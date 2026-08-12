import { Reservation, UploadedDocument } from '../types';

/**
 * Adds business days (Monday to Friday) to a given date, skipping weekends.
 */
export function addBusinessDays(startDate: Date | string, days: number): Date {
  const result = new Date(startDate);
  if (isNaN(result.getTime())) return new Date();

  let addedDays = 0;
  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay();
    // 0 is Sunday, 6 is Saturday
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      addedDays++;
    }
  }
  return result;
}

/**
 * Calculates remaining business days between two dates.
 */
export function getRemainingBusinessDays(fromDate: Date, targetDate: Date): number {
  if (targetDate <= fromDate) return 0;

  let count = 0;
  const current = new Date(fromDate);
  // Reset time to start of day for comparison
  current.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(23, 59, 59, 999);

  while (current < target) {
    current.setDate(current.getDate() + 1);
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      count++;
    }
  }
  return count;
}

export type LeasingState = 
  | 'VALIDATED'           // Cas n°1 : Bon de commande présent -> Réservation validée
  | 'PROVISIONAL_ACTIVE'  // Cas n°2 : Accord de leasing présent, < 5 jours ouvrés
  | 'GRACE_PERIOD_ACTIVE' // Cas n°2 suite : 5j ouvrés expirés -> Délai de grâce +2j ouvrés accordé
  | 'EXPIRED_CANCELLED'   // Cas n°2 fin : 5j + 2j ouvrés expirés sans Bon de commande -> Annulation
  | 'NOT_LEASING';

export interface LeasingEvaluation {
  isLeasing: boolean;
  hasAccordLeasing: boolean;
  hasBonCommande: boolean;
  state: LeasingState;
  provisionalDeadline: Date;
  graceDeadline: Date;
  daysRemainingInProvisional: number;
  daysRemainingInGrace: number;
  badgeTitle: string;
  badgeSubtext: string;
  badgeColorClass: string;
  isUrgentNotification: boolean;
  notificationMessage?: string;
}

/**
 * Evaluates the automated business rules for leasing reservations:
 * Cas n°1: Dossier avec Bon de commande -> Réservation immédiatement validable.
 * Cas n°2: Dossier avec Accord de leasing -> Réservation provisoire 5 jours ouvrés.
 * Expération 5j: Notification au commercial + Délai de grâce 2 jours ouvrés max avant annulation.
 */
