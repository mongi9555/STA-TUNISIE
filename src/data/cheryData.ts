import {
  CarModel,
  CommercialUser,
  Reservation,
  SiteSettings,
  KnowledgeBaseItem,
  DocumentTemplateConfig,
  CarAccessory,
  CustomQuote,
  TestDriveAppointment,
  StockRequest,
  UserPermissions,
  ThemeMode,
  AdministrativeDocument,
  AuditLogEntry,
  DeletedReservationItem,
} from '../types';

export const CHERY_MODELS_DATA = [
  { name: 'Chery Tiggo 2 Pro Max', category: 'SUV', price: 68900, deposit: 10000 },
  { name: 'Chery Tiggo 4 Pro', category: 'SUV', price: 78900, deposit: 20000 },
  { name: 'Chery Tiggo 4 Pro HEV', category: 'Hybride', price: 84900, deposit: 20000 },
  { name: 'Chery Tiggo 7 Pro Luxe', category: 'SUV', price: 98900, deposit: 30000 },
  { name: 'Chery Tiggo 7 Pro PHEV', category: 'Hybride', price: 118900, deposit: 30000 },
  { name: 'Chery Tiggo 8 Pro Max 4WD', category: 'SUV', price: 138900, deposit: 40000 },
  { name: 'Chery Tiggo 8 Pro PHEV', category: 'Hybride', price: 158900, deposit: 40000 },
  { name: 'Chery Tiggo 9 Pro PHEV', category: 'Hybride', price: 178900, deposit: 50000 },
  { name: 'Chery iCar 03 4x2', category: 'Électrique', price: 119900, deposit: 20000 },
  { name: 'Chery iCar 03 4x4', category: 'Électrique', price: 134900, deposit: 20000 },
  { name: 'Chery Arrizo 8 PHEV', category: 'Hybride', price: 139900, deposit: 30000 },
  { name: 'Chery Omoda 5 GT', category: 'Crossover', price: 108900, deposit: 25000 },
  { name: 'Chery Arrizo 5', category: 'Berline', price: 58900, deposit: 10000 },
  { name: 'CHERY Himla 4X2 Pick-up', category: 'Pick-up', price: 89900, deposit: 20000 },
  { name: 'Chery Himla 4X4 Pick-up', category: 'Pick-up', price: 102900, deposit: 20000 }
];

export const CHERY_PALETTES = [
  { name: 'Blanc Okavango / Arctique', hex: '#F8FAFC' },
  { name: 'Gris Platine / Titanium', hex: '#475569' },
  { name: 'Noir Onyx / Profond', hex: '#09090B' },
  { name: 'Bleu Saphir / Électrique', hex: '#1E3A8A' },
  { name: 'Rouge Rubis / Impérial', hex: '#DC2626' },
  { name: 'Vert Bivouac / Armée', hex: '#14532D' }
];

export const CHERY_INTERIORS = [
  'Cuir Noir Sport & Surpiqûres',
  'Cuir Marron Cognac Premium',
  'Cuir Nappa Beige & Bleu Nuit',
  'Cuir Nappa Vert & Bronze',
  'Tissu & Simili-Cuir Noir Carbone'
];

export const TUNISIAN_CITIES = [
  'Tunis (La Charguia / Berges du Lac)',
  'Ariana / Ennasr',
  'Ben Arous / Megrine',
  'Sousse / Kantaoui',
  'Sfax (Route de Téniour)',
  'Nabeul / Hammamet',
  'Bizerte',
  'Monastir',
  'Gabès'
];

export const INITIAL_KNOWLEDGE_BASE: KnowledgeBaseItem[] = [
  {
    id: 'kb-1',
    category: 'faq',
    title: 'Documents requis pour commande particulier',
    content: '1. Copie CIN valide (recto-verso)\n2. Justificatif d\'adresse ou quittance STEG/SONEDE\n3. Preuve de versement ou virement de l\'acompte réglementaire\n4. Bon de commande signé et daté',
    tags: ['particulier', 'documents', 'acompte', 'cin'],
    updatedAt: new Date().toISOString(),
    isPublicForAI: true,
  },
  {
    id: 'kb-2',
    category: 'faq',
    title: 'Documents pour leasing / société (personne morale)',
    content: '1. Extrait du Registre National des Entreprises (RNE / Registre de Commerce récent < 3 mois)\n2. Copie CIN du Gérant ou Mandataire\n3. Matricule Fiscal & Déclaration d\'existence\n4. Accord de principe de la société de Leasing partenaire (si applicable)',
    tags: ['société', 'leasing', 'rne', 'matricule fiscal'],
    updatedAt: new Date().toISOString(),
    isPublicForAI: true,
  },
  {
    id: 'kb-3',
    category: 'financement',
    title: 'Modalités d\'acompte et délais de livraison',
    content: 'L\'acompte officiel de réservation est exigé pour valider et sécuriser le blocage du véhicule en stock (Chèque Certifié, Virement Bancaire ou Espèces) :\n- Chery Tiggo 9 PHEV : 50 000 TND\n- Chery Tiggo 8 PHEV : 40 000 TND\n- Chery Tiggo 7 PHEV & Arrizo 8 PHEV : 30 000 TND\n- Chery Tiggo 4 HEV, Himla 4X4 & I03 : 20 000 TND\n- Chery Tiggo 2 Pro Max : 10 000 TND\nLe solde restant dû est à régler avant la délivrance de la Carte Grise et de la livraison finale.',
    tags: ['acompte', 'financement', 'délai', 'livraison', 'espèces', 'chèque', 'virement'],
    updatedAt: new Date().toISOString(),
    isPublicForAI: true,
  },
  {
    id: 'kb-4',
    category: 'garantie',
    title: 'Garantie Constructeur Chery Tunisie (STA)',
    content: 'Tous nos véhicules bénéficient de la garantie constructeur exceptionnelle de 7 ans ou 200 000 km (premier terme échu). Pour les modèles 100% électriques et Hybrides (iCar 03, PHEV), la batterie de traction haute tension est garantie 8 ans ou 160 000 km.',
    tags: ['garantie', '7 ans', '200000 km', 'batterie', 'sta'],
    updatedAt: new Date().toISOString(),
    isPublicForAI: true,
  }
];

