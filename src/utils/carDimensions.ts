import { CarModel } from '../types';
import { getFullCarPrice } from '../data/cheryData';

export interface CarDimensionInfo {
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  lengthM: string;
  widthM: string;
  heightM: string;
  volumeM3: number;
  formatted: string;
  segmentLabel: string;
}

// Fallback lookup table based on model name keywords
const KNOWN_DIMENSIONS: Record<string, { l: number; w: number; h: number; segment: string }> = {
  'tiggo 2': { l: 4200, w: 1760, h: 1570, segment: 'SUV Citadin Compact (4.20 m)' },
  'tiggo 4': { l: 4358, w: 1830, h: 1670, segment: 'SUV Compact Urbain (4.36 m)' },
  'i03': { l: 4406, w: 1910, h: 1715, segment: 'SUV Électrique Baroudeur (4.41 m)' },
  'icar': { l: 4406, w: 1910, h: 1715, segment: 'SUV Électrique Baroudeur (4.41 m)' },
  'omoda': { l: 4400, w: 1830, h: 1588, segment: 'Crossover Fastback (4.40 m)' },
  'tiggo 7': { l: 4500, w: 1842, h: 1746, segment: 'SUV Familial 5 Places (4.50 m)' },
  'tiggo 8': { l: 4722, w: 1860, h: 1745, segment: 'Grand SUV 7 Places (4.72 m)' },
  'arrizo 5': { l: 4572, w: 1825, h: 1482, segment: 'Berline Compacte (4.57 m)' },
  'arrizo 8': { l: 4780, w: 1843, h: 1469, segment: 'Grande Berline Prestige (4.78 m)' },
  'tiggo 9': { l: 4820, w: 1930, h: 1699, segment: 'Grand SUV Prestige Flagship (4.82 m)' },
  'himla': { l: 5330, w: 1920, h: 1825, segment: 'Pick-up Double Cabine XL (5.33 m)' },
};

/**
 * Parse dimensions string like "4780 x 1843 x 1469 mm" or deduce from model name
 */
export function getCarDimensions(car?: CarModel | null): CarDimensionInfo {
  if (!car) {
    return {
      lengthMm: 0,
      widthMm: 0,
      heightMm: 0,
      lengthM: '0.00',
      widthM: '0.00',
      heightM: '0.00',
      volumeM3: 0,
      formatted: 'Dimensions non spécifiées',
      segmentLabel: 'Non spécifié',
    };
  }

  let l = 0;
  let w = 0;
  let h = 0;

  if (car.dimensions) {
    // Matches sequences of digits
    const matches = car.dimensions.match(/\d+/g);
    if (matches && matches.length >= 3) {
      l = parseInt(matches[0], 10);
      w = parseInt(matches[1], 10);
      h = parseInt(matches[2], 10);
    }
  }

  // Fallback if dimensions were not parsed
  if (!l || l < 1000) {
    const nameLower = (car.name || '').toLowerCase();
    for (const [key, val] of Object.entries(KNOWN_DIMENSIONS)) {
      if (nameLower.includes(key)) {
        l = val.l;
        w = val.w;
        h = val.h;
        break;
      }
    }
  }

  // Default fallback if still 0
  if (!l) {
    if (car.category === 'Pick-up') {
      l = 5330;
      w = 1920;
      h = 1825;
    } else if (car.category === 'Berline') {
      l = 4780;
      w = 1843;
      h = 1469;
    } else {
      l = 4500;
      w = 1840;
      h = 1700;
    }
  }

  const lengthM = (l / 1000).toFixed(2);
  const widthM = (w / 1000).toFixed(2);
  const heightM = (h / 1000).toFixed(2);
  const volumeM3 = parseFloat(((l * w * h) / 1000000000).toFixed(2));

  let segmentLabel = '';
  if (l >= 5200) {
    segmentLabel = `Pick-up XL (${lengthM} m)`;
  } else if (l >= 4800) {
    segmentLabel = `Grand SUV Flagship (${lengthM} m)`;
  } else if (l >= 4700) {
    segmentLabel = car.category === 'Berline' ? `Grande Berline (${lengthM} m)` : `Grand SUV 7 Places (${lengthM} m)`;
  } else if (l >= 4500) {
    segmentLabel = `SUV Familial (${lengthM} m)`;
  } else if (l >= 4350) {
    segmentLabel = `SUV Compact (${lengthM} m)`;
  } else {
    segmentLabel = `Citadine Compacte (${lengthM} m)`;
  }

  return {
    lengthMm: l,
    widthMm: w,
    heightMm: h,
    lengthM,
    widthM,
    heightM,
    volumeM3,
    formatted: `${l} × ${w} × ${h} mm (${lengthM} m)`,
    segmentLabel,
  };
}

