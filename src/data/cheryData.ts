import {
  CommercialUser,
  CarModel,
  Reservation,
  UserPermissions,
  SiteSettings,
  KnowledgeBaseItem,
  DocumentTemplateConfig,
  CarAccessory,
  CustomQuote,
  TestDriveAppointment,
  StockRequest,
} from '../types';

export interface AutomotiveWallpaperPreset {
  id: string;
  title: string;
  category: string;
  url: string;
  previewUrl: string;
}

export const PRESET_AUTOMOTIVE_WALLPAPERS: AutomotiveWallpaperPreset[] = [
  {
    id: 'wall-icar03-offroad',
    title: 'Chery iCAR 03 Off-Road Noir',
    category: 'Off-Road & Aventure',
    url: '/chery_icar03_offroad.jpg',
    previewUrl: '/chery_icar03_offroad.jpg',
  },
  {
    id: 'wall-showroom',
    title: 'Showroom Chery STA Luxe',
    category: 'Showroom',
    url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1920&auto=format&fit=crop&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'wall-carbon-racing',
    title: 'Fibre de Carbone Nuit Racing',
    category: 'Sport & Racing',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&auto=format&fit=crop&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'wall-tiggo-highway',
    title: 'SUV Tiggo Pro Highway Sunset',
    category: 'Evasion & Route',
    url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1920&auto=format&fit=crop&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'wall-omoda-cockpit',
    title: 'Cockpit Cyber Omoda EV Cyan',
    category: 'Électrique / High-Tech',
    url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1920&auto=format&fit=crop&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'wall-titanium-studio',
    title: 'Gris Titanium Metallic Studio',
    category: 'Premium Studio',
    url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1920&auto=format&fit=crop&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'wall-night-tunnel',
    title: 'Tunnel High-Speed Motion',
    category: 'Performance',
    url: 'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?w=1920&auto=format&fit=crop&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?w=400&auto=format&fit=crop&q=80',
  },
];

export interface AutomotiveThemeDefinition {
  mode: import('../types').ThemeMode;
  name: string;
  subtitle: string;
  bgHex: string;
  cardBgHex: string;
  accentHex: string;
  badgeTag: string;
  iconName: string;
  borderColor: string;
  gradientBg: string;
}

export const AUTOMOTIVE_THEME_DEFINITIONS: AutomotiveThemeDefinition[] = [
  {
    mode: 'dark',
    name: 'Nuit Carbone',
    subtitle: 'Thème Sombre Classique & Bleu Slate',
    bgHex: '#0B0F17',
    cardBgHex: '#111827',
    accentHex: '#3B82F6',
    badgeTag: 'Sombre Standard',
    iconName: 'Moon',
    borderColor: 'border-slate-800',
    gradientBg: 'from-slate-900 via-slate-950 to-slate-900',
  },
  {
    mode: 'light',
    name: 'Showroom Épuré',
    subtitle: 'Thème Clair Lumineux & Éléments Chromés',
    bgHex: '#F8FAFC',
    cardBgHex: '#FFFFFF',
    accentHex: '#2563EB',
    badgeTag: 'Clair Lumineux',
    iconName: 'Sun',
    borderColor: 'border-slate-200',
    gradientBg: 'from-slate-100 via-white to-slate-100',
  },
  {
    mode: 'red',
    name: 'Chery Crimson',
    subtitle: 'Rouge Passion Chery & Finition Nuit',
    bgHex: '#150507',
    cardBgHex: '#1F0A0D',
    accentHex: '#DC2626',
    badgeTag: 'Chery Identity',
    iconName: 'Flame',
    borderColor: 'border-red-900/60',
    gradientBg: 'from-red-950/90 via-[#150507] to-red-950/70',
  },
  {
    mode: 'carbon',
    name: 'Fibre de Carbone',
    subtitle: 'Ambiance Piste Racing & Surpiqûres Rouges',
    bgHex: '#090a0f',
    cardBgHex: '#131620',
    accentHex: '#EF4444',
    badgeTag: 'Sport & Performance',
    iconName: 'Gauge',
    borderColor: 'border-red-500/30',
    gradientBg: 'from-neutral-950 via-[#0a0d14] to-neutral-950',
  },
  {
    mode: 'electric_cyan',
    name: 'Omoda EV Cyber',
    subtitle: 'Électrique / Hybride, Cockpit Neon Cyan',
    bgHex: '#03131a',
    cardBgHex: '#08212d',
    accentHex: '#06B6D4',
    badgeTag: 'Omoda & EV',
    iconName: 'Zap',
    borderColor: 'border-cyan-500/30',
    gradientBg: 'from-cyan-950/80 via-[#03131a] to-slate-950',
  },
  {
    mode: 'luxury_gold',
    name: 'Tiggo Executive Gold',
    subtitle: 'Luxe Executive, Bronze Or & Cuir Nappa',
    bgHex: '#120e0a',
    cardBgHex: '#1d1812',
    accentHex: '#D97706',
    badgeTag: 'Executive Luxe',
    iconName: 'Crown',
    borderColor: 'border-amber-600/30',
    gradientBg: 'from-amber-950/70 via-[#120e0a] to-stone-950',
  },
  {
    mode: 'titanium',
    name: 'Titanium High-Tech',
    subtitle: 'Châssis Métal Brossé & Satiné Silver',
    bgHex: '#111518',
    cardBgHex: '#1a2026',
    accentHex: '#94A3B8',
    badgeTag: 'Titanium Metal',
    iconName: 'Shield',
    borderColor: 'border-slate-700/60',
    gradientBg: 'from-slate-900 via-[#111518] to-slate-950',
  },
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  logoUrl: '/sta_logo_white.svg',
  siteName: 'CHERY Tunisie',
  siteSubtitle: 'Système de Réservation, Stocks & Gestion des Accès — Siège STA',
  headerBadgeText: 'Espace Commercial & Direction',
  announcementBanner: {
    enabled: true,
    text: '⚡ [Super Admin DSI] Système de réservation opérationnel. Mises à jour automatiques des arrivages et personnalisations.',
    type: 'info',
  },
  dsiContact: {
    phone: '+216 71 800 990',
    email: 'dsi.support@chery.tn',
    supportHours: 'Lun - Ven: 08:00 - 17:30',
    address: 'Direction Informatique (DSI) - Siège STA, Zone Industrielle Ben Arous, Tunis',
  },
  accentColor: '#DC2626',
  footerLogoUrl: '/sta_logo_white.svg',
  footerTitle: "STA — Société Tunisienne d'Automobiles",
  footerSubtitle: "Distributeur Officiel & Réseau Agréé",
  footerDescription: "Plateforme réservée aux commerciaux & réseau d'agences agréées.",
  footerCopyright: "© 2026 STA — Société Tunisienne d'Automobiles. Conçu & Développé par Jamai Mongi. Tous droits réservés.",
  homeBackgroundType: 'video',
  homeBackgroundImageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1920&auto=format&fit=crop&q=80',
  homeBackgroundVideoUrl: 'https://youtu.be/DdNliUon_Cs',
  homeBackgroundOverlayOpacity: 0.65,
  homeBackgroundBlur: false,

  siteBackgroundType: 'image',
  siteBackgroundImageUrl: '/chery_icar03_offroad.jpg',
  siteBackgroundVideoUrl: '',
  siteBackgroundOverlayOpacity: 0.85,
  siteBackgroundBlur: false,

  defaultThemeMode: 'dark',
};