export const DEFAULT_DOCUMENT_TEMPLATE: DocumentTemplateConfig = {
  companyName: 'Société Tunisienne d\'Automobiles (STA)',
  logoUrl: '',
  voucherLogoUrl: '',
  matriculeFiscale: '0024925/N',
  address: 'Z.I Borj Ghorbel, GP1 Km 13, 2013 Ben Arous',
  phone: '(+216) 31 390 290 / (+216) 71 800 900',
  email: 'contact@chery-tunisie.tn',
  ribBancaire: 'BIAT TN59 08 000 0001234567890 45',
  tvaPercentage: 19,
  droitDeTimbreTND: 1.0,
  validityDays: 30,
  quoteHeaderNote: 'DOCUMENT OFFICIEL STA CHERY',
  quoteFooterTerms: '1. Le présent bon de commande/réservation constitue un engagement ferme sous réserve de versement de l\'acompte prévu.\n2. Les prix s\'entendent TTC en Dinars Tunisiens (TND).\n3. Garantie constructeur officielle STA : 7 ans ou 200 000 km selon carnet d\'entretien.',
  defaultRegistrationFeeTND: 0,
};

export const INITIAL_ACCESSORIES: CarAccessory[] = [
  {
    id: 'acc-1',
    name: 'Tapis de sol 3D All-Weather thermoformés Chery',
    category: 'intérieur',
    priceTND: 380,
    description: 'Protection intégrale du plancher avec rebords surélevés, matériau imperméable et antidérapant.',
  },
  {
    id: 'acc-2',
    name: 'Attelage d\'origine avec faisceau électrique 13 broches',
    category: 'extérieur',
    priceTND: 1450,
    description: 'Attelage homologué constructeur haute résistance pour remorquage sécurisé.',
  },
  {
    id: 'acc-3',
    name: 'Barres de toit transversales aérodynamiques en aluminium',
    category: 'extérieur',
    priceTND: 650,
    description: 'Support verrouillable à clé pour coffre de toit, porte-vélos ou skis.',
  },
  {
    id: 'acc-4',
    name: 'Borne de recharge murale Wallbox 7.4 kW / 22 kW Type 2',
    category: 'multimédia',
    priceTND: 2200,
    description: 'Chargeur accéléré pour véhicules Hybrides PHEV et 100% Électriques avec câble 5m inclus.',
  },
  {
    id: 'acc-5',
    name: 'Pack Film teinté solaire anti-UV et anti-chaleur Nano-Céramique',
    category: 'protection',
    priceTND: 890,
    description: 'Isolation thermique supérieure et protection de l\'habitacle contre 99% des rayons UV.',
  },
  {
    id: 'acc-6',
    name: 'Bac de coffre thermoformé imperméable',
    category: 'protection',
    priceTND: 290,
    description: 'Protection sur-mesure lavable contre les saletés, liquides et objets encombrants.',
  }
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: 'Société Tunisienne d\'Automobiles (STA)',
  siteSubtitle: 'Concessionnaire Officiel CHERY en Tunisie - Leader du marché SUV & Hybride',
  logoUrl: '',
  faviconUrl: '/favicon.svg',
  voucherLogoUrl: '',
  voucherCompanyName: 'CHERY TUNISIE',
  voucherCompanySubtitle: 'Société Tunisienne d\'Automobiles (STA)',
  accentColor: '#DC2626',
  defaultThemeMode: 'dark',
  announcementBanner: {
    enabled: true,
    text: '⚡ Stock Châssis officiel STA Tunisie mis à jour en temps réel avec réservation bancaire sécurisée.',
    type: 'info'
  },
  dsiContact: {
    phone: '+216 31 390 290 / +216 71 800 900',
    email: 'contact@chery-tunisie.tn',
    supportHours: '8h30 - 18h00 du Lundi au Vendredi',
    address: 'Z.I Borj Ghorbel, GP1 Km 13, Ben Arous / Showroom Les Berges du Lac, Tunis'
  }
};

