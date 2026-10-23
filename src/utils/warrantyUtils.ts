/**
 * Utilitaires officiels de Garantie Chery Tunisie (STA)
 *
 * Modèles éligibles à la garantie de la batterie haute tension :
 * - Arrizo 8 PHEV
 * - Tiggo 4 HEV
 * - Tiggo 7 PHEV
 * - Tiggo 8 PHEV
 * - Tiggo 9 PHEV
 * - I03 (I03 4x2, I03 4x4, iCar 03)
 *
 * Période de garantie : 8 ans ou 160 000 km
 */

export const OFFICIAL_MANUFACTURER_WARRANTY = '7 ans / 200 000 km';
export const OFFICIAL_BATTERY_WARRANTY = '8 ans ou 160 000 km';

/**
 * Vérifie si un modèle de véhicule bénéficie de la garantie de la batterie
 * @param carName Nom du modèle (ex: "Chery Tiggo 7 PHEV", "Arrizo 8 PHEV", "I03")
 */
export function hasBatteryWarranty(carName?: string): boolean {
  if (!carName) return false;
  const name = carName.toLowerCase().replace(/[-_]/g, ' ').trim();

  // 1. Arrizo 8 PHEV
  if (name.includes('arrizo 8') && (name.includes('phev') || name.includes('hev') || name.includes('hybride') || name.includes('hybrid'))) {
    return true;
  }

  // 2. Tiggo 4 HEV / Pro HEV
  if (name.includes('tiggo 4') && (name.includes('hev') || name.includes('phev') || name.includes('hybride') || name.includes('hybrid'))) {
    return true;
  }

  // 3. Tiggo 7 PHEV / Pro PHEV
  if (name.includes('tiggo 7') && (name.includes('phev') || name.includes('hev') || name.includes('hybride') || name.includes('hybrid'))) {
    return true;
  }

  // 4. Tiggo 8 PHEV / Pro PHEV
  if (name.includes('tiggo 8') && (name.includes('phev') || name.includes('hev') || name.includes('hybride') || name.includes('hybrid'))) {
    return true;
  }

  // 5. Tiggo 9 PHEV / Pro PHEV
  if (name.includes('tiggo 9') && (name.includes('phev') || name.includes('hev') || name.includes('hybride') || name.includes('hybrid'))) {
    return true;
  }

  // 6. I03 (I03, Chery I03, I03 4X4, I03 4X2, iCar 03)
  if (/\b(i03|icar\s*03|i\s*03)\b/.test(name) || name.includes('i03') || name.includes('icar 03')) {
    return true;
  }

  return false;
}

/**
 * Retourne la mention de garantie de la batterie si le véhicule est concerné
 */
export function getBatteryWarrantyText(carName?: string, customBatteryGuarantee?: string): string | null {
  if (customBatteryGuarantee) return customBatteryGuarantee;
  return hasBatteryWarranty(carName) ? OFFICIAL_BATTERY_WARRANTY : null;
}
