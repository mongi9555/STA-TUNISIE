import React, { useState, useRef } from 'react';
import { CarModel, CarColor, CommercialUser, Reservation, UserRole, UserPermissions, SiteSettings, ThemeMode, StockRequest, CarAccessory, CustomQuote, AuditLogEntry } from '../types';
import { TechSpecModal } from './TechSpecModal';
import { compressImageDataUrl, fileToCompressedAvatarDataUrl } from '../utils/imageCompressor';
import { UserPhotoUploadModal } from './UserPhotoUploadModal';
import { StaLogo } from './StaLogo';
import { AuditLogViewer } from './AuditLogViewer';
import {
  DEFAULT_ADMIN_PERMISSIONS,
  DEFAULT_COMMERCIAL_PERMISSIONS,
  PRESET_AUTOMOTIVE_WALLPAPERS,
  AUTOMOTIVE_THEME_DEFINITIONS,
  isPickupCar,
  getCarCapacityLabel,
} from '../data/cheryData';
import {
  Settings,
  Plus,
  Palette,
  Car,
  Users,
  Building,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Save,
  Trash2,
  Edit2,
  BarChart3,
  RefreshCw,
  Lock,
  Key,
  Eye,
  EyeOff,
  UserPlus,
  ShieldCheck,
  Phone,
  Mail,
  Shield,
  X,
  Check,
  FileText,
  Upload,
  Image as ImageIcon,
  Camera,
  Megaphone,
  Globe,
  Sparkles,
  RotateCcw,
  Sliders,
  MapPin,
  Clock,
  PackageCheck,
  Package,
  Flame,
  Moon,
  Sun,
  Gauge,
  Zap,
  Crown,
  Monitor,
  Layout,
  Video,
  Film,
  Play,
  Database,
  Download,
  UploadCloud,
  Server,
  HardDrive,
  FileJson,
  Printer,
  History,
} from 'lucide-react';
import cheryLogo from '../assets/images/chery_logo_emblem_1785417732982.jpg';

interface AdminPanelProps {
  currentUser: CommercialUser;
  cars: CarModel[];
  commercials: CommercialUser[];
  reservations: Reservation[];
  accessories?: CarAccessory[];
  quotes?: CustomQuote[];
  auditLogs?: AuditLogEntry[];
  onClearAuditLogs?: () => void;
  onDeleteAuditLog?: (logId: string) => void;
  onDeleteMultipleAuditLogs?: (logIds: string[]) => void;
  onResetDefaultLogs?: () => void;
  onAddManualLog?: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  onUpdateCarStock: (carId: string, updatedColors: CarColor[]) => void;
  onUpdateCarPrice: (carId: string, newPriceTND: number) => void;
  onAddColorToCar: (carId: string, newColor: CarColor) => void;
  onEditColor?: (carId: string, colorId: string, updatedColorProps: Partial<CarColor>) => void;
  onDeleteColor?: (carId: string, colorId: string) => void;
  onEditCarModel?: (updatedCar: CarModel) => void;
  onAddCarModel?: (newCar: CarModel) => void;
  onDeleteCarModel?: (carId: string) => void;
  onAddCommercial: (newUser: CommercialUser) => void;
  onUpdateCommercial?: (updatedUser: CommercialUser) => void;
  onUpdateCommercialPassword: (userId: string, newPassword: string) => void;
  onDeleteCommercial: (userId: string) => void;
  siteSettings?: SiteSettings;
  onUpdateSiteSettings?: (newSettings: SiteSettings) => void;
  stockRequests?: StockRequest[];
  onProcessStockRequest?: (requestId: string, status: 'Approuvé' | 'Refusé', adminNote?: string) => void;
  onDeleteStockRequest?: (requestId: string) => void;
  onImportDatabase?: (data: any) => void;
  onResetToFactoryDefaults?: () => void;
}

