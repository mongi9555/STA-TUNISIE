import { TimesheetPeriod, TimesheetNote, CalendarMediaType } from '../types';

/**
 * Calcule le numéro de semaine ISO (1 - 53) pour une date donnée
 */
export function getISOWeekNumber(d: Date): number {
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

/**
 * Retourne les 7 dates (du Lundi au Dimanche) pour la semaine contenant la date fournie
 */
export function getWeekDates(date: Date): { dayName: string; shortDay: string; dateStr: string; dateObj: Date; isToday: boolean }[] {
  const dayIndex = (date.getDay() + 6) % 7; // Lundi = 0, Dimanche = 6
  const monday = new Date(date);
  monday.setDate(date.getDate() - dayIndex);
  monday.setHours(0, 0, 0, 0);

  const days: { dayName: string; shortDay: string; dateStr: string; dateObj: Date; isToday: boolean }[] = [];
  const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const shortDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const todayStr = new Date().toISOString().slice(0, 10);

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    days.push({
      dayName: dayNames[i],
      shortDay: shortDays[i],
      dateStr,
      dateObj: d,
      isToday: dateStr === todayStr,
    });
  }

  return days;
}

/**
 * Retourne la grille complète des jours du mois (avec padding des jours du mois précédent et suivant)
 */
export function getMonthCalendarGrid(year: number, monthIndex: number): {
  dateStr: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  dateObj: Date;
}[] {
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const todayStr = new Date().toISOString().slice(0, 10);

  const grid: {
    dateStr: string;
    dayNumber: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    dateObj: Date;
  }[] = [];

  // Lundi = 1, Dimanche = 0 => conversion en 0 = Lundi, 6 = Dimanche
  const startDayOffset = (firstDay.getDay() + 6) % 7;

  // Jours du mois précédent pour aligner le premier lundi
  const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();
  for (let i = startDayOffset - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i;
    const d = new Date(year, monthIndex - 1, dayNum);
    const dateStr = d.toISOString().slice(0, 10);
    grid.push({
      dateStr,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      dateObj: d,
    });
  }

  // Jours du mois en cours
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const d = new Date(year, monthIndex, i);
    const dateStr = d.toISOString().slice(0, 10);
    grid.push({
      dateStr,
      dayNumber: i,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      dateObj: d,
    });
  }

  // Jours du mois suivant pour compléter à 35 ou 42 cellules (grille de 7 colonnes)
  const remainingCells = (7 - (grid.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    const d = new Date(year, monthIndex + 1, i);
    const dateStr = d.toISOString().slice(0, 10);
    grid.push({
      dateStr,
      dayNumber: i,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      dateObj: d,
    });
  }

  return grid;
}

/**
 * Formate une taille en octets en chaîne lisible (Ko, Mo)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Ko';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Octets', 'Ko', 'Mo', 'Go'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Convertit un fichier en Base64 Data URL
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Échantillon minimal de PDF STA officiel (Base64)
 */
export const SAMPLE_STA_PDF = 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2JqCjIgMCBvYmo8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PmVuZG9iagozIDAgb2JqPDwvVHlwZS9QYWdlL1BhcmVudCAyIDAgUi9NZWRpYUJveFswIDAgNTk1IDg0Ml0vQ29udGVudHMgNCAwIFIvUmVzb3VyY2VzPDw+Pj4+ZW5kb2JqCjQgMCBvYmo8PC9MZW5ndGggODc+PnN0cmVhbQpCVAovRjEgMjAgVGYKNTAgNzcwIFRkCihDSEVSWSBUVU5JU0lFIC0gU1RBIFNpZWdlIFpvbmUgSW5kdXN0cmllbGxlIEJlbiBBcm91cylUago1MCA3MzAgVGYKMTIgVGYKKEZpY2hlIFRlY2huaXF1ZSAmIERvY3VtZW50IGRlIENvbmZvcm1pdGUgMjAyNilUagpFClplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxOCAwMDAwMCBuIAowMDAwMDAwMDY4IDAwMDAwIG4gCjAwMDAwMDAxMjUgMDAwMDAgbiAKMDAwMDAwMDIxNCAwMDAwMCBuIAp0cmFpbGVyCjw8L1NpemUgNS9Sb290IDEgMCBSPj4Kc3RhcnR4cmVmCjM1MAolJUVPRgo=';

