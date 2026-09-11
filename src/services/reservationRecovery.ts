import { db, reservationsCollection, auditLogsCollection, carsCollection, commercialsCollection, saveReservationToFirestore } from '../firebase';
import { getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { Reservation, CarModel, CommercialUser, AuditLogEntry, ClientInfo } from '../types';

export interface RecoveryResult {
  totalAuditEntriesScanned: number;
  missingFound: number;
  recoveredCount: number;
  recoveredReservations: Reservation[];
  alreadyPresentCount: number;
  errors: string[];
}

/**
 * Nettoie le nom du client extrait des logs de traçabilité
 */
function cleanClientName(rawName: string): string {
  let cleaned = rawName.trim();
  // Nettoyer les préfixes automatiques
  cleaned = cleaned.replace(/^le bon de réservation #[A-Z0-9-]+\s+au nom de\s+/i, '');
  cleaned = cleaned.replace(/^le bon de réservation #[^a-zA-Z0-9]+au nom de\s+/i, '');
  cleaned = cleaned.replace(/^au nom de\s+/i, '');
  cleaned = cleaned.replace(/^pour\s+/i, '');
  return cleaned.trim();
}

/**
 * Vérifie si un nom correspond à une fausse saisie de test
 */
function isDummyTestName(name: string, phone: string): boolean {
  const lower = name.toLowerCase();
  const dummies = [
    'aaaaaaa',
    'cccccc',
    'ccccc',
    'dfdfdfd',
    'vccccc',
    'medd med',
    'meddss medss',
    'test test',
    'azerty',
  ];
  if (dummies.some((d) => lower.includes(d))) return true;
  if (phone === '22222222' || phone === '20202020' || phone === '25222222' || phone === '0000000000') return true;
  return false;
}

/**
 * Analyse la traçabilité et restaure toutes les réservations valides manquantes dans Firestore
 */
export async function recoverMissingReservationsFromAudit(): Promise<RecoveryResult> {
  const result: RecoveryResult = {
    totalAuditEntriesScanned: 0,
    missingFound: 0,
    recoveredCount: 0,
    recoveredReservations: [],
    alreadyPresentCount: 0,
    errors: [],
  };

  try {
    // 1. Charger les réservations actuelles dans Firestore
    const resSnap = await getDocs(reservationsCollection);
    const existingReservations = resSnap.docs.map((d) => ({ ...d.data(), id: d.id } as Reservation));
    const existingIds = new Set(existingReservations.map((r) => r.id));

    // 2. Charger les voitures pour associer carId, prix et couleurs
    const carsSnap = await getDocs(carsCollection);
    const cars = carsSnap.docs.map((d) => ({ ...d.data(), id: d.id } as CarModel));

    // 3. Charger les commerciaux pour associer les profils
    const commSnap = await getDocs(commercialsCollection);
    const commercials = commSnap.docs.map((d) => ({ ...d.data(), id: d.id } as CommercialUser));

    // 4. Charger l'historique complet d'audit
    const auditSnap = await getDocs(auditLogsCollection);
    const auditLogs = auditSnap.docs.map((d) => d.data() as AuditLogEntry);
    auditLogs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    result.totalAuditEntriesScanned = auditLogs.length;

    // Trouver le plus grand numéro de séquence actuel
    let maxSeq = 1001;
    existingReservations.forEach((r) => {
      const match = r.id?.match(/RES-2026-([0-9]+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxSeq) maxSeq = num;
      }
    });

    // 5. Parcourir les logs de création ou validation de réservation
    const candidateEntries: Array<{
      originalId: string;
      clientName: string;
      clientPhone: string;
      carName: string;
      targetCarId: string;
      targetColorName: string;
      userName: string;
      userId: string;
      userAgency: string;
      timestamp: string;
      status: 'Confirmée' | 'En attente';
      details: string;
    }> = [];

    auditLogs.forEach((l) => {
      const isResAction =
        l.actionType === 'reservation_stock_deduct' ||
        l.actionLabel?.toLowerCase().includes('réservation') ||
        l.actionLabel?.toLowerCase().includes('deduction stock');

      if (!isResAction) return;

      const idMatch = l.details?.match(/#?(RES-2026-[0-9]+)/);
      const clientMatch = l.details?.match(/(?:nom de|pour)\s+([^(]+)\s*\(([^)]*)\)/i);

      if (idMatch && clientMatch) {
        const clientName = cleanClientName(clientMatch[1]);
        const clientPhone = clientMatch[2].trim();

        if (!clientName || isDummyTestName(clientName, clientPhone)) {
          return;
        }

        const isConfirmed =
          l.actionLabel?.toLowerCase().includes('confirm') ||
          l.details?.toLowerCase().includes('confirmée') ||
          l.details?.toLowerCase().includes('déduction de 1 unité');

        candidateEntries.push({
          originalId: idMatch[1],
          clientName,
          clientPhone,
          carName: l.targetCarName || '',
          targetCarId: l.targetCarId || '',
          targetColorName: l.targetColorName || '',
          userName: l.userName || 'Commercial Chery',
          userId: l.userId || 'commercial',
          userAgency: l.userAgency || 'Siège STA',
          timestamp: l.timestamp,
          status: isConfirmed ? 'Confirmée' : 'En attente',
          details: l.details,
        });
      }
    });

    // 6. Dédupliquer par client (Nom + Téléphone)
    const uniqueCandidates: typeof candidateEntries = [];
    const seenClients = new Set<string>();

    candidateEntries.forEach((cand) => {
      const key = `${cand.clientName.toLowerCase()}_${cand.clientPhone.replace(/[^0-9]/g, '')}`;
      if (!seenClients.has(key)) {
        seenClients.add(key);
        uniqueCandidates.push(cand);
      } else {
        // Mettre à jour avec le statut le plus récent (ex: si confirmé plus tard)
        const idx = uniqueCandidates.findIndex(
          (u) => `${u.clientName.toLowerCase()}_${u.clientPhone.replace(/[^0-9]/g, '')}` === key
        );
        if (idx !== -1 && cand.status === 'Confirmée') {
          uniqueCandidates[idx].status = 'Confirmée';
        }
      }
    });

    // 7. Filtrer ceux qui existent déjà dans Firestore
    const trulyMissing: typeof uniqueCandidates = [];

    uniqueCandidates.forEach((cand) => {
      const alreadyIn = existingReservations.some((r) => {
        const rNom = (r.client?.personnePhysique?.nom || r.client?.societe?.raisonSociale || '').toLowerCase();
        const candNom = cand.clientName.toLowerCase();
        const rPhone = (r.client?.personnePhysique?.telephone || r.client?.societe?.telephone || '').replace(/[^0-9]/g, '');
        const candPhone = cand.clientPhone.replace(/[^0-9]/g, '');

        const namesMatch = rNom.length > 3 && candNom.length > 3 && (rNom.includes(candNom) || candNom.includes(rNom));
        const phonesMatch = candPhone.length >= 8 && rPhone.length >= 8 && rPhone.includes(candPhone);

        // Si même ID et même client
        if (r.id === cand.originalId && (namesMatch || phonesMatch)) {
          return true;
        }

        return namesMatch || phonesMatch;
      });

      if (alreadyIn) {
        result.alreadyPresentCount++;
      } else {
        trulyMissing.push(cand);
      }
    });

    result.missingFound = trulyMissing.length;

    // 8. Reconstituer chaque réservation manquante
    for (const item of trulyMissing) {
      // Trouver la voiture correspondante
      const matchedCar =
        cars.find((c) => c.id === item.targetCarId) ||
        cars.find((c) => item.carName.toLowerCase().includes(c.name.toLowerCase())) ||
        cars[0];

      // Couleur
      const colorChosen =
        matchedCar?.colors?.find((col) => col.name.toLowerCase() === item.targetColorName.toLowerCase()) ||
        matchedCar?.colors?.[0] || {
          id: 'col-default',
          name: item.targetColorName || 'Standard',
          hexCode: '#808080',
        };

      // Type de client : Société si contient Sté, Société, SARL, etc.
      const isSociete =
        item.clientName.toLowerCase().includes('ste') ||
        item.clientName.toLowerCase().includes('sté') ||
        item.clientName.toLowerCase().includes('societe') ||
        item.clientName.toLowerCase().includes('société') ||
        item.clientName.toLowerCase().includes('sarl') ||
        item.clientName.toLowerCase().includes('suarl') ||
        item.clientName.toLowerCase().includes('service') ||
        item.clientName.toLowerCase().includes('company') ||
        item.clientName.toLowerCase().includes('pack') ||
        item.clientName.toLowerCase().includes('laboratoire') ||
        item.clientName.toLowerCase().includes('lighting');

      const clientInfo: ClientInfo = {
        type: isSociete ? 'societe' : 'personne_physique',
        personnePhysique: isSociete
          ? undefined
          : {
              nom: item.clientName,
              prenom: '',
              cin: '',
              ville: item.userAgency?.includes('Sfax') ? 'Sfax' : item.userAgency?.includes('Sousse') ? 'Sousse' : 'Tunis',
              telephone: item.clientPhone,
              email: '',
              adresse: '',
            },
        societe: isSociete
          ? {
              raisonSociale: item.clientName,
              matriculeFiscale: '',
              ville: item.userAgency?.includes('Sfax') ? 'Sfax' : item.userAgency?.includes('Sousse') ? 'Sousse' : 'Tunis',
              telephone: item.clientPhone,
              email: '',
              adresse: '',
            }
          : undefined,
      };

      // Assigner un ID unique : si l'ID original n'est pas pris, le conserver ! Sinon prendre le suivant.
      let allocatedId = item.originalId;
      if (existingIds.has(allocatedId)) {
        maxSeq++;
        allocatedId = `RES-2026-${String(maxSeq).padStart(3, '0')}`;
      }
      existingIds.add(allocatedId);

      const restoredReservation: Reservation = {
        id: allocatedId,
        commercialId: item.userId,
        commercialName: item.userName,
        agency: item.userAgency,
        carId: matchedCar ? matchedCar.id : 'car-chery',
        carName: item.carName || matchedCar?.name || 'Chery',
        colorChosen: colorChosen,
        vehicles: [
          {
            id: `veh-${allocatedId}-0`,
            carId: matchedCar ? matchedCar.id : 'car-chery',
            carName: item.carName || matchedCar?.name || 'Chery',
            colorChosen: colorChosen,
            quantity: 1,
            unitPriceTND: matchedCar?.priceTND || 85000,
            totalPriceTND: matchedCar?.priceTND || 85000,
          },
        ],
        client: clientInfo,
        documents: [],
        priceTND: matchedCar?.priceTND || 85000,
        registrationFeeTND: 0,
        depositPaidTND: 0,
        paymentMethod: 'Chèque Certifié',
        status: item.status,
        createdAt: item.timestamp,
        updatedAt: item.timestamp,
        notes: `Restauré automatiquement depuis la traçabilité (Audit #${item.originalId})`,
      };

      // Sauvegarder dans Firestore
      try {
        await setDoc(doc(db, 'reservations', restoredReservation.id), restoredReservation);
        result.recoveredReservations.push(restoredReservation);
        result.recoveredCount++;
        console.log(`[Recovery] Réservation restaurée avec succès : ${restoredReservation.id} pour ${item.clientName}`);
      } catch (err: any) {
        const isQuota =
          err?.code === 'resource-exhausted' ||
          err?.message?.includes('Quota') ||
          err?.message?.includes('quota');
        if (isQuota) {
          console.warn(`[Recovery Quota] Limite journalière atteinte lors de la sauvegarde de ${item.clientName}.`);
          result.errors.push(`Quota Firestore journalier atteint pour ${item.clientName}.`);
        } else {
          console.warn(`[Recovery Error] Échec de restauration pour ${item.clientName}:`, err?.message || err);
          result.errors.push(`Erreur pour ${item.clientName}: ${err?.message || String(err)}`);
        }
      }
    }
  } catch (globalError: any) {
    const isQuota =
      globalError?.code === 'resource-exhausted' ||
      globalError?.message?.includes('Quota') ||
      globalError?.message?.includes('quota') ||
      String(globalError).includes('Quota');

    if (isQuota) {
      console.warn('[Recovery Warning] Quota de requêtes journalier Firestore temporairement atteint. Les réservations restent enregistrées et consultables localement.');
      result.errors.push('Quota de requêtes journalier Firestore atteint. Les données continuent de fonctionner en mode local sécurisé.');
    } else {
      console.warn('[Recovery Warning]:', globalError?.message || globalError);
      result.errors.push(`Erreur de synchronisation: ${globalError?.message || String(globalError)}`);
    }
  }

  return result;
}
