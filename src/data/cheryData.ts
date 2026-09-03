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
    content: 'L\'acompte officiel de réservation est exigé pour valider et sécuriser le blocage du châssis en stock:\n- SUV Urbains / Berlines: 10 000 à 20 000 TND\n- SUV Luxe / Hybrides PHEV: 30 000 à 50 000 TND\nLe solde doit être versé avant la délivrance de la Carte Grise et de la livraison finale.',
    tags: ['acompte', 'financement', 'délai', 'livraison'],
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
    role: 'commercial',
    phone: '+216 71 800 902',
    agency: 'STA Showroom Ariana / Ennasr',
    avatar: '',
    permissions: {
      canCreateReservation: true,
      canCancelReservation: false,
      canEditValidatedReservations: false,
      canEditPrices: false,
      canManageStock: false,
      canAccessAdminPanel: false,
      canPrintVouchers: true,
      canExportReports: false,
    }
  },
  {
    id: 'comm-sami',
    name: 'Sami Chaker',
    email: 'sami.chaker@chery-tunisie.tn',
    password: 'STA@2026+',
    role: 'commercial',
    phone: '+216 73 800 903',
    agency: 'STA Agence Sousse / Kantaoui',
    avatar: '',
    permissions: {
      canCreateReservation: true,
      canCancelReservation: false,
      canEditValidatedReservations: false,
      canEditPrices: false,
      canManageStock: false,
      canAccessAdminPanel: false,
      canPrintVouchers: true,
      canExportReports: false,
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

  if (name.includes('icar 03')) return 20000;
  if (name.includes('arrizo 8') && (name.includes('phev') || name.includes('hybride'))) return 30000;
  if (name.includes('arrizo 8')) return 25000;

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

export const INITIAL_CARS: CarModel[] = [
  {
    id: "car-1785512735025",
    name: "Chery Arrizo 8 PHEV",
    category: "Berline",
    engine: "1.5 T DHT",
    energy: "Hybride",
    transmission: "Boîte Automatique",
    priceTND: 89900,
    powerHP: "147 ch (8 CV Fiscaux)",
    acceleration: "0-100 km/h en 8.9s",
    torque: "210 Nm @ 1750-4000 tr/min",
    consumption: "6.8 L/100km",
    maxSpeed: "190 km/h",
    dimensions: "4780 x 1843 x 1469 mm",
    bootCapacity: "475 Litres",
    guarantee: "7 ans ou 200 000 km",
    imageUrl: "https://catalogue.automobile.tn/big/2026/06/47649.webp?t=1782727426",
    description: "Berline Premium Hybride Rechargeable d'exception alliant raffinement et puissance.",
    features: [
      "Double écran incurvé HD 24.6\"",
      "Chargeur rapide par induction 50W",
      "Toit ouvrant panoramique électrique",
      "Climatisation Bizone Purifiée N95 & Parfumeur d'ambiance"
    ],
    safetyFeatures: [
      "10 Airbags",
      "Conduite autonome ADAS Niveau 2+",
      "Caméra 540° Haute Définition",
      "Freinage d'urgence autonome (AEB)",
      "Avertisseur d'angle mort (BSD)"
    ],
    colors: [
      { id: "col-1-1785512735025", name: "Blanc Nacré", hexCode: "#F8FAFC", interiorColor: "Gris Clair & Bleu Nappa", stock: 12, reserved: 0 },
      { id: "col-2-1785512735025", name: "Gris Platine", hexCode: "#475569", interiorColor: "Cuir Noir Surpiqué", stock: 8, reserved: 0 },
      { id: "col-3-1785512735025", name: "Noir Carbone", hexCode: "#090D16", interiorColor: "Cuir Noir", stock: 15, reserved: 0 },
      { id: "col-4-1785512735025", name: "Bleu Électrique", hexCode: "#1D4ED8", interiorColor: "Cuir Beige & Bleu", stock: 6, reserved: 0 }
    ],
    interiorColors: [
      { id: "int-1787043676942-1", name: "Noir Carbone", hexCode: "#0F172A", stock: 15, reserved: 0 },
      { id: "int-1787043676942-2", name: "Cuir Marron Cognac", hexCode: "#78350F", stock: 10, reserved: 0 },
      { id: "int-1787043676942-3", name: "Beige Nappa & Bleu", hexCode: "#D4B996", stock: 8, reserved: 0 }
    ],
    ficheTechniqueUrl: ""
  },
  {
    id: "car-1785512823129",
    name: "Chery Arrizo 8",
    category: "Berline",
    engine: "1.6 T-GDi Luxury BVA",
    energy: "Essence",
    transmission: "Boîte Automatique DCT 7 rapports",
    priceTND: 100000,
    powerHP: "197 ch (11 CV Fiscaux)",
    acceleration: "0-100 km/h en 7.8s",
    torque: "290 Nm @ 2000-4000 tr/min",
    consumption: "6.5 L/100km",
    maxSpeed: "205 km/h",
    dimensions: "4780 x 1843 x 1469 mm",
    bootCapacity: "475 Litres",
    guarantee: "7 ans ou 200 000 km",
    imageUrl: "https://catalogue.automobile.tn/big/2026/04/47408.webp?t=1780418724",
    description: "Berline grand tourisme d'exception, design dynamique et habitacle ultra connecté.",
    features: [
      "Système Audio Sony 12 haut-parleurs",
      "Écran tactile 12.3\" + Combiné numérique 12.3\"",
      "Sièges avant chauffants & ventilés à mémoire",
      "Éclairage d'ambiance dynamique 64 couleurs"
    ],
    safetyFeatures: [
      "8 Airbags",
      "ESP Bosch 9.3",
      "Régulateur de vitesse adaptatif ACC",
      "Système de maintien dans la voie (LKA)"
    ],
    colors: [
      { id: "col-1-arrizo8-1", name: "Blanc Glacier", hexCode: "#F8FAFC", interiorColor: "Cuir Noir", stock: 10, reserved: 0 },
      { id: "col-2-arrizo8-2", name: "Gris Anthracite", hexCode: "#475569", interiorColor: "Cuir Cognac", stock: 9, reserved: 0 },
      { id: "col-3-arrizo8-3", name: "Noir Intense", hexCode: "#090D16", interiorColor: "Cuir Noir", stock: 14, reserved: 0 },
      { id: "col-4-arrizo8-4", name: "Rouge Rubis", hexCode: "#991B1B", interiorColor: "Cuir Noir & Rouge", stock: 5, reserved: 0 }
    ],
    interiorColors: [
      { id: "int-arrizo8-1", name: "Noir Carbone", hexCode: "#0F172A", stock: 15, reserved: 0 },
      { id: "int-arrizo8-2", name: "Cuir Marron Cognac", hexCode: "#78350F", stock: 12, reserved: 0 }
    ],
    ficheTechniqueUrl: ""
  },
  {
    id: "car-1785513071800",
    name: "Chery Tiggo 9 PHEV",
    category: "SUV",
    engine: "1.5 T DHT AWD Super Hybrid",
    energy: "Hybride",
    transmission: "Boîte Automatique 3-DHT",
    priceTND: 129900,
    powerHP: "326 ch (16 CV Fiscaux)",
    acceleration: "0-100 km/h en 5.7s",
    torque: "545 Nm combiné",
    consumption: "5.2 L/100km (Autonomie +1200km)",
    maxSpeed: "210 km/h",
    dimensions: "4820 x 1930 x 1699 mm",
    bootCapacity: "717 Litres (jusqu'à 2065 L)",
    guarantee: "7 ans ou 200 000 km",
    imageUrl: "https://catalogue.automobile.tn/big/2026/06/47650.webp?t=1782984077",
    description: "Le fleuron SUV 7 places technologique de Chery avec transmission intégrale AWD intelligente.",
    features: [
      "Écran géant 2.5K Ultra HD 15.6\"",
      "Affichage tête haute HUD Réalité Augmentée",
      "Suspension pilotée CDC adaptative",
      "Sièges massants avec repose-mollets zéro gravité"
    ],
    safetyFeatures: [
      "10 Airbags",
      "Assistance à la conduite intelligente L2.9",
      "Vision nocturne & Caméra 540°",
      "Freinage d'urgence autonome multi-zones"
    ],
    colors: [
      { id: "col-1-1785513071800", name: "White BX", hexCode: "#FCFCFC", interiorColor: "Cuir Noir", stock: 8, reserved: 0 },
      { id: "col-2-1785513071800", name: "Green SJ", hexCode: "#087252", interiorColor: "Cuir Beige & Bleu", stock: 7, reserved: 0 },
      { id: "col-3-1785513071800", name: "Tech Gray GX", hexCode: "#727783", interiorColor: "Cuir Noir", stock: 14, reserved: 0 },
      { id: "col-1786981421374", name: "Black CM", hexCode: "#030303", interiorColor: "Cuir Beige & Bleu", stock: 16, reserved: 0 },
      { id: "col-1786981512703", name: "Huanyu Gray", hexCode: "#A1A1A1", interiorColor: "Cuir Noir", stock: 11, reserved: 0 }
    ],
    interiorColors: [
      { id: "int-1787043707010-1", name: "Noir Carbone", hexCode: "#0F172A", stock: 15, reserved: 0 },
      { id: "int-1787043707010-2", name: "Cuir Marron Cognac", hexCode: "#78350F", stock: 12, reserved: 0 },
      { id: "int-1787043707010-3", name: "Beige Nappa & Sable", hexCode: "#D4B996", stock: 10, reserved: 0 }
    ],
    ficheTechniqueUrl: ""
  },
  {
    id: "car-1785513939488",
    name: "CHERY Himla 4X2",
    category: "Pick-up",
    engine: "2.3 L Turbo Diesel 4x2",
    energy: "Diesel",
    transmission: "Boîte Manuelle 6 rapports",
    priceTND: 89900,
    powerHP: "161 ch (8 CV Fiscaux)",
    acceleration: "0-100 km/h en 9.2s",
    torque: "380 Nm @ 1800-2600 tr/min",
    consumption: "7.8 L/100km",
    maxSpeed: "165 km/h",
    dimensions: "5330 x 1920 x 1825 mm",
    bootCapacity: "1050 Kg (Charge Utile)",
    payload: "1050 Kg",
    guarantee: "5 ans ou 200 000 km",
    imageUrl: "https://catalogue.automobile.tn/big/2026/07/47663.webp?t=1",
    description: "Pick-up double cabine robuste, polyvalent et ultra résistant pour tous vos trajets professionnels.",
    features: [
      "Écran Tactile HD 10.25\" avec Apple CarPlay & Android Auto",
      "Châssis échelle haute résistance renforcé",
      "Climatisation automatique avec aérateurs arrière",
      "Caméra de recul et radars de stationnement"
    ],
    safetyFeatures: [
      "4 Airbags",
      "ABS + EBD + ESP",
      "Aide au démarrage en côte (HAC)",
      "Contrôle de descente (HDC)"
    ],
    colors: [
      { id: "col-1-1785513939488", name: "Blanc Pur", hexCode: "#F0F2F4", interiorColor: "Cuir Noir", stock: 9, reserved: 0 },
      { id: "col-2-1785513939488", name: "Gris Argent", hexCode: "#94A3B8", interiorColor: "Cuir Noir", stock: 8, reserved: 0 },
      { id: "col-3-1785513939488", name: "Black CH", hexCode: "#0A0A0A", interiorColor: "Cuir Noir", stock: 12, reserved: 0 }
    ],
    interiorColors: [
      { id: "int-1787041462294-1", name: "Noir Carbone", hexCode: "#0F172A", stock: 15, reserved: 0 },
      { id: "int-1787041462294-2", name: "Cuir Marron Cognac", hexCode: "#78350F", stock: 10, reserved: 0 }
    ],
    ficheTechniqueUrl: ""
  },
  {
    id: "car-1785514106502",
    name: "Chery Himla 4X4",
    category: "Pick-up",
    engine: "2.3 L Turbo Diesel 4x4 BVA",
    energy: "Diesel",
    transmission: "Boîte Automatique 8 rapports avec sélecteur 4WD",
    priceTND: 102900,
    powerHP: "161 ch (8 CV Fiscaux)",
    acceleration: "0-100 km/h en 8.5s",
    torque: "420 Nm @ 1800-2400 tr/min",
    consumption: "8.4 L/100km",
    maxSpeed: "170 km/h",
    dimensions: "5330 x 1920 x 1825 mm",
    bootCapacity: "1100 Kg (Charge Utile)",
    payload: "1100 Kg",
    guarantee: "5 ans ou 200 000 km",
    imageUrl: "https://catalogue.automobile.tn/big/2026/07/47663.webp?t=1",
    description: "Pick-up tout-terrain 4x4 haute puissance avec blocage de différentiel et transmission intégrale.",
    features: [
      "Transmission 4x4 électronique (2H / 4H / 4L) avec blocage de différentiel",
      "Écran tactile 10.25\" & Système de navigation",
      "Sièges cuir avec réglages électriques",
      "Protection de benne renforcée & Marchepieds aluminium"
    ],
    safetyFeatures: [
      "6 Airbags",
      "Contrôle de stabilité de remorque (TSC)",
      "Système de vision panoramique 360°",
      "Freinage d'urgence autonome"
    ],
    colors: [
      { id: "col-1-1785514106502", name: "Silver Gray GR", hexCode: "#BFBFBF", interiorColor: "Cuir Marron", stock: 11, reserved: 0 },
      { id: "col-2-1785514106502", name: "Green SC", hexCode: "#38AD9A", interiorColor: "Cuir Marron", stock: 6, reserved: 0 },
      { id: "col-3-1785514106502", name: "Orange DU", hexCode: "#FF9500", interiorColor: "Cuir Marron", stock: 5, reserved: 0 },
      { id: "col-1786981947069", name: "Black CH", hexCode: "#0A0A0A", interiorColor: "Cuir Marron", stock: 14, reserved: 0 }
    ],
    interiorColors: [
      { id: "int-himla4x4-1", name: "Noir Carbone", hexCode: "#0F172A", stock: 15, reserved: 0 },
      { id: "int-himla4x4-2", name: "Cuir Marron", hexCode: "#78350F", stock: 12, reserved: 0 }
    ],
    ficheTechniqueUrl: ""
  },
  {
    id: "car-1785753010029",
    name: "Chery Tiggo 2 Pro Max",
    category: "SUV",
    engine: "1.0 T CVT Turbo",
    energy: "Essence",
    transmission: "Boîte Automatique CVT 9 rapports simulés",
    priceTND: 66990,
    powerHP: "102 ch (5 CV Fiscaux)",
    acceleration: "0-100 km/h en 10.5s",
    torque: "150 Nm @ 1750-4000 tr/min",
    consumption: "5.8 L/100km",
    maxSpeed: "175 km/h",
    dimensions: "4200 x 1760 x 1570 mm",
    bootCapacity: "420 Litres",
    guarantee: "7 ans ou 200 000 km",
    imageUrl: "https://catalogue.automobile.tn/big/2026/04/47617.webp?t=1777544465",
    description: "Le SUV citadin compact le plus accessible et moderne de Tunisie, économique et dynamique.",
    features: [
      "Écran tactile 10.25\" HD avec MirrorLink",
      "Feux avant LED Crystal Diamond",
      "Climatisation à commandes tactiles",
      "Jantes alliage 17\" bicolores"
    ],
    safetyFeatures: [
      "4 Airbags",
      "ABS + EBD + ESP Bosch",
      "Radar et caméra de recul avec lignes de guidage dynamique",
      "Régulateur et limiteur de vitesse"
    ],
    colors: [
      { id: "col-1-1785753010029", name: "Rouge Flamme", hexCode: "#DC2626", interiorColor: "Cuir Noir", stock: 8, reserved: 0 },
      { id: "col-2-1785753010029", name: "Gris Météore", hexCode: "#5A626C", interiorColor: "Cuir Noir", stock: 12, reserved: 0 },
      { id: "col-3-1785753010029", name: "Noir Onyx", hexCode: "#161618", interiorColor: "Cuir Noir", stock: 9, reserved: 0 },
      { id: "col-1786983375958", name: "Blanc Glacier", hexCode: "#EDF0F7", interiorColor: "Cuir Noir", stock: 14, reserved: 0 }
    ],
    interiorColors: [
      { id: "int-tiggo2-1", name: "Noir Carbone", hexCode: "#0F172A", stock: 20, reserved: 0 }
    ],
    ficheTechniqueUrl: ""
  },
  {
    id: "car-1785753066750",
    name: "Chery Tiggo 4 HEV",
    category: "SUV",
    energy: "Hybride",
    engine: "1.5 L DHT Hybrid",
    transmission: "Boîte Automatique Hybride DHT",
    priceTND: 79900,
    powerHP: "147 ch (6 CV Fiscaux)",
    acceleration: "0-100 km/h en 8.8s",
    torque: "210 Nm @ 1750-4000 tr/min",
    consumption: "4.9 L/100km",
    maxSpeed: "185 km/h",
    dimensions: "4358 x 1830 x 1670 mm",
    bootCapacity: "430 Litres",
    guarantee: "7 ans ou 200 000 km",
    imageUrl: "https://catalogue.automobile.tn/big/2026/06/47647.webp?t=1782726731",
    description: "SUV compact Hybride moderne et sobre, idéal pour la ville et les longs trajets.",
    features: [
      "Double combiné digital 10.25\"",
      "Démarrage sans clé & Clé intelligente avec ouverture automatique",
      "Chargeur à induction pour smartphone",
      "Toit ouvrant électrique"
    ],
    safetyFeatures: [
      "6 Airbags",
      "Frein de stationnement électrique avec Auto-Hold",
      "Radar de recul & Caméra HD",
      "Système de contrôle de la pression des pneus (TPMS)"
    ],
    colors: [
      { id: "col-1-1785753066750", name: "Silver KU", hexCode: "#D1CCCC", interiorColor: "Cuir Noir", stock: 10, reserved: 0 },
      { id: "col-2-1785753066750", name: "White BW", hexCode: "#FFFFFF", interiorColor: "Cuir Noir", stock: 16, reserved: 0 },
      { id: "col-3-1785753066750", name: "Gray GV", hexCode: "#6E6F72", interiorColor: "Cuir Noir", stock: 12, reserved: 0 },
      { id: "col-1786982272954", name: "Black CL", hexCode: "#050505", interiorColor: "Cuir Noir", stock: 14, reserved: 0 }
    ],
    interiorColors: [
      { id: "int-tiggo4-1", name: "Noir Carbone", hexCode: "#0F172A", stock: 18, reserved: 0 }
    ],
    ficheTechniqueUrl: ""
  },
  {
    id: "car-1785753150277",
    name: "Chery I03 4X2",
    category: "SUV",
    engine: "Électrique 65.7 kWh 4x2",
    energy: "Électrique",
    transmission: "Réducteur Automatique 1 rapport",
    priceTND: 76900,
    powerHP: "184 ch (7 CV Fiscaux)",
    acceleration: "0-100 km/h en 7.5s",
    torque: "275 Nm instantané",
    consumption: "Autonomie 401 km (CLTC)",
    maxSpeed: "170 km/h",
    dimensions: "4406 x 1910 x 1715 mm",
    bootCapacity: "450 Litres + Frunk 40L",
    guarantee: "8 ans ou 200 000 km (Batterie)",
    imageUrl: "https://catalogue.automobile.tn/big/2026/04/47620.webp?t=1",
    description: "SUV 100% Électrique au look baroudeur cybernétique ultra moderne avec châssis tout aluminium.",
    features: [
      "Écran central tactile 15.6\" Ultra HD avec processeur Snapdragon 8155",
      "Recharge rapide DC 30% à 80% en 30 minutes",
      "Toit panoramique XXL avec store occultant électrique",
      "Prise 220V V2L pour alimenter vos appareils externes"
    ],
    safetyFeatures: [
      "8 Airbags",
      "Structure en aluminium haute résistance 100%",
      "Caméra 360° transparente 3D",
      "Freinage d'urgence autonome multi-véhicules et piétons"
    ],
    colors: [
      { id: "col-1-1785753150277", name: "Noir Cosmos", hexCode: "#000000", interiorColor: "Cuir Marron", stock: 18, reserved: 0 },
      { id: "col-2-1785753150277", name: "Argent Lunaire", hexCode: "#B3C2D5", interiorColor: "Cuir Marron", stock: 12, reserved: 0 },
      { id: "col-3-1785753150277", name: "Vert Émeraude", hexCode: "#0E775C", interiorColor: "Cuir Vert & Marron", stock: 9, reserved: 0 }
    ],
    interiorColors: [
      { id: "int-i03-4x2-1", name: "Cuir Marron Cognac", hexCode: "#78350F", stock: 15, reserved: 0 },
      { id: "int-i03-4x2-2", name: "Noir Carbone", hexCode: "#0F172A", stock: 12, reserved: 0 }
    ],
    ficheTechniqueUrl: ""
  },
  {
    id: "car-1785753208837",
    name: "Chery I03 4X4",
    category: "SUV",
    engine: "Bi-Moteur Électrique 69.8 kWh 4x4",
    energy: "Électrique",
    transmission: "Transmission Intégrale e-AWD",
    priceTND: 84900,
    powerHP: "279 ch (9 CV Fiscaux)",
    acceleration: "0-100 km/h en 6.5s",
    torque: "385 Nm instantané",
    consumption: "Autonomie 501 km (CLTC)",
    maxSpeed: "180 km/h",
    dimensions: "4406 x 1910 x 1715 mm",
    bootCapacity: "450 Litres + Frunk 40L",
    guarantee: "8 ans ou 200 000 km (Batterie)",
    imageUrl: "https://catalogue.automobile.tn/big/2026/04/47620.webp?t=1",
    description: "Le baroudeur 100% Électrique 4x4 tout-terrain avec double motorisation et modes de franchissement.",
    features: [
      "Double motorisation avant/arrière avec gestion de couple intelligente",
      "8 modes de conduite tout-terrain (Neige, Boue, Sable, Roches, Sport...)",
      "Système audio Surround Hi-Fi 12 haut-parleurs",
      "Suspension tout-terrain surélevée à grand débattement"
    ],
    safetyFeatures: [
      "10 Airbags",
      "Blindage de protection sous châssis pour la batterie",
      "Pack d'aides à la conduite ADAS complet Niveau 2+",
      "Assistance de franchissement d'obstacles"
    ],
    colors: [
      { id: "col-1-1785753208837", name: "Noir Cosmos", hexCode: "#000000", interiorColor: "Cuir Marron", stock: 31, reserved: 0 },
      { id: "col-2-1785753208837", name: "Argent Lunaire", hexCode: "#B3C2D5", interiorColor: "Cuir Marron", stock: 23, reserved: 0 },
      { id: "col-1786454499484", name: "Vert Safari", hexCode: "#0E775C", interiorColor: "Cuir Marron", stock: 12, reserved: 0 },
      { id: "col-1786454514433", name: "Gris Titane", hexCode: "#6F7585", interiorColor: "Cuir Marron", stock: 28, reserved: 0 }
    ],
    interiorColors: [
      { id: "int-i03-4x4-1", name: "Cuir Marron", hexCode: "#78350F", stock: 30, reserved: 0 },
      { id: "int-i03-4x4-2", name: "Noir Carbone", hexCode: "#0F172A", stock: 20, reserved: 0 }
    ],
    ficheTechniqueUrl: ""
  },
  {
    id: "car-1785753278797",
    name: "Chery Tiggo 7 PHEV",
    category: "SUV",
    engine: "1.5 T DHT Hybrid",
    energy: "Hybride",
    transmission: "Boîte Automatique Hybride DHT",
    priceTND: 88900,
    powerHP: "245 ch (8 CV Fiscaux)",
    acceleration: "0-100 km/h en 7.9s",
    torque: "510 Nm combiné",
    consumption: "5.5 L/100km (Autonomie +1000km)",
    maxSpeed: "195 km/h",
    dimensions: "4500 x 1842 x 1746 mm",
    bootCapacity: "475 Litres (jusqu'à 1500 L)",
    guarantee: "7 ans ou 200 000 km",
    imageUrl: "https://catalogue.automobile.tn/big/2026/04/47615.webp?t=1782724835",
    description: "SUV familial Hybride rechargeable d'excellence, confort royal et technologies de pointe.",
    features: [
      "Double écran HD 24.6\" incurvé",
      "Toit panoramique géant 1.13 m²",
      "Climatisation automatique bizone avec purificateur PM2.5",
      "Hayon arrière électrique à ouverture mains-libres"
    ],
    safetyFeatures: [
      "8 Airbags",
      "ESP Bosch 9.3 dernière génération",
      "Caméra 360° HD panoramique",
      "Régulateur adaptatif avec maintien au centre de la voie"
    ],
    colors: [
      { id: "col-1-1785753278797", name: "White BW", hexCode: "#FFFFFF", interiorColor: "Cuir Noir", stock: 25, reserved: 0 },
      { id: "col-2-1785753278797", name: "Phantom Gray GV", hexCode: "#939AA5", interiorColor: "Cuir Noir", stock: 35, reserved: 0 },
      { id: "col-3-1785753278797", name: "Tech Gray GX", hexCode: "#727783", interiorColor: "Cuir Noir", stock: 25, reserved: 0 },
      { id: "col-1786454139529", name: "Black CL", hexCode: "#050505", interiorColor: "Cuir Noir", stock: 30, reserved: 0 },
      { id: "col-1786454192522", name: "Exclusive Blue WE", hexCode: "#217CB5", interiorColor: "Cuir Noir", stock: 20, reserved: 0 }
    ],
    interiorColors: [
      { id: "int-tiggo7-1", name: "Noir Carbone", hexCode: "#0F172A", stock: 30, reserved: 0 },
      { id: "int-tiggo7-2", name: "Cuir Marron Cognac", hexCode: "#78350F", stock: 25, reserved: 0 }
    ],
    ficheTechniqueUrl: ""
  },
  {
    id: "car-1785753367152",
    name: "Chery Tiggo 8 PHEV",
    category: "SUV",
    engine: "1.5 T DHT Super Hybrid 7 Places",
    energy: "Hybride",
    transmission: "Boîte Automatique 3-DHT",
    priceTND: 102990,
    powerHP: "326 ch (10 CV Fiscaux)",
    acceleration: "0-100 km/h en 7.0s",
    torque: "545 Nm combiné",
    consumption: "5.4 L/100km (Autonomie +1100km)",
    maxSpeed: "200 km/h",
    dimensions: "4722 x 1860 x 1745 mm",
    bootCapacity: "7 places modulables / 890 Litres",
    guarantee: "7 ans ou 200 000 km",
    imageUrl: "https://catalogue.automobile.tn/big/2026/05/47635.webp?t=1782480403",
    description: "Le grand SUV 7 places Hybride Premium, spacieux, puissant et ultra économique pour toute la famille.",
    features: [
      "Configuration 7 places avec sièges rabattables à plat",
      "Double combiné numérique 24.6\" Ultra HD",
      "Système de son Sony Premium 8 haut-parleurs",
      "Sièges cuir chauffants et ventilés avec réglages électriques"
    ],
    safetyFeatures: [
      "10 Airbags",
      "Freinage d'urgence autonome multi-cibles",
      "Caméra 540° avec châssis transparent",
      "Avertisseur de trafic transversal arrière"
    ],
    colors: [
      { id: "col-1-1785753367152", name: "White BW", hexCode: "#FFFFFF", interiorColor: "Cuir Noir", stock: 15, reserved: 0 },
      { id: "col-2-1785753367152", name: "Gray UM", hexCode: "#668F88", interiorColor: "Cuir Noir", stock: 14, reserved: 0 },
      { id: "col-3-1785753367152", name: "Black CL", hexCode: "#050505", interiorColor: "Cuir Noir", stock: 22, reserved: 0 },
      { id: "col-1786454375127", name: "Green SJ", hexCode: "#087252", interiorColor: "Cuir Noir", stock: 12, reserved: 0 }
    ],
    interiorColors: [
      { id: "int-tiggo8-1", name: "Noir Carbone", hexCode: "#0F172A", stock: 20, reserved: 0 },
      { id: "int-tiggo8-2", name: "Cuir Marron Cognac", hexCode: "#78350F", stock: 15, reserved: 0 }
    ],
    ficheTechniqueUrl: ""
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

export function saveStoredSiteSettings(settings: SiteSettings): void {
  safeLocalStorageSet(STORAGE_KEYS.SITE_SETTINGS, JSON.stringify(settings));
}

export function getStoredCars(): CarModel[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CARS);
    if (data) {
      const parsed: CarModel[] = JSON.parse(data);
      // Filter out any virtual mock cars from localStorage
      const filtered = parsed.filter((car) => !isVirtualCar(car));
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
  return INITIAL_CARS;
}

export function saveStoredCars(cars: CarModel[]): void {
  // Ensure we never persist virtual cars to local storage
  const cleanCars = (cars || []).filter((car) => !isVirtualCar(car));
  safeLocalStorageSet(STORAGE_KEYS.CARS, JSON.stringify(cleanCars));
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