/**
 * Notes / Documents initiaux du Calendrier (Images & PDF)
 */
export const INITIAL_TIMESHEET_NOTES: TimesheetNote[] = [
  {
    id: 'cal-img-01',
    title: 'Arrivage Flotte Chery Tiggo 7 Pro & Tiggo 8 Pro - Port de Radès',
    content: 'Contrôle visuel de déchargement et inspection carrosserie des nouveaux modèles Tiggo 7 Pro et Tiggo 8 Pro reçus ce matin.',
    date: '2026-10-02',
    weekNumber: 40,
    monthKey: '2026-10',
    periodType: 'day',
    mediaType: 'image',
    fileUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&auto=format&fit=crop&q=80',
    fileName: 'Arrivage_Tiggo7_Port_Rades.jpg',
    fileSize: '1.2 Mo',
    authorName: 'Mongi Jamaï',
    authorRole: 'Super Administrateur (DSI)',
    createdAt: '2026-10-02T08:30:00.000Z',
    updatedAt: '2026-10-02T08:30:00.000Z',
  },
  {
    id: 'cal-pdf-01',
    title: 'Fiche Technique & Homologation STA Chery Tiggo 4 Pro (Octobre 2026)',
    content: 'Document officiel des caractéristiques techniques, motorisation 1.5L Turbo, dimensions et équipements de sécurité homologués pour le marché tunisien.',
    date: '2026-10-02',
    weekNumber: 40,
    monthKey: '2026-10',
    periodType: 'day',
    mediaType: 'pdf',
    fileUrl: SAMPLE_STA_PDF,
    fileName: 'Fiche_Technique_Tiggo4Pro_STA.pdf',
    fileSize: '450 Ko',
    authorName: 'Mongi Jamaï',
    authorRole: 'Super Administrateur (DSI)',
    createdAt: '2026-10-02T10:15:00.000Z',
    updatedAt: '2026-10-02T10:15:00.000Z',
  },
  {
    id: 'cal-img-02',
    title: 'Préparation Véhicules Showroom & Livraisons STA Ben Arous',
    content: 'Revue de conformité esthétique et nettoyage des véhicules programmés pour livraison client en agence.',
    date: '2026-10-01',
    weekNumber: 40,
    monthKey: '2026-10',
    periodType: 'day',
    mediaType: 'image',
    fileUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=80',
    fileName: 'Showroom_Livraison_BenArous.jpg',
    fileSize: '1.8 Mo',
    authorName: 'Mongi Jamaï',
    authorRole: 'Super Administrateur (DSI)',
    createdAt: '2026-10-01T14:00:00.000Z',
    updatedAt: '2026-10-01T14:00:00.000Z',
  },
  {
    id: 'cal-pdf-02',
    title: 'Grille Tarifaire Officielle & Barème Financement Leasing STA (Q4 2026)',
    content: 'Circulaire de tarification générale pour l\'ensemble du réseau commercial et accords bancaires préférentiels.',
    date: '2026-10-03',
    weekNumber: 40,
    monthKey: '2026-10',
    periodType: 'day',
    mediaType: 'pdf',
    fileUrl: SAMPLE_STA_PDF,
    fileName: 'Grille_Tarifs_STA_Octobre_2026.pdf',
    fileSize: '680 Ko',
    authorName: 'Mongi Jamaï',
    authorRole: 'Super Administrateur (DSI)',
    createdAt: '2026-10-02T16:00:00.000Z',
    updatedAt: '2026-10-02T16:00:00.000Z',
  },
];