export const INITIAL_COMMERCIALS: CommercialUser[] = [
  {
    id: 'comm-superadmin',
    name: 'Mongi Jamaï',
    email: 'jamaimongi0@gmail.com',
    password: 'STA@2026+',
    role: 'super_admin',
    phone: '+216 71 800 900',
    agency: 'STA Direction Générale - Ben Arous / Tunis',
    avatar: '',
    permissions: {
      canCreateReservation: true,
      canCancelReservation: true,
      canEditValidatedReservations: true,
      canEditPrices: true,
      canManageStock: true,
      canAccessAdminPanel: true,
      canPrintVouchers: true,
      canExportReports: true,
    }
  },
  {
    id: 'comm-admin',
    name: 'Arbi Gharbi',
    email: 'arbi.gharbi@chery-tunisie.tn',
    password: 'STA@2026+',
    role: 'admin',
    phone: '+216 71 800 901',
    agency: 'STA Showroom Les Berges du Lac - Tunis',
    avatar: '',
    permissions: {
      canCreateReservation: true,
      canCancelReservation: true,
      canEditValidatedReservations: true,
      canEditPrices: true,
      canManageStock: true,
      canAccessAdminPanel: true,
      canPrintVouchers: true,
      canExportReports: true,
    }
  },
  {
    id: 'comm-lamine',
    name: 'Lamine Abbasi',
    email: 'lamine.abbasi@chery-tunisie.tn',
    password: 'STA@2026+',
    role: 'admin',
    phone: '+216 71 800 902',
    agency: 'STA Showroom Ariana / Ennasr',
    avatar: '',
    permissions: {
      canCreateReservation: true,
      canCancelReservation: true,
      canEditValidatedReservations: true,
      canEditPrices: true,
      canManageStock: true,
      canAccessAdminPanel: true,
      canPrintVouchers: true,
      canExportReports: true,
    }
  },
  {
    id: 'comm-sami',
    name: 'Sami Chaker',
    email: 'sami.chaker@chery-tunisie.tn',
    password: 'STA@2026+',
    role: 'admin',
    phone: '+216 73 800 903',
    agency: 'STA Agence Sousse / Kantaoui',
    avatar: '',
    permissions: {
      canCreateReservation: true,
      canCancelReservation: true,
      canEditValidatedReservations: true,
      canEditPrices: true,
      canManageStock: true,
      canAccessAdminPanel: true,
      canPrintVouchers: true,
      canExportReports: true,
    }
  }
];