// --- Initial Customization Configurations ---
export const DEFAULT_DOCUMENT_TEMPLATE: DocumentTemplateConfig = {
  companyName: "Société Tunisienne d'Automobiles (STA)",
  logoUrl: '/sta_logo_white.svg',
  matriculeFiscale: '1489203/A/M/000',
  address: 'Zone Industrielle Ben Arous, Rue des Entrepreneurs, 2013 Tunis',
  phone: '+216 71 800 990',
  email: 'contact@chery.tn',
  ribBancaire: 'TN59 10 000 0000000000000 12 (BIAT)',
  tvaPercentage: 19,
  droitDeTimbreTND: 1.0,
  validityDays: 30,
  defaultRegistrationFeeTND: 0,
  quoteHeaderNote: 'Offre de prix officielle pour véhicules neufs Chery garantie constructeur 7 ans / 200 000 km.',
  quoteFooterTerms: 'Conditions de paiement : Acompte de 20% à la réservation, le solde avant immatriculation et livraison.',
};

export const INITIAL_KNOWLEDGE_BASE: KnowledgeBaseItem[] = [
  {
    id: 'kb-1',
    title: 'Garantie Constructeur Chery 7 Ans / 200 000 km',
    category: 'garantie',
    content: 'Tous les véhicules neufs distribués par STA Chery Tunisie bénéficient de la garantie constructeur de 7 ans ou 200 000 km (au premier des deux termes atteint). La garantie couvre le moteur, la boîte de vitesses, le système électrique et le châssis, à condition de respecter les révisions périodiques dans les ateliers agréés STA.',
    tags: ['Garantie', 'Service Après-Vente', 'Maintenance', 'Moteur'],
    updatedAt: '2026-07-30',
    updatedBy: 'Lamine Abbasi (Directeur Marketing)',
    isPublicForAI: true,
  },
  {
    id: 'kb-2',
    title: 'Procédure & Éligibilité Dossier Leasing (Crédit-Bail)',
    category: 'financement',
    content: 'Pour les professionnels et sociétés, nous acceptons les financements Leasing via toutes les compagnies de la place (Tunisie Leasing, Hannibal Lease, Best Lease, etc.). Documents requis : Extrait RNE, Matricule Fiscale, CIN Gérant, 3 derniers relevés bancaires. Acompte recommandé : 10% à 20%.',
    tags: ['Leasing', 'Financement', 'Société', 'Documents'],
    updatedAt: '2026-07-29',
    updatedBy: 'Sami Chaker (Admin)',
    isPublicForAI: true,
  },
  {
    id: 'kb-3',
    title: 'Adresses & Contacts des Agences Chery Tunisie (STA)',
    category: 'agences',
    content: '• Siège STA & Showroom Ben Arous : Z.I. Ben Arous, Tél: 71 800 990\n• Showroom Lac 2 Tunis : Rue de la Feuille d\'Érable, Tél: 31 300 400\n• Agence Sousse Pearl : Avenue Yasser Arafat, Sahloul, Tél: 73 220 400\n• Agence Sfax : Route Teniour Km 1.5, Tél: 74 400 500\nHoraires : Lundi au Vendredi de 08:00 à 17:30 / Samedi de 08:30 à 13:00.',
    tags: ['Agences', 'Showrooms', 'Horaires', 'Localisation'],
    updatedAt: '2026-07-28',
    updatedBy: 'Lamine Abbasi',
    isPublicForAI: true,
  },
  {
    id: 'kb-4',
    title: 'Modalités d\'Immatriculation & Carte Grise Tunisie',
    category: 'faq',
    content: 'Frais de carte grise et d\'immatriculation applicables selon la puissance fiscale (CV) : \n- 5 à 7 CV : 650 à 850 TND\n- 8 à 10 CV : 950 à 1200 TND\n- 11 CV et plus : 1500 TND.\nSTA s\'occupe des démarches administratives auprès de l\'Agence Technique des Transports Terrestres (ATTT).',
    tags: ['Immatriculation', 'Carte Grise', 'ATTT', 'Frais'],
    updatedAt: '2026-07-25',
    updatedBy: 'Arbi Gharbi (DSI)',
    isPublicForAI: true,
  },
  {
    id: 'kb-5',
    title: 'Offre Spéciale Flotte & Remises Volume Entreprises',
    category: 'promotions',
    content: 'Pour les commandes de flottes d\'entreprises (à partir de 3 véhicules), STA accorde une remise tarifaire progressive allant de 2% à 5% sur le prix HT ainsi que la gratuité du premier entretien à 10 000 km.',
    tags: ['Flotte', 'Remise', 'Promotions', 'Société'],
    updatedAt: '2026-07-20',
    updatedBy: 'Lamine Abbasi',
    isPublicForAI: true,
  },
];