export const getCheryModelDefaultPhoto = (name: string, category?: string): string => {
  const n = (name || '').toLowerCase();
  if (n.includes('himla') || category === 'Pick-up') {
    return 'https://catalogue.automobile.tn/big/2026/07/47663.webp?t=1';
  }
  if (n.includes('tiggo 9')) {
    return 'https://catalogue.automobile.tn/big/2026/06/47650.webp?t=1782984077';
  }
  if (n.includes('tiggo 8')) {
    return 'https://catalogue.automobile.tn/big/2026/05/47635.webp?t=1782480403';
  }
  if (n.includes('tiggo 7')) {
    return 'https://catalogue.automobile.tn/big/2026/04/47615.webp?t=1782724835';
  }
  if (n.includes('tiggo 4')) {
    return 'https://catalogue.automobile.tn/big/2026/06/47647.webp?t=1782726731';
  }
  if (n.includes('tiggo 2')) {
    return 'https://catalogue.automobile.tn/big/2026/04/47617.webp?t=1777544465';
  }
  if (n.includes('icar') || n.includes('i03') || n.includes('i 03')) {
    return 'https://catalogue.automobile.tn/big/2026/04/47620.webp?t=1';
  }
  if (n.includes('arrizo 8') && (n.includes('phev') || n.includes('plug'))) {
    return 'https://catalogue.automobile.tn/big/2026/06/47649.webp?t=1782727426';
  }
  if (n.includes('arrizo 8')) {
    return 'https://catalogue.automobile.tn/big/2026/04/47408.webp?t=1780418724';
  }
  return 'https://catalogue.automobile.tn/big/2026/07/47663.webp?t=1';
};

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  cars,
  commercials,
  reservations,
  accessories = [],
  quotes = [],
  auditLogs = [],
  onClearAuditLogs,
  onDeleteAuditLog,
  onDeleteMultipleAuditLogs,
  onResetDefaultLogs,
  onAddManualLog,
  onUpdateCarStock,
  onUpdateCarPrice,
  onAddColorToCar,
  onEditColor,
  onDeleteColor,
  onEditCarModel,
  onAddCarModel,
  onDeleteCarModel,
  onAddCommercial,
  onUpdateCommercial,
  onUpdateCommercialPassword,
  onDeleteCommercial,
  siteSettings,
  onUpdateSiteSettings,
  stockRequests = [],
  onProcessStockRequest,
  onDeleteStockRequest,
  onImportDatabase,
  onResetToFactoryDefaults,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'inventory' | 'commercials' | 'stock_requests' | 'audit_log' | 'branding' | 'database'>('inventory');
  const [dbImportStatusMsg, setDbImportStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Stock Request Filter State
  const [stockRequestStatusFilter, setStockRequestStatusFilter] = useState<'all' | 'En attente' | 'Approuvé' | 'Refusé'>('all');
  const [stockRequestSearch, setStockRequestSearch] = useState('');

  // Security Guard: Only admins & super_admins can access admin panel
  if (currentUser.role !== 'admin' && currentUser.role !== 'super_admin') {
    return (
      <div className="bg-slate-900 border border-red-800/60 rounded-2xl p-8 text-center max-w-2xl mx-auto my-12 space-y-4 shadow-xl">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto text-red-500">
          <Lock className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-extrabold text-white">Accès Réservé à la Direction & Super Admin (DSI)</h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          Les comptes commerciaux (ex: <strong>{currentUser.name}</strong>) ne sont pas autorisés à accéder aux réglages système, stocks et personnalisation du site.
        </p>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-amber-400 font-medium">
          🔒 Seuls les Administrateurs & Super Admins (DSI) possèdent les droits d'administration globale.
        </div>
      </div>
    );
  }

  // Site Customization Local Form State
  const [logoInput, setLogoInput] = useState(siteSettings?.logoUrl || '');
  const [siteNameInput, setSiteNameInput] = useState(siteSettings?.siteName || 'CHERY Tunisie');
  const [siteSubtitleInput, setSiteSubtitleInput] = useState(siteSettings?.siteSubtitle || 'Système de Réservation, Stocks & Gestion des Accès — Siège STA');
  const [badgeInput, setBadgeInput] = useState(siteSettings?.headerBadgeText || 'Espace Commercial & Direction');
  const [announcementEnabled, setAnnouncementEnabled] = useState(siteSettings?.announcementBanner?.enabled ?? true);
  const [announcementText, setAnnouncementText] = useState(siteSettings?.announcementBanner?.text || '⚡ [Super Admin DSI] Système de réservation opérationnel. Mise à jour automatique des arrivages véhicules en temps réel.');
  const [announcementType, setAnnouncementType] = useState<'info' | 'warning' | 'success' | 'alert'>(siteSettings?.announcementBanner?.type || 'info');
  const [dsiPhone, setDsiPhone] = useState(siteSettings?.dsiContact?.phone || '+216 71 800 990');
  const [dsiEmail, setDsiEmail] = useState(siteSettings?.dsiContact?.email || 'dsi.support@chery.tn');
  const [dsiHours, setDsiHours] = useState(siteSettings?.dsiContact?.supportHours || 'Lun - Ven: 08:00 - 17:30');
  const [dsiAddress, setDsiAddress] = useState(siteSettings?.dsiContact?.address || 'Direction Informatique (DSI) - Siège STA, Zone Industrielle Ben Arous, Tunis');

  // Footer Personalization Local Form State
  const [footerLogoInput, setFooterLogoInput] = useState(siteSettings?.footerLogoUrl || '/sta_logo_white.svg');
  const [footerTitleInput, setFooterTitleInput] = useState(siteSettings?.footerTitle || "STA — Société Tunisienne d'Automobiles");
  const [footerSubtitleInput, setFooterSubtitleInput] = useState(siteSettings?.footerSubtitle || 'Distributeur Officiel & Réseau Agréé');
  const [footerDescriptionInput, setFooterDescriptionInput] = useState(siteSettings?.footerDescription || "Plateforme réservée aux commerciaux & réseau d'agences agréées.");
  const [footerCopyrightInput, setFooterCopyrightInput] = useState(siteSettings?.footerCopyright || "© 2026 STA — Société Tunisienne d'Automobiles. Conçu & Développé par Jamai Mongi. Tous droits réservés.");

  // Bon de Réservation & Printable Documents Logo Customization State
  const [voucherLogoInput, setVoucherLogoInput] = useState(siteSettings?.voucherLogoUrl || '');
  const [voucherCompanyNameInput, setVoucherCompanyNameInput] = useState(siteSettings?.voucherCompanyName || 'CHERY TUNISIE');
  const [voucherCompanySubtitleInput, setVoucherCompanySubtitleInput] = useState(siteSettings?.voucherCompanySubtitle || "Société Tunisienne d'Automobiles (STA)");

  // Background Media Customization State (Home & Global Site)
  const [homeBgType, setHomeBgType] = useState<'image' | 'video'>(
    siteSettings?.homeBackgroundType === 'video' ? 'video' : 'image'
  );
  const [homeBgInput, setHomeBgInput] = useState(siteSettings?.homeBackgroundImageUrl || 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1920&auto=format&fit=crop&q=80');
  const [homeVideoInput, setHomeVideoInput] = useState(siteSettings?.homeBackgroundVideoUrl || '');
  const [homeBgOpacity, setHomeBgOpacity] = useState(siteSettings?.homeBackgroundOverlayOpacity ?? 0.75);
  const [homeBgBlur, setHomeBgBlur] = useState(siteSettings?.homeBackgroundBlur ?? false);

  const [siteBgType, setSiteBgType] = useState<'image' | 'video' | 'none'>(siteSettings?.siteBackgroundType || 'image');
  const [siteBgInput, setSiteBgInput] = useState(siteSettings?.siteBackgroundImageUrl || '/chery_icar03_offroad.jpg');
  const [siteVideoInput, setSiteVideoInput] = useState(siteSettings?.siteBackgroundVideoUrl || '');
  const [siteBgOpacity, setSiteBgOpacity] = useState(siteSettings?.siteBackgroundOverlayOpacity ?? 0.85);
  const [siteBgBlur, setSiteBgBlur] = useState(siteSettings?.siteBackgroundBlur ?? false);

  const [selectedThemeMode, setSelectedThemeMode] = useState<ThemeMode>(siteSettings?.defaultThemeMode || 'dark');

  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [selectedSpecCarAdmin, setSelectedSpecCarAdmin] = useState<CarModel | null>(null);

  // Helper to upload files to /api/upload and receive a clean relative URL
  const uploadMediaFile = async (file: File, defaultDataUrl: string): Promise<string> => {
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, fileData: defaultDataUrl }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.url) {
          return data.url;
        }
      }
    } catch (e) {
      console.warn('[AdminPanel Upload] Impossible de contacter /api/upload, utilisation du fallback.', e);
    }
    return defaultDataUrl;
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      const compressed = await compressImageDataUrl(dataUrl, 600, 600, 0.85);
      const uploadedUrl = await uploadMediaFile(file, compressed);
      setLogoInput(uploadedUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleHomeBgFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      const compressed = await compressImageDataUrl(dataUrl, 1920, 1080, 0.8);
      const uploadedUrl = await uploadMediaFile(file, compressed);
      setHomeBgInput(uploadedUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleHomeVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      const uploadedUrl = await uploadMediaFile(file, dataUrl);
      setHomeVideoInput(uploadedUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSiteBgFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      const compressed = await compressImageDataUrl(dataUrl, 1920, 1080, 0.8);
      const uploadedUrl = await uploadMediaFile(file, compressed);
      setSiteBgInput(uploadedUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSiteVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      const uploadedUrl = await uploadMediaFile(file, dataUrl);
      setSiteVideoInput(uploadedUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleFooterLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      const compressed = await compressImageDataUrl(dataUrl, 800, 400, 0.9);
      const uploadedUrl = await uploadMediaFile(file, compressed);
      setFooterLogoInput(uploadedUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleVoucherLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      const compressed = await compressImageDataUrl(dataUrl, 800, 800, 0.88);
      const uploadedUrl = await uploadMediaFile(file, compressed);
      setVoucherLogoInput(uploadedUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateSiteSettings) return;

    const updated: SiteSettings = {
      logoUrl: logoInput.trim(),
      siteName: siteNameInput.trim(),
      siteSubtitle: siteSubtitleInput.trim(),
      headerBadgeText: badgeInput.trim(),
      announcementBanner: {
        enabled: announcementEnabled,
        text: announcementText.trim(),
        type: announcementType,
      },
      dsiContact: {
        phone: dsiPhone.trim(),
        email: dsiEmail.trim(),
        supportHours: dsiHours.trim(),
        address: dsiAddress.trim(),
      },
      // Personnalisation du Pied de Page (Footer)
      footerLogoUrl: footerLogoInput.trim(),
      footerTitle: footerTitleInput.trim(),
      footerSubtitle: footerSubtitleInput.trim(),
      footerDescription: footerDescriptionInput.trim(),
      footerCopyright: footerCopyrightInput.trim(),

      // Personnalisation du Bon de Réservation & Documents Imprimés
      voucherLogoUrl: voucherLogoInput.trim(),
      voucherCompanyName: voucherCompanyNameInput.trim(),
      voucherCompanySubtitle: voucherCompanySubtitleInput.trim(),

      // Page d'accueil (Choix rôle)
      homeBackgroundType: homeBgType,
      homeBackgroundImageUrl: homeBgInput.trim(),
      homeBackgroundVideoUrl: homeVideoInput.trim(),
      homeBackgroundOverlayOpacity: homeBgOpacity,
      homeBackgroundBlur: homeBgBlur,

      // Espace connecté (Global site workspace)
      siteBackgroundType: siteBgType,
      siteBackgroundImageUrl: siteBgInput.trim(),
      siteBackgroundVideoUrl: siteVideoInput.trim(),
      siteBackgroundOverlayOpacity: siteBgOpacity,
      siteBackgroundBlur: siteBgBlur,

      defaultThemeMode: selectedThemeMode,
    };

    onUpdateSiteSettings(updated);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 4000);
  };

  // New Color Modal State
  const [addingColorCarId, setAddingColorCarId] = useState<string | null>(null);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#1E3A8A');
  const [newColorStock, setNewColorStock] = useState<number>(5);
  const [newColorInterior, setNewColorInterior] = useState('Noir');

  // Edit Color Modal State
  const [editingColorItem, setEditingColorItem] = useState<{ carId: string; color: CarColor } | null>(null);
  const [editColorName, setEditColorName] = useState('');
  const [editColorHex, setEditColorHex] = useState('');
  const [editColorStock, setEditColorStock] = useState<number>(0);
  const [editColorInterior, setEditColorInterior] = useState('');

  // Car Model Edit/Create Modal State
  const [editingCarModel, setEditingCarModel] = useState<CarModel | null>(null);
  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false);
  const [newCarName, setNewCarName] = useState('');
  const [newCarCategory, setNewCarCategory] = useState<CarModel['category']>('SUV');
  const [newCarPrice, setNewCarPrice] = useState<number>(65000);
  const [newCarRequiredDeposit, setNewCarRequiredDeposit] = useState<number>(20000);
  const [newCarEngine, setNewCarEngine] = useState('1.5L Turbo 147 ch');
  const [newCarTransmission, setNewCarTransmission] = useState('Boîte Automatique CVT 9 rapports');
  const [newCarEnergy, setNewCarEnergy] = useState<CarModel['energy']>('Essence');
  const [newCarGuarantee, setNewCarGuarantee] = useState('7 ans ou 200 000 km');
  const [newCarImage, setNewCarImage] = useState('');
  const [newCarDesc, setNewCarDesc] = useState('Modèle moderne équipé des dernières technologies Chery.');
  const [newCarFicheUrl, setNewCarFicheUrl] = useState('');
  
  // Extended Technical Specs state for new car model
  const [newCarPower, setNewCarPower] = useState('147 ch (8 CV Fiscaux)');
  const [newCarConsumption, setNewCarConsumption] = useState('6.8 L/100km');
  const [newCarTorque, setNewCarTorque] = useState('210 Nm @ 1750-4000 tr/min');
  const [newCarDimensions, setNewCarDimensions] = useState('4400 x 1830 x 1670 mm');
  const [newCarBoot, setNewCarBoot] = useState('475 Litres');
  const [newCarMaxSpeed, setNewCarMaxSpeed] = useState('190 km/h');
  const [newCarAcceleration, setNewCarAcceleration] = useState('0-100 km/h en 8.9s');
  const [newCarFeaturesStr, setNewCarFeaturesStr] = useState('Écran Tactile HD 10.25", Chargeur par induction, Toit panoramique, Climatisation Bizone Purifiée N95');
  const [newCarSafetyStr, setNewCarSafetyStr] = useState('6 Airbags, ABS + EBD, ESP Bosch 9.3, Radar de recul 360°, Isofix, Freinage d\'urgence');

  const handleFicheFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      let dataUrl = event.target?.result as string;
      if (file.type.startsWith('image/')) {
        try {
          dataUrl = await compressImageDataUrl(dataUrl, 2400, 2400, 0.88);
        } catch (compErr) {
          console.warn('[Fiche Upload] Fallback sans compression:', compErr);
        }
      }
      const uploadedUrl = await uploadMediaFile(file, dataUrl);
      if (isEditing) {
        setEditingCarModel((prev) => (prev ? {
          ...prev,
          ficheTechniqueUrl: uploadedUrl,
        } : null));
      } else {
        setNewCarFicheUrl(uploadedUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCarImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      let dataUrl = event.target?.result as string;
      if (file.type.startsWith('image/')) {
        try {
          dataUrl = await compressImageDataUrl(dataUrl, 1600, 1200, 0.85);
        } catch (err) {
          console.warn('[Car Photo Upload] Fallback:', err);
        }
      }
      const uploadedUrl = await uploadMediaFile(file, dataUrl);
      if (isEditing) {
        setEditingCarModel((prev) => (prev ? {
          ...prev,
          imageUrl: uploadedUrl,
        } : null));
      } else {
        setNewCarImage(uploadedUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // User Session Permissions Edit State
  const [editingUserPermissions, setEditingUserPermissions] = useState<CommercialUser | null>(null);

  // Password Visibility Toggle State map { userId: boolean }
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // Password Editing State { userId: string | null, name: string, current: string }
  const [editingPasswordUser, setEditingPasswordUser] = useState<{ id: string; name: string; current: string } | null>(null);
  const [inputNewPassword, setInputNewPassword] = useState('');

  // User Profile Edit Modal State
  const [editingUserSession, setEditingUserSession] = useState<CommercialUser | null>(null);

  // Create User Modal State
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserTitle, setNewUserTitle] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('commercial');
  const [newUserAgency, setNewUserAgency] = useState('Chery Agence Tunis Lac 2');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('+216 ');
  const [newUserPassword, setNewUserPassword] = useState('123');
  const [newUserAvatar, setNewUserAvatar] = useState<string>('');
  const [userToDeleteConfirm, setUserToDeleteConfirm] = useState<CommercialUser | null>(null);
  const [userForPhotoModal, setUserForPhotoModal] = useState<CommercialUser | null>(null);
  const newAvatarInputRef = useRef<HTMLInputElement>(null);

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const handleAddColorSubmit = (carId: string) => {
    if (!newColorName.trim() || !newColorHex.trim()) return;

    const newColor: CarColor = {
      id: `col-${Date.now()}`,
      name: newColorName,
      hexCode: newColorHex,
      stock: newColorStock,
      reserved: 0,
      interiorColor: newColorInterior.trim() || 'Noir',
    };

    onAddColorToCar(carId, newColor);
    setAddingColorCarId(null);
    setNewColorName('');
    setNewColorHex('#1E3A8A');
    setNewColorStock(5);
    setNewColorInterior('Noir');
  };

  const handleOpenEditColor = (carId: string, color: CarColor) => {
    setEditingColorItem({ carId, color });
    setEditColorName(color.name);
    setEditColorHex(color.hexCode);
    setEditColorStock(color.stock);
    setEditColorInterior(color.interiorColor || 'Noir');
  };

  const handleSaveEditColor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingColorItem || !onEditColor) return;
    onEditColor(editingColorItem.carId, editingColorItem.color.id, {
      name: editColorName,
      hexCode: editColorHex,
      stock: editColorStock,
      interiorColor: editColorInterior.trim() || 'Noir',
    });
    setEditingColorItem(null);
  };

  const handleSaveUserSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserSession || !onUpdateCommercial) return;
    onUpdateCommercial(editingUserSession);
    setEditingUserSession(null);
  };

  const handleOpenAddCarModal = () => {
    setNewCarName('');
    setNewCarCategory('SUV');
    setNewCarPrice(65000);
    setNewCarRequiredDeposit(20000);
    setNewCarEngine('1.5L Turbo 147 ch');
    setNewCarTransmission('Boîte Automatique CVT 9 rapports');
    setNewCarEnergy('Essence');
    setNewCarGuarantee('7 ans ou 200 000 km');
    setNewCarImage('');
    setNewCarDesc('Modèle moderne équipé des dernières technologies Chery.');
    setNewCarFicheUrl('');
    setIsAddCarModalOpen(true);
  };

  const handleCreateCarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCarName.trim() || !onAddCarModel) return;

    const parsedFeatures = newCarFeaturesStr
      .split(/[,;\n]/)
      .map((f) => f.trim())
      .filter(Boolean);

    const parsedSafety = newCarSafetyStr
      .split(/[,;\n]/)
      .map((s) => s.trim())
      .filter(Boolean);

    // Intelligently resolve the vehicle image: custom image URL or uploaded photo or model preset
    let resolvedImage = newCarImage.trim();
    if (!resolvedImage) {
      if (newCarFicheUrl && (newCarFicheUrl.startsWith('data:image') || /\.(jpg|jpeg|png|webp)/i.test(newCarFicheUrl))) {
        resolvedImage = newCarFicheUrl;
      } else {
        resolvedImage = getCheryModelDefaultPhoto(newCarName, newCarCategory);
      }
    }

    const newCar: CarModel = {
      id: `car-${Date.now()}`,
      name: newCarName.trim(),
      category: newCarCategory,
      priceTND: newCarPrice,
      requiredDepositTND: newCarRequiredDeposit,
      engine: newCarEngine.trim(),
      transmission: newCarTransmission.trim(),
      energy: newCarEnergy,
      guarantee: newCarGuarantee.trim(),
      imageUrl: resolvedImage,
      description: newCarDesc.trim(),
      ficheTechniqueUrl: newCarFicheUrl.trim(),
      powerHP: newCarPower.trim(),
      consumption: newCarConsumption.trim(),
      torque: newCarTorque.trim(),
      dimensions: newCarDimensions.trim(),
      bootCapacity: newCarBoot.trim(),
      maxSpeed: newCarMaxSpeed.trim(),
      acceleration: newCarAcceleration.trim(),
      features: parsedFeatures.length > 0 ? parsedFeatures : ['Climatisation Automatique Dual-Zone', 'Écran Tactile HD 10.25"', 'Jantes Alliage High Spec', 'Caméra de Recul 360°'],
      safetyFeatures: parsedSafety.length > 0 ? parsedSafety : ['6 Airbags', 'ABS + EBD', 'ESP Bosch 9.3', 'Isofix'],
      colors: [
        { id: `col-1-${Date.now()}`, name: 'Blanc Nacré', hexCode: '#F8FAFC', stock: 5, reserved: 0 },
        { id: `col-2-${Date.now()}`, name: 'Gris Minéral', hexCode: '#475569', stock: 4, reserved: 0 },
        { id: `col-3-${Date.now()}`, name: 'Noir Ébène', hexCode: '#090D16', stock: 3, reserved: 0 },
      ],
    };

    onAddCarModel(newCar);
    setIsAddCarModalOpen(false);
    setNewCarName('');
    setNewCarImage('');
    setNewCarPrice(65000);
    setNewCarRequiredDeposit(20000);
  };

  const handleSaveEditCarModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCarModel || !onEditCarModel) return;
    onEditCarModel(editingCarModel);
    setEditingCarModel(null);
  };

  const handleStockChange = (carId: string, colorId: string, delta: number) => {
    const car = cars.find((c) => c.id === carId);
    if (!car) return;

    const updatedColors = car.colors.map((col) => {
      if (col.id === colorId) {
        return {
          ...col,
          stock: Math.max(0, col.stock + delta),
        };
      }
      return col;
    });

    onUpdateCarStock(carId, updatedColors);
  };

  const handleSavePassword = () => {
    if (!editingPasswordUser || !inputNewPassword.trim()) return;
    onUpdateCommercialPassword(editingPasswordUser.id, inputNewPassword.trim());
    setEditingPasswordUser(null);
    setInputNewPassword('');
  };

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword.trim()) return;

    const avatarUrls = [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    ];
    const randomAvatar = avatarUrls[Math.floor(Math.random() * avatarUrls.length)];

    const newUser: CommercialUser = {
      id: `user-${Date.now()}`,
      name: newUserName.trim(),
      title: newUserTitle.trim() || (newUserRole === 'admin' ? 'Administrateur' : 'Commercial'),
      role: newUserRole,
      agency: newUserAgency.trim(),
      email: newUserEmail.trim(),
      phone: newUserPhone.trim(),
      password: newUserPassword.trim(),
      avatar: newUserAvatar.trim() || randomAvatar,
      permissions: newUserRole === 'admin' ? { ...DEFAULT_ADMIN_PERMISSIONS } : { ...DEFAULT_COMMERCIAL_PERMISSIONS },
    };

    onAddCommercial(newUser);
    setIsCreateUserOpen(false);

    // Reset form
    setNewUserName('');
    setNewUserTitle('');
    setNewUserEmail('');
    setNewUserPhone('+216 ');
    setNewUserPassword('123');
    setNewUserAvatar('');
  };

  const superAdminsList = commercials.filter((u) => u.role === 'super_admin');
  const adminsList = commercials.filter((u) => u.role === 'admin');
  const salesList = commercials.filter((u) => u.role === 'commercial' || (!u.role && u.role !== 'admin' && u.role !== 'super_admin'));

  const handleDeleteUserWithConfirm = (targetUser: CommercialUser) => {
    setUserToDeleteConfirm(targetUser);
  };

  const handleExportJSON = () => {
    const payload = {
      savedAt: new Date().toISOString(),
      cars,
      reservations,
      commercials,
      siteSettings,
      accessories: accessories || [],
      quotes: quotes || [],
      stockRequests: stockRequests || [],
    };
    const jsonStr = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chery_database_backup_${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSONFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (onImportDatabase) {
          onImportDatabase(parsed);
          setDbImportStatusMsg({ type: 'success', text: '✅ Base de données importée et synchronisée avec succès dans Cloud & Local !' });
        }
      } catch (err) {
        setDbImportStatusMsg({ type: 'error', text: '❌ Échec d\'importation : Fichier JSON invalide ou corrompu.' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-900 border border-amber-800/40 rounded-2xl p-5 md:p-6 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Espace Administrateur Direction Générale</span>
              </span>
              <span className="text-[11px] text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
                Chery Tunisie • Société Tunisienne Automobile
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Gestion Centralisée des Stocks, Mots de Passe & Paramètres
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              Direction Marketing & Administration STA. Supervisez les disponibilités de stock par modèle et couleur, gérez les comptes commerciaux et personnalisez la plateforme.
            </p>
          </div>

          {/* Quick Database Status Badge */}
          <div className="flex items-center gap-2.5 text-xs text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 px-3.5 py-2 rounded-xl shrink-0 self-start lg:self-center shadow-inner">
            <div className="relative flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute opacity-75"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[11px] text-emerald-200">Base locale & Cloud active</span>
              <span className="text-[10px] text-emerald-400/80 font-mono">/data/db.json • Synchronisée</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Dedicated Admin Navigation Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
          <button
            type="button"
            onClick={() => setActiveAdminTab('inventory')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeAdminTab === 'inventory'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Gestion des Stocks & Couleurs</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              activeAdminTab === 'inventory' ? 'bg-amber-700/80 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {cars.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('commercials')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeAdminTab === 'commercials'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Sessions & Mots de Passe</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              activeAdminTab === 'commercials' ? 'bg-amber-700/80 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {commercials.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('stock_requests')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeAdminTab === 'stock_requests'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Demandes de Quota & Stock</span>
            {stockRequests.filter((r) => r.status === 'En attente').length > 0 ? (
              <span className="px-1.5 py-0.5 bg-rose-600 text-white font-extrabold text-[10px] rounded-full animate-bounce">
                {stockRequests.filter((r) => r.status === 'En attente').length}
              </span>
            ) : (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeAdminTab === 'stock_requests' ? 'bg-blue-700/80 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {stockRequests.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('audit_log')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeAdminTab === 'audit_log'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <History className="w-4 h-4 text-amber-400" />
            <span>Journal d'Audit (Stocks & Tarifs)</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              activeAdminTab === 'audit_log' ? 'bg-amber-700/80 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              10 Dernières
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('branding')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeAdminTab === 'branding'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Personnalisation du Site & Logo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('database')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeAdminTab === 'database'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Base de Données & Backup JSON</span>
          </button>
        </div>
      </div>

      {/* TAB 1: INVENTORY & COLOR MANAGER */}
      {activeAdminTab === 'inventory' && (
        <div className="space-y-6">
          {/* Top Bar for Catalog Management */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Car className="w-5 h-5 text-amber-400" />
                <span>Gestion Complète du Catalogue & Disponibilités Couleurs</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ajustez les prix, les caractéristiques techniques, ajoutez de nouvelles couleurs ou créez de nouveaux modèles Chery.
              </p>
            </div>

            {onAddCarModel && (
              <button
                onClick={handleOpenAddCarModal}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-amber-600/30 flex items-center gap-2 transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau Modèle Chery</span>
              </button>
            )}
          </div>

          {/* Quick Snapshot: Recent Stock & Price Actions */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 shrink-0">
                <History className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Traçabilité & 10 Dernières Actions
                  </h4>
                  <span className="text-[10px] px-2 py-0.2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-semibold">
                    En direct
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {auditLogs.length > 0
                    ? `Dernière action : ${auditLogs[0].actionLabel} par ${auditLogs[0].userName} (${new Date(auditLogs[0].timestamp).toLocaleDateString('fr-FR')} ${new Date(auditLogs[0].timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })})`
                    : "Toutes les modifications de prix et stocks sont enregistrées et consultables dans l'onglet Journal d'Audit."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveAdminTab('audit_log')}
              id="open-audit-log-tab-btn"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-sm"
            >
              <span>Consulter le Journal Complet</span>
              <History className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {cars.map((car) => {
              const isAddingColor = addingColorCarId === car.id;

              return (
                <div
                  key={car.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md space-y-4"
                >
                  {/* Car Header & Model Edit Actions */}
                  <div className="flex items-start justify-between border-b border-slate-800 pb-3 gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        onClick={() => setSelectedSpecCarAdmin(car)}
                        title="Cliquer pour afficher la Fiche Technique Flottante (PDF / Image)"
                        className="relative cursor-pointer group/thumb shrink-0"
                      >
                        <img
                          src={car.imageUrl}
                          alt={car.name}
                          className="w-16 h-12 object-cover rounded-xl border border-slate-700 shadow group-hover/thumb:border-amber-400 transition-all"
                        />
                        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                          <Eye className="w-4 h-4 text-amber-400" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-extrabold text-white">{car.name}</h3>
                          <span className="px-2 py-0.2 bg-slate-800 text-slate-300 font-semibold rounded text-[10px]">
                            {car.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{car.engine} • {car.energy}</p>
                        <p className="text-[11px] text-amber-400 font-semibold">{car.guarantee}</p>
                      </div>
                    </div>

                    {/* Price edit & Car actions */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Prix TTC (TND)</span>
                        <input
                          type="number"
                          step="500"
                          value={car.priceTND}
                          onChange={(e) => onUpdateCarPrice(car.id, Number(e.target.value))}
                          className="w-28 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-amber-400 font-mono font-bold text-right focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                        <span className="text-[10px] text-emerald-400/90 font-mono block text-right mt-0.5">
                          Acompte rec.: {(car.requiredDepositTND ?? 20000).toLocaleString()} DT
                        </span>
                      </div>

                      <div className="flex items-center gap-1 pt-1">
                        {onEditCarModel && (
                          <button
                            onClick={() => setEditingCarModel(car)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                            title="Éditer la fiche modèle"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-[10px]">Éditer</span>
                          </button>
                        )}
                        {onDeleteCarModel && (
                          <button
                            onClick={() => onDeleteCarModel(car.id)}
                            className="p-1.5 bg-slate-950 hover:bg-red-950 text-slate-500 hover:text-red-400 border border-slate-800 rounded-lg text-xs transition-colors cursor-pointer"
                            title="Supprimer ce modèle du catalogue"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Colors List with Live Controls */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                      <span>Stock par Couleur ({car.colors.length} teintes) :</span>
                      <button
                        onClick={() => setAddingColorCarId(isAddingColor ? null : car.id)}
                        className="text-amber-400 hover:text-amber-300 text-xs flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Ajouter une couleur</span>
                      </button>
                    </div>

                    {/* Add New Color Form if open */}
                    {isAddingColor && (
                      <div className="p-3.5 bg-slate-950 border border-amber-500/40 rounded-xl space-y-3">
                        <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                          <Plus className="w-3.5 h-3.5 text-amber-400" />
                          <span>Nouvelle déclinaison couleur extérieure & intérieure :</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-400 block font-semibold mb-0.5">Teinte Extérieure :</label>
                            <input
                              type="text"
                              placeholder="ex: Noir Fantôme"
                              value={newColorName}
                              onChange={(e) => setNewColorName(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block font-semibold mb-0.5">Code Hex / Swatch :</label>
                            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1">
                              <input
                                type="color"
                                value={newColorHex}
                                onChange={(e) => setNewColorHex(e.target.value)}
                                className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                              />
                              <span className="text-xs font-mono text-slate-300">{newColorHex}</span>
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] text-amber-400 block font-semibold mb-0.5">Couleur Intérieur associée :</label>
                            <input
                              type="text"
                              placeholder="ex: Noir, Cuir Marron Cognac"
                              value={newColorInterior}
                              onChange={(e) => setNewColorInterior(e.target.value)}
                              className="w-full bg-slate-900 border border-amber-500/40 rounded-lg px-2.5 py-1.5 text-xs text-amber-200 font-semibold focus:ring-1 focus:ring-amber-500"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block font-semibold mb-0.5">Stock initial :</label>
                            <input
                              type="number"
                              min={0}
                              placeholder="Unités"
                              value={newColorStock}
                              onChange={(e) => setNewColorStock(Number(e.target.value))}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            onClick={() => setAddingColorCarId(null)}
                            className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={() => handleAddColorSubmit(car.id)}
                            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                          >
                            Enregistrer Couleur
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Color Swatch rows with + / - buttons, Edit Color & Delete Color */}
                    <div className="space-y-2">
                      {car.colors.map((color) => (
                        <div
                          key={color.id}
                          className="p-2.5 bg-slate-950 border border-slate-800/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className="w-5 h-5 rounded-full border border-slate-600 shrink-0 shadow-inner"
                              style={{ backgroundColor: color.hexCode }}
                            />
                            <div className="min-w-0">
                              <span className="text-[10px] uppercase tracking-wider font-extrabold text-sky-400 block leading-tight">
                                Couleur Extérieure :
                              </span>
                              <p className="font-bold text-white truncate flex items-center gap-1.5">
                                <span>{color.name}</span>
                                <span className="font-mono text-[10px] text-slate-400">({color.hexCode})</span>
                              </p>
                            </div>
                          </div>

                          {/* Case / Badge Couleur Intérieur associée */}
                          <div className="flex items-center gap-2 bg-slate-900 border border-amber-500/40 px-3 py-1.5 rounded-lg text-xs sm:text-sm text-amber-300 w-fit">
                            <span className="text-slate-300 text-xs font-medium">Couleur Intérieur associée:</span>
                            <span className="font-extrabold text-amber-300 text-xs sm:text-sm">{color.interiorColor || 'Noir'}</span>
                          </div>

                          {/* Controls */}
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg font-mono font-bold">
                              <button
                                onClick={() => handleStockChange(car.id, color.id, -1)}
                                className="px-2 py-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-l-lg transition-colors cursor-pointer"
                              >
                                -
                              </button>
                              <span
                                className={`px-3 py-1 text-xs ${
                                  color.stock === 0 ? 'text-red-400 font-extrabold' : 'text-white'
                                }`}
                              >
                                {color.stock} unit.
                              </span>
                              <button
                                onClick={() => handleStockChange(car.id, color.id, 1)}
                                className="px-2 py-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-r-lg transition-colors cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            {/* Color edit & delete */}
                            {onEditColor && (
                              <button
                                onClick={() => handleOpenEditColor(car.id, color)}
                                className="p-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-800 rounded-lg cursor-pointer"
                                title="Modifier la couleur (Extérieur & Intérieur) & le stock"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {onDeleteColor && (
                              <button
                                onClick={() => onDeleteColor(car.id, color.id)}
                                className="p-1 bg-slate-900 hover:bg-red-950 text-slate-500 hover:text-red-400 border border-slate-800 rounded-lg cursor-pointer"
                                title="Supprimer cette couleur"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SESSIONS & PASSWORDS MANAGEMENT */}
      {activeAdminTab === 'commercials' && (
        <div className="space-y-6">
          {/* Top Bar with Add User Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>Gestion des Sessions & Accès Réseau Chery</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Consultez et modifiez les mots de passe de chaque administrateur et commercial, ou créez de nouvelles sessions d'agences.
              </p>
            </div>

            <button
              onClick={() => setIsCreateUserOpen(true)}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Créer une Nouvelle Session</span>
            </button>
          </div>

          {/* Section 0: Super Administrateurs (DSI & Direction Générale) */}
          <div className="bg-slate-900 border border-purple-500/40 rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></span>
                <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  Sessions Super Administrateur & DSI ({superAdminsList.length})
                </h4>
              </div>
              <span className="text-xs text-purple-300 font-mono font-semibold bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                Mongi Jamaï (Super Admin DSI) & Direction Générale
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {superAdminsList.map((sAdmin) => {
                const isPassVisible = !!visiblePasswords[sAdmin.id];
                const displayPassword = sAdmin.password || 'STA@2026+';
                const isCurrentSelf = currentUser.id === sAdmin.id;

                return (
                  <div
                    key={sAdmin.id}
                    className="bg-slate-950 border border-purple-500/40 rounded-xl p-4 space-y-3 shadow relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-bl-lg font-mono tracking-wider shadow">
                      SUPER ADMIN / DSI
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="relative group cursor-pointer" onClick={() => setUserForPhotoModal(sAdmin)}>
                          <img
                            src={sAdmin.avatar}
                            alt={sAdmin.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-purple-500 shadow group-hover:brightness-75 transition-all"
                          />
                          <div
                            title="Changer la photo de profil / login"
                            className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                          >
                            <Camera className="w-4 h-4 text-purple-400" />
                          </div>
                        </div>
                        <div>
                          <h5 className="font-extrabold text-white text-sm flex items-center gap-1.5">
                            <span>{sAdmin.name}</span>
                            {isCurrentSelf && (
                              <span className="text-[10px] text-purple-300 font-normal bg-purple-500/20 px-1.5 py-0.2 rounded border border-purple-500/30">
                                Vous
                              </span>
                            )}
                          </h5>
                          <p className="text-xs font-semibold text-purple-300">{sAdmin.title || 'Super Administrateur DSI'}</p>
                          <p className="text-[11px] text-slate-400">{sAdmin.agency}</p>
                        </div>
                      </div>

                      {currentUser.role === 'super_admin' && (
                        <div>
                          {!isCurrentSelf ? (
                            <button
                              onClick={() => handleDeleteUserWithConfirm(sAdmin)}
                              className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-500/30 rounded-lg transition-colors cursor-pointer"
                              title="Supprimer ce profil Super Admin (Privilège Mongi Jamaï)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-mono italic">Session active</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-purple-400" /> {sAdmin.email}
                        </span>
                        <span className="text-slate-400 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-purple-400" /> {sAdmin.phone}
                        </span>
                      </div>

                      {/* Password Field with Eye Toggle & Edit */}
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span className="text-slate-400 text-[11px] font-medium">Mot de passe :</span>
                          <span className="font-mono font-bold text-white tracking-wider text-xs">
                            {isPassVisible ? displayPassword : '••••••••'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => togglePasswordVisibility(sAdmin.id)}
                            className="p-1 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                            title={isPassVisible ? 'Masquer' : 'Afficher'}
                          >
                            {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => {
                              setEditingPasswordUser({ id: sAdmin.id, name: sAdmin.name, current: displayPassword });
                              setInputNewPassword(displayPassword);
                            }}
                            className="px-2 py-1 bg-purple-500/20 hover:bg-purple-600 text-purple-200 hover:text-white text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 border border-purple-500/30"
                            title="Réinitialiser / Changer le mot de passe"
                          >
                            <Key className="w-3 h-3" /> Pass
                          </button>
                          <button
                            onClick={() => setEditingUserSession(sAdmin)}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                            title="Modifier les informations de la session"
                          >
                            <Edit2 className="w-3 h-3 text-purple-400" /> Profil
                          </button>
                          <button
                            onClick={() => setEditingUserPermissions(sAdmin)}
                            className="px-2 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                            title="Gérer les permissions et droits d'accès"
                          >
                            <Shield className="w-3 h-3 text-purple-400" /> Droits
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 1: Administrateurs */}
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  Sessions Administration & Direction ({adminsList.length})
                </h4>
              </div>
              <span className="text-xs text-amber-400 font-mono font-semibold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                Direction Commerciale STA & Responsables Réseau
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adminsList.map((admin) => {
                const isPassVisible = !!visiblePasswords[admin.id];
                const displayPassword = admin.password || 'admin';

                return (
                  <div
                    key={admin.id}
                    className="bg-slate-950 border border-amber-500/30 rounded-xl p-4 space-y-3 shadow relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-bl-lg font-mono">
                      ADMIN / DIRECTION
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="relative group cursor-pointer" onClick={() => setUserForPhotoModal(admin)}>
                          <img
                            src={admin.avatar}
                            alt={admin.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-amber-500 shadow group-hover:brightness-75 transition-all"
                          />
                          <div
                            title="Changer la photo de profil / login"
                            className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                          >
                            <Camera className="w-4 h-4 text-amber-400" />
                          </div>
                        </div>
                        <div>
                          <h5 className="font-extrabold text-white text-sm">{admin.name}</h5>
                          <p className="text-xs font-semibold text-amber-300">{admin.title || 'Administrateur'}</p>
                          <p className="text-[11px] text-slate-400">{admin.agency}</p>
                        </div>
                      </div>

                      {/* Admin/Super Admin can delete admin profiles (excluding self) */}
                      {(currentUser.role === 'super_admin' || currentUser.role === 'admin') && (
                        <button
                          onClick={() => handleDeleteUserWithConfirm(admin)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-500/30 rounded-lg transition-colors cursor-pointer"
                          title="Supprimer ce profil Administrateur"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {admin.email}
                        </span>
                        <span className="text-slate-400 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {admin.phone}
                        </span>
                      </div>

                      {/* Password Field with Eye Toggle & Edit */}
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="text-slate-400 text-[11px] font-medium">Mot de passe :</span>
                          <span className="font-mono font-bold text-white tracking-wider text-xs">
                            {isPassVisible ? displayPassword : '••••••••'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => togglePasswordVisibility(admin.id)}
                            className="p-1 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                            title={isPassVisible ? 'Masquer' : 'Afficher'}
                          >
                            {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => {
                              setEditingPasswordUser({ id: admin.id, name: admin.name, current: displayPassword });
                              setInputNewPassword(displayPassword);
                            }}
                            className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                            title="Réinitialiser / Changer le mot de passe"
                          >
                            <Key className="w-3 h-3" /> Pass
                          </button>
                          <button
                            onClick={() => setEditingUserSession(admin)}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                            title="Modifier les informations de la session"
                          >
                            <Edit2 className="w-3 h-3 text-amber-400" /> Profil
                          </button>
                          <button
                            onClick={() => setEditingUserPermissions(admin)}
                            className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                            title="Gérer les permissions et droits d'accès"
                          >
                            <Shield className="w-3 h-3 text-amber-400" /> Droits
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Commerciaux & Agences */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  Sessions Commerciales Agences ({salesList.length})
                </h4>
              </div>
              <span className="text-xs text-slate-400">
                Conseillers commerciaux showroom & agences agréées Chery Tunisie
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {salesList.map((comm) => {
                const commReservations = reservations.filter((r) => r.commercialId === comm.id);
                const isPassVisible = !!visiblePasswords[comm.id];
                const displayPassword = comm.password || '123';

                return (
                  <div
                    key={comm.id}
                    className="bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all rounded-xl p-4 space-y-3 shadow flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="relative group cursor-pointer" onClick={() => setUserForPhotoModal(comm)}>
                            <img
                              src={comm.avatar}
                              alt={comm.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-red-500/60 shadow group-hover:brightness-75 transition-all"
                            />
                            <div
                              title="Changer la photo de login du commercial"
                              className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                            >
                              <Camera className="w-4 h-4 text-red-400" />
                            </div>
                          </div>
                          <div>
                            <h5 className="font-extrabold text-white text-sm">{comm.name}</h5>
                            <p className="text-xs text-slate-400">{comm.agency}</p>
                            <span className="inline-block mt-1 px-2 py-0.2 bg-blue-500/20 text-blue-300 font-mono text-[10px] rounded border border-blue-500/30 font-semibold">
                              COMMERCIAL
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteUserWithConfirm(comm)}
                          className="p-1 text-slate-500 hover:text-red-400 rounded transition-colors cursor-pointer"
                          title="Supprimer la session commerciale"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                        <p className="flex items-center gap-1.5 text-slate-400">
                          <Phone className="w-3 h-3 text-slate-500" /> {comm.phone}
                        </p>
                        <p className="flex items-center gap-1.5 text-slate-400">
                          <Mail className="w-3 h-3 text-slate-500" /> {comm.email}
                        </p>
                        <div className="pt-1 font-bold text-emerald-400 flex justify-between items-center bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800">
                          <span className="text-[11px] text-slate-300">Réservations actives :</span>
                          <span className="font-mono text-xs">{commReservations.length} dossier(s)</span>
                        </div>
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="mt-3 pt-2 border-t border-slate-800/80">
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Lock className="w-3 h-3 text-red-400 shrink-0" />
                          <span className="font-mono font-bold text-white text-xs tracking-wider truncate">
                            {isPassVisible ? displayPassword : '••••••••'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => togglePasswordVisibility(comm.id)}
                            className="p-1 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                            title={isPassVisible ? 'Masquer' : 'Afficher'}
                          >
                            {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => {
                              setEditingPasswordUser({ id: comm.id, name: comm.name, current: displayPassword });
                              setInputNewPassword(displayPassword);
                            }}
                            className="px-2 py-1 bg-slate-800 hover:bg-red-600 text-slate-200 hover:text-white text-[10px] font-bold rounded-md transition-all cursor-pointer flex items-center gap-1"
                            title="Réinitialiser / Changer le mot de passe"
                          >
                            <Key className="w-3 h-3" /> Pass
                          </button>
                          <button
                            onClick={() => setEditingUserSession(comm)}
                            className="px-2 py-1 bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-[10px] font-bold rounded-md transition-all cursor-pointer flex items-center gap-1"
                            title="Modifier le profil commercial"
                          >
                            <Edit2 className="w-3 h-3 text-blue-400" /> Profil
                          </button>
                          <button
                            onClick={() => setEditingUserPermissions(comm)}
                            className="px-2 py-1 bg-slate-800 hover:bg-amber-500 text-slate-200 hover:text-slate-950 text-[10px] font-bold rounded-md transition-all cursor-pointer flex items-center gap-1"
                            title="Gérer les permissions et droits d'accès de ce commercial"
                          >
                            <Shield className="w-3 h-3 text-amber-400" /> Droits
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB: DEMANDES DE QUOTA ET STOCK COMMERCIALES */}
      {activeAdminTab === 'stock_requests' && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-slate-900 border border-blue-800/40 rounded-2xl p-5 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full border border-blue-500/30 flex items-center gap-1">
                  <Megaphone className="w-3.5 h-3.5" /> Espace Direction & Validation des Quotas
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2">
                <Megaphone className="w-6 h-6 text-blue-400" />
                <span>Demandes d'Extension de Quota & Réapprovisionnement Stock</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Validez ou refusez les demandes transmises par les commerciaux lorsque leurs quotas de réservations par modèle sont atteints.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-950 p-2 border border-slate-800 rounded-xl">
              <div className="text-center px-3">
                <span className="block text-2xl font-black text-amber-400">
                  {stockRequests.filter((r) => r.status === 'En attente').length}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-bold">En Attente</span>
              </div>
              <div className="h-8 w-[1px] bg-slate-800" />
              <div className="text-center px-3">
                <span className="block text-2xl font-black text-emerald-400">
                  {stockRequests.filter((r) => r.status === 'Approuvé').length}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Approuvées</span>
              </div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setStockRequestStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  stockRequestStatusFilter === 'all'
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Toutes ({stockRequests.length})
              </button>
              <button
                type="button"
                onClick={() => setStockRequestStatusFilter('En attente')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  stockRequestStatusFilter === 'En attente'
                    ? 'bg-amber-600 text-white shadow'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>En attente ({stockRequests.filter((r) => r.status === 'En attente').length})</span>
              </button>
              <button
                type="button"
                onClick={() => setStockRequestStatusFilter('Approuvé')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  stockRequestStatusFilter === 'Approuvé'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Approuvées ({stockRequests.filter((r) => r.status === 'Approuvé').length})</span>
              </button>
              <button
                type="button"
                onClick={() => setStockRequestStatusFilter('Refusé')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  stockRequestStatusFilter === 'Refusé'
                    ? 'bg-rose-600 text-white shadow'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <X className="w-3.5 h-3.5 text-rose-400" />
                <span>Refusées ({stockRequests.filter((r) => r.status === 'Refusé').length})</span>
              </button>
            </div>

            <div className="w-full sm:w-64">
              <input
                type="text"
                value={stockRequestSearch}
                onChange={(e) => setStockRequestSearch(e.target.value)}
                placeholder="Rechercher commercial ou modèle..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Requests List */}
          {(() => {
            const filteredRequests = stockRequests.filter((req) => {
              const matchesStatus = stockRequestStatusFilter === 'all' || req.status === stockRequestStatusFilter;
              const matchesSearch =
                req.commercialName.toLowerCase().includes(stockRequestSearch.toLowerCase()) ||
                req.carName.toLowerCase().includes(stockRequestSearch.toLowerCase()) ||
                (req.commercialAgency && req.commercialAgency.toLowerCase().includes(stockRequestSearch.toLowerCase()));
              return matchesStatus && matchesSearch;
            });

            if (filteredRequests.length === 0) {
              return (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
                  <Megaphone className="w-12 h-12 mx-auto text-slate-600" />
                  <p className="text-sm font-semibold">Aucune demande de quota / stock trouvée.</p>
                  <p className="text-xs text-slate-500">
                    Les demandes créées par les commerciaux apparaîtront ici pour validation par l'administration.
                  </p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRequests.map((req) => (
                  <div
                    key={req.id}
                    className={`bg-slate-900 border rounded-2xl p-5 space-y-4 shadow-lg transition-all ${
                      req.status === 'En attente'
                        ? 'border-amber-500/60 shadow-amber-950/20'
                        : req.status === 'Approuvé'
                        ? 'border-emerald-500/40'
                        : 'border-slate-800 opacity-80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-white text-sm">{req.commercialName}</span>
                          {req.commercialAgency && (
                            <span className="px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold rounded">
                              {req.commercialAgency}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          ID: <strong className="text-slate-300">{req.id}</strong> • Transmise le {new Date(req.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 shrink-0 ${
                          req.status === 'En attente'
                            ? 'bg-amber-950/80 text-amber-300 border-amber-500/60 animate-pulse'
                            : req.status === 'Approuvé'
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                            : 'bg-rose-950/80 text-rose-300 border-rose-500/50'
                        }`}
                      >
                        {req.status === 'En attente' && <Clock className="w-3.5 h-3.5 text-amber-400" />}
                        {req.status === 'Approuvé' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        {req.status === 'Refusé' && <X className="w-3.5 h-3.5 text-rose-400" />}
                        <span>{req.status}</span>
                      </span>
                    </div>

                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Modèle de véhicule sollicité :</span>
                        <span className="font-extrabold text-red-400 text-sm">{req.carName}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Extension de quota demandée :</span>
                        <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/40 font-black rounded-lg text-xs">
                          +{req.requestedQuantity} Réservations
                        </span>
                      </div>
                      {req.reason && (
                        <div className="pt-2 border-t border-slate-800 text-xs">
                          <span className="text-slate-400 block text-[11px] font-semibold mb-0.5">Motif / Justification :</span>
                          <p className="text-slate-200 italic bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                            "{req.reason}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons for Admin */}
                    {req.status === 'En attente' ? (
                      <div className="flex items-center gap-2 pt-1">
                        {onProcessStockRequest && (
                          <>
                            <button
                              type="button"
                              onClick={() => onProcessStockRequest(req.id, 'Approuvé')}
                              className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-950"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Approuver (+{req.requestedQuantity} Quota)</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onProcessStockRequest(req.id, 'Refusé')}
                              className="py-2 px-3 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                              <span>Refuser</span>
                            </button>
                          </>
                        )}
                        {onDeleteStockRequest && (
                          <button
                            type="button"
                            onClick={() => onDeleteStockRequest(req.id)}
                            className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                            title="Supprimer la demande"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-1 text-xs text-slate-400 border-t border-slate-800/60">
                        <span>
                          Traitée le {req.processedAt ? new Date(req.processedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-'}
                        </span>
                        {onDeleteStockRequest && (
                          <button
                            type="button"
                            onClick={() => onDeleteStockRequest(req.id)}
                            className="text-slate-500 hover:text-red-400 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Supprimer
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 3: BRANDING & SITE CUSTOMIZATION (SUPER ADMIN DSI) */}
      {activeAdminTab === 'branding' && (
        <form onSubmit={handleSaveBranding} className="space-y-6">
          {/* Top Info Header */}
          <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-900 border border-purple-800/40 rounded-2xl p-5 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full border border-purple-500/30 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Espace Dédié — Direction Informatique (DSI)
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2">
                <Palette className="w-6 h-6 text-purple-400" />
                <span>Personnalisation Globale du Site & Logo de la Plateforme</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl">
                Configurez le logo officiel, le nom de l'application, le slogan d'en-tête, le bandeau d'annonce globale en temps réel et les coordonnées du support technique DSI.
              </p>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer les Modifications</span>
            </button>
          </div>

          {/* Success Banner */}
          {saveSuccessMsg && (
            <div className="bg-emerald-950/90 border border-emerald-500/50 rounded-2xl p-4 flex items-center justify-between text-emerald-200 text-sm font-bold shadow-lg animate-fade-in">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-extrabold text-white">Modifications enregistrées avec succès !</p>
                  <p className="text-xs text-emerald-300 font-normal">Le logo et les paramètres du site sont désormais mis à jour sur toutes les sessions.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSaveSuccessMsg(false)}
                className="text-emerald-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PANEL 1: LOGO & APERÇU VISUEL */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <ImageIcon className="w-5 h-5 text-purple-400" />
                <h4 className="font-extrabold text-white text-base">1. Logo du Site & Écusson de Marque</h4>
              </div>

              {/* Logo Live Preview */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">Aperçu en Direct du Logo :</label>
                <div className="grid grid-cols-2 gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800">
                  {/* Dark Mode Preview */}
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex flex-col items-center justify-center gap-2 text-center">
                    <span className="text-[10px] text-slate-400 font-mono uppercase">Thème Sombre</span>
                    <img
                      src={logoInput || cheryLogo}
                      alt="Aperçu Logo"
                      className="w-16 h-16 object-cover rounded-xl border-2 border-red-500/60 shadow-lg shadow-red-950/50"
                    />
                    <span className="text-xs font-bold text-white tracking-tight">{siteNameInput || 'CHERY Tunisie'}</span>
                  </div>

                  {/* Light Mode Preview */}
                  <div className="bg-white p-3 rounded-xl border border-slate-300 flex flex-col items-center justify-center gap-2 text-center text-slate-900">
                    <span className="text-[10px] text-slate-500 font-mono uppercase">Thème Clair</span>
                    <img
                      src={logoInput || cheryLogo}
                      alt="Aperçu Logo"
                      className="w-16 h-16 object-cover rounded-xl border-2 border-red-500/60 shadow-md"
                    />
                    <span className="text-xs font-bold text-slate-900 tracking-tight">{siteNameInput || 'CHERY Tunisie'}</span>
                  </div>
                </div>
              </div>

              {/* Upload File Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">Téléverser une Image de Logo (Fichier local) :</label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 bg-slate-950 border border-dashed border-purple-500/40 hover:border-purple-400 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-all hover:bg-purple-950/20 text-xs text-purple-300 font-bold">
                    <Upload className="w-4 h-4 text-purple-400" />
                    <span>Choisir une Image (PNG, JPG, SVG, WebP)...</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* URL Direct Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Ou saisir une URL Web directe d'image :</label>
                <input
                  type="text"
                  placeholder="https://domaine.com/mon-logo-chery.png"
                  value={logoInput}
                  onChange={(e) => setLogoInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              {/* Reset Logo Button */}
              {logoInput && (
                <button
                  type="button"
                  onClick={() => setLogoInput('')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Réinitialiser au Logo Chery Officiel</span>
                </button>
              )}
            </div>

            {/* PANEL 2: TITRES ET IDENTITÉ DU SITE */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Globe className="w-5 h-5 text-purple-400" />
                <h4 className="font-extrabold text-white text-base">2. Textes d'En-Tête & Identité visuelle</h4>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300 block">Nom Principal du Site :</label>
                  <input
                    type="text"
                    required
                    value={siteNameInput}
                    onChange={(e) => setSiteNameInput(e.target.value)}
                    placeholder="ex: CHERY Tunisie ou STA CHERY AUTOMOBILES"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-extrabold focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300 block">Sous-Titre / Slogan de l'En-Tête :</label>
                  <input
                    type="text"
                    required
                    value={siteSubtitleInput}
                    onChange={(e) => setSiteSubtitleInput(e.target.value)}
                    placeholder="ex: Système de Réservation, Stocks & Gestion des Accès — Siège STA"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300 block">Texte du Badge d'En-Tête (Pilule) :</label>
                  <input
                    type="text"
                    required
                    value={badgeInput}
                    onChange={(e) => setBadgeInput(e.target.value)}
                    placeholder="ex: Espace Commercial & Direction"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* PANEL 3: ÉDITEUR DU LOGO ET PIED DE PAGE (FOOTER) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-5 lg:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                    <Layout className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-base">3. Éditeur du Logo &amp; Pied de Page (Footer)</h4>
                    <p className="text-xs text-slate-400">Personnalisez le logo du bas de page, l'intitulé officiel de la société, le sous-titre et les mentions légales.</p>
                  </div>
                </div>

                {/* Reset to default STA footer */}
                <button
                  type="button"
                  onClick={() => {
                    setFooterLogoInput('/sta_logo_white.svg');
                    setFooterTitleInput("STA — Société Tunisienne d'Automobiles");
                    setFooterSubtitleInput("Distributeur Officiel & Réseau Agréé");
                    setFooterDescriptionInput("Plateforme réservée aux commerciaux & réseau d'agences agréées.");
                    setFooterCopyrightInput("© 2026 STA — Société Tunisienne d'Automobiles. Conçu & Développé par Jamai Mongi. Tous droits réservés.");
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Réinitialiser Footer STA par défaut</span>
                </button>
              </div>

              {/* Live Footer Previews (Dark & Light) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">Aperçu en Direct du Pied de Page (Footer) :</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  {/* Dark Mode Preview */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3 text-slate-200 text-xs shadow-inner">
                    <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Thème Sombre</span>
                    <div className="flex items-center gap-3">
                      <div className="px-2 py-1 rounded bg-black/90 border border-slate-700/60 shadow-sm flex items-center justify-center min-w-[65px]">
                        {footerLogoInput && footerLogoInput !== '/sta_logo_white.svg' && footerLogoInput !== '/sta_logo_dark.svg' && footerLogoInput !== '/sta_logo.svg' ? (
                          <img
                            src={footerLogoInput}
                            alt="Aperçu Footer Logo"
                            className="h-6 w-auto object-contain max-w-[120px]"
                          />
                        ) : (
                          <StaLogo className="h-5 w-auto" variant="white" showText={true} />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-xs text-white truncate">{footerTitleInput || "STA — Société Tunisienne d'Automobiles"}</span>
                        <span className="text-[10px] text-slate-400 truncate">{footerSubtitleInput || "Distributeur Officiel & Réseau Agréé"}</span>
                      </div>
                    </div>
                    <div className="border-t border-slate-800 pt-2 text-[10px] space-y-0.5">
                      <p className="text-slate-400">{footerDescriptionInput || "Plateforme réservée aux commerciaux & réseau d'agences agréées."}</p>
                      <p className="font-medium text-slate-300">{footerCopyrightInput || "© 2026 STA — Société Tunisienne d'Automobiles. Conçu & Développé par Jamai Mongi. Tous droits réservés."}</p>
                    </div>
                  </div>

                  {/* Light Mode Preview */}
                  <div className="bg-slate-100 border border-slate-300 rounded-xl p-4 flex flex-col justify-between gap-3 text-slate-800 text-xs shadow-inner">
                    <span className="text-[10px] text-slate-500 font-mono uppercase font-bold">Thème Clair</span>
                    <div className="flex items-center gap-3">
                      <div className="px-2 py-1 rounded bg-slate-900 border border-slate-800 shadow-sm flex items-center justify-center min-w-[65px]">
                        {footerLogoInput && footerLogoInput !== '/sta_logo_white.svg' && footerLogoInput !== '/sta_logo_dark.svg' && footerLogoInput !== '/sta_logo.svg' ? (
                          <img
                            src={footerLogoInput}
                            alt="Aperçu Footer Logo"
                            className="h-6 w-auto object-contain max-w-[120px]"
                          />
                        ) : (
                          <StaLogo className="h-5 w-auto" variant="white" showText={true} />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-xs text-slate-900 truncate">{footerTitleInput || "STA — Société Tunisienne d'Automobiles"}</span>
                        <span className="text-[10px] text-slate-500 truncate">{footerSubtitleInput || "Distributeur Officiel & Réseau Agréé"}</span>
                      </div>
                    </div>
                    <div className="border-t border-slate-300 pt-2 text-[10px] space-y-0.5">
                      <p className="text-slate-500">{footerDescriptionInput || "Plateforme réservée aux commerciaux & réseau d'agences agréées."}</p>
                      <p className="font-medium text-slate-700">{footerCopyrightInput || "© 2026 STA — Société Tunisienne d'Automobiles. Conçu & Développé par Jamai Mongi. Tous droits réservés."}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logo Upload & URL Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upload Local Logo */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">Téléverser une Image / SVG pour le Logo du Footer :</label>
                  <label className="flex bg-slate-950 border border-dashed border-purple-500/40 hover:border-purple-400 rounded-xl p-3.5 flex items-center justify-center gap-2 cursor-pointer transition-all hover:bg-purple-950/20 text-xs text-purple-300 font-bold">
                    <Upload className="w-4 h-4 text-purple-400" />
                    <span>Choisir un Logo Footer (PNG, JPG, SVG, WebP)...</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFooterLogoFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Direct URL Input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">Ou saisir une URL Web directe du Logo Footer :</label>
                  <input
                    type="text"
                    placeholder="https://.../logo-sta.svg"
                    value={footerLogoInput}
                    onChange={(e) => setFooterLogoInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Quick Presets for Footer Logo */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  Logos Prédéfinis Recommandés pour le Footer (1-Click) :
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFooterLogoInput('/sta_logo_white.svg')}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
                      footerLogoInput === '/sta_logo_white.svg'
                        ? 'border-purple-500 bg-purple-950/30 ring-1 ring-purple-500'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="p-1.5 bg-black rounded-lg border border-slate-700 shrink-0">
                      <StaLogo className="h-4 w-auto" variant="white" showText={false} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Logo STA Blanc (Recommandé)</p>
                      <p className="text-[10px] text-slate-400">Vectoriel SVG Haute Netteté</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFooterLogoInput('/sta_logo_dark.svg')}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
                      footerLogoInput === '/sta_logo_dark.svg'
                        ? 'border-purple-500 bg-purple-950/30 ring-1 ring-purple-500'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="p-1.5 bg-white rounded-lg border border-slate-300 shrink-0">
                      <StaLogo className="h-4 w-auto" variant="dark" showText={false} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Logo STA Dark (Inversé)</p>
                      <p className="text-[10px] text-slate-400">Pour fond clair contrasté</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFooterLogoInput('https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&auto=format&fit=crop&q=80')}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
                      footerLogoInput.includes('photo-1617788138017-80ad40651399')
                        ? 'border-purple-500 bg-purple-950/30 ring-1 ring-purple-500'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&auto=format&fit=crop&q=80"
                        alt="Chery"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Écusson Chery Automobile</p>
                      <p className="text-[10px] text-slate-400">Logo Constructeur</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Text Fields for Footer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">Titre Officiel / Nom de l'Entreprise :</label>
                  <input
                    type="text"
                    value={footerTitleInput}
                    onChange={(e) => setFooterTitleInput(e.target.value)}
                    placeholder="STA — Société Tunisienne d'Automobiles"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">Sous-Titre / Mention Réseau :</label>
                  <input
                    type="text"
                    value={footerSubtitleInput}
                    onChange={(e) => setFooterSubtitleInput(e.target.value)}
                    placeholder="Distributeur Officiel & Réseau Agréé"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">Description / Note d'Accès :</label>
                  <input
                    type="text"
                    value={footerDescriptionInput}
                    onChange={(e) => setFooterDescriptionInput(e.target.value)}
                    placeholder="Plateforme réservée aux commerciaux & réseau d'agences agréées."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">Mention de Copyright &amp; Développement :</label>
                  <input
                    type="text"
                    value={footerCopyrightInput}
                    onChange={(e) => setFooterCopyrightInput(e.target.value)}
                    placeholder="© 2026 STA — Société Tunisienne d'Automobiles. Conçu & Développé par Jamai Mongi. Tous droits réservés."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* PANEL 4: LOGO & EN-TÊTE DU BON DE RÉSERVATION (IMPRESSION & PDF) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-5 lg:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                    <Printer className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-base">4. Logo &amp; En-Tête du Bon de Réservation (Impression &amp; PDF)</h4>
                    <p className="text-xs text-slate-400">Personnalisez le logo affiché sur le Bon de Réservation officiel, les devis imprimés et les documents contractuels.</p>
                  </div>
                </div>

                {/* Reset to default Voucher logo */}
                <button
                  type="button"
                  onClick={() => {
                    setVoucherLogoInput('');
                    setVoucherCompanyNameInput('CHERY TUNISIE');
                    setVoucherCompanySubtitleInput("Société Tunisienne d'Automobiles (STA)");
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Réinitialiser Logo du Bon par défaut</span>
                </button>
              </div>

              {/* Live Voucher Header Preview */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  Aperçu en Direct de l'En-Tête du Bon de Réservation Imprimé :
                </label>
                <div className="p-5 bg-white text-slate-900 rounded-2xl border-2 border-slate-300 shadow-sm space-y-3">
                  <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <img
                          src={voucherLogoInput || logoInput || cheryLogo}
                          alt="Logo Bon de Réservation"
                          className="h-12 w-auto max-w-[150px] object-contain rounded-xl border border-slate-200 shadow-sm p-0.5 bg-white"
                        />
                        <div>
                          <h1 className="text-xl font-black text-slate-900 tracking-tight">
                            {voucherCompanyNameInput || 'CHERY TUNISIE'}
                          </h1>
                          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-600">
                            {voucherCompanySubtitleInput || "Société Tunisienne d'Automobiles (STA)"}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 pt-0.5">
                        STA Direction Générale - Ben Arous / Tunis (Showroom Officiel)
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-md font-mono text-xs font-bold">
                        N° BON : RES-2026-654
                      </span>
                      <p className="text-xs text-slate-500 mt-1">
                        Date : {new Date().toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-xs text-slate-500">
                        Commercial : <strong className="text-slate-800">Mongi Jamaï</strong>
                      </p>
                    </div>
                  </div>

                  <div className="text-center bg-slate-100 p-2 rounded-lg border border-slate-200">
                    <h2 className="text-sm font-black uppercase text-slate-800 tracking-wide">
                      BON DE RÉSERVATION VÉHICULE NEUF
                    </h2>
                  </div>
                </div>
              </div>

              {/* Upload & Direct URL Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upload Local Logo for Voucher */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Téléverser un Nouveau Logo pour le Bon (Fichier local) :
                  </label>
                  <label className="flex bg-slate-950 border border-dashed border-red-500/40 hover:border-red-400 rounded-xl p-3.5 flex items-center justify-center gap-2 cursor-pointer transition-all hover:bg-red-950/20 text-xs text-red-300 font-bold">
                    <Upload className="w-4 h-4 text-red-400" />
                    <span>Choisir une Image de Logo (PNG, JPG, SVG, WebP)...</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleVoucherLogoFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Direct URL Input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Ou saisir une URL Web directe du Logo du Bon :
                  </label>
                  <input
                    type="text"
                    placeholder="https://.../mon-logo-bon.png"
                    value={voucherLogoInput}
                    onChange={(e) => setVoucherLogoInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Presets for Voucher Logo */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-red-400" />
                  Logos Prédéfinis pour le Bon de Réservation (1-Click) :
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setVoucherLogoInput('')}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
                      !voucherLogoInput
                        ? 'border-red-500 bg-red-950/30 ring-1 ring-red-500'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                      <img
                        src={cheryLogo}
                        alt="Chery"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Écusson Chery Original</p>
                      <p className="text-[10px] text-slate-400">Logo Constructeur Officiel</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVoucherLogoInput('/sta_logo.svg')}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
                      voucherLogoInput === '/sta_logo.svg'
                        ? 'border-red-500 bg-red-950/30 ring-1 ring-red-500'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="p-1 bg-white rounded-lg border border-slate-300 shrink-0 w-8 h-8 flex items-center justify-center">
                      <img src="/sta_logo.svg" alt="STA" className="max-h-6 max-w-full object-contain" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Logo STA Officiel</p>
                      <p className="text-[10px] text-slate-400">Vectoriel pour Documents</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVoucherLogoInput('https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&auto=format&fit=crop&q=80')}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
                      voucherLogoInput.includes('photo-1617788138017-80ad40651399')
                        ? 'border-red-500 bg-red-950/30 ring-1 ring-red-500'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&auto=format&fit=crop&q=80"
                        alt="Chery"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Logo Chery Automobile</p>
                      <p className="text-[10px] text-slate-400">Haute Définition</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Text Fields for Voucher Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Titre Principal sur le Bon de Réservation :
                  </label>
                  <input
                    type="text"
                    value={voucherCompanyNameInput}
                    onChange={(e) => setVoucherCompanyNameInput(e.target.value)}
                    placeholder="CHERY TUNISIE"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Sous-Titre / Raison Sociale sur le Bon :
                  </label>
                  <input
                    type="text"
                    value={voucherCompanySubtitleInput}
                    onChange={(e) => setVoucherCompanySubtitleInput(e.target.value)}
                    placeholder="Société Tunisienne d'Automobiles (STA)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>

            {/* PANEL 5: BANDEAU D'ANNONCE GLOBALE */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 justify-between">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-amber-400" />
                  <h4 className="font-extrabold text-white text-base">5. Bandeau d'Annonce Globale en Haut du Site</h4>
                </div>

                {/* Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={announcementEnabled}
                    onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300 block">Message d'Annonce (Diffusé sur toutes les sessions) :</label>
                  <textarea
                    rows={2}
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    placeholder="ex: ⚡ Arrivage spécial : 50 nouveaux véhicules Tiggo 7 Pro disponibles à la réservation !"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300 block">Style / Type du Bandeau :</label>
                  <select
                    value={announcementType}
                    onChange={(e) => setAnnouncementType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 font-semibold"
                  >
                    <option value="info">🔵 Information DSI (Indigo/Bleu)</option>
                    <option value="warning">🟡 Attention / Stock Limité (Ambre)</option>
                    <option value="alert">🔴 Alerte Importante / Urgence (Rouge)</option>
                    <option value="success">🟢 Confirmation / Arrivage Validé (Vert)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* PANEL 5: SUPPORT TECHNIQUE DSI */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h4 className="font-extrabold text-white text-base">5. Coordonnées &amp; Assistance Technique DSI</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300 block flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" /> Téléphone Support :
                  </label>
                  <input
                    type="text"
                    value={dsiPhone}
                    onChange={(e) => setDsiPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300 block flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-emerald-400" /> Email Support DSI :
                  </label>
                  <input
                    type="email"
                    value={dsiEmail}
                    onChange={(e) => setDsiEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300 block flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" /> Horaires Support :
                  </label>
                  <input
                    type="text"
                    value={dsiHours}
                    onChange={(e) => setDsiHours(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300 block flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Adresse Siège / DSI :
                  </label>
                  <input
                    type="text"
                    value={dsiAddress}
                    onChange={(e) => setDsiAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* PANEL 6: ARRIÈRE-PLAN DE LA PAGE D'ACCUEIL (Choix du Rôle / Login) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-6 lg:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Layout className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-base">6. Arrière-Plan de la Page d'Accueil (Choix du Rôle &amp; Connexion)</h4>
                    <p className="text-xs text-slate-400">Choisissez d'afficher la Vidéo HD de l'Événement Chery Tunisie ou une Image personnalisée.</p>
                  </div>
                </div>

                {/* Mode Selector (Vidéo / Image) */}
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
                  <button
                    type="button"
                    onClick={() => setHomeBgType('video')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                      homeBgType === 'video'
                        ? 'bg-red-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" /> Vidéo HD
                  </button>
                  <button
                    type="button"
                    onClick={() => setHomeBgType('image')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                      homeBgType === 'image'
                        ? 'bg-amber-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" /> Image
                  </button>
                </div>
              </div>

              {/* MODE IMAGE */}
              {homeBgType === 'image' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Upload Local Image */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300 block">Téléverser une Image de Fond (Fichier local JPG, PNG, WebP) :</label>
                      <label className="flex bg-slate-950 border border-dashed border-amber-500/40 hover:border-amber-400 rounded-xl p-3.5 flex items-center justify-center gap-2 cursor-pointer transition-all hover:bg-amber-950/20 text-xs text-amber-300 font-bold">
                        <Upload className="w-4 h-4 text-amber-400" />
                        <span>Choisir une Image pour la Page d'Accueil...</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleHomeBgFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Direct URL Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300 block">Ou saisir l'URL directe d'une Image d'Arrière-Plan :</label>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={homeBgInput}
                        onChange={(e) => setHomeBgInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  {/* Preset Automotive Wallpapers */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-white flex items-center gap-1.5 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Galerie de Fonds d'Écran Automobile Haute Définition (1-Click) :
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      {PRESET_AUTOMOTIVE_WALLPAPERS.map((wall) => {
                        const isSelected = homeBgInput === wall.url;
                        return (
                          <button
                            type="button"
                            key={wall.id}
                            onClick={() => setHomeBgInput(wall.url)}
                            className={`group relative rounded-xl overflow-hidden border-2 text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'border-amber-500 ring-2 ring-amber-500/50 scale-[1.02]'
                                : 'border-slate-800 hover:border-slate-600 opacity-80 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={wall.previewUrl}
                              alt={wall.title}
                              className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-1.5 flex flex-col justify-end">
                              <span className="text-[9px] font-bold text-amber-300 uppercase tracking-tight truncate">{wall.category}</span>
                              <span className="text-[10px] font-extrabold text-white truncate">{wall.title}</span>
                            </div>
                            {isSelected && (
                              <div className="absolute top-1 right-1 bg-amber-500 text-slate-950 p-0.5 rounded-full shadow">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* MODE VIDÉO */}
              {homeBgType === 'video' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-red-950/30 border border-red-500/30 rounded-xl p-3 flex items-center gap-3 text-xs text-red-200">
                    <Film className="w-5 h-5 text-red-400 shrink-0" />
                    <div>
                      <p className="font-extrabold text-white">Prise en charge Vidéo YouTube & MP4 Direct</p>
                      <p className="text-[11px] text-red-300">Saisissez un lien YouTube (ex: Chery iCAR 03) ou téléversez un fichier vidéo MP4/WebM local.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Upload Local Video */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300 block">Téléverser un Fichier Vidéo (MP4, WebM) :</label>
                      <label className="flex bg-slate-950 border border-dashed border-red-500/40 hover:border-red-400 rounded-xl p-3.5 flex items-center justify-center gap-2 cursor-pointer transition-all hover:bg-red-950/20 text-xs text-red-300 font-bold">
                        <Upload className="w-4 h-4 text-red-400" />
                        <span>Choisir un Fichier Vidéo MP4...</span>
                        <input
                          type="file"
                          accept="video/mp4,video/webm"
                          onChange={handleHomeVideoFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Direct Video / YouTube URL Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300 block">Ou Lien Web / Vidéo YouTube (ex: https://youtu.be/DdNliUon_Cs) :</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="https://youtu.be/DdNliUon_Cs"
                          value={homeVideoInput}
                          onChange={(e) => setHomeVideoInput(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-red-500 pr-32"
                        />
                        <button
                          type="button"
                          onClick={() => setHomeVideoInput('https://youtu.be/DdNliUon_Cs')}
                          className="absolute right-1.5 top-1.5 px-2.5 py-1 bg-red-600/80 hover:bg-red-600 text-white text-[10px] font-bold rounded-lg transition-colors"
                        >
                          Vidéo Officielle
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Réglages Opacité & Flou */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-amber-400" />
                      Assombrissement du Fond (Lisibilité du Texte) :
                    </label>
                    <span className="font-mono font-bold text-amber-400">{Math.round(homeBgOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.95"
                    step="0.05"
                    value={homeBgOpacity}
                    onChange={(e) => setHomeBgOpacity(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-500">Ajuste le filtre d'obscurité pour garantir la lisibilité optimale des cartes et formulaires.</p>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white block">Effet Flou Artistique (Backdrop Blur)</span>
                    <span className="text-[10px] text-slate-400 block">Floute légèrement l'arrière-plan</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={homeBgBlur}
                    onChange={(e) => setHomeBgBlur(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* PANEL 7: ARRIÈRE-PLAN GLOBAL DU SITE (Espace Connecté / Dashboard Workspace) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-6 lg:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-base">7. Arrière-Plan Global de l'Espace de Travail (Après Connexion)</h4>
                    <p className="text-xs text-slate-400">Appliquez un fond d'écran (Image ou Vidéo) sur l'ensemble de l'application commercial & administration.</p>
                  </div>
                </div>

                {/* Mode Selector (None / Image / Video) */}
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSiteBgType('none')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                      siteBgType === 'none'
                        ? 'bg-purple-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Palette className="w-3.5 h-3.5" /> Couleur / Thème
                  </button>
                  <button
                    type="button"
                    onClick={() => setSiteBgType('image')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                      siteBgType === 'image'
                        ? 'bg-purple-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" /> Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setSiteBgType('video')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                      siteBgType === 'video'
                        ? 'bg-red-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" /> Vidéo HD
                  </button>
                </div>
              </div>

              {/* MODE IMAGE GLOBAL SITE */}
              {siteBgType === 'image' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Upload Local Image */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300 block">Téléverser une Image pour l'Espace de Travail :</label>
                      <label className="flex bg-slate-950 border border-dashed border-purple-500/40 hover:border-purple-400 rounded-xl p-3.5 flex items-center justify-center gap-2 cursor-pointer transition-all hover:bg-purple-950/20 text-xs text-purple-300 font-bold">
                        <Upload className="w-4 h-4 text-purple-400" />
                        <span>Choisir une Image pour l'Espace Connecté...</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleSiteBgFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Direct URL Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300 block">Saisir l'URL directe d'une Image d'Arrière-Plan :</label>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={siteBgInput}
                        onChange={(e) => setSiteBgInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* MODE VIDÉO GLOBAL SITE */}
              {siteBgType === 'video' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Upload Local Video */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300 block">Téléverser une Vidéo pour l'Espace de Travail (MP4, WebM) :</label>
                      <label className="flex bg-slate-950 border border-dashed border-red-500/40 hover:border-red-400 rounded-xl p-3.5 flex items-center justify-center gap-2 cursor-pointer transition-all hover:bg-red-950/20 text-xs text-red-300 font-bold">
                        <Upload className="w-4 h-4 text-red-400" />
                        <span>Choisir une Vidéo MP4...</span>
                        <input
                          type="file"
                          accept="video/mp4,video/webm"
                          onChange={handleSiteVideoFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Direct Video / YouTube URL Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300 block">Lien YouTube ou URL Vidéo Directe :</label>
                      <input
                        type="text"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={siteVideoInput}
                        onChange={(e) => setSiteVideoInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* MODE COULEUR / THÈME */}
              {siteBgType === 'none' && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-3">
                  <Palette className="w-6 h-6 text-purple-400 shrink-0" />
                  <div>
                    <span className="font-extrabold text-white block text-sm">Fond Standard & Thème de Couleur Sélectionné</span>
                    <span>L'espace de travail utilise le thème de couleur actif (Thème Chery Dark, Titanium, Cyan ou Gold) sans image ni vidéo en arrière-plan.</span>
                  </div>
                </div>
              )}

              {/* Réglages Opacité & Flou Site Global */}
              {siteBgType !== 'none' && (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-purple-400" />
                        Assombrissement du Fond Site (Lisibilité) :
                      </label>
                      <span className="font-mono font-bold text-purple-400">{Math.round(siteBgOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="0.95"
                      step="0.05"
                      value={siteBgOpacity}
                      onChange={(e) => setSiteBgOpacity(parseFloat(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-white block">Effet Flou Artistique (Backdrop Blur)</span>
                      <span className="text-[10px] text-slate-400 block">Floute légèrement le fond du site</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={siteBgBlur}
                      onChange={(e) => setSiteBgBlur(e.target.checked)}
                      className="w-4 h-4 accent-purple-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* PANEL 8: THÈMES SPÉCIFIQUES AU DOMAINE AUTOMOBILE */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-5 lg:col-span-2">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Palette className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="font-extrabold text-white text-base">8. Thèmes Visuels Spécifiques au Domaine Automobile</h4>
                  <p className="text-xs text-slate-400">Définissez le thème par défaut appliqué sur le site (Nuit Carbone, Fibre de Carbone, Omoda EV Cyber, Tiggo Gold, Chery Crimson, Showroom Épuré, Titanium High-Tech).</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {AUTOMOTIVE_THEME_DEFINITIONS.map((thm) => {
                  const isSelected = selectedThemeMode === thm.mode;
                  return (
                    <button
                      type="button"
                      key={thm.mode}
                      onClick={() => setSelectedThemeMode(thm.mode)}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'border-amber-500 bg-slate-950 ring-2 ring-amber-500/30 shadow-lg'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider text-white"
                          style={{ backgroundColor: thm.accentHex }}
                        >
                          {thm.badgeTag}
                        </span>
                        {isSelected ? (
                          <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-slate-950">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div
                            className="w-4 h-4 rounded-full border border-white/20"
                            style={{ backgroundColor: thm.bgHex }}
                          />
                        )}
                      </div>

                      <div>
                        <h5 className="font-extrabold text-white text-sm">{thm.name}</h5>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{thm.subtitle}</p>
                      </div>

                      {/* Color Palette Swatches */}
                      <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800/80">
                        <span className="text-[9px] text-slate-500 uppercase font-mono">Palette :</span>
                        <div className="w-3.5 h-3.5 rounded-full border border-white/30" style={{ backgroundColor: thm.bgHex }} title="Arrière-plan principal" />
                        <div className="w-3.5 h-3.5 rounded-full border border-white/30" style={{ backgroundColor: thm.cardBgHex }} title="Fond des cartes" />
                        <div className="w-3.5 h-3.5 rounded-full border border-white/30" style={{ backgroundColor: thm.accentHex }} title="Couleur d'accentuation" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-black text-sm rounded-xl shadow-xl shadow-purple-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-5 h-5" />
              <span>Enregistrer et Appliquer la Personnalisation du Site</span>
            </button>
          </div>
        </form>
      )}

      {/* Modal: Edit Password */}
      {editingPasswordUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <h4 className="font-extrabold text-white text-base">Réinitialiser le Mot de Passe</h4>
              </div>
              <button
                onClick={() => setEditingPasswordUser(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
              <p className="text-xs text-slate-300">
                Changement immédiat du code d'accès pour : <strong className="text-white font-bold">{editingPasswordUser.name}</strong>
              </p>
              <p className="text-[11px] text-amber-400 font-mono">
                Privilège Super Admin & Direction — Synchronisé en direct avec Firestore.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Nouveau Mot de Passe :</label>
              <input
                type="text"
                autoComplete="new-password"
                data-lpignore="true"
                value={inputNewPassword}
                onChange={(e) => setInputNewPassword(e.target.value)}
                placeholder="Entrez le nouveau mot de passe"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-amber-400 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 font-medium">Raccourcis :</span>
                {['STA@2026+', 'Chery2026!', 'STA#Admin1', '123456'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setInputNewPassword(preset)}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono font-semibold rounded border border-slate-700 cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setEditingPasswordUser(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={handleSavePassword}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Enregistrer Mot de Passe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create New User / Session */}
      {isCreateUserOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateUserSubmit}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-red-500" />
                <h4 className="font-extrabold text-white text-base">Créer une Nouvelle Session Client / Admin</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateUserOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Nom & Prénom *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Marwa Frikha"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Rôle de la Session *</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="commercial">Commercial Agence</option>
                  <option value="admin">Administrateur / Direction</option>
                  {currentUser.role === 'super_admin' && (
                    <option value="super_admin">Super Administrateur (DSI)</option>
                  )}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Intitulé / Poste</label>
                <input
                  type="text"
                  placeholder="ex: Commercial Senior ou Directeur"
                  value={newUserTitle}
                  onChange={(e) => setNewUserTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Agence / Affectation *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Chery Agence Lac 2 - Tunis"
                  value={newUserAgency}
                  onChange={(e) => setNewUserAgency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="nom@chery.tn"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Téléphone</label>
                <input
                  type="text"
                  placeholder="+216 22 101 202"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Avatar Upload Field for New User */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={newUserAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=320&auto=format&fit=crop&q=80'}
                  alt="Avatar preview"
                  className="w-12 h-12 rounded-full object-cover border-2 border-red-500 shadow"
                />
                <div>
                  <p className="text-xs font-bold text-white">Photo de Profil / Login</p>
                  <p className="text-[10px] text-slate-400">Téléversez une photo personnalisée pour l'utilisateur</p>
                </div>
              </div>
              <input
                ref={newAvatarInputRef}
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const compressed = await fileToCompressedAvatarDataUrl(file, 320, 0.88);
                      setNewUserAvatar(compressed);
                    } catch (err) {
                      console.error('Error compressing new user avatar:', err);
                    }
                  }
                }}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => newAvatarInputRef.current?.click()}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-red-400" />
                <span>Uploader Photo</span>
              </button>
            </div>

            <div className="pt-1">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300 text-xs block">Mot de Passe d'Accès *</label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  data-lpignore="true"
                  placeholder="Entrez le mot de passe de la session"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-400 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsCreateUserOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/30 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Créer la Session
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Edit Color & Stock */}
      {editingColorItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEditColor}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-amber-400" />
                <h4 className="font-extrabold text-white text-base">Modifier la Couleur & le Stock</h4>
              </div>
              <button
                type="button"
                onClick={() => setEditingColorItem(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Nom de la Couleur :</label>
                <input
                  type="text"
                  required
                  value={editColorName}
                  onChange={(e) => setEditColorName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Code Hexadécimal / Teinte :</label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-2">
                  <input
                    type="color"
                    value={editColorHex}
                    onChange={(e) => setEditColorHex(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
                  />
                  <input
                    type="text"
                    required
                    value={editColorHex}
                    onChange={(e) => setEditColorHex(e.target.value)}
                    className="w-full bg-transparent font-mono text-sm font-bold text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-amber-300 block">
                  Couleur Intérieur associée :
                </label>
                <input
                  type="text"
                  required
                  value={editColorInterior}
                  onChange={(e) => setEditColorInterior(e.target.value)}
                  placeholder="ex: Noir, Cuir Marron Cognac, Rouge Sport"
                  className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-3 py-2 text-amber-100 font-semibold text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Quantité en Stock (Unités) :</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={editColorStock}
                  onChange={(e) => setEditColorStock(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono font-bold text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingColorItem(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Enregistrer Modifications
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Edit Vehicle Model */}
      {editingCarModel && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEditCarModel}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-amber-400" />
                <h4 className="font-extrabold text-white text-base">Éditer Fiche Véhicule : {editingCarModel.name}</h4>
              </div>
              <button
                type="button"
                onClick={() => setEditingCarModel(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Nom du Modèle *</label>
                <input
                  type="text"
                  required
                  value={editingCarModel.name}
                  onChange={(e) => setEditingCarModel({ ...editingCarModel, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Catégorie *</label>
                <select
                  value={editingCarModel.category}
                  onChange={(e) => setEditingCarModel({ ...editingCarModel, category: e.target.value as CarModel['category'] })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold"
                >
                  <option value="SUV">SUV</option>
                  <option value="Berline">Berline</option>
                  <option value="Pick-up">Pick-up (4X4 / 4X2)</option>
                  <option value="Crossover">Crossover</option>
                  <option value="Électrique/Hybride">Électrique / Hybride</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Prix TTC (TND) *</label>
                <input
                  type="number"
                  step="500"
                  required
                  value={editingCarModel.priceTND}
                  onChange={(e) => setEditingCarModel({ ...editingCarModel, priceTND: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Acompte recommandé (TND)</label>
                <input
                  type="number"
                  step="500"
                  value={editingCarModel.requiredDepositTND ?? 20000}
                  onChange={(e) => setEditingCarModel({ ...editingCarModel, requiredDepositTND: Number(e.target.value) })}
                  placeholder="ex: 20000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Motorisation / Puissance</label>
                <input
                  type="text"
                  value={editingCarModel.engine}
                  onChange={(e) => setEditingCarModel({ ...editingCarModel, engine: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Transmission / Boîte *</label>
                <select
                  value={editingCarModel.transmission}
                  onChange={(e) => setEditingCarModel({ ...editingCarModel, transmission: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium"
                >
                  <option value="Boîte Automatique">Boîte Automatique</option>
                  <option value="Boîte Automatique CVT 9 rapports">Boîte Automatique CVT 9 rapports</option>
                  <option value="Boîte Automatique DCT 7 rapports">Boîte Automatique DCT 7 rapports</option>
                  <option value="Boîte Automatique BVA 6 rapports">Boîte Automatique BVA 6 rapports</option>
                  <option value="Boîte Manuelle">Boîte Manuelle</option>
                  <option value="Boîte Manuelle BVM 5 rapports">Boîte Manuelle BVM 5 rapports</option>
                  <option value="Boîte Manuelle BVM 6 rapports">Boîte Manuelle BVM 6 rapports</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Énergie *</label>
                <select
                  value={editingCarModel.energy}
                  onChange={(e) => setEditingCarModel({ ...editingCarModel, energy: e.target.value as CarModel['energy'] })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Essence">Essence</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybride">Hybride</option>
                  <option value="Électrique">Électrique</option>
                </select>
              </div>

              {/* Fiche Technique Upload & Link Section */}
              <div className="sm:col-span-2 p-3 bg-slate-950/90 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-white text-xs uppercase tracking-wider">Fiche Technique & Documentation PDF</span>
                  </div>
                  {editingCarModel.ficheTechniqueUrl && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Fiche Technique Jointe
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Téléverser Fiche Technique (PDF / Image) :</label>
                    <label className="flex items-center justify-center gap-2 p-2.5 bg-slate-900 border border-dashed border-amber-500/40 hover:border-amber-500 rounded-xl cursor-pointer text-xs text-slate-300 transition-colors">
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>Joindre Fiche PDF / Image</span>
                      <input
                        type="file"
                        accept="application/pdf,image/*"
                        onChange={(e) => handleFicheFileUpload(e, true)}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Ou Lien URL Fiche Technique :</label>
                    <input
                      type="url"
                      placeholder="https://...fiche-technique.pdf"
                      value={editingCarModel.ficheTechniqueUrl || ''}
                      onChange={(e) => setEditingCarModel({ ...editingCarModel, ficheTechniqueUrl: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white font-mono"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      💡 Les PDF téléversés sont convertis en flux Blob pour éviter les blocages de sécurité Chrome.
                    </p>
                  </div>
                </div>

                {/* Spécifications Détaillées */}
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-white text-xs uppercase tracking-wider">Spécifications Détaillées (Moteur, Dimensions, Équipements)</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block">Puissance :</label>
                      <input
                        type="text"
                        placeholder="ex: 147 ch (8 CV)"
                        value={editingCarModel.powerHP || ''}
                        onChange={(e) => setEditingCarModel({ ...editingCarModel, powerHP: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block">Consommation :</label>
                      <input
                        type="text"
                        placeholder="ex: 6.8 L/100km"
                        value={editingCarModel.consumption || ''}
                        onChange={(e) => setEditingCarModel({ ...editingCarModel, consumption: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block">Couple Moteur :</label>
                      <input
                        type="text"
                        placeholder="ex: 210 Nm"
                        value={editingCarModel.torque || ''}
                        onChange={(e) => setEditingCarModel({ ...editingCarModel, torque: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block">Vitesse Max :</label>
                      <input
                        type="text"
                        placeholder="ex: 190 km/h"
                        value={editingCarModel.maxSpeed || ''}
                        onChange={(e) => setEditingCarModel({ ...editingCarModel, maxSpeed: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block">Accélération :</label>
                      <input
                        type="text"
                        placeholder="ex: 0-100 km/h en 8.9s"
                        value={editingCarModel.acceleration || ''}
                        onChange={(e) => setEditingCarModel({ ...editingCarModel, acceleration: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block">Dimensions (L x l x h) :</label>
                      <input
                        type="text"
                        placeholder="ex: 4400 x 1830 x 1670 mm"
                        value={editingCarModel.dimensions || ''}
                        onChange={(e) => setEditingCarModel({ ...editingCarModel, dimensions: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-[11px]"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-3">
                      <label className="text-[10px] font-semibold text-slate-400 block">
                        {isPickupCar(editingCarModel) || editingCarModel.category === 'Pick-up' ? 'Charge Utile (Kg / Tonnes) :' : 'Volume du Coffre :'}
                      </label>
                      <input
                        type="text"
                        placeholder={isPickupCar(editingCarModel) || editingCarModel.category === 'Pick-up' ? 'ex: 1050 Kg (Charge Utile)' : 'ex: 475 Litres'}
                        value={editingCarModel.bootCapacity || ''}
                        onChange={(e) => setEditingCarModel({ ...editingCarModel, bootCapacity: e.target.value, payload: (isPickupCar(editingCarModel) || editingCarModel.category === 'Pick-up') ? e.target.value : editingCarModel.payload })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-[11px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">Équipements de Sécurité (séparés par des virgules) :</label>
                      <textarea
                        rows={2}
                        placeholder="ex: 6 Airbags, ABS + EBD, ESP Bosch 9.3, Radar de recul 360"
                        value={(editingCarModel.safetyFeatures || []).join(', ')}
                        onChange={(e) => {
                          const list = e.target.value.split(',').map(s => s.trim());
                          setEditingCarModel({ ...editingCarModel, safetyFeatures: list });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">Équipements de Confort & Multimédia (séparés par des virgules) :</label>
                      <textarea
                        rows={2}
                        placeholder="ex: Écran Tactile HD 10.25, Chargeur par induction, Toit panoramique"
                        value={(editingCarModel.features || []).join(', ')}
                        onChange={(e) => {
                          const list = e.target.value.split(',').map(s => s.trim());
                          setEditingCarModel({ ...editingCarModel, features: list });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-slate-300 block">Garantie Constructeur</label>
                <input
                  type="text"
                  value={editingCarModel.guarantee}
                  onChange={(e) => setEditingCarModel({ ...editingCarModel, guarantee: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="space-y-2 sm:col-span-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-semibold text-slate-200 block text-xs">Photo / Image Principale du Véhicule</label>
                    <p className="text-[10px] text-slate-400">Photo affichée sur le Tableau de bord, le Catalogue et les Devis</p>
                  </div>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold rounded-lg border border-amber-500/40 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Uploader une Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCarImageFileUpload(e, true)}
                      className="hidden"
                    />
                  </label>
                </div>

                {editingCarModel.imageUrl && (
                  <div className="flex items-center gap-3 p-2 bg-slate-900 rounded-lg border border-slate-800">
                    <img
                      src={editingCarModel.imageUrl}
                      alt="Aperçu véhicule"
                      className="w-24 h-16 object-cover rounded-md border border-slate-700 bg-black shrink-0"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://catalogue.automobile.tn/big/2026/07/47663.webp?t=1';
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Photo actuelle enregistrée
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{editingCarModel.imageUrl}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => setEditingCarModel({ ...editingCarModel, imageUrl: getCheryModelDefaultPhoto(editingCarModel.name, editingCarModel.category) })}
                          className="text-[10px] text-amber-400 hover:text-amber-300 underline font-medium"
                        >
                          Réinitialiser avec la photo officielle
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <input
                  type="url"
                  placeholder="https://... ou téléversez une photo"
                  value={editingCarModel.imageUrl}
                  onChange={(e) => setEditingCarModel({ ...editingCarModel, imageUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-slate-300 block">Description Commerciale</label>
                <textarea
                  rows={3}
                  value={editingCarModel.description}
                  onChange={(e) => setEditingCarModel({ ...editingCarModel, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingCarModel(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Enregistrer Véhicule
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Add New Vehicle Model */}
      {isAddCarModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateCarSubmit}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <h4 className="font-extrabold text-white text-base">Ajouter un Nouveau Modèle Chery</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCarModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Nom du Modèle *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Chery Arrizo 8"
                  value={newCarName}
                  onChange={(e) => setNewCarName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Catégorie *</label>
                <select
                  value={newCarCategory}
                  onChange={(e) => setNewCarCategory(e.target.value as CarModel['category'])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold"
                >
                  <option value="SUV">SUV</option>
                  <option value="Berline">Berline</option>
                  <option value="Pick-up">Pick-up (4X4 / 4X2)</option>
                  <option value="Crossover">Crossover</option>
                  <option value="Électrique/Hybride">Électrique / Hybride</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Prix TTC (TND) *</label>
                <input
                  type="number"
                  step="500"
                  required
                  value={newCarPrice}
                  onChange={(e) => setNewCarPrice(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Acompte recommandé (TND)</label>
                <input
                  type="number"
                  step="500"
                  value={newCarRequiredDeposit}
                  onChange={(e) => setNewCarRequiredDeposit(Number(e.target.value))}
                  placeholder="ex: 20000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Motorisation</label>
                <input
                  type="text"
                  value={newCarEngine}
                  onChange={(e) => setNewCarEngine(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Transmission (Boîte de vitesse) *</label>
                <select
                  value={newCarTransmission}
                  onChange={(e) => setNewCarTransmission(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium"
                >
                  <option value="Boîte Automatique">Boîte Automatique</option>
                  <option value="Boîte Automatique CVT 9 rapports">Boîte Automatique CVT 9 rapports</option>
                  <option value="Boîte Automatique DCT 7 rapports">Boîte Automatique DCT 7 rapports</option>
                  <option value="Boîte Automatique BVA 6 rapports">Boîte Automatique BVA 6 rapports</option>
                  <option value="Boîte Manuelle">Boîte Manuelle</option>
                  <option value="Boîte Manuelle BVM 5 rapports">Boîte Manuelle BVM 5 rapports</option>
                  <option value="Boîte Manuelle BVM 6 rapports">Boîte Manuelle BVM 6 rapports</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Énergie *</label>
                <select
                  value={newCarEnergy}
                  onChange={(e) => setNewCarEnergy(e.target.value as CarModel['energy'])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Essence">Essence</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybride">Hybride</option>
                  <option value="Électrique">Électrique</option>
                </select>
              </div>

              {/* Fiche Technique Upload & Specs Section */}
              <div className="sm:col-span-2 p-3 bg-slate-950/90 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-white text-xs uppercase tracking-wider">Fiche Technique & Documents Spécifications</span>
                  </div>
                  {newCarFicheUrl && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Fiche Technique Jointe
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Téléverser Fiche Technique (PDF / Image) :</label>
                    <label className="flex items-center justify-center gap-2 p-2.5 bg-slate-900 border border-dashed border-amber-500/40 hover:border-amber-500 rounded-xl cursor-pointer text-xs text-slate-300 transition-colors">
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>Joindre Fiche PDF / Image</span>
                      <input
                        type="file"
                        accept="application/pdf,image/*"
                        onChange={(e) => handleFicheFileUpload(e, false)}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Ou Lien URL Fiche Technique :</label>
                    <input
                      type="url"
                      placeholder="https://...fiche-technique.pdf"
                      value={newCarFicheUrl}
                      onChange={(e) => setNewCarFicheUrl(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-bold text-white text-[11px] uppercase tracking-wider">Spécifications Détaillées</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block">Puissance :</label>
                      <input
                        type="text"
                        placeholder="ex: 147 ch (8 CV)"
                        value={newCarPower}
                        onChange={(e) => setNewCarPower(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block">Consommation :</label>
                      <input
                        type="text"
                        placeholder="ex: 6.8 L/100km"
                        value={newCarConsumption}
                        onChange={(e) => setNewCarConsumption(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block">Couple Moteur :</label>
                      <input
                        type="text"
                        placeholder="ex: 210 Nm"
                        value={newCarTorque}
                        onChange={(e) => setNewCarTorque(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block">Vitesse Max :</label>
                      <input
                        type="text"
                        placeholder="ex: 190 km/h"
                        value={newCarMaxSpeed}
                        onChange={(e) => setNewCarMaxSpeed(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block">Accélération :</label>
                      <input
                        type="text"
                        placeholder="ex: 0-100 km/h en 8.9s"
                        value={newCarAcceleration}
                        onChange={(e) => setNewCarAcceleration(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block">Dimensions :</label>
                      <input
                        type="text"
                        placeholder="ex: 4400 x 1830 x 1670 mm"
                        value={newCarDimensions}
                        onChange={(e) => setNewCarDimensions(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-[11px]"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-3">
                      <label className="text-[10px] font-semibold text-slate-400 block">
                        {newCarCategory === 'Pick-up' || isPickupCar(newCarName) ? 'Charge Utile (Kg / Tonnes) :' : 'Volume du Coffre :'}
                      </label>
                      <input
                        type="text"
                        placeholder={newCarCategory === 'Pick-up' || isPickupCar(newCarName) ? 'ex: 1050 Kg (Charge Utile)' : 'ex: 475 Litres'}
                        value={newCarBoot}
                        onChange={(e) => setNewCarBoot(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-[11px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">Équipements de Sécurité (séparés par des virgules) :</label>
                      <textarea
                        rows={2}
                        placeholder="6 Airbags, ABS + EBD, ESP Bosch 9.3, Radar de recul 360"
                        value={newCarSafetyStr}
                        onChange={(e) => setNewCarSafetyStr(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">Équipements de Confort & Multimédia (séparés par des virgules) :</label>
                      <textarea
                        rows={2}
                        placeholder="Écran Tactile HD 10.25, Chargeur par induction, Toit panoramique"
                        value={newCarFeaturesStr}
                        onChange={(e) => setNewCarFeaturesStr(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-semibold text-slate-200 block text-xs">Photo / Image Principale du Véhicule</label>
                    <p className="text-[10px] text-slate-400">Photo affichée sur le Tableau de bord, le Catalogue et les Devis</p>
                  </div>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold rounded-lg border border-amber-500/40 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Uploader une Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCarImageFileUpload(e, false)}
                      className="hidden"
                    />
                  </label>
                </div>

                {newCarImage ? (
                  <div className="flex items-center gap-3 p-2 bg-slate-900 rounded-lg border border-slate-800">
                    <img
                      src={newCarImage}
                      alt="Aperçu photo"
                      className="w-24 h-16 object-cover rounded-md border border-slate-700 bg-black shrink-0"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://catalogue.automobile.tn/big/2026/07/47663.webp?t=1';
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Photo prête pour ce véhicule
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{newCarImage}</p>
                      <button
                        type="button"
                        onClick={() => setNewCarImage('')}
                        className="text-[10px] text-red-400 hover:text-red-300 underline font-medium mt-1"
                      >
                        Retirer la photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2 bg-slate-900/60 rounded-lg border border-dashed border-slate-800">
                    <p className="text-[11px] text-slate-400">
                      💡 Aucune photo personnalisée. Par défaut, la photo officielle pour <strong className="text-white">{newCarName || newCarCategory}</strong> sera appliquée.
                    </p>
                    {newCarName && (
                      <button
                        type="button"
                        onClick={() => setNewCarImage(getCheryModelDefaultPhoto(newCarName, newCarCategory))}
                        className="text-[10px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold rounded border border-slate-700 shrink-0"
                      >
                        Appliquer photo Chery
                      </button>
                    )}
                  </div>
                )}

                <input
                  type="url"
                  placeholder="https://... ou téléversez une photo"
                  value={newCarImage}
                  onChange={(e) => setNewCarImage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-slate-300 block">Description Commerciale</label>
                <textarea
                  rows={2}
                  value={newCarDesc}
                  onChange={(e) => setNewCarDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddCarModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Ajouter au Catalogue
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Edit User Session Details */}
      {editingUserSession && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveUserSession}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-amber-400" />
                <h4 className="font-extrabold text-white text-base">Modifier Profil Session : {editingUserSession.name}</h4>
              </div>
              <button
                type="button"
                onClick={() => setEditingUserSession(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Avatar Row in Edit User Modal */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={editingUserSession.avatar}
                  alt={editingUserSession.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-red-500 shadow"
                />
                <div>
                  <p className="text-xs font-bold text-white">Photo de Profil / Login</p>
                  <p className="text-[10px] text-slate-400">Photo utilisée sur l'écran d'accueil et les fiches</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUserForPhotoModal(editingUserSession)}
                className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Changer la photo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Nom & Prénom *</label>
                <input
                  type="text"
                  required
                  value={editingUserSession.name}
                  onChange={(e) => setEditingUserSession({ ...editingUserSession, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Intitulé / Poste</label>
                <input
                  type="text"
                  value={editingUserSession.title || ''}
                  onChange={(e) => setEditingUserSession({ ...editingUserSession, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Rôle *</label>
                <select
                  value={editingUserSession.role}
                  onChange={(e) => setEditingUserSession({ ...editingUserSession, role: e.target.value as UserRole })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold"
                >
                  <option value="commercial">Commercial Agence</option>
                  <option value="admin">Administrateur / Direction</option>
                  {currentUser.role === 'super_admin' && (
                    <option value="super_admin">Super Administrateur (DSI)</option>
                  )}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Agence / Affectation *</label>
                <input
                  type="text"
                  required
                  value={editingUserSession.agency}
                  onChange={(e) => setEditingUserSession({ ...editingUserSession, agency: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Email *</label>
                <input
                  type="email"
                  required
                  value={editingUserSession.email}
                  onChange={(e) => setEditingUserSession({ ...editingUserSession, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Téléphone *</label>
                <input
                  type="text"
                  required
                  value={editingUserSession.phone}
                  onChange={(e) => setEditingUserSession({ ...editingUserSession, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Mot de Passe d'Accès *</label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  data-lpignore="true"
                  value={editingUserSession.password || ''}
                  onChange={(e) => setEditingUserSession({ ...editingUserSession, password: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingUserSession(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Enregistrer Profil
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Edit User Permissions & Rights */}
      {editingUserPermissions && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h4 className="font-extrabold text-white text-base">
                  Gestion des Accès & Permissions : {editingUserPermissions.name}
                </h4>
              </div>
              <button
                onClick={() => setEditingUserPermissions(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-slate-400">Rôle : </span>
                <span className="text-xs font-extrabold text-amber-400 uppercase font-mono">{editingUserPermissions.role}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 text-[11px]">Raccourcis :</span>
                <button
                  type="button"
                  onClick={() => {
                    const updated = { ...editingUserPermissions, permissions: { ...DEFAULT_COMMERCIAL_PERMISSIONS } };
                    setEditingUserPermissions(updated);
                  }}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold rounded-lg cursor-pointer"
                >
                  Preset Commercial
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const updated = { ...editingUserPermissions, permissions: { ...DEFAULT_ADMIN_PERMISSIONS } };
                    setEditingUserPermissions(updated);
                  }}
                  className="px-2 py-1 bg-amber-600/30 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded-lg cursor-pointer"
                >
                  Preset Admin Total
                </button>
              </div>
            </div>

            {/* Permissions Toggles List */}
            <div className="space-y-2.5 text-xs">
              {[
                { key: 'canCreateReservation', label: 'Créer et valider les bons de réservation', desc: 'Permet d\'effectuer des réservations au nom des clients' },
                { key: 'canCancelReservation', label: 'Annuler ou libérer les réservations', desc: 'Permet d\'annuler un dossier actif et remettre les véhicules en stock' },
                { key: 'canEditValidatedReservations', label: 'Modifier la réservation après validation', desc: 'Autorise la modification des informations ou du statut d\'une réservation déjà confirmée/validée' },
                { key: 'canEditPrices', label: 'Modifier les tarifs & prix catalogue', desc: 'Autorise le changement de tarif TTC des véhicules Chery' },
                { key: 'canManageStock', label: 'Gérer les stocks et ajouter des couleurs', desc: 'Permet d\'ajouter/supprimer des couleurs et ajuster les stocks' },
                { key: 'canAccessAdminPanel', label: 'Accès au Panneau d\'Administration et Réseau', desc: 'Donne accès aux données financières et à la gestion du personnel' },
                { key: 'canPrintVouchers', label: 'Impression & Téléchargement des Bons de Réservation', desc: 'Accès à l\'exportation PDF/Imprimante des reçus clients' },
                { key: 'canExportReports', label: 'Exportation des rapports d\'activité et statistiques', desc: 'Autorise le téléchargement des récapitulatifs agences' },
              ].map((perm) => {
                const currentPerms = editingUserPermissions.permissions || (editingUserPermissions.role === 'admin' ? DEFAULT_ADMIN_PERMISSIONS : DEFAULT_COMMERCIAL_PERMISSIONS);
                const isChecked = !!currentPerms[perm.key as keyof UserPermissions];

                return (
                  <label
                    key={perm.key}
                    className={`flex items-start justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-slate-950 border-amber-500/50 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-0.5 pr-3">
                      <p className="font-bold text-white text-xs">{perm.label}</p>
                      <p className="text-[11px] text-slate-400">{perm.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const newPerms = { ...currentPerms, [perm.key]: e.target.checked };
                        const updatedUser = { ...editingUserPermissions, permissions: newPerms };
                        setEditingUserPermissions(updatedUser);
                      }}
                      className="w-4 h-4 mt-1 text-red-600 rounded border-slate-700 focus:ring-red-500 accent-red-600 cursor-pointer"
                    />
                  </label>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingUserPermissions(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Fermer
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onUpdateCommercial) {
                    onUpdateCommercial(editingUserPermissions);
                  }
                  setEditingUserPermissions(null);
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Sauvegarder Permissions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DATABASE & BACKUP JSON */}
      {activeAdminTab === 'database' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30">
                    Auto-Persist & Dynamic Cloud Sync
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-white mt-1 flex items-center gap-2">
                  <Database className="w-6 h-6 text-emerald-400" />
                  <span>Gestion de la Base de Données & Backup JSON</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Toutes vos modifications (modèles de véhicules, prix, couleurs, réservations et comptes) sont automatiquement enregistrées dans <strong>localStorage</strong>, synchronisées dans <strong>/data/db.json</strong> et publiées dans le <strong>Cloud Firebase</strong>.
                </p>
              </div>

              <button
                onClick={handleExportJSON}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Exporter JSON (Backup Complet)</span>
              </button>
            </div>

            {dbImportStatusMsg && (
              <div
                className={`p-4 rounded-xl border text-xs font-bold flex items-center justify-between ${
                  dbImportStatusMsg.type === 'success'
                    ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                    : 'bg-rose-950/80 border-rose-800 text-rose-300'
                }`}
              >
                <span>{dbImportStatusMsg.text}</span>
                <button
                  onClick={() => setDbImportStatusMsg(null)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Sync Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <Server className="w-4 h-4" />
                  <span>Base Cloud Firestore</span>
                </div>
                <p className="text-xs text-slate-300">
                  Synchronisation multi-ordinateurs et multi-domaines (Vercel & Cloud) active en temps réel.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-800/40 w-fit">
                  ✅ Statut: Connecté
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                  <HardDrive className="w-4 h-4" />
                  <span>Storage Navigateur (localStorage)</span>
                </div>
                <p className="text-xs text-slate-300">
                  Sauvegarde automatique continue (Auto-Persist) sur chaque modification locale.
                </p>
                <div className="text-[11px] font-mono text-blue-400 bg-blue-950/40 px-2 py-1 rounded border border-blue-800/40 w-fit">
                  ✅ Persistance Active ({cars.length} véhicules)
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <FileJson className="w-4 h-4" />
                  <span>Base Locale Projet (/data/db.json)</span>
                </div>
                <p className="text-xs text-slate-300">
                  Écriture atomique sécurisée avec fichier de secours (.bak) en cas de coupure.
                </p>
                <div className="text-[11px] font-mono text-amber-400 bg-amber-950/40 px-2 py-1 rounded border border-amber-800/40 w-fit">
                  ✅ Synchronisé
                </div>
              </div>
            </div>

            {/* Import & Restore Section */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-emerald-400" />
                <span>Importer ou Restaurer une Base de Données JSON</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Si vous déployez votre application sur Vercel, changez de navigateur ou souhaitez restaurer une version précédente, chargez ici votre fichier JSON de sauvegarde. Vos modèles, prix, couleurs et réservations seront instantanément mis à jour.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <label className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all">
                  <Upload className="w-4 h-4" />
                  <span>Sélectionner un fichier JSON Backup (Bouton Exporter / Importer JSON)</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleImportJSONFile}
                    className="hidden"
                  />
                </label>

                {onResetToFactoryDefaults && (
                  <button
                    onClick={() => {
                      if (window.confirm("Êtes-vous sûr de vouloir réinitialiser les véhicules aux modèles de série par défaut ?")) {
                        onResetToFactoryDefaults();
                        setDbImportStatusMsg({ type: 'success', text: 'Réinitialisation aux modèles de série effectuée avec succès.' });
                      }
                    }}
                    className="w-full sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-700"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-400" />
                    <span>Réinitialiser aux Modèles de Série</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: AUDIT LOG (10 LAST ACTIONS ON STOCKS & PRICES) */}
      {activeAdminTab === 'audit_log' && (
        <AuditLogViewer
          logs={auditLogs}
          currentUser={currentUser}
          cars={cars}
          onClearLogs={onClearAuditLogs}
          onDeleteLog={onDeleteAuditLog}
          onDeleteMultipleLogs={onDeleteMultipleAuditLogs}
          onResetDefaultLogs={onResetDefaultLogs}
          onAddManualLog={onAddManualLog}
        />
      )}

      {/* Floating Tech Spec Sheet Modal */}
      <TechSpecModal
        car={selectedSpecCarAdmin}
        onClose={() => setSelectedSpecCarAdmin(null)}
      />

      {/* User Photo Upload Modal */}
      {userForPhotoModal && (
        <UserPhotoUploadModal
          user={userForPhotoModal}
          isOpen={true}
          onClose={() => setUserForPhotoModal(null)}
          onSaveAvatar={(newAvatar) => {
            const updated = { ...userForPhotoModal, avatar: newAvatar };
            if (onUpdateCommercial) {
              onUpdateCommercial(updated);
            }
            if (editingUserSession && editingUserSession.id === userForPhotoModal.id) {
              setEditingUserSession(updated);
            }
            setUserForPhotoModal(null);
          }}
        />
      )}

      {/* Modal: Confirmation de Suppression de Session */}
      {userToDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-base">Supprimer la Session</h4>
                  <p className="text-xs text-slate-400">Confirmation de suppression utilisateur</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUserToDeleteConfirm(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {currentUser.id === userToDeleteConfirm.id ? (
              <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Action Impossible</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Vous êtes actuellement connecté avec le profil de <strong className="text-white">{userToDeleteConfirm.name}</strong>. Vous ne pouvez pas supprimer votre propre session en cours d'utilisation.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
                  <img
                    src={userToDeleteConfirm.avatar || 'https://catalogue.automobile.tn/big/2026/04/47408.webp?t=1780418724'}
                    alt={userToDeleteConfirm.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-red-500/60"
                  />
                  <div>
                    <h5 className="font-bold text-white text-sm">{userToDeleteConfirm.name}</h5>
                    <p className="text-xs text-slate-400">{userToDeleteConfirm.agency}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-red-500/20 text-red-300 font-mono text-[10px] rounded border border-red-500/30 uppercase font-bold">
                      {userToDeleteConfirm.role === 'super_admin'
                        ? 'Super Admin DSI'
                        : userToDeleteConfirm.role === 'admin'
                        ? 'Administrateur / Direction'
                        : 'Commercial Agence'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Êtes-vous sûr de vouloir supprimer définitivement la session de <strong className="text-white">{userToDeleteConfirm.name}</strong> ? Cette action est irréversible et supprimera le profil de la base de données.
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setUserToDeleteConfirm(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                Annuler
              </button>
              {currentUser.id !== userToDeleteConfirm.id && (
                <button
                  type="button"
                  onClick={() => {
                    if (onDeleteCommercial) {
                      onDeleteCommercial(userToDeleteConfirm.id);
                    }
                    setUserToDeleteConfirm(null);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Supprimer Définitivement
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