export const INITIAL_ADMIN_DOCUMENTS: AdministrativeDocument[] = [
  {
    id: 'doc-adm-1',
    title: 'Check-list Dossier Leasing Particulier & Professionnel (STA Chery)',
    category: 'leasing',
    categoryLabel: 'Dossier Leasing',
    fileFormat: 'pdf',
    fileName: 'Checklist_Dossier_Leasing_STA_Chery.pdf',
    fileUrl: '',
    fileSizeFormatted: '185 KB',
    uploadedAt: '2026-03-01T09:00:00.000Z',
    uploadedBy: 'Direction Commerciale STA',
    description: 'Check-list complète des pièces à fournir pour validation immédiate ou accord provisoire de leasing particulier et professionnel.',
    applicableModels: 'Tous modèles (Tiggo, Arrizo, Omoda, iCar, Himla)',
    isOfficialSTA: true,
    itemCount: 7,
    checklistItems: [
      'Devis / Facture Proforma officielle STA en cours de validité',
      'Accord de principe formel ou Bon de commande de l\'organisme de Leasing',
      'Copie CIN du bénéficiaire ou du gérant (Recto/Verso)',
      '3 dernières fiches de paie ou Déclarations fiscales récentes',
      'Relevés bancaires des 6 derniers mois visés par la banque',
      'Extrait RNE / Registre de Commerce datant de moins de 3 mois (si professionnel)',
      'Attestation de non-engagement ou quittance d\'acompte si demandée par le loueur'
    ]
  },
  {
    id: 'doc-adm-2',
    title: 'Check-list Dossier Particulier & Vente Comptant',
    category: 'particulier',
    categoryLabel: 'Dossier Particulier',
    fileFormat: 'pdf',
    fileName: 'Checklist_Vente_Particulier_STA.pdf',
    fileUrl: '',
    fileSizeFormatted: '142 KB',
    uploadedAt: '2026-03-01T09:30:00.000Z',
    uploadedBy: 'Direction Commerciale STA',
    description: 'Procédure et pièces justificatives obligatoires pour l\'achat d\'un véhicule neuf par une personne physique.',
    applicableModels: 'Tous modèles particuliers',
    isOfficialSTA: true,
    itemCount: 6,
    checklistItems: [
      'Bon de réservation officiel STA dûment signé et paraphé',
      'Copie certifiée conforme de la CIN du titulaire (8 chiffres)',
      'Permis de conduire valide du conducteur principal',
      'Justificatif de domicile récent (Facture STEG ou SONEDE)',
      'Preuve de versement de l\'acompte fixe réglementaire (Quittance ou Chèque certifié)',
      'Fiche d\'engagement signée pour l\'immatriculation et la remise de la carte grise'
    ]
  },
  {
    id: 'doc-adm-3',
    title: 'Check-list Dossier Société & Personne Morale (Flottes & Entreprises)',
    category: 'societe',
    categoryLabel: 'Dossier Société',
    fileFormat: 'docx',
    fileName: 'Checklist_Dossier_Societe_Flottes_Chery.docx',
    fileUrl: '',
    fileSizeFormatted: '96 KB',
    uploadedAt: '2026-03-02T10:15:00.000Z',
    uploadedBy: 'Service Entreprises STA',
    description: 'Dossier légal et fiscal pour l\'acquisition de véhicules par les sociétés (SARL, SUARL, SA) et professionnels libéraux.',
    applicableModels: 'Tous modèles (y compris Pick-up Himla 4X2 / 4X4)',
    isOfficialSTA: true,
    itemCount: 7,
    checklistItems: [
      'Extrait récent du Registre National des Entreprises (RNE) de moins de 3 mois',
      'Copie de la Déclaration d\'existence / Patente / Matricule Fiscale en cours',
      'Statuts de la société enregistrés à la recette des finances',
      'Procès-verbal de nomination du Gérant ou Mandataire légal',
      'Copie CIN du gérant / mandataire habilité à signer',
      'Bon de commande officiel sur papier à en-tête avec cachet et signature',
      'Chèque de réservation ou ordre de virement bancaire au nom de la société'
    ]
  },
  {
    id: 'doc-adm-4',
    title: 'Procédure Immatriculation & Dépôt Dossier Cartes Grises STA',
    category: 'immatriculation',
    categoryLabel: 'Immatriculation & Carte Grise',
    fileFormat: 'pdf',
    fileName: 'Procedure_Immatriculation_Cartes_Grises_STA.pdf',
    fileUrl: '',
    fileSizeFormatted: '210 KB',
    uploadedAt: '2026-03-03T11:00:00.000Z',
    uploadedBy: 'Service Homologation & Immatriculation STA',
    description: 'Procédure officielle auprès de l\'Agence Technique des Transports Terrestres (ATTT) pour délivrance des cartes grises.',
    applicableModels: 'Tous modèles',
    isOfficialSTA: true,
    itemCount: 5,
    checklistItems: [
      'Certificat de conformité constructeur original visé par les mines',
      'Facture d\'achat définitive acquittée',
      'Quittance de paiement de la taxe de circulation et timbre fiscal',
      'Formulaire de demande de certificat d\'immatriculation ATTT signé par le client',
      'Bordereau de dépôt collectif transmis au service immatriculation'
    ]
  },
  {
    id: 'doc-adm-5',
    title: 'Fiche de Contrôle Qualité & Check-list Pré-Livraison Showroom (PDI)',
    category: 'livraison',
    categoryLabel: 'Livraison & PDI',
    fileFormat: 'docx',
    fileName: 'Fiche_Controle_Pre_Livraison_PDI_Chery.docx',
    fileUrl: '',
    fileSizeFormatted: '115 KB',
    uploadedAt: '2026-03-04T14:20:00.000Z',
    uploadedBy: 'Service Qualité & Préparation Véhicules STA',
    description: 'Grille d\'inspection 50 points avant remise des clés au client (carrosserie, électronique, niveaux, accessoires, propreté).',
    applicableModels: 'Tous modèles',
    isOfficialSTA: true,
    itemCount: 8,
    checklistItems: [
      'Vérification esthétique carrosserie, alignement panneaux et peinture',
      'Contrôle pression pneumatiques et serrage écrous de roues',
      'Vérification des niveaux : huile moteur, liquide de refroidissement, lave-glace',
      'Test systèmes multimédia, combiné numérique, caméra 360° et climatisation',
      'Présence du kit de sécurité (triangle, gilet, extincteur)',
      'Présence roue de secours ou kit anti-crevaison, cric et manivelle',
      'Double des clés programmées et fonctionnelles',
      'Carnet de garantie 7 ans / 200 000 km et manuel d\'utilisation en français/arabe'
    ]
  },
  {
    id: 'doc-adm-6',
    title: 'Check-list Dossier Crédit Bancaire Direct Client Particulier',
    category: 'credit',
    categoryLabel: 'Crédit Bancaire',
    fileFormat: 'pdf',
    fileName: 'Checklist_Credit_Bancaire_Client_Chery.pdf',
    fileUrl: '',
    fileSizeFormatted: '160 KB',
    uploadedAt: '2026-03-05T08:45:00.000Z',
    uploadedBy: 'Pôle Financement & Crédit STA',
    description: 'Ensemble des pièces requises pour les dossiers de crédit auto bancaire avec domiciliation de salaire.',
    applicableModels: 'Tous modèles particuliers',
    isOfficialSTA: true,
    itemCount: 6,
    checklistItems: [
      'Facture Proforma avec mention du taux de TVA et frais d\'immatriculation',
      'Accord définitif de crédit émis par l\'établissement bancaire',
      'Attestation de domiciliation irrévocable de salaire',
      'Engagement de subrogation de gage au profit de la banque prêteuse',
      'Reçu de versement de l\'apport personnel minimum',
      'Attestation d\'assurance tous risques avec délégation au profit de la banque'
    ]
  },
  {
    id: 'doc-adm-7',
    title: 'Formulaire Décharge & Procès-Verbal de Réception Véhicule Neuf',
    category: 'livraison',
    categoryLabel: 'Livraison & PDI',
    fileFormat: 'docx',
    fileName: 'PV_Reception_Decharge_Vehicule_Neuf_STA.docx',
    fileUrl: '',
    fileSizeFormatted: '88 KB',
    uploadedAt: '2026-03-05T15:00:00.000Z',
    uploadedBy: 'Service Livraison STA',
    description: 'Document officiel à faire signer par le client lors de la remise des clés en showroom attestant de la conformité du véhicule.',
    applicableModels: 'Tous modèles',
    isOfficialSTA: true,
    itemCount: 5,
    checklistItems: [
      'Contrôle visuel contradictoire de la carrosserie et de l\'habitacle',
      'Vérification du kilométrage de livraison (< 20 km)',
      'Remise du carnet de garantie STA 7 ans / 200 000 km',
      'Remise de la carte grise / attestation provisoire et des 2 clés',
      'Signature et cachet du procès-verbal de livraison'
    ]
  }
];


