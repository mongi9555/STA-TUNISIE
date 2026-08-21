export type StockRequestStatus = 'En attente' | 'Approuvé' | 'Refusé';

export interface StockRequest {
  id: string;
  commercialId: string;
  commercialName: string;
  commercialAgency?: string;
  carId: string;
  carName: string;
  requestedQuantity: number;
  reason?: string;
  status: StockRequestStatus;
  createdAt: string;
  processedAt?: string;
  adminNote?: string;
}

export type UserRole = 'super_admin' | 'admin' | 'commercial';
export type ThemeMode =
  | 'light'
  | 'nordic_clean'
  | 'pearl_luxury'
  | 'crystal_cyan'
  | 'dark'
  | 'red'
  | 'carbon'
  | 'electric_cyan'
  | 'luxury_gold'
  | 'titanium';

export interface AnnouncementBannerSettings {
  enabled: boolean;
  text: string;
  type: 'info' | 'warning' | 'success' | 'alert';
}

export interface DsiContactSettings {
  phone: string;
  email: string;
  supportHours: string;
  address?: string;
}

export interface SiteSettings {
  logoUrl?: string;
  siteName?: string;
  siteSubtitle?: string;
  headerBadgeText?: string;
  announcementBanner?: AnnouncementBannerSettings;
  dsiContact?: DsiContactSettings;
  accentColor?: string;

  // Personnalisation du Pied de Page (Footer)
  footerLogoUrl?: string;
  footerTitle?: string;
  footerSubtitle?: string;
  footerDescription?: string;
  footerCopyright?: string;

  // Page d'accueil (Choix rôle / Login) - Fond d'écran Image ou Vidéo
  homeBackgroundType?: 'image' | 'video' | 'default';
  homeBackgroundImageUrl?: string;
  homeBackgroundVideoUrl?: string;
  homeBackgroundOverlayOpacity?: number; // 0.1 to 0.95
  homeBackgroundBlur?: boolean;

  // Espace connecté (Global Site Workspace) - Fond d'écran Image ou Vidéo
  siteBackgroundType?: 'image' | 'video' | 'none';
  siteBackgroundImageUrl?: string;
  siteBackgroundVideoUrl?: string;
  siteBackgroundOverlayOpacity?: number; // 0.1 to 0.95
  siteBackgroundBlur?: boolean;

  defaultThemeMode?: ThemeMode;
}

export interface UserPermissions {
  canCreateReservation: boolean;
  canCancelReservation: boolean;
  canEditPrices: boolean;
  canManageStock: boolean;
  canAccessAdminPanel: boolean;
  canPrintVouchers: boolean;
  canExportReports: boolean;
}

export interface CommercialUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  agency: string;
  role: UserRole;
  avatar: string;
  password?: string;
  title?: string;
  quotaPerModel?: number; // Quota max de réservations par modèle par session commerciale (défaut 5)
  permissions?: UserPermissions;
}

export interface CarColor {
  id: string;
  name: string;
  hexCode: string;
  stock: number;
  reserved: number;
  interiorColor?: string; // Couleur intérieure disponible / associée (ex: Noir, Cuir Marron Cognac, Rouge Sport)
}

export type CarCategory = 'SUV' | 'Berline' | 'Crossover' | 'Électrique/Hybride' | 'Pick-up';

export interface CarModel {
  id: string;
  name: string;
  category: CarCategory | string;
  priceTND: number;
  requiredDepositTND?: number; // Acompte fixe requis pour réservation
  registrationFeeTND?: number; // Frais d'immatriculation, carte grise & timbre fiscal (défaut 0 TND)
  engine: string;
  transmission: string;
  energy: 'Essence' | 'Diesel' | 'Hybride' | 'Électrique';
  guarantee: string;
  imageUrl: string;
  colors: CarColor[];
  interiorColors?: CarColor[];
  features: string[];
  description: string;
  // Enhanced technical specs (Fiche Technique)
  ficheTechniqueUrl?: string; // PDF or image document URL for official specification sheet
  consumption?: string; // ex: "6.5 L/100km"
  powerHP?: string; // ex: "147 ch (8 CV Fiscaux)"
  torque?: string; // ex: "210 Nm"
  dimensions?: string; // ex: "4400 x 1830 x 1670 mm"
  bootCapacity?: string; // ex: "475 Litres" ou Charge utile "1050 Kg" pour Pick-up 4X4/4X2
  payload?: string; // Spécifique Pick-up: Charge Utile (ex: "1050 Kg")
  maxSpeed?: string; // ex: "190 km/h"
  acceleration?: string; // ex: "0-100 km/h en 8.9s"
  galleryImages?: string[];
  safetyFeatures?: string[];
  interiorOptions?: string[];
}

export type ClientType = 'personne_physique' | 'societe';

export interface PersonnePhysiqueInfo {
  nom: string;
  prenom: string;
  cin: string; // 8 chiffres CIN Tunisie
  ville: string; // Gouvernorat/Ville Tunisie
  telephone: string;
  email: string;
  adresse: string;
}

export interface SocieteInfo {
  raisonSociale: string;
  matriculeFiscale: string; // Matricule fiscale Tunisie (ex: 1234567/A/M/000)
  gerantNomPrenom: string;
  gerantCin: string;
  ville: string;
  telephone: string;
  email: string;
  adresse: string;
  registreCommerce?: string; // RNE Tunisie
}

export interface ClientInfo {
  type: ClientType;
  personnePhysique?: PersonnePhysiqueInfo;
  societe?: SocieteInfo;
}