export const INITIAL_ACCESSORIES: CarAccessory[] = [
  {
    id: 'acc-1',
    name: 'Marchepieds Latéraux en Aluminium Brossé',
    category: 'extérieur',
    priceTND: 750,
    description: 'Design robuste et élégant facilitant l\'accès à bord et protégeant la bas de caisse.',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'acc-2',
    name: 'Tapis de Sol 3D Thermoformés sur-mesure Chery',
    category: 'intérieur',
    priceTND: 180,
    description: 'Protection maximale contre la poussière et l\'eau avec bordures relevées anti-déversement.',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'acc-3',
    name: 'Attelage de Remorquage Amovible d\'Origine',
    category: 'extérieur',
    priceTND: 950,
    description: 'Capacité de remorquage jusqu\'à 1500 kg avec faisceau électrique 13 broches inclus.',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'acc-4',
    name: 'Films de Protection Solaire Anti-UV & Anti-Carjacking',
    category: 'protection',
    priceTND: 320,
    description: 'Teintage homologué des vitres latérales et lunette arrière. Filtre 99% des rayons UV.',
  },
  {
    id: 'acc-5',
    name: 'Barres de Toit Longitudinales Alulight',
    category: 'extérieur',
    priceTND: 450,
    description: 'Permet le montage de coffre de toit ou porte-vélos jusqu\'à 75 kg de charge.',
  },
  {
    id: 'acc-6',
    name: 'Alarme Volumétrique & Anti-Soulèvement',
    category: 'sécurité',
    priceTND: 380,
    description: 'Système d\'alarme d\'origine connecté à la clé intelligente Keyless avec sirène haute puissance.',
  },
  {
    id: 'acc-7',
    name: 'Becquet Arrière Sport Aéro',
    category: 'extérieur',
    priceTND: 290,
    description: 'Design sportif affiné peints couleur carrosserie.',
  },
  {
    id: 'acc-8',
    name: 'Dashcam Caméra de Bord Ultra HD Wi-Fi',
    category: 'multimédia',
    priceTND: 350,
    description: 'Enregistrement continu en 4K avec vision nocturne et capteur de choc en stationnement.',
  },
];


export const DEFAULT_ADMIN_PERMISSIONS: UserPermissions = {
  canCreateReservation: true,
  canCancelReservation: true,
  canEditPrices: true,
  canManageStock: true,
  canAccessAdminPanel: true,
  canPrintVouchers: true,
  canExportReports: true,
};

export const DEFAULT_COMMERCIAL_PERMISSIONS: UserPermissions = {
  canCreateReservation: true,
  canCancelReservation: false,
  canEditPrices: false,
  canManageStock: false,
  canAccessAdminPanel: false,
  canPrintVouchers: true,
  canExportReports: true,
};

export const INITIAL_COMMERCIALS: CommercialUser[] = [
  {
    id: 'superadmin-arbi',
    name: 'Arbi Gharbi',
    title: "Directeur Système d'Informations (DSI)",
    email: 'arbi.gharbi@chery.tn',
    phone: '+216 71 800 990',
    agency: 'Direction Informatique (DSI) - Siège STA',
    role: 'super_admin',
    password: '1234',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    permissions: DEFAULT_ADMIN_PERMISSIONS,
  },
  {
    id: 'superadmin-kamel',
    name: 'Kamel Belhoula',
    title: 'Manager IT',
    email: 'kamel.belhoula@chery.tn',
    phone: '+216 71 800 991',
    agency: 'Direction Informatique (DSI) - Siège STA',
    role: 'super_admin',
    password: '1234',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    permissions: DEFAULT_ADMIN_PERMISSIONS,
  },
  {
    id: 'admin-lamine',
    name: 'Lamine Abbasi',
    title: 'Directeur Marketing',
    email: 'lamine.abbasi@chery.tn',
    phone: '+216 71 800 900',
    agency: 'Direction Générale - Marketing',
    role: 'admin',
    password: 'admin',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    permissions: DEFAULT_ADMIN_PERMISSIONS,
  },
  {
    id: 'admin-sami',
    name: 'Sami Chaker',
    title: 'Administrateur',
    email: 'sami.chaker@chery.tn',
    phone: '+216 71 800 901',
    agency: 'Direction Générale - Administration',
    role: 'admin',
    password: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    permissions: DEFAULT_ADMIN_PERMISSIONS,
  },
  {
    id: 'comm-marwa',
    name: 'Marwa Frikha',
    title: 'Commerciale',
    email: 'marwa.frikha@chery.tn',
    phone: '+216 22 101 202',
    agency: 'Chery Agence Lac 2 - Tunis',
    role: 'commercial',
    password: '123',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    permissions: DEFAULT_COMMERCIAL_PERMISSIONS,
  },
  {
    id: 'comm-moez',
    name: 'Moez Ben Naser',
    title: 'Commercial',
    email: 'moez.bennaser@chery.tn',
    phone: '+216 55 303 404',
    agency: 'Chery Agence Sousse Pearl',
    role: 'commercial',
    password: '123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    permissions: DEFAULT_COMMERCIAL_PERMISSIONS,
  },
  {
    id: 'comm-bassem',
    name: 'Bassem Jerbi',
    title: 'Commercial',
    email: 'bassem.jerbi@chery.tn',
    phone: '+216 98 505 606',
    agency: 'Chery Agence Sfax Route Teniour',
    role: 'commercial',
    password: '123',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    permissions: DEFAULT_COMMERCIAL_PERMISSIONS,
  },
  {
    id: 'comm-hanen',
    name: 'Hanen Gharbi',
    title: 'Commerciale',
    email: 'hanen.gharbi@chery.tn',
    phone: '+216 20 707 808',
    agency: 'Chery Agence Nabeul Cap Bon',
    role: 'commercial',
    password: '123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    permissions: DEFAULT_COMMERCIAL_PERMISSIONS,
  },
  {
    id: 'comm-ines',
    name: 'Ines Chaari',
    title: 'Commerciale',
    email: 'ines.chaari@chery.tn',
    phone: '+216 26 909 101',
    agency: 'Chery Agence Bizerte Port',
    role: 'commercial',
    password: '123',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    permissions: DEFAULT_COMMERCIAL_PERMISSIONS,
  },
];

