import { Reservation, CarModel, CommercialUser, ReservationStatus } from '../types';

export interface CsvImportResult {
  reservations: Reservation[];
  errors: string[];
  totalRows: number;
  newCount: number;
  updatedCount: number;
}

/**
 * Robust CSV parser that handles:
 * - Semicolon (;), Comma (,), or Tab (\t) delimiters
 * - Quoted fields with escaped quotes ("")
 * - Windows (\r\n) and Unix (\n) line endings
 * - UTF-8 BOM
 */
export function parseCsvText(csvText: string): string[][] {
  if (!csvText) return [];

  // Strip UTF-8 BOM if present
  let cleanText = csvText.charCodeAt(0) === 0xfeff ? csvText.slice(1) : csvText;
  cleanText = cleanText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Detect delimiter from first non-empty line
  const firstLine = cleanText.split('\n').find((l) => l.trim().length > 0) || '';
  let delimiter = ';';
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const commaCount = (firstLine.match(/,/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;

  if (tabCount > semicolonCount && tabCount > commaCount) {
    delimiter = '\t';
  } else if (commaCount > semicolonCount) {
    delimiter = ',';
  } else {
    delimiter = ';';
  }

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote: "" -> "
        currentField += '"';
        i++; // skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if (char === '\n' && !inQuotes) {
      currentRow.push(currentField.trim());
      // Only push non-empty rows
      if (currentRow.some((f) => f.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((f) => f.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Normalizes header string for fuzzy matching
 */
function normalizeHeader(header: string): string {
  return (
    header
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/[^a-z0-9]/g, '') // remove punctuation/spaces
      .trim()
  );
}

/**
 * Parses numeric currency strings (e.g. "88 900 DT", "79,900.00 TND", "102900")
 */
function parsePrice(value: string | undefined, defaultVal: number = 0): number {
  if (!value) return defaultVal;
  const cleaned = value
    .replace(/[^\d.,]/g, '')
    .replace(/\s+/g, '')
    .replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? defaultVal : Math.round(num);
}

/**
 * Parses dates into standard ISO string
 * Handles DD/MM/YYYY, YYYY-MM-DD, DD-MM-YYYY, etc.
 */
function parseDateToIso(rawDate: string | undefined): string {
  if (!rawDate) return new Date().toISOString();
  const trimmed = rawDate.trim();

  // Format DD/MM/YYYY or DD-MM-YYYY
  const frMatch = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if (frMatch) {
    const day = parseInt(frMatch[1], 10);
    const month = parseInt(frMatch[2], 10) - 1;
    const year = parseInt(frMatch[3], 10);
    const d = new Date(year, month, day, 12, 0, 0);
    if (!isNaN(d.getTime())) return d.toISOString();
  }

  // Standard ISO format check
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString();
  }

  return new Date().toISOString();
}

/**
 * Main importer function to convert CSV text into typed Reservation objects
 */
export function importReservationsFromCsv(
  csvText: string,
  cars: CarModel[] = [],
  currentCommercial?: CommercialUser,
  existingReservations: Reservation[] = []
): CsvImportResult {
  const parsedGrid = parseCsvText(csvText);
  if (parsedGrid.length < 2) {
    return {
      reservations: [],
      errors: ['Le fichier CSV est vide ou ne contient aucune ligne de données.'],
      totalRows: 0,
      newCount: 0,
      updatedCount: 0,
    };
  }

  const rawHeaders = parsedGrid[0];
  const normalizedHeaders = rawHeaders.map(normalizeHeader);

  // Helper to find column index by synonyms
  const findColIndex = (...synonyms: string[]): number => {
    const normSynonyms = synonyms.map(normalizeHeader);
    for (const syn of normSynonyms) {
      const idx = normalizedHeaders.findIndex((h) => h === syn || h.includes(syn));
      if (idx !== -1) return idx;
    }
    return -1;
  };

  const idCol = findColIndex('nobondecommande', 'bon', 'id', 'reference', 'numerobon', 'ref');
  const dateCol = findColIndex('datereservation', 'date', 'createdat', 'datebon', 'creele');
  const typeCol = findColIndex('typeclient', 'natureclient', 'type');
  const clientNameCol = findColIndex('nomclientraisonsociale', 'nomclient', 'raisonsociale', 'client', 'nom');
  const cinMfCol = findColIndex('cinmatriculefiscale', 'cin', 'matriculefiscale', 'mf', 'cinmf');
  const phoneCol = findColIndex('telephoneclient', 'telephone', 'tel', 'phone', 'mobile');
  const emailCol = findColIndex('emailclient', 'email', 'mail');
  const villeCol = findColIndex('villegouvernorat', 'ville', 'gouvernorat', 'adresse');
  const carNameCol = findColIndex('modelechery', 'modele', 'car', 'vehicule', 'chery', 'voiture');
  const extColorCol = findColIndex('couleurexterieure', 'couleur', 'teinte', 'colorext');
  const intColorCol = findColIndex('couleurinterieurehabillage', 'couleurinterieure', 'habillage', 'interieur');
  const priceCol = findColIndex('prixvehiculettctnd', 'prixttctnd', 'prixttc', 'prix', 'montant');
  const regFeeCol = findColIndex('fraisimmatriculationtnd', 'fraisimmatriculation', 'immatriculation', 'cartegrise');
  const depositCol = findColIndex('acompteversetnd', 'acompte', 'avance', 'versement', 'deposit');
  const paymentMethodCol = findColIndex('modedereglement', 'reglement', 'modepaiement', 'paiement', 'payment');
  const commercialCol = findColIndex('commercialsaisi', 'commercial', 'conseiller', 'vendeur');
  const agencyCol = findColIndex('showroomagence', 'agence', 'showroom', 'site', 'succursale');
  const statusCol = findColIndex('statutreservation', 'statut', 'etat', 'status');
  const deliveryDateCol = findColIndex('datelivraisonprevue', 'datelivraison', 'livraison', 'eta');
  const notesCol = findColIndex('remarquesnotes', 'remarques', 'notes', 'commentaires', 'observations');

  const existingMap = new Map<string, Reservation>();
  existingReservations.forEach((r) => existingMap.set(r.id.toUpperCase(), r));

  const importedList: Reservation[] = [];
  const errors: string[] = [];
  let newCount = 0;
  let updatedCount = 0;

  // Track auto-generated sequence for missing IDs
  let autoIdSeq = Date.now() % 10000;

  for (let rowIndex = 1; rowIndex < parsedGrid.length; rowIndex++) {
    const row = parsedGrid[rowIndex];
    if (row.length === 0 || row.every((c) => !c.trim())) continue;

    try {
      // 1. ID Bon de Commande
      let rawId = (idCol !== -1 ? row[idCol] : '') || '';
      rawId = rawId.replace(/["'#]/g, '').trim();
      if (!rawId || !rawId.toUpperCase().startsWith('RES-')) {
        autoIdSeq++;
        rawId = `RES-2026-${autoIdSeq}`;
      }
      const resId = rawId.toUpperCase();

      // 2. Existing reservation lookup (for enrichment)
      const existing = existingMap.get(resId);

      // 3. Client details
      const rawType = (typeCol !== -1 ? row[typeCol] : '') || '';
      const rawClientName = (clientNameCol !== -1 ? row[clientNameCol] : '') || '';
      const rawCinMf = (cinMfCol !== -1 ? row[cinMfCol] : '') || '';
      const rawPhone = (phoneCol !== -1 ? row[phoneCol] : '') || '';
      const rawEmail = (emailCol !== -1 ? row[emailCol] : '') || '';
      const rawVille = (villeCol !== -1 ? row[villeCol] : '') || 'Tunis';

      const isSociete =
        Boolean(rawType && /\b(societe|société|ste|sarl|suarl|sa|holding|groupe|entreprise|morale)\b/i.test(rawType)) ||
        /\b(societe|société|ste|sarl|suarl|sa|holding|groupe|entreprise)\b/i.test(rawClientName) ||
        (existing?.client?.type === 'societe');

      let nom = rawClientName;
      let prenom = '';
      if (!isSociete && rawClientName.includes(' ')) {
        const parts = rawClientName.split(' ');
        prenom = parts[0];
        nom = parts.slice(1).join(' ');
      }

      // 4. Car Model resolution
      const rawCarName = (carNameCol !== -1 ? row[carNameCol] : '') || existing?.carName || 'Chery Tiggo 4 Pro HEV';
      const matchedCar = cars.find(
        (c) =>
          c.name.toLowerCase() === rawCarName.toLowerCase() ||
          rawCarName.toLowerCase().includes(c.name.toLowerCase()) ||
          c.name.toLowerCase().includes(rawCarName.toLowerCase())
      );

      const finalCarName = matchedCar ? matchedCar.name : rawCarName;
      const finalCarId = matchedCar ? matchedCar.id : existing?.carId || 'car-default';

      // 5. Colors
      const rawExtColor = (extColorCol !== -1 ? row[extColorCol] : '') || existing?.colorChosen?.name || 'Gris Platine';
      const matchedColor = matchedCar?.colors?.find(
        (col) => col.name.toLowerCase() === rawExtColor.toLowerCase() || rawExtColor.toLowerCase().includes(col.name.toLowerCase())
      );
      const colorChosen = {
        id: matchedColor ? matchedColor.id : `col-${resId}`,
        name: matchedColor ? matchedColor.name : rawExtColor,
        hexCode: matchedColor ? matchedColor.hexCode : '#475569',
      };

      const rawIntColor = (intColorCol !== -1 ? row[intColorCol] : '') || existing?.interiorColorChosen?.name || '';
      const interiorColorChosen = rawIntColor
        ? {
            id: `int-${resId}`,
            name: rawIntColor,
            hexCode: '#171717',
          }
        : undefined;

      // 6. Pricing & Deposit
      const defaultCarPrice = matchedCar ? matchedCar.priceTND : 88900;
      const priceTND = priceCol !== -1 && row[priceCol] ? parsePrice(row[priceCol], defaultCarPrice) : (existing?.priceTND || defaultCarPrice);
      const registrationFeeTND = regFeeCol !== -1 && row[regFeeCol] ? parsePrice(row[regFeeCol], 0) : (existing?.registrationFeeTND || 0);
      const depositPaidTND = depositCol !== -1 && row[depositCol] ? parsePrice(row[depositCol], Math.round(priceTND * 0.1)) : (existing?.depositPaidTND || Math.round(priceTND * 0.1));

      // 7. Payment method
      const rawPayment = (paymentMethodCol !== -1 ? row[paymentMethodCol] : '') || existing?.paymentMethod || 'Chèque Certifié';
      let paymentMethod: Reservation['paymentMethod'] = 'Chèque Certifié';
      if (/leas/i.test(rawPayment)) paymentMethod = 'Leasing';
      else if (/esp/i.test(rawPayment)) paymentMethod = 'Espèces';
      else if (/vir/i.test(rawPayment)) paymentMethod = 'Virement Bancaire';
      else paymentMethod = 'Chèque Certifié';

      // 8. Commercial & Agency
      const commercialName = (commercialCol !== -1 ? row[commercialCol] : '') || existing?.commercialName || currentCommercial?.name || 'Conseiller STA';
      const agency = (agencyCol !== -1 ? row[agencyCol] : '') || existing?.agency || currentCommercial?.agency || 'Siège STA';
      const commercialId = existing?.commercialId || currentCommercial?.id || 'commercial-sta';

      // 9. Status
      const rawStatus = (statusCol !== -1 ? row[statusCol] : '') || existing?.status || 'En attente';
      let status: ReservationStatus = 'En attente';
      if (/conf/i.test(rawStatus)) status = 'Confirmée';
      else if (/liv/i.test(rawStatus)) status = 'Livrée';
      else if (/annul/i.test(rawStatus)) status = 'Annulée';
      else status = 'En attente';

      // 10. Dates
      const rawDate = (dateCol !== -1 ? row[dateCol] : '') || existing?.createdAt;
      const createdAt = parseDateToIso(rawDate);
      const expectedDeliveryDate = (deliveryDateCol !== -1 ? row[deliveryDateCol] : '') || existing?.expectedDeliveryDate || '';

      // 11. Notes
      const notes = (notesCol !== -1 ? row[notesCol] : '') || existing?.notes || '';

      // Construct Reservation object
      const reservation: Reservation = {
        id: resId,
        commercialId,
        commercialName,
        agency,
        carId: finalCarId,
        carName: finalCarName,
        colorChosen,
        interiorColorChosen,
        vehicles: [
          {
            id: `veh-${resId}-0`,
            carId: finalCarId,
            carName: finalCarName,
            colorChosen,
            interiorColorChosen,
            quantity: 1,
            unitPriceTND: priceTND,
            totalPriceTND: priceTND,
          },
        ],
        client: {
          type: isSociete ? 'societe' : 'personne_physique',
          personnePhysique: isSociete
            ? undefined
            : {
                nom: nom || existing?.client?.personnePhysique?.nom || 'Client',
                prenom: prenom || existing?.client?.personnePhysique?.prenom || '',
                cin: rawCinMf || existing?.client?.personnePhysique?.cin || '',
                ville: rawVille || existing?.client?.personnePhysique?.ville || 'Tunis',
                telephone: rawPhone || existing?.client?.personnePhysique?.telephone || '',
                email: rawEmail || existing?.client?.personnePhysique?.email || '',
                adresse: existing?.client?.personnePhysique?.adresse || '',
              },
          societe: isSociete
            ? {
                raisonSociale: rawClientName || existing?.client?.societe?.raisonSociale || 'Société',
                matriculeFiscale: rawCinMf || existing?.client?.societe?.matriculeFiscale || '',
                ville: rawVille || existing?.client?.societe?.ville || 'Tunis',
                telephone: rawPhone || existing?.client?.societe?.telephone || '',
                email: rawEmail || existing?.client?.societe?.email || '',
                adresse: existing?.client?.societe?.adresse || '',
              }
            : undefined,
        },
        documents: existing?.documents || [],
        priceTND,
        registrationFeeTND,
        depositPaidTND,
        paymentMethod,
        status,
        createdAt,
        updatedAt: new Date().toISOString(),
        expectedDeliveryDate,
        notes,
      };

      if (existingMap.has(resId)) {
        updatedCount++;
      } else {
        newCount++;
      }

      importedList.push(reservation);
    } catch (err: any) {
      errors.push(`Ligne ${rowIndex + 1}: ${err.message || 'Erreur de lecture'}`);
    }
  }

  return {
    reservations: importedList,
    errors,
    totalRows: parsedGrid.length - 1,
    newCount,
    updatedCount,
  };
}