export function evaluateLeasingStatus(
  reservation: Reservation,
  now: Date = new Date()
): LeasingEvaluation {
  const docs = reservation.documents || [];

  const hasBonCommande = docs.some(
    (d) => d.category === 'bon_commande' || d.name.toLowerCase().includes('bon de commande')
  );
  const hasAccordLeasing = docs.some(
    (d) => d.category === 'accord_leasing' || d.name.toLowerCase().includes('accord')
  );

  const isLeasing =
    reservation.paymentMethod === 'Leasing' || hasAccordLeasing || hasBonCommande;

  if (!isLeasing) {
    return {
      isLeasing: false,
      hasAccordLeasing: false,
      hasBonCommande: false,
      state: 'NOT_LEASING',
      provisionalDeadline: now,
      graceDeadline: now,
      daysRemainingInProvisional: 0,
      daysRemainingInGrace: 0,
      badgeTitle: '',
      badgeSubtext: '',
      badgeColorClass: '',
      isUrgentNotification: false,
    };
  }

  // Cas n°1 : Le dossier contient un Bon de commande leasing
  if (hasBonCommande) {
    return {
      isLeasing: true,
      hasAccordLeasing,
      hasBonCommande: true,
      state: 'VALIDATED',
      provisionalDeadline: now,
      graceDeadline: now,
      daysRemainingInProvisional: 0,
      daysRemainingInGrace: 0,
      badgeTitle: '✅ Validée — Bon de Commande Leasing Reçu',
      badgeSubtext: 'Dossier leasing complet et validé conformément aux règles STA.',
      badgeColorClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80 shadow-emerald-950/40',
      isUrgentNotification: false,
    };
  }

  // Cas n°2 : Le dossier contient uniquement un Accord de leasing (ou est un leasing sans bon de commande)
  const createdAt = reservation.createdAt ? new Date(reservation.createdAt) : new Date();
  
  // Expiration 1: 5 jours ouvrés pour la réservation provisoire
  const provisionalDeadline = addBusinessDays(createdAt, 5);
  // Expiration 2: 5 + 2 = 7 jours ouvrés pour le délai de grâce maximal
  const graceDeadline = addBusinessDays(createdAt, 7);

  const daysRemProv = getRemainingBusinessDays(now, provisionalDeadline);
  const daysRemGrace = getRemainingBusinessDays(now, graceDeadline);

  if (now <= provisionalDeadline) {
    // Dans les 5 jours ouvrés
    return {
      isLeasing: true,
      hasAccordLeasing: true,
      hasBonCommande: false,
      state: 'PROVISIONAL_ACTIVE',
      provisionalDeadline,
      graceDeadline,
      daysRemainingInProvisional: daysRemProv,
      daysRemainingInGrace: daysRemGrace,
      badgeTitle: `⏳ Réservation Provisoire Leasing (${daysRemProv}j ouvrés restants)`,
      badgeSubtext: `Accord de leasing validé. Bon de commande requis avant le ${provisionalDeadline.toLocaleDateString('fr-FR')}.`,
      badgeColorClass: 'bg-amber-950/80 text-amber-300 border-amber-700/80 shadow-amber-950/40',
      isUrgentNotification: false,
    };
  } else if (now <= graceDeadline) {
    // 5j ouvrés expirés -> Délai supplémentaire de 2 jours ouvrés accordé
    return {
      isLeasing: true,
      hasAccordLeasing: true,
      hasBonCommande: false,
      state: 'GRACE_PERIOD_ACTIVE',
      provisionalDeadline,
      graceDeadline,
      daysRemainingInProvisional: 0,
      daysRemainingInGrace: daysRemGrace,
      badgeTitle: `🚨 DÉLAI DE GRÂCE ACCORDÉ (+${daysRemGrace}j ouvrés max)`,
      badgeSubtext: `Délai de 5j dépassé ! Délai supplémentaire de 2j ouvrés accordé à ${reservation.commercialName} avant annulation.`,
      badgeColorClass: 'bg-red-950/90 text-red-200 border-red-600 shadow-red-950/60 animate-pulse',
      isUrgentNotification: true,
      notificationMessage: `⚠️ ATTENTION LEASING [${reservation.id}] : Le délai initial de 5 jours ouvrés pour le dossier de ${
        reservation.client.type === 'personne_physique'
          ? `${reservation.client.personnePhysique?.prenom} ${reservation.client.personnePhysique?.nom}`
          : reservation.client.societe?.raisonSociale
      } a expiré. Un DÉLAI DE GRÂCE SUPPLÉMENTAIRE DE 2 JOURS OUVRÉS vous a été accordé pour ajouter le Bon de Commande Leasing avant annulation définitive.`,
    };
  } else {
    // 5j + 2j expirés sans Bon de commande -> Annulation définitive
    return {
      isLeasing: true,
      hasAccordLeasing: true,
      hasBonCommande: false,
      state: 'EXPIRED_CANCELLED',
      provisionalDeadline,
      graceDeadline,
      daysRemainingInProvisional: 0,
      daysRemainingInGrace: 0,
      badgeTitle: '❌ Annulée — Expiration Délai Leasing (5+2j)',
      badgeSubtext: 'Bon de commande non imprimé/fourni dans le délai maximal de 7 jours ouvrés.',
      badgeColorClass: 'bg-slate-950 text-slate-400 border-slate-800',
      isUrgentNotification: true,
      notificationMessage: `❌ RÉSORTION ANNULÉE [${reservation.id}] : Annulation automatique du dossier Leasing (Bon de commande non fourni après les 5j + 2j de délai de grâce).`,
    };
  }
}