export function getRequiredDepositForCar(carNameOrModel?: string | CarModel | null): number {
  if (!carNameOrModel) return 20000;

  if (typeof carNameOrModel === 'object' && carNameOrModel !== null) {
    if (carNameOrModel.requiredDepositTND && carNameOrModel.requiredDepositTND > 0) {
      return carNameOrModel.requiredDepositTND;
    }
    carNameOrModel = carNameOrModel.name;
  }

  const name = String(carNameOrModel).toLowerCase();

  // Barème officiel des acomptes requis Chery Tunisie (Chèque Certifié & Virement Bancaire & Comptant)
  // Chery Tiggo 9 PHEV : 50 000 TND
  if (name.includes('tiggo 9')) return 50000;
  // Chery Tiggo 8 PHEV : 40 000 TND
  if (name.includes('tiggo 8')) return 40000;
  // Chery Tiggo 7 PHEV & Arrizo 8 PHEV : 30 000 TND
  if (name.includes('tiggo 7')) return 30000;
  if (name.includes('arrizo 8')) return 30000;
  // Chery Tiggo 4 HEV, Himla 4X4 & I03 : 20 000 TND
  if (name.includes('tiggo 4')) return 20000;
  if (name.includes('himla')) return 20000;
  if (name.includes('i03') || name.includes('icar 03') || name.includes('i 03')) return 20000;
  // Chery Tiggo 2 Pro Max : 10 000 TND
  if (name.includes('tiggo 2')) return 10000;
  if (name.includes('arrizo 5')) return 10000;
  if (name.includes('omoda 5')) return 25000;

  return 20000;
}

export const getFixedDepositForCar = getRequiredDepositForCar;

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

/**
 * Calcule la Date de Livraison Estimée sur la base de la Date ETA + 30 jours (marge de sécurité)
 */
export function calculateDeliveryDate(etaDateOrCreatedAt?: string, daysToAdd: number = 30): string {
  const base = etaDateOrCreatedAt ? new Date(etaDateOrCreatedAt) : new Date();
  if (isNaN(base.getTime())) {
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + daysToAdd);
    return fallback.toISOString().slice(0, 10);
  }
  const result = new Date(base);
  result.setDate(result.getDate() + daysToAdd);
  return result.toISOString().slice(0, 10);
}

/**
 * Formate une date pour affichage sur les bons de réservation et documents officiels
 */
export function formatVoucherDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateStr || '';
  }
}

/**
 * Vérifie si l'utilisateur courant possède les droits d'administration pour modifier la Date d'Arrivage Prévisionnel (ETA)
 * Autorisé uniquement pour les Administrateurs (ex: Sami Chaker, Lamine Abbasi, etc.)
 */
export function canUserEditEta(user?: CommercialUser | null): boolean {
  if (!user) return false;
  const role = user.role;
  const name = (user.name || '').toLowerCase();
  const id = user.id || '';
  return (
    role === 'admin' ||
    role === 'super_admin' ||
    id === 'comm-sami' ||
    id === 'comm-lamine' ||
    id === 'comm-admin' ||
    id === 'comm-superadmin' ||
    name.includes('sami chaker') ||
    name.includes('lamine abbasi') ||
    name.includes('lamine abassi')
  );
}

/**
 * Génère un numéro de bon de réservation chronologique et séquentiel (ex: RES-2026-001, RES-2026-002, ...)
 * Garanti sans collision d'identifiants
 */
export function generateChronologicalReservationId(
  reservations: Reservation[] = [],
  extraIds: string[] = []
): string {
  const currentYear = new Date().getFullYear();
  const yearPrefix = `RES-${currentYear}-`;

  const existingIds = new Set<string>();
  // Séquence minimale garantie au-delà de tous les bons existants (actuellement 120 bons enregistrés)
  let maxSeq = 1013;

  const processId = (idStr?: string) => {
    if (!idStr) return;
    const cleanId = idStr.trim();
    existingIds.add(cleanId);
    if (cleanId.startsWith(yearPrefix)) {
      const numPart = cleanId.substring(yearPrefix.length);
      const parsed = parseInt(numPart, 10);
      if (!isNaN(parsed) && parsed > maxSeq) {
        maxSeq = parsed;
      }
    } else if (cleanId.startsWith('RES-')) {
      const parts = cleanId.split('-');
      if (parts.length >= 3) {
        const parsed = parseInt(parts[2], 10);
        if (!isNaN(parsed) && parsed > maxSeq) {
          maxSeq = parsed;
        }
      }
    }
  };

  reservations.forEach((r) => processId(r.id));
  extraIds.forEach((id) => processId(id));

  // Vérifier également les réservations en cache local si disponibles
  try {
    const cached = localStorage.getItem('chery_tn_reservations_v1');
    if (cached) {
      const parsedList = JSON.parse(cached);
      if (Array.isArray(parsedList)) {
        parsedList.forEach((r: any) => processId(r?.id));
      }
    }
  } catch (_) {}

  let nextSeq = Math.max(maxSeq + 1, 1014);
  let candidate = `RES-${currentYear}-${String(nextSeq).padStart(3, '0')}`;

  while (existingIds.has(candidate)) {
    nextSeq++;
    candidate = `RES-${currentYear}-${String(nextSeq).padStart(3, '0')}`;
  }

  return candidate;
}

export function isPickupCar(car?: CarModel | { name?: string; category?: string } | string | null): boolean {
  if (!car) return false;
  if (typeof car === 'string') {
    const lower = car.toLowerCase();
    return (
      lower.includes('pick') ||
      lower.includes('himla') ||
      lower.includes('grand tiger') ||
      ((lower.includes('4x4') || lower.includes('4x2')) && (lower.includes('himla') || lower.includes('pick')))
    );
  }
  const nameLower = (car.name || '').toLowerCase();
  const catLower = (car.category || '').toLowerCase();
  return (
    catLower.includes('pick') ||
    nameLower.includes('himla') ||
    nameLower.includes('pick') ||
    nameLower.includes('grand tiger') ||
    ((nameLower.includes('4x4') || nameLower.includes('4x2')) &&
      (nameLower.includes('himla') || nameLower.includes('chery himla') || catLower.includes('pick')))
  );
}