export function getFixedDepositForCar(car?: CarModel | null | string): number {
  if (!car) return 20000;
  if (typeof car === 'object' && car.requiredDepositTND && car.requiredDepositTND > 0) {
    return car.requiredDepositTND;
  }

  const name = (typeof car === 'string' ? car : car.name).toLowerCase();

  // Rules specified by Chery Tunisie STA:
  // 1. Chery iCar 03 4x2 -> 20 000 TND
  // 2. Chery iCar 03 4x4 -> 20 000 TND
  // 3. Chery Arrizo 8 PHEV -> 30 000 TND
  // 4. Chery Tiggo 7 PHEV -> 30 000 TND
  // 5. Chery Tiggo 2 Pro Max -> 10 000 TND
  // 6. Chery Tiggo 8 PHEV -> 40 000 TND
  // 7. Chery Tiggo 9 PHEV -> 50 000 TND
  // 8. Chery Tiggo 4 HEV -> 20 000 TND

  if (name.includes('icar 03 4x2') || name.includes('i03 4x2') || name.includes('icar03 4x2')) return 20000;
  if (name.includes('icar 03 4x4') || name.includes('i03 4x4') || name.includes('icar03 4x4')) return 20000;
  if (name.includes('icar 03') || name.includes('i03')) return 20000;

  if (name.includes('arrizo 8')) return 30000;

  if (name.includes('tiggo 7') && (name.includes('phev') || name.includes('hybride'))) return 30000;
  if (name.includes('tiggo 7')) return 30000;

  if (name.includes('tiggo 2')) return 10000;

  if (name.includes('tiggo 8') && (name.includes('phev') || name.includes('hybride'))) return 40000;
  if (name.includes('tiggo 8')) return 40000;

  if (name.includes('tiggo 9')) return 50000;

  if (name.includes('tiggo 4') && (name.includes('hev') || name.includes('phev') || name.includes('hybride'))) return 20000;
  if (name.includes('tiggo 4')) return 20000;

  if (name.includes('arrizo 5')) return 10000;
  if (name.includes('omoda 5')) return 25000;

  return 20000;
}

export const DEFAULT_REGISTRATION_AND_CARTE_GRISE_FEE = 0;

export function getRegistrationFeeForCar(car?: CarModel | null | string): number {
  if (!car) return DEFAULT_REGISTRATION_AND_CARTE_GRISE_FEE;
  if (typeof car === 'object' && car.registrationFeeTND !== undefined && car.registrationFeeTND > 0) {
    return car.registrationFeeTND;
  }
  return DEFAULT_REGISTRATION_AND_CARTE_GRISE_FEE;
}

export function getFullCarPrice(car?: CarModel | null | string): number {
  if (!car) return 0;
  if (typeof car === 'string') return 0;
  const base = car.priceTND || 0;
  const regFee = getRegistrationFeeForCar(car);
  return base + regFee;
}