export type CarSortOption =
  | 'price-asc'
  | 'price-desc'
  | 'size-asc'
  | 'size-desc'
  | 'name-asc'
  | 'stock-desc';

export interface SortOptionMeta {
  id: CarSortOption;
  label: string;
  shortLabel: string;
  description: string;
  iconType: 'price' | 'size' | 'name' | 'stock';
  direction: 'asc' | 'desc';
}

export const CAR_SORT_OPTIONS: SortOptionMeta[] = [
  {
    id: 'price-asc',
    label: 'Prix croissant (Moins cher ➔ Plus cher)',
    shortLabel: 'Prix ↗ (Moins cher)',
    description: 'Du premier prix (Tiggo 2 Pro Max) aux modèles haut de gamme',
    iconType: 'price',
    direction: 'asc',
  },
  {
    id: 'price-desc',
    label: 'Prix décroissant (Plus cher ➔ Moins cher)',
    shortLabel: 'Prix ↘ (Plus cher)',
    description: 'Du fleuron haut de gamme (Tiggo 9 PHEV) aux modèles accessibles',
    iconType: 'price',
    direction: 'desc',
  },
  {
    id: 'size-asc',
    label: 'Taille / Longueur croissante (Plus compact ➔ Plus grand)',
    shortLabel: 'Taille ↗ (Compact)',
    description: 'De la citadine compacte (4.20 m) au grand pick-up double cabine (5.33 m)',
    iconType: 'size',
    direction: 'asc',
  },
  {
    id: 'size-desc',
    label: 'Taille / Longueur décroissante (Plus grand ➔ Plus compact)',
    shortLabel: 'Taille ↘ (Grand)',
    description: 'Du pick-up 5.33 m et SUV 7 places aux véhicules urbains compacts',
    iconType: 'size',
    direction: 'desc',
  },
  {
    id: 'name-asc',
    label: 'Nom de modèle (A ➔ Z)',
    shortLabel: 'Nom (A-Z)',
    description: 'Classement alphabétique officiel',
    iconType: 'name',
    direction: 'asc',
  },
  {
    id: 'stock-desc',
    label: 'Disponibilité stock (Plus grand stock en premier)',
    shortLabel: 'Stock disponible',
    description: 'Véhicules immédiatement disponibles pour réservation',
    iconType: 'stock',
    direction: 'desc',
  },
];

/**
 * Sorts an array of cars based on the given sort option
 */
export function sortCarList(cars: CarModel[], sortBy: CarSortOption | string): CarModel[] {
  const list = [...cars];

  return list.sort((a, b) => {
    if (sortBy === 'price-asc') {
      const priceA = getFullCarPrice(a);
      const priceB = getFullCarPrice(b);
      return priceA - priceB;
    }

    if (sortBy === 'price-desc') {
      const priceA = getFullCarPrice(a);
      const priceB = getFullCarPrice(b);
      return priceB - priceA;
    }

    if (sortBy === 'size-asc') {
      const dimA = getCarDimensions(a);
      const dimB = getCarDimensions(b);
      // Primary sort by length
      if (dimA.lengthMm !== dimB.lengthMm) {
        return dimA.lengthMm - dimB.lengthMm;
      }
      // Secondary sort by price
      return getFullCarPrice(a) - getFullCarPrice(b);
    }

    if (sortBy === 'size-desc') {
      const dimA = getCarDimensions(a);
      const dimB = getCarDimensions(b);
      // Primary sort by length
      if (dimA.lengthMm !== dimB.lengthMm) {
        return dimB.lengthMm - dimA.lengthMm;
      }
      // Secondary sort by price
      return getFullCarPrice(b) - getFullCarPrice(a);
    }

    if (sortBy === 'stock-desc') {
      const stockA = a.colors.reduce((sum, c) => sum + c.stock, 0);
      const stockB = b.colors.reduce((sum, c) => sum + c.stock, 0);
      return stockB - stockA;
    }

    if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' });
    }

    return 0;
  });
}