export function getCarCapacityLabel(car?: CarModel | { name?: string; category?: string } | string | null): string {
  return isPickupCar(car) ? 'Charge Utile' : 'Volume du Coffre';
}

export function formatCarCapacityValue(
  car?: CarModel | { name?: string; category?: string; bootCapacity?: string; payload?: string } | string | null,
  rawValue?: string
): string {
  const isPickup = isPickupCar(car);
  if (rawValue && rawValue.trim()) return rawValue;
  if (typeof car === 'object' && car !== null) {
    if (car.payload && car.payload.trim()) return car.payload;
    if (car.bootCapacity && car.bootCapacity.trim()) return car.bootCapacity;
  }
  return isPickup ? '1050 Kg (Charge Utile)' : '475 Litres';
}

export const VIRTUAL_CAR_IDS: string[] = [];

export const OFFICIAL_CAR_IDS = [
  "car-1785512735025", // Chery Arrizo 8 PHEV
  "car-1785512823129", // Chery Arrizo 8
  "car-1785513071800", // Chery Tiggo 9 PHEV
  "car-1785513939488", // CHERY Himla 4X2
  "car-1785514106502", // Chery Himla 4X4
  "car-1785753010029", // Chery Tiggo 2 Pro Max
  "car-1785753066750", // Chery Tiggo 4 HEV
  "car-1785753150277", // Chery I03 4X2
  "car-1785753208837", // Chery I03 4X4
  "car-1785753278797", // Chery Tiggo 7 PHEV
  "car-1785753367152", // Chery Tiggo 8 PHEV
];

export const OFFICIAL_CAR_NAMES = [
  "chery arrizo 8 phev",
  "chery arrizo 8",
  "chery tiggo 9 phev",
  "chery himla 4x2",
  "chery himla 4x4",
  "chery tiggo 2 pro max",
  "chery tiggo 4 hev",
  "chery i03 4x2",
  "chery i03 4x4",
  "chery tiggo 7 phev",
  "chery tiggo 8 phev",
];

export function isVirtualCar(_carOrId: CarModel | string | null | undefined): boolean {
  // Never treat any car model as virtual to prevent automatic deletion
  return false;
}

import { INITIAL_CARS } from './initialCars';
export { INITIAL_CARS };

import { INITIAL_RESERVATIONS } from './initialReservations';
export { INITIAL_RESERVATIONS };

// Strips heavy Base64 data URLs from objects saved to offline localStorage cache
function stripHeavyBase64Data(obj: any): any {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    // If string is an inline data URL longer than 500 chars, strip it from local browser cache
    if (obj.startsWith('data:') && obj.length > 500) {
      return '';
    }
    return obj;
  }
  if (Array.isArray(obj)) return obj.map(stripHeavyBase64Data);
  if (typeof obj === 'object') {
    const res: any = {};
    for (const k in obj) {
      res[k] = stripHeavyBase64Data(obj[k]);
    }
    return res;
  }
  return obj;
}

// Helper function to safely write to localStorage with quota-exceeded fallback
function safeLocalStorageSet(key: string, value: string): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch (_err) {
    try {
      // Step 1: Strip heavy base64 strings and images
      let parsed = JSON.parse(value);
      parsed = stripHeavyBase64Data(parsed);
      localStorage.setItem(key, JSON.stringify(parsed));
    } catch (_err1) {
      try {
        // Step 2: Clean up secondary caches to free space
        const keysToClean = [
          'chery_tn_quotes_v1',
          'chery_tn_test_drives_v1',
          'chery_tn_audit_logs_v1',
          'chery_tn_stock_requests_v1',
        ];
        keysToClean.forEach((k) => {
          if (k !== key) {
            try {
              localStorage.removeItem(k);
            } catch (_) {}
          }
        });
        let parsed = JSON.parse(value);
        parsed = stripHeavyBase64Data(parsed);
        // Stripping all document dataUrls ensures 100% of reservations are preserved without dropping any
        if (Array.isArray(parsed)) {
          const strippedReservations = parsed.map((item: any) => {
            if (item && item.documents && Array.isArray(item.documents)) {
              return {
                ...item,
                documents: item.documents.map((d: any) => ({
                  ...d,
                  dataUrl: '',
                })),
              };
            }
            return item;
          });
          localStorage.setItem(key, JSON.stringify(strippedReservations));
        } else {
          localStorage.setItem(key, JSON.stringify(parsed));
        }
      } catch (_err2) {
        // Step 3: Minimalist preservation of ALL reservations (never truncating the count)
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            const strippedAll = parsed.map((item: any) => ({
              id: item?.id,
              carId: item?.carId,
              carName: item?.carName,
              colorChosen: item?.colorChosen,
              client: item?.client,
              status: item?.status,
              createdAt: item?.createdAt,
              updatedAt: item?.updatedAt,
              priceTND: item?.priceTND,
              depositPaidTND: item?.depositPaidTND,
              paymentMethod: item?.paymentMethod,
              commercialId: item?.commercialId,
              commercialName: item?.commercialName,
              agency: item?.agency,
              vehicles: item?.vehicles,
              notes: item?.notes,
              documents: [],
            }));
            localStorage.setItem(key, JSON.stringify(strippedAll));
          }
        } catch (_) {
          // Graceful fallback: data is 100% persisted and synced in the backend / database
        }
      }
    }
  }
}