export const INITIAL_CARS: CarModel[] = [
  {
    id: 'car-tiggo-2-pro-max',
    name: 'Chery Tiggo 2 Pro Max',
    category: 'SUV',
    priceTND: 68900,
    requiredDepositTND: 10000,
    engine: '1.5L VVT 108 ch',
    transmission: 'Automatique CVT 9',
    energy: 'Essence',
    guarantee: '7 ans / 200 000 km',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
    description: 'Le SUV urbain Max avec calandre diamant chromée, écran tactile 10.25", feux LED et toit ouvrant.',
    features: [
      'Écran tactile 10.25" HD Apple CarPlay & Android Auto',
      'Caméra HD de recul + Radars arrière',
      'Toit ouvrant panoramique électrique',
      'Jantes alliage 17" bicolores sport',
      'Volant cuir multifonctions',
      'Système d\'aide au démarrage en côte (HHC)'
    ],
    colors: [
      { id: 'col-t2m-1', name: 'Blanc Okavango', hexCode: '#FFFFFF', stock: 8, reserved: 2, interiorColor: 'Cuir Marron Cognac' },
      { id: 'col-t2m-2', name: 'Gris Platine', hexCode: '#6B7280', stock: 5, reserved: 1, interiorColor: 'Gris Anthracite / Noir' },
      { id: 'col-t2m-3', name: 'Noir Fantôme', hexCode: '#111827', stock: 4, reserved: 0, interiorColor: 'Noir / Surpiqûres Rouges' },
      { id: 'col-t2m-4', name: 'Rouge Rubis', hexCode: '#DC2626', stock: 3, reserved: 1, interiorColor: 'Cuir Noir Sport' },
    ],
    interiorColors: [
      { id: 'int-t2m-1', name: 'Noir Anthracite Surpiqûres Rouge', hexCode: '#1E293B', stock: 12, reserved: 3 },
    ]
  },
  {
    id: 'car-icar-03-4x2',
    name: 'Chery iCar 03 4x2',
    category: 'Électrique/Hybride',
    priceTND: 119900,
    requiredDepositTND: 20000,
    engine: 'Moteur Électrique 135 kW (184 ch)',
    transmission: 'Automatique Monorapport',
    energy: 'Électrique',
    guarantee: '8 ans / 160 000 km Batterie & 7 ans Véhicule',
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80',
    description: 'SUV tout-terrain 100% Électrique au design cubique futuriste. Autonomie jusqu\'à 501 km CLTC.',
    features: [
      'Batterie LFP CATL 65.6 kWh',
      'Écran central tactile 15.6" Ultra HD',
      'Affichage panoramique 360° avec vue châssis',
      'Processeur Qualcomm Snapdragon 8155',
      'Chargement rapide DC 30-80% en 30min',
      'Système audio premium 12 HP'
    ],
    colors: [
      { id: 'col-i03-1', name: 'Gris Armée Cyber', hexCode: '#475569', stock: 6, reserved: 2, interiorColor: 'Cuir Vert Militaire & Gold' },
      { id: 'col-i03-2', name: 'Blanc Arctique', hexCode: '#FFFFFF', stock: 5, reserved: 1, interiorColor: 'Noir Technologique' },
      { id: 'col-i03-3', name: 'Noir Carbone', hexCode: '#09090B', stock: 4, reserved: 0, interiorColor: 'Cuir Noir Surpiqûres Vert Cyber' },
    ],
    interiorColors: [
      { id: 'int-i03-1', name: 'Cuir Vert Militaire & Gold', hexCode: '#1E293B', stock: 8, reserved: 2 },
    ]
  },
  {
    id: 'car-icar-03-4x4',
    name: 'Chery iCar 03 4x4',
    category: 'Électrique/Hybride',
    priceTND: 134900,
    requiredDepositTND: 20000,
    engine: 'Double Moteur Électrique 205 kW (279 ch) 4WD',
    transmission: 'Automatique Intégrale e-4WD',
    energy: 'Électrique',
    guarantee: '8 ans / 160 000 km Batterie & 7 ans Véhicule',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
    description: 'SUV Électrique 4WD bimoteur iWD tout-terrain extrême. 0-100 km/h en 6.5s et 8 modes de franchissement.',
    features: [
      'Transmission Intégrale Intelligente e-4WD (Dual Motor)',
      'Batterie LFP 69.8 kWh high capacity',
      'Modes Tout-Terrain (Sable, Boue, Neige, Roches)',
      'Écran central 15.6" Qualcomm Snapdragon',
      'Toit panoramique ouvrant géant',
      'Audio Haute Fidélité 12 Haut-parleurs'
    ],
    colors: [
      { id: 'col-i034-1', name: 'Gris Armée Cyber', hexCode: '#334155', stock: 4, reserved: 1, interiorColor: 'Cuir Nappa Vert & Bronze' },
      { id: 'col-i034-2', name: 'Vert Bivouac', hexCode: '#14532D', stock: 3, reserved: 1, interiorColor: 'Cuir Vert Bivouac & Noir' },
      { id: 'col-i034-3', name: 'Noir Onyx', hexCode: '#000000', stock: 3, reserved: 0, interiorColor: 'Cuir Noir Titanium' },
    ],
    interiorColors: [
      { id: 'int-i034-1', name: 'Cuir Nappa Vert & Surpiqûres Bronze', hexCode: '#022C22', stock: 7, reserved: 2 },
    ]
  },
  {
    id: 'car-arrizo-8-phev',
    name: 'Chery Arrizo 8 PHEV',
    category: 'Électrique/Hybride',
    priceTND: 139900,
    requiredDepositTND: 30000,
    engine: '1.5L Turbo PHEV C-DM (360 ch Cumulés)',
    transmission: 'Automatique DHT Hybride',
    energy: 'Hybride',
    guarantee: '7 ans / 200 000 km',
    imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=80',
    description: 'Berline de luxe Hybride Rechargeable Plug-in. Autonomie combinée jusqu\'à 1400 km et 100 km en 100% électrique.',
    features: [
      'Système Hybride C-DM de 5ème génération 360 ch / 530 Nm',
      'Double écran incurvé 24.6" 2.5K HD',
      'Sièges chauffants, ventilés & massants Nappa',
      'Système Audio SONY 12 Haut-parleurs',
      'Aides ADAS niveau 2+ (Conduite semi-autonome)',
      'Consommation ultra-basse 4.2 L / 100 km'
    ],
    colors: [
      { id: 'col-a8p-1', name: 'Bleu Saphir Impérial', hexCode: '#1E3A8A', stock: 5, reserved: 1 },
      { id: 'col-a8p-2', name: 'Blanc Nacre', hexCode: '#FFFFFF', stock: 4, reserved: 2 },
      { id: 'col-a8p-3', name: 'Gris Titanium', hexCode: '#475569', stock: 3, reserved: 0 },
    ],
    interiorColors: [
      { id: 'int-a8p-1', name: 'Cuir Nappa Macchiato & Bleu Nuit', hexCode: '#1E293B', stock: 8, reserved: 2 },
    ]
  },
  {
    id: 'car-tiggo-4-pro-hev',
    name: 'Chery Tiggo 4 Pro HEV',
    category: 'Électrique/Hybride',
    priceTND: 84900,
    requiredDepositTND: 20000,
    engine: '1.5L Hybride Auto-Rechargeable 143 ch',
    transmission: 'Automatique Hybride Dedicated Transmission',
    energy: 'Hybride',
    guarantee: '7 ans / 200 000 km',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80',
    description: 'SUV compact Hybride sans contrainte de recharge. Économie de carburant exceptionnelle en ville (4.8L/100km).',
    features: [
      'Technologie Hybride Auto-Rechargeable',
      'Écran tactile 10.25" avec CarPlay / Android Auto',
      'Caméra 360° HD',
      'Frein à main électrique Autohold',
      'Régulateur de vitesse adaptatif',
      'Climatisation automatique avec filtre N95'
    ],
    colors: [
      { id: 'col-t4h-1', name: 'Blanc Okavango', hexCode: '#FFFFFF', stock: 7, reserved: 2 },
      { id: 'col-t4h-2', name: 'Gris Platine', hexCode: '#6B7280', stock: 5, reserved: 1 },
      { id: 'col-t4h-3', name: 'Bleu Électrique', hexCode: '#2563EB', stock: 3, reserved: 0 },
    ],
    interiorColors: [
      { id: 'int-t4h-1', name: 'Cuir Synthétique Noir & Bleuté', hexCode: '#0F172A', stock: 10, reserved: 2 },
    ]
  },
  {
    id: 'car-tiggo-7-pro-phev',
    name: 'Chery Tiggo 7 Pro PHEV',
    category: 'Électrique/Hybride',
    priceTND: 118900,
    requiredDepositTND: 30000,
    engine: '1.5L Turbo PHEV Dual-Motor (326 ch / 510 Nm)',
    transmission: 'Automatique DHT 3 rapports Hybride',
    energy: 'Hybride',
    guarantee: '7 ans / 200 000 km',
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop&q=80',
    description: 'SUV Familial Hybride Rechargeable Plug-in. 80 km 100% électrique, toit panoramique et puissance cumulée de 326 ch.',
    features: [
      'Motorisation Hybride Rechargeable 326 ch',
      'Autonomie électrique 80 km (1000 km combinés)',
      'Toit ouvrant panoramique 1.1 m²',
      'Caméra HD 360° avec châssis transparent',
      'Régulateur adaptatif ACC + Freinage d\'urgence',
      'Système audio SONY 8 HP'
    ],
    colors: [
      { id: 'col-t7p-1', name: 'Blanc Nacre Arctique', hexCode: '#F8FAFC', stock: 6, reserved: 2 },
      { id: 'col-t7p-2', name: 'Gris Titanium', hexCode: '#475569', stock: 4, reserved: 1 },
      { id: 'col-t7p-3', name: 'Noir Onyx', hexCode: '#000000', stock: 3, reserved: 1 },
    ],
    interiorColors: [
      { id: 'int-t7p-1', name: 'Cuir Nappa Noir & Surpiqûres Électriques', hexCode: '#111827', stock: 8, reserved: 3 },
    ]
  },
  {
    id: 'car-tiggo-8-pro-phev',
    name: 'Chery Tiggo 8 Pro PHEV',
    category: 'Électrique/Hybride',
    priceTND: 158900,
    requiredDepositTND: 40000,
    engine: '1.5L Turbo PHEV C-DM (326 ch / 545 Nm)',
    transmission: 'Automatique DHT Hybride 3 rapports',
    energy: 'Hybride',
    guarantee: '7 ans / 200 000 km',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
    description: 'Le grand SUV 7 places Hybride Rechargeable de prestige. Performance, espace familial et autonomie totale de 1200 km.',
    features: [
      '7 Places modulables en cuir Nappa',
      'Système Hybride Rechargeable 326 ch',
      'Double écran HD incurvé 24.6"',
      'Affichage Tête Haute HUD couleur',
      'Audio SONY 10 Haut-parleurs',
      'Recharge rapide DC 30-80% en 25 min'
    ],
    colors: [
      { id: 'col-t8p-1', name: 'Noir Onyx Impérial', hexCode: '#000000', stock: 5, reserved: 2 },
      { id: 'col-t8p-2', name: 'Blanc Nacre', hexCode: '#FFFFFF', stock: 4, reserved: 1 },
      { id: 'col-t8p-3', name: 'Gris Titane', hexCode: '#374151', stock: 3, reserved: 0 },
    ],
    interiorColors: [
      { id: 'int-t8p-1', name: 'Cuir Nappa Executive Noir & Cognac', hexCode: '#0B0F19', stock: 7, reserved: 2 },
    ]
  },
  {
    id: 'car-tiggo-9-pro-phev',
    name: 'Chery Tiggo 9 Pro PHEV',
    category: 'Électrique/Hybride',
    priceTND: 178900,
    requiredDepositTND: 50000,
    engine: '2.0L Turbo PHEV C-DM Super Hybrid (380 ch / 610 Nm)',
    transmission: 'Automatique 3-DHT Intégrale 4WD',
    energy: 'Hybride',
    guarantee: '7 ans / 200 000 km',
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop&q=80',
    description: 'Le Flagship Luxe absolu Chery. Suspension pilotée CDC, 380 ch 4WD, massage Nappa et confort 5 étoiles.',
    features: [
      'Suspension Électromagnétique Active CDC',
      'Transmission Intégrale 4WD Super Hybrid 380 ch',
      'Écran panoramique 24.6" 2.5K + Affichage AR-HUD 50"',
      'Sièges Zéro-Gravité massants & ventilés',
      'Système Audio SONY 14 Haut-parleurs avec têtières intégrées',
      'AD-ADAS Niveau 2.5 (Park Assist 360 & Conduite Autonome)'
    ],
    colors: [
      { id: 'col-t9p-1', name: 'Noir Onyx Monarque', hexCode: '#000000', stock: 4, reserved: 1 },
      { id: 'col-t9p-2', name: 'Gris Métal Satiné', hexCode: '#334155', stock: 3, reserved: 1 },
      { id: 'col-t9p-3', name: 'Blanc Nacre Alpin', hexCode: '#FFFFFF', stock: 3, reserved: 0 },
    ],
    interiorColors: [
      { id: 'int-t9p-1', name: 'Cuir Nappa Blanc Yatch & Bleu Royal', hexCode: '#1E293B', stock: 6, reserved: 2 },
    ]
  },
  {
    id: 'car-tiggo-2-pro',
    name: 'Chery Tiggo 2 Pro',
    category: 'SUV',
    priceTND: 64900,
    requiredDepositTND: 10000,
    engine: '1.5L VVT 108 ch',
    transmission: 'Automatique CVT (9 rapports séquentiels)',
    energy: 'Essence',
    guarantee: '7 ans / 200 000 km',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
    description: 'Le SUV urbain dynamique et connecté avec calandre diamant, écran tactile 9 pouces et feux LED signature.',
    features: [
      'Écran tactile 9" HD Apple CarPlay & Android Auto',
      'Caméra de recul + Radars arrière',
      'Régulateur de vitesse',
      'Jantes alliage 16" bicolores',
      'Volant cuir multifonctions',
      'Système d\'aide au démarrage en côte (HHC)'
    ],
    colors: [
      { id: 'col-t2-1', name: 'Blanc Okavango', hexCode: '#FFFFFF', stock: 6, reserved: 2 },
      { id: 'col-t2-2', name: 'Gris Platine', hexCode: '#6B7280', stock: 4, reserved: 1 },
      { id: 'col-t2-3', name: 'Noir Fantôme', hexCode: '#111827', stock: 3, reserved: 0 },
      { id: 'col-t2-4', name: 'Rouge Rubis', hexCode: '#DC2626', stock: 2, reserved: 1 },
    ],
    interiorColors: [
      { id: 'int-t2-1', name: 'Noir Anthracite Surpiqûres Orange', hexCode: '#1E293B', stock: 10, reserved: 2 },
    ]
  },
  {
    id: 'car-tiggo-4-pro',
    name: 'Chery Tiggo 4 Pro',
    category: 'SUV',
    priceTND: 78900,
    requiredDepositTND: 20000,
    engine: '1.5L Turbo 147 ch',
    transmission: 'Automatique CVT 9',
    energy: 'Essence',
    guarantee: '7 ans / 200 000 km',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80',
    description: 'Un SUV polyvalent spacieux offrant un équipement technologique complet, toit ouvrant et chargeur à induction.',
    features: [
      'Tableau de bord digital 7" + Écran central 10.25"',
      'Chargeur Smartphone par induction',
      'Toit ouvrant électrique',
      'Frein de stationnement électrique avec Autohold',
      'Sellerie Simili-Cuir haute qualité',
      'Accès et démarrage mains libres (Keyless)'
    ],
    colors: [
      { id: 'col-t4-1', name: 'Blanc Okavango', hexCode: '#F8FAFC', stock: 8, reserved: 3 },
      { id: 'col-t4-2', name: 'Gris Platine Métallisé', hexCode: '#475569', stock: 5, reserved: 2 },
      { id: 'col-t4-3', name: 'Noir Profond', hexCode: '#09090B', stock: 2, reserved: 1 },
    ],
    interiorColors: [
      { id: 'int-t4-1', name: 'Cuir Synthétique Noir Premium', hexCode: '#0F172A', stock: 12, reserved: 4 },
    ]
  },
  {
    id: 'car-tiggo-7-pro',
    name: 'Chery Tiggo 7 Pro Luxe',
    category: 'SUV',
    priceTND: 98900,
    requiredDepositTND: 30000,
    engine: '1.5L Turbo 147 ch',
    transmission: 'Automatique CVT9 Séquentiel',
    energy: 'Essence',
    guarantee: '7 ans / 200 000 km',
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop&q=80',
    description: 'Le SUV familial haut de gamme de Chery avec toit panoramique géant, vision 360° et climatisation automatique bizone.',
    features: [
      'Toit panoramique ouvrant 1.1 m²',
      'Caméra de vision panoramique 360° HD',
      'Hayon arrière électrique mains libres',
      'Sièges conducteur & passager électriques',
      'Climatisation automatique bizone avec purificateur N95',
      'Éclairage d\'ambiance intérieur personnalisable 64 couleurs'
    ],
    colors: [
      { id: 'col-t7-1', name: 'Blanc Nacre', hexCode: '#F1F5F9', stock: 5, reserved: 2 },
      { id: 'col-t7-2', name: 'Gris Minéral', hexCode: '#334155', stock: 3, reserved: 1 },
      { id: 'col-t7-3', name: 'Noir Onyx', hexCode: '#18181B', stock: 4, reserved: 0 },
    ],
    interiorColors: [
      { id: 'int-t7-1', name: 'Cuir Nappa Noir Surpiqué', hexCode: '#111827', stock: 8, reserved: 2 },
    ]
  },
  {
    id: 'car-tiggo-8-pro-max',
    name: 'Chery Tiggo 8 Pro Max 4WD',
    category: 'SUV',
    priceTND: 138900,
    requiredDepositTND: 40000,
    engine: '2.0L TGDI 254 ch 4WD',
    transmission: 'Automatique DCT 7 rapports',
    energy: 'Essence',
    guarantee: '7 ans / 200 000 km',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
    description: 'Le vaisseau amiral 7 places. Transmission intégrale intelligente 4WD, système audio Sony 10 haut-parleurs et aides ADAS niveau 2.',
    features: [
      '7 Vraies places en cuir perforé Nappa',
      'Double écran panoramique incurvé 24.6"',
      'Système Audio premium SONY 10 HP',
      'Affichage tête haute HUD couleur',
      'Aides à la conduite ADAS (Freinage d\'urgence, Maintien de voie, Blind Spot)',
      'Transmission 4WD intégrale avec 6 modes de conduite'
    ],
    colors: [
      { id: 'col-t8-1', name: 'Noir Onyx Impérial', hexCode: '#000000', stock: 3, reserved: 1 },
      { id: 'col-t8-2', name: 'Blanc Nacre Arctique', hexCode: '#FFFFFF', stock: 4, reserved: 2 },
    ],
    interiorColors: [
      { id: 'int-t8-1', name: 'Cuir Nappa Royal Noir Executive', hexCode: '#0B0F19', stock: 6, reserved: 2 },
    ]
  },
  {
    id: 'car-arrizo-5',
    name: 'Chery Arrizo 5',
    category: 'Berline',
    priceTND: 58900,
    requiredDepositTND: 10000,
    engine: '1.5L DVVT 115 ch',
    transmission: 'Manuelle 5 rapports / CVT',
    energy: 'Essence',
    guarantee: '7 ans / 200 000 km',
    imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=80',
    description: 'Berline tricorps spacieuse et économique, idéale pour les déplacements professionnels et les flottes d\'entreprises.',
    features: [
      'Écran tactile 8" Multimédia',
      'Radar de recul sonore',
      'Rétroviseurs électriques dégivrants',
      'Système de freinage ABS + EBD + ESP',
      'Jantes alu 16"',
      'Grand coffre de 430 Litres'
    ],
    colors: [
      { id: 'col-arr-1', name: 'Blanc Okavango', hexCode: '#FFFFFF', stock: 7, reserved: 2 },
      { id: 'col-arr-2', name: 'Gris Platine', hexCode: '#6B7280', stock: 5, reserved: 1 },
    ],
    interiorColors: [
      { id: 'int-arr-1', name: 'Tissu & Simili-Cuir Noir Carbone', hexCode: '#1E293B', stock: 12, reserved: 3 },
    ]
  },
  {
    id: 'car-omoda-5',
    name: 'Chery Omoda 5 GT',
    category: 'Crossover',
    priceTND: 108900,
    requiredDepositTND: 25000,
    engine: '1.6L TGDI Turbo 197 ch',
    transmission: 'Automatique DCT 7',
    energy: 'Essence',
    guarantee: '7 ans / 200 000 km',
    imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&auto=format&fit=crop&q=80',
    description: 'Design futuriste Fastback, feux à effet matrice, sièges sport baquets chauffants et technologie de cockpit intelligent.',
    features: [
      'Design Fastback avec calandre matricielle',
      'Sièges sport baquets en cuir bicolore',
      'Écran double dalle 20.5"',
      'Caméra HD 360° avec vue châssis transparent',
      'Commande vocale intelligente',
      'Jantes Sport 18" finition diamant'
    ],
    colors: [
      { id: 'col-om-1', name: 'Gris Mat Technologique', hexCode: '#475569', stock: 3, reserved: 1 },
      { id: 'col-om-2', name: 'Blanc Bicolore Toit Noir', hexCode: '#E2E8F0', stock: 4, reserved: 1 },
    ],
    interiorColors: [
      { id: 'int-om-1', name: 'Sièges Baquets Cuir Noir Sport & Surpiqûres Bleues', hexCode: '#0F172A', stock: 6, reserved: 1 },
    ]
  }
];