export interface UploadedDocument {
  id: string;
  name: string;
  category: 'cin_recto' | 'cin_verso' | 'matricule_fiscale' | 'registre_commerce' | 'permis_conduire' | 'quittance_acompte' | 'cheque_reservation' | 'virement_bancaire' | 'accord_leasing' | 'bon_commande' | 'autre';
  fileType: string;
  dataUrl: string; // Base64 or object URL preview
  sizeFormatted: string;
  uploadedAt: string;
}

export type ReservationStatus = 'En attente' | 'Confirmée' | 'Livrée' | 'Annulée';

export type TestDriveStatus = 'En attente' | 'Confirmé' | 'Effectué' | 'Annulé';

export interface TestDriveAppointment {
  id: string; // ex: TD-2026-101
  carId: string;
  carName: string;
  agency: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  clientCin?: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // ex: "10:00", "11:30", "15:00"
  commercialId?: string;
  commercialName?: string;
  status: TestDriveStatus;
  notes?: string;
  createdAt: string;
}

export interface Reservation {
  id: string; // ex: RES-2026-104
  commercialId: string;
  commercialName: string;
  agency: string;
  carId: string;
  carName: string;
  colorChosen: {
    id: string;
    name: string;
    hexCode: string;
  };
  interiorColorChosen?: {
    id: string;
    name: string;
    hexCode: string;
  };
  client: ClientInfo;
  documents: UploadedDocument[];
  priceTND: number;
  registrationFeeTND: number;
  depositPaidTND: number;
  paymentMethod: 'Espèces' | 'Chèque Certifié' | 'Virement Bancaire' | 'Leasing';
  status: ReservationStatus;
  createdAt: string;
  expectedDeliveryDate?: string;
  notes?: string;
}

export const TUNISIA_GOVERNORATES = [
  'Ariana',
  'Béja',
  'Ben Arous',
  'Bizerte',
  'Gabès',
  'Gafsa',
  'Jendouba',
  'Kairouan',
  'Kasserine',
  'Kébili',
  'Kef',
  'Mahdia',
  'Manouba',
  'Médenine',
  'Monastir',
  'Nabeul',
  'Sfax',
  'Sidi Bouzid',
  'Siliana',
  'Sousse',
  'Tataouine',
  'Tozeur',
  'Tunis',
  'Zaghouan',
];

// --- 1. Base de Connaissances Personnalisée ---
export type KnowledgeCategory = 'faq' | 'garantie' | 'financement' | 'promotions' | 'agences' | 'fiches_techniques' | 'politique_sta';

export interface KnowledgeBaseItem {
  id: string;
  title: string;
  category: KnowledgeCategory;
  content: string;
  tags?: string[];
  updatedAt: string;
  updatedBy?: string;
  isPublicForAI: boolean;
}

// --- 2. Personnalisation des Documents & Devis ---
export interface DocumentTemplateConfig {
  companyName: string; // STA - Société Tunisienne d'Automobiles
  logoUrl: string;
  matriculeFiscale: string; // ex: 1234567/A/M/000
  address: string;
  phone: string;
  email: string;
  ribBancaire?: string;
  tvaPercentage: number; // default 19%
  droitDeTimbreTND: number; // default 1.000 TND
  validityDays: number; // default 30 jours
  quoteHeaderNote?: string;
  quoteFooterTerms?: string;
  defaultRegistrationFeeTND: number; // default 0 TND
}

// --- 3. Personnalisation des Véhicules & Accessoires ---
export interface CarAccessory {
  id: string;
  name: string;
  category: 'extérieur' | 'intérieur' | 'sécurité' | 'multimédia' | 'protection';
  priceTND: number;
  description: string;
  compatibleModels?: string[]; // Vehicle IDs or empty for all
  imageUrl?: string;
}

export interface VehicleConfiguration {
  carId: string;
  carName: string;
  colorId: string;
  colorName: string;
  colorHex: string;
  interiorColorId?: string;
  interiorColorName?: string;
  interiorColorHex?: string;
  selectedAccessories: CarAccessory[];
  customDiscountTND: number;
  registrationFeeTND: number;
  basePriceTND: number;
  accessoriesPriceTND: number;
  totalTND: number;
}

export interface CustomQuote {
  id: string; // ex: DEV-2026-001
  quoteNumber: string;
  date: string;
  validUntil: string;
  commercialName: string;
  agency: string;
  client: ClientInfo;
  config: VehicleConfiguration;
  financials: {
    basePriceHT: number;
    accessoriesHT: number;
    discountTND: number;
    subtotalHT: number;
    tvaAmount: number;
    droitDeTimbre: number;
    registrationFee: number;
    totalTTC: number;
  };
  notes?: string;
}

// --- 4. Documents Administratifs & Check-lists ---
export type AdminDocCategory =
  | 'leasing'
  | 'particulier'
  | 'societe'
  | 'immatriculation'
  | 'livraison'
  | 'conformite'
  | 'credit'
  | 'general';

export interface AdministrativeDocument {
  id: string;
  title: string;
  category: AdminDocCategory;
  categoryLabel: string;
  fileFormat: 'pdf' | 'docx' | 'doc';
  fileName: string;
  fileUrl: string; // Base64 or URL
  fileSizeFormatted: string;
  uploadedAt: string;
  uploadedBy: string;
  description?: string;
  applicableModels?: string;
  isOfficialSTA?: boolean;
  itemCount?: number; // Number of items in checklist if structured
  checklistItems?: string[];
}