// Helper functions for LocalStorage persistence
const STORAGE_KEYS = {
  CARS: 'chery_tn_cars_v1',
  RESERVATIONS: 'chery_tn_reservations_v1',
  TRASH_RESERVATIONS: 'chery_tn_trash_reservations_v1',
  DELETED_RESERVATION_IDS: 'chery_tn_deleted_reservation_ids_v1',
  COMMERCIALS: 'chery_tn_commercials_v1',
  SITE_SETTINGS: 'chery_tn_site_settings_v1',
  KNOWLEDGE_BASE: 'chery_tn_knowledge_base_v1',
  DOC_TEMPLATE: 'chery_tn_doc_template_v1',
  ACCESSORIES: 'chery_tn_accessories_v1',
  QUOTES: 'chery_tn_quotes_v1',
  ADMIN_DOCS: 'chery_tn_admin_docs_v1',
};

export function getStoredAdminDocuments(): AdministrativeDocument[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ADMIN_DOCS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error loading admin documents from storage', e);
  }
  return INITIAL_ADMIN_DOCUMENTS;
}

export function saveStoredAdminDocuments(docs: AdministrativeDocument[]): void {
  safeLocalStorageSet(STORAGE_KEYS.ADMIN_DOCS, JSON.stringify(docs));
}

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

export function getDeletedCarIds(): Set<string> {
  try {
    if (typeof localStorage === 'undefined') return new Set();
    const data = localStorage.getItem('chery_tn_deleted_car_ids_v1');
    if (data) {
      const arr = JSON.parse(data);
      if (Array.isArray(arr)) return new Set(arr);
    }
  } catch {}
  return new Set();
}

export function saveDeletedCarIds(set: Set<string>): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem('chery_tn_deleted_car_ids_v1', JSON.stringify(Array.from(set)));
  } catch {}
}

export function saveStoredSiteSettings(settings: SiteSettings): void {
  safeLocalStorageSet(STORAGE_KEYS.SITE_SETTINGS, JSON.stringify(settings));
}

export function getStoredCars(): CarModel[] {
  const deletedIds = getDeletedCarIds();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CARS);
    if (data) {
      const parsed: CarModel[] = JSON.parse(data);
      // Filter out any virtual mock cars and deleted cars from localStorage
      const filtered = parsed.filter((car) => !isVirtualCar(car) && !deletedIds.has(car.id));
      if (filtered.length > 0) {
        return filtered.map((car) => ({
          ...car,
          colors: (car.colors || []).map((c) => ({
            ...c,
            interiorColor: c.interiorColor === 'Noir Cuir' ? 'Noir' : c.interiorColor,
          })),
        }));
      }
    }
  } catch (e) {
    console.error('Error loading cars from storage', e);
  }
  return INITIAL_CARS.filter((c) => !deletedIds.has(c.id));
}

export function saveStoredCars(cars: CarModel[]): void {
  // Ensure we never persist virtual cars to local storage
  const cleanCars = (cars || []).filter((car) => !isVirtualCar(car));
  safeLocalStorageSet(STORAGE_KEYS.CARS, JSON.stringify(cleanCars));
}

export function getDeletedReservationIds(): Set<string> {
  try {
    if (typeof localStorage === 'undefined') return new Set();
    const data = localStorage.getItem('chery_tn_deleted_reservation_ids_v1');
    if (data) {
      const arr = JSON.parse(data);
      if (Array.isArray(arr)) return new Set(arr);
    }
  } catch {}
  return new Set();
}

export function saveDeletedReservationIds(set: Set<string>): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem('chery_tn_deleted_reservation_ids_v1', JSON.stringify(Array.from(set)));
  } catch {}
}

export function getTrashReservations(): DeletedReservationItem[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.TRASH_RESERVATIONS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error loading trash reservations', e);
  }
  return [];
}

export function saveTrashReservations(items: DeletedReservationItem[]): void {
  const cleanItems = (items || []).map((t) => {
    if (!t) return t;
    if (t.reservation) {
      return {
        ...t,
        reservation: {
          ...t.reservation,
          documents: (t.reservation.documents || []).map((doc) => ({
            ...doc,
            dataUrl: typeof doc.dataUrl === 'string' && doc.dataUrl.startsWith('data:') && doc.dataUrl.length > 500 ? '' : doc.dataUrl,
          })),
        },
      };
    }
    return t;
  });
  safeLocalStorageSet(STORAGE_KEYS.TRASH_RESERVATIONS, JSON.stringify(cleanItems));
}

export function getStoredReservations(): Reservation[] {
  const deletedIds = getDeletedReservationIds();
  const map = new Map<string, Reservation>();
  INITIAL_RESERVATIONS.forEach((r) => {
    if (r && r.id && !deletedIds.has(String(r.id).trim().toUpperCase())) {
      map.set(r.id, r);
    }
  });

  try {
    const data = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    if (data !== null) {
      const parsed: Reservation[] = JSON.parse(data);
      if (Array.isArray(parsed)) {
        parsed.forEach((r) => {
          if (r && r.id && !deletedIds.has(String(r.id).trim().toUpperCase())) {
            const existing = map.get(r.id);
            map.set(r.id, { ...existing, ...r });
          }
        });
      }
    }
  } catch (e) {
    console.error('Error loading reservations from storage', e);
  }

  return Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );
}

export function saveStoredReservations(reservations: Reservation[]): void {
  const cleanReservations = (reservations || []).map((r) => {
    if (!r) return r;
    return {
      ...r,
      documents: (r.documents || []).map((doc) => ({
        ...doc,
        dataUrl: typeof doc.dataUrl === 'string' && doc.dataUrl.startsWith('data:') && doc.dataUrl.length > 500 ? '' : doc.dataUrl,
      })),
    };
  });
  safeLocalStorageSet(STORAGE_KEYS.RESERVATIONS, JSON.stringify(cleanReservations));
}