export const INITIAL_RESERVATIONS: Reservation[] = [];

// Helper function to safely write to localStorage with quota-exceeded fallback
function safeLocalStorageSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (e: any) {
    if (e?.name === 'QuotaExceededError' || e?.code === 22 || e?.number === -2147024882) {
      console.warn(`[LocalStorage QuotaExceeded] Impossible de sauvegarder la clé "${key}" en local storage direct. Tentative de sauvegarde allégée sans images base64 lourdes.`);
      try {
        const parsed = JSON.parse(value);
        if (parsed && typeof parsed === 'object') {
          // Strips huge Base64 data URLs (>100KB) from localStorage cache to preserve non-image state
          const stripHugeStrings = (obj: any): any => {
            if (!obj) return obj;
            if (typeof obj === 'string') {
              if (obj.startsWith('data:') && obj.length > 100000) {
                return ''; // strip heavy base64 string from local browser cache
              }
              return obj;
            }
            if (Array.isArray(obj)) return obj.map(stripHugeStrings);
            if (typeof obj === 'object') {
              const res: any = {};
              for (const k in obj) {
                res[k] = stripHugeStrings(obj[k]);
              }
              return res;
            }
            return obj;
          };
          const lightweight = stripHugeStrings(parsed);
          localStorage.setItem(key, JSON.stringify(lightweight));
          console.log(`[LocalStorage QuotaExceeded] Clé "${key}" enregistrée avec succès en version allégée.`);
        }
      } catch (innerErr) {
        console.error(`[LocalStorage QuotaExceeded] Échec ultime pour ${key}`, innerErr);
      }
    } else {
      console.error(`Error saving ${key} to storage`, e);
    }
  }
}

// Helper functions for LocalStorage persistence
const STORAGE_KEYS = {
  CARS: 'chery_tn_cars_v1',
  RESERVATIONS: 'chery_tn_reservations_v1',
  COMMERCIALS: 'chery_tn_commercials_v1',
  SITE_SETTINGS: 'chery_tn_site_settings_v1',
  KNOWLEDGE_BASE: 'chery_tn_knowledge_base_v1',
  DOC_TEMPLATE: 'chery_tn_doc_template_v1',
  ACCESSORIES: 'chery_tn_accessories_v1',
  QUOTES: 'chery_tn_quotes_v1',
};

export function getStoredKnowledgeBase(): KnowledgeBaseItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.KNOWLEDGE_BASE);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error loading knowledge base from storage', e);
  }
  return INITIAL_KNOWLEDGE_BASE;
}

export function saveStoredKnowledgeBase(items: KnowledgeBaseItem[]): void {
  safeLocalStorageSet(STORAGE_KEYS.KNOWLEDGE_BASE, JSON.stringify(items));
}

export function getStoredDocumentTemplate(): DocumentTemplateConfig {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DOC_TEMPLATE);
    if (data) return { ...DEFAULT_DOCUMENT_TEMPLATE, ...JSON.parse(data) };
  } catch (e) {
    console.error('Error loading document template from storage', e);
  }
  return DEFAULT_DOCUMENT_TEMPLATE;
}