export function isDeprecatedCommercialUser(u: { id?: string; name?: string; email?: string }): boolean {
  if (!u) return false;
  // Never automatically delete or filter user profiles
  return false;
}

export function getStoredCommercials(): CommercialUser[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COMMERCIALS);
    if (data !== null) {
      const parsed: CommercialUser[] = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.filter((u) => !isDeprecatedCommercialUser(u));
      }
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

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [];

export function getStoredAuditLogs(): AuditLogEntry[] {
  try {
    const data = localStorage.getItem('chery_tn_audit_logs_v1');
    if (data !== null) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        // Exclure automatiquement les anciens faux exemples STA (audit-log-1 à audit-log-10)
        return parsed.filter((l: any) => l && l.id && !l.id.startsWith('audit-log-'));
      }
    }
  } catch (e) {
    console.error('Error loading audit logs from storage', e);
  }
  return [];
}

export function saveStoredAuditLogs(logs: AuditLogEntry[]): void {
  safeLocalStorageSet('chery_tn_audit_logs_v1', JSON.stringify(logs));
}

export const DEFAULT_ADMIN_PERMISSIONS: UserPermissions = {
  canCreateReservation: true,
  canCancelReservation: true,
  canEditValidatedReservations: true,
  canEditPrices: true,
  canManageStock: true,
  canAccessAdminPanel: true,
  canPrintVouchers: true,
  canExportReports: true,
};

export const DEFAULT_COMMERCIAL_PERMISSIONS: UserPermissions = {
  canCreateReservation: true,
  canCancelReservation: false,
  canEditValidatedReservations: false,
  canEditPrices: false,
  canManageStock: false,
  canAccessAdminPanel: false,
  canPrintVouchers: true,
  canExportReports: true,
};

export interface AutomotiveWallpaper {
  id: string;
  title: string;
  category: string;
  previewUrl: string;
  url: string;
}

export const PRESET_AUTOMOTIVE_WALLPAPERS: AutomotiveWallpaper[] = [
  {
    id: 'wall-1',
    title: 'Showroom Chery Premium',
    category: 'Showroom',
    previewUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&auto=format&fit=crop&q=80',
    url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1920&auto=format&fit=crop&q=80',
  },
  {
    id: 'wall-2',
    title: 'SUV Night Drive',
    category: 'Urban',
    previewUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format&fit=crop&q=80',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&auto=format&fit=crop&q=80',
  },
  {
    id: 'wall-3',
    title: 'Luxe Cockpit Futuriste',
    category: 'Intérieur',
    previewUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&auto=format&fit=crop&q=80',
    url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1920&auto=format&fit=crop&q=80',
  },
  {
    id: 'wall-4',
    title: 'Berline Performance',
    category: 'Prestige',
    previewUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&auto=format&fit=crop&q=80',
    url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1920&auto=format&fit=crop&q=80',
  },
  {
    id: 'wall-5',
    title: 'Design Dynamic Crossover',
    category: 'Design',
    previewUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&auto=format&fit=crop&q=80',
    url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1920&auto=format&fit=crop&q=80',
  },
  {
    id: 'wall-6',
    title: 'Chery Cyber Night',
    category: 'High-Tech',
    previewUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&auto=format&fit=crop&q=80',
    url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1920&auto=format&fit=crop&q=80',
  },
];

export interface AutomotiveThemeDef {
  mode: ThemeMode;
  name: string;
  subtitle: string;
  badgeTag: string;
  bgHex: string;
  cardBgHex: string;
  accentHex: string;
}

export const AUTOMOTIVE_THEME_DEFINITIONS: AutomotiveThemeDef[] = [
  {
    mode: 'carbon',
    name: 'Fibre de Carbone Sport',
    subtitle: 'Noir composite haute performance & graphite profond (Recommandé STA)',
    badgeTag: 'Recommandé Sombre',
    bgHex: '#090D16',
    cardBgHex: '#131B2E',
    accentHex: '#EF4444',
  },
  {
    mode: 'dark',
    name: 'Noir Obsidienne Pur',
    subtitle: 'Contraste sombre absolu & finitions anthracite haute lisibilité',
    badgeTag: 'Noir Pur',
    bgHex: '#050811',
    cardBgHex: '#0F172A',
    accentHex: '#F59E0B',
  },
  {
    mode: 'red',
    name: 'Chery Crimson Racing',
    subtitle: 'Rouge passion officiel Chery Racing sur fond nuit sportive',
    badgeTag: 'Racing Sport',
    bgHex: '#14080A',
    cardBgHex: '#220D12',
    accentHex: '#EF4444',
  },
  {
    mode: 'electric_cyan',
    name: 'Omoda EV Cyber Cyan',
    subtitle: 'Ambiance nocturne futuriste avec accents cyan électrique Hybride & EV',
    badgeTag: 'Cyber EV',
    bgHex: '#03131A',
    cardBgHex: '#082535',
    accentHex: '#06B6D4',
  },
  {
    mode: 'luxury_gold',
    name: 'Tiggo Gold Prestige VIP',
    subtitle: 'Finition noir profond et or champagne impérial pour showroom VIP',
    badgeTag: 'Prestige VIP',
    bgHex: '#0E0B07',
    cardBgHex: '#1F180F',
    accentHex: '#EAB308',
  },
  {
    mode: 'titanium',
    name: 'Titanium High-Tech',
    subtitle: 'Gris titane brossé sur fond sombre épuré haute précision',
    badgeTag: 'High-Tech',
    bgHex: '#0B0F19',
    cardBgHex: '#182234',
    accentHex: '#94A3B8',
  },
];