export function saveStoredDocumentTemplate(config: DocumentTemplateConfig): void {
  safeLocalStorageSet(STORAGE_KEYS.DOC_TEMPLATE, JSON.stringify(config));
}

export function getStoredAccessories(): CarAccessory[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ACCESSORIES);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error loading accessories from storage', e);
  }
  return INITIAL_ACCESSORIES;
}

export function saveStoredAccessories(accessories: CarAccessory[]): void {
  safeLocalStorageSet(STORAGE_KEYS.ACCESSORIES, JSON.stringify(accessories));
}

export function getStoredQuotes(): CustomQuote[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.QUOTES);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error loading quotes from storage', e);
  }
  return [];
}

export function saveStoredQuotes(quotes: CustomQuote[]): void {
  safeLocalStorageSet(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
}


export function getStoredSiteSettings(): SiteSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SITE_SETTINGS);
    if (data) {
      return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('Error loading site settings from storage', e);
  }
  return DEFAULT_SITE_SETTINGS;
}

export function saveStoredSiteSettings(settings: SiteSettings): void {
  safeLocalStorageSet(STORAGE_KEYS.SITE_SETTINGS, JSON.stringify(settings));
}

export function getStoredCars(): CarModel[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CARS);
    if (data) {
      const parsed: CarModel[] = JSON.parse(data);
      return parsed.map((car) => ({
        ...car,
        colors: (car.colors || []).map((c) => ({
          ...c,
          interiorColor: c.interiorColor === 'Noir Cuir' ? 'Noir' : c.interiorColor,
        })),
      }));
    }
  } catch (e) {
    console.error('Error loading cars from storage', e);
  }
  return INITIAL_CARS;
}

export function saveStoredCars(cars: CarModel[]): void {
  safeLocalStorageSet(STORAGE_KEYS.CARS, JSON.stringify(cars));
}

export function getStoredReservations(): Reservation[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    if (data !== null) return JSON.parse(data);
  } catch (e) {
    console.error('Error loading reservations from storage', e);
  }
  return INITIAL_RESERVATIONS;
}

export function saveStoredReservations(reservations: Reservation[]): void {
  safeLocalStorageSet(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
}

export function getStoredCommercials(): CommercialUser[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COMMERCIALS);
    if (data) {
      const parsed: CommercialUser[] = JSON.parse(data);
      const merged = [...parsed];
      INITIAL_COMMERCIALS.forEach((initUser) => {
        if (!merged.some((u) => u.id === initUser.id)) {
          merged.unshift(initUser);
        }
      });
      return merged;
    }
  } catch (e) {
    console.error('Error loading commercials from storage', e);
  }
  return INITIAL_COMMERCIALS;
}

export function saveStoredCommercials(commercials: CommercialUser[]): void {
  safeLocalStorageSet(STORAGE_KEYS.COMMERCIALS, JSON.stringify(commercials));
}

export function getStoredTestDrives(): TestDriveAppointment[] {
  try {
    const data = localStorage.getItem('chery_tn_test_drives_v1');
    if (data !== null) return JSON.parse(data);
  } catch (e) {
    console.error('Error loading test drives from storage', e);
  }
  return [];
}

export function saveStoredTestDrives(testDrives: TestDriveAppointment[]): void {
  safeLocalStorageSet('chery_tn_test_drives_v1', JSON.stringify(testDrives));
}

export function getStoredStockRequests(): StockRequest[] {
  try {
    const data = localStorage.getItem('chery_tn_stock_requests_v1');
    if (data !== null) return JSON.parse(data);
  } catch (e) {
    console.error('Error loading stock requests from storage', e);
  }
  return [];
}

export function saveStoredStockRequests(requests: StockRequest[]): void {
  safeLocalStorageSet('chery_tn_stock_requests_v1', JSON.stringify(requests));
}
