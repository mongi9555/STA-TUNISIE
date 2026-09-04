import React, { useState, useEffect, useRef } from 'react';
import {
  CarModel,
  CarColor,
  CommercialUser,
  Reservation,
  UploadedDocument,
  ThemeMode,
  SiteSettings,
  KnowledgeBaseItem,
  DocumentTemplateConfig,
  CarAccessory,
  CustomQuote,
  VehicleConfiguration,
  TestDriveAppointment,
  TestDriveStatus,
  StockRequest,
  StockRequestStatus,
  AdministrativeDocument,
  AuditLogEntry,
  AuditActionType,
  UserRole,
} from './types';
import {
  getStoredCars,
  saveStoredCars,
  getStoredReservations,
  saveStoredReservations,
  getStoredCommercials,
  saveStoredCommercials,
  getStoredSiteSettings,
  saveStoredSiteSettings,
  getStoredKnowledgeBase,
  saveStoredKnowledgeBase,
  getStoredDocumentTemplate,
  saveStoredDocumentTemplate,
  getStoredAccessories,
  saveStoredAccessories,
  getStoredQuotes,
  saveStoredQuotes,
  getStoredTestDrives,
  saveStoredTestDrives,
  getStoredStockRequests,
  saveStoredStockRequests,
  getStoredAdminDocuments,
  saveStoredAdminDocuments,
  getStoredAuditLogs,
  saveStoredAuditLogs,
  INITIAL_AUDIT_LOGS,
  INITIAL_COMMERCIALS,
  INITIAL_CARS,
  DEFAULT_SITE_SETTINGS,
  isVirtualCar,
  isDeprecatedCommercialUser,
  getDeletedCarIds,
  saveDeletedCarIds,
} from './data/cheryData';
import {
  db,
  carsCollection,
  reservationsCollection,
  testDrivesCollection,
  commercialsCollection,
  settingsCollection,
  stockRequestsCollection,
  accessoriesCollection,
  quotesCollection,
  adminDocsCollection,
  auditLogsCollection,
  seedInitialDataIfEmpty,
  cleanupVirtualCarsFromFirestore,
  saveCarToFirestore,
  deleteCarFromFirestore,
  saveReservationToFirestore,
  deleteReservationFromFirestore,
  deleteAllReservationsFromFirestore,
  saveTestDriveToFirestore,
  deleteTestDriveFromFirestore,
  saveStockRequestToFirestore,
  deleteStockRequestFromFirestore,
  saveCommercialToFirestore,
  deleteCommercialFromFirestore,
  saveSiteSettingsToFirestore,
  saveAccessoryToFirestore,
  deleteAccessoryFromFirestore,
  saveQuoteToFirestore,
  deleteQuoteFromFirestore,
  saveAdminDocToFirestore,
  deleteAdminDocFromFirestore,
  saveAuditLogToFirestore,
  deleteAuditLogFromFirestore,
  deleteMultipleAuditLogsFromFirestore,
  clearAuditLogsFromFirestore,
  knowledgeBaseCollection,
  saveKnowledgeBaseItemToFirestore,
  deleteKnowledgeBaseItemFromFirestore,
  saveDocTemplateToFirestore,
} from './firebase';
import { evaluateLeasingStatus } from './utils/leasingUtils';
import { onSnapshot, doc } from 'firebase/firestore';
import { Header, AppTab } from './components/Header';
import { StockDashboard } from './components/StockDashboard';
import { CarCatalog } from './components/CarCatalog';
import { ReservationList } from './components/ReservationList';
import { ReservationModal } from './components/ReservationModal';
import { ReservationVoucher } from './components/ReservationVoucher';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { AdminPanel } from './components/AdminPanel';
import { LoginScreen } from './components/LoginScreen';
import { BackgroundMediaRender } from './components/BackgroundMediaRender';
import { KnowledgeBaseManager } from './components/KnowledgeBaseManager';
import { DocumentQuoteCustomizer } from './components/DocumentQuoteCustomizer';
import { AdministrativeDocuments } from './components/AdministrativeDocuments';
import { TestDriveList } from './components/TestDriveList';
import { TestDriveModal } from './components/TestDriveModal';
import { StaLogo } from './components/StaLogo';
import { CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Thème automobile 100% sombre exclusif (aucun thème clair)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('chery_theme') as ThemeMode;
    const lightThemes = ['light', 'nordic_clean', 'pearl_luxury', 'crystal_cyan'];
    if (saved && !lightThemes.includes(saved)) return saved;
    return 'carbon'; // Défaut: Fibre de Carbone Sport (Sombre Haute Précision)
  });

  useEffect(() => {
    const lightThemes = ['light', 'nordic_clean', 'pearl_luxury', 'crystal_cyan'];
    const activeTheme = lightThemes.includes(theme) ? 'carbon' : theme;
    localStorage.setItem('chery_theme', activeTheme);
    localStorage.setItem('chery_theme_mode', 'dark');
    localStorage.setItem('chery_theme_manual', 'true');
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', activeTheme);
      document.documentElement.setAttribute('data-theme-mode', 'dark');
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    }
  }, [theme]);

  // State initialization with localStorage fallback
  const [cars, setCars] = useState<CarModel[]>(() => getStoredCars());
  const [reservations, setReservations] = useState<Reservation[]>(() => getStoredReservations());
  const [commercials, setCommercials] = useState<CommercialUser[]>(() => getStoredCommercials());
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => getStoredSiteSettings());

  // New Personalization Features & Test Drive State
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseItem[]>(() => getStoredKnowledgeBase());
  const [docTemplate, setDocTemplate] = useState<DocumentTemplateConfig>(() => getStoredDocumentTemplate());
  const [accessories, setAccessories] = useState<CarAccessory[]>(() => getStoredAccessories());
  const [quotes, setQuotes] = useState<CustomQuote[]>(() => getStoredQuotes());
  const [testDrives, setTestDrives] = useState<TestDriveAppointment[]>(() => getStoredTestDrives());
  const [stockRequests, setStockRequests] = useState<StockRequest[]>(() => getStoredStockRequests());
  const [adminDocs, setAdminDocs] = useState<AdministrativeDocument[]>(() => getStoredAdminDocuments());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => getStoredAuditLogs());

  const [isDbSynced, setIsDbSynced] = useState<boolean>(false);

  // Active user session state (defaults to null when opening the site to show Home / Role selection)
  const [currentUser, setCurrentUser] = useState<CommercialUser | null>(null);

  // Main Tab Navigation State
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [tabHistory, setTabHistory] = useState<AppTab[]>([]);

  const handleSelectTab = (newTab: AppTab) => {
    if (newTab !== activeTab) {
      setTabHistory((prev) => [...prev, activeTab]);
      setActiveTab(newTab);
    }
  };

  // Modals state
  const [isReservationModalOpen, setIsReservationModalOpen] = useState<boolean>(false);
  const [isTestDriveModalOpen, setIsTestDriveModalOpen] = useState<boolean>(false);
  const [testDrivePreselectedCar, setTestDrivePreselectedCar] = useState<CarModel | null>(null);
  const [configForQuote, setConfigForQuote] = useState<VehicleConfiguration | null>(null);

  const [preselectedCar, setPreselectedCar] = useState<CarModel | null>(null);
  const [preselectedColor, setPreselectedColor] = useState<CarColor | null>(null);

  const [activeVoucher, setActiveVoucher] = useState<Reservation | null>(null);
  const [activeDocument, setActiveDocument] = useState<UploadedDocument | null>(null);

  // Keydown Escape handler for returning to previous page in navigation history
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        // Close active overlay/modal states if open
        if (activeDocument) {
          setActiveDocument(null);
        }
        if (activeVoucher) {
          setActiveVoucher(null);
        }
        if (isReservationModalOpen) {
          setIsReservationModalOpen(false);
        }
        if (isTestDriveModalOpen) {
          setIsTestDriveModalOpen(false);
        }

        // Always navigate back to previous tab in navigation history
        setTabHistory((prevHistory) => {
          if (prevHistory.length > 0) {
            const previousTab = prevHistory[prevHistory.length - 1];
            setActiveTab(previousTab);
            return prevHistory.slice(0, prevHistory.length - 1);
          } else if (activeTab !== 'dashboard') {
            setActiveTab('dashboard');
          }
          return prevHistory;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDocument, activeVoucher, isReservationModalOpen, isTestDriveModalOpen, activeTab]);

  // Current state references for zero-latency, race-free definitive persistence
  const carsRef = useRef(cars); carsRef.current = cars;
  const reservationsRef = useRef(reservations); reservationsRef.current = reservations;
  const commercialsRef = useRef(commercials); commercialsRef.current = commercials;
  const siteSettingsRef = useRef(siteSettings); siteSettingsRef.current = siteSettings;
  const knowledgeBaseRef = useRef(knowledgeBase); knowledgeBaseRef.current = knowledgeBase;
  const docTemplateRef = useRef(docTemplate); docTemplateRef.current = docTemplate;
  const accessoriesRef = useRef(accessories); accessoriesRef.current = accessories;
  const quotesRef = useRef(quotes); quotesRef.current = quotes;
  const testDrivesRef = useRef(testDrives); testDrivesRef.current = testDrives;
  const stockRequestsRef = useRef(stockRequests); stockRequestsRef.current = stockRequests;
  const adminDocsRef = useRef(adminDocs); adminDocsRef.current = adminDocs;
  const auditLogsRef = useRef(auditLogs); auditLogsRef.current = auditLogs;

  // Persistence for Knowledge Base, Docs, Accessories, and Quotes
  const handleSaveKnowledgeBase = (newItems: KnowledgeBaseItem[]) => {
    setKnowledgeBase(newItems);
    saveStoredKnowledgeBase(newItems);
    newItems.forEach((item) => saveKnowledgeBaseItemToFirestore(item));
    triggerInstantDbSave({ knowledgeBase: newItems });
    showToast('Base de Connaissances mise à jour et enregistrée définitivement !');
  };

  const handleSaveDocTemplate = (newConfig: DocumentTemplateConfig) => {
    setDocTemplate(newConfig);
    saveStoredDocumentTemplate(newConfig);
    saveDocTemplateToFirestore(newConfig);
    triggerInstantDbSave({ docTemplate: newConfig });
    showToast('Paramètres des documents et devis mis à jour et synchronisés !');
  };

  const handleSaveAccessories = (newAccessories: CarAccessory[]) => {
    setAccessories(newAccessories);
    saveStoredAccessories(newAccessories);
    newAccessories.forEach((acc) => saveAccessoryToFirestore(acc));
    triggerInstantDbSave({ accessories: newAccessories });
    showToast('Catalogue des accessoires mis à jour et synchronisé dans le cloud & local !');
  };

  const handleSaveQuote = (newQuote: CustomQuote) => {
    const updated = [newQuote, ...quotes.filter((q) => q.id !== newQuote.id)];
    setQuotes(updated);
    saveStoredQuotes(updated);
    saveQuoteToFirestore(newQuote);
    triggerInstantDbSave({ quotes: updated });
    showToast(`Devis ${newQuote.quoteNumber} créé et enregistré dans la base définitivement !`);
  };

  const handleDeleteQuote = (quoteId: string) => {
    const updated = quotes.filter((q) => q.id !== quoteId);
    setQuotes(updated);
    saveStoredQuotes(updated);
    deleteQuoteFromFirestore(quoteId);
    triggerInstantDbSave({ quotes: updated });
    showToast('Devis supprimé définitivement de la base de données');
  };

  const handleConvertQuoteToReservation = (quote: CustomQuote) => {
    const car = cars.find((c) => c.id === quote.config.carId) || cars[0];
    const color = car?.colors.find((col) => col.id === quote.config.colorId) || car?.colors[0];
    setPreselectedCar(car);
    setPreselectedColor(color || null);
    setIsReservationModalOpen(true);
    showToast(`Conversion du devis ${quote.quoteNumber} en réservation...`);
  };


  /**
   * Enregistre instantanément et définitivement l'état dans data/db.json (écriture atomique côté serveur),
   * garantissant que toute modification ou suppression (session commerciale, mot de passe, véhicule, couleur, stock, prix, etc.)
   * est gravée immédiatement sur le disque dans la base locale et synchronisée avec le Cloud.
   */
  const triggerInstantDbSave = (delta?: {
    cars?: CarModel[];
    reservations?: Reservation[];
    commercials?: CommercialUser[];
    siteSettings?: SiteSettings | null;
    accessories?: CarAccessory[];
    quotes?: CustomQuote[];
    adminDocs?: AdministrativeDocument[];
    knowledgeBase?: KnowledgeBaseItem[];
    testDrives?: TestDriveAppointment[];
    stockRequests?: StockRequest[];
    auditLogs?: AuditLogEntry[];
    docTemplate?: DocumentTemplateConfig | null;
  }) => {
    if (delta?.cars) carsRef.current = delta.cars;
    if (delta?.reservations) reservationsRef.current = delta.reservations;
    if (delta?.commercials) commercialsRef.current = delta.commercials;
    if (delta?.siteSettings !== undefined) siteSettingsRef.current = delta.siteSettings;
    if (delta?.accessories) accessoriesRef.current = delta.accessories;
    if (delta?.quotes) quotesRef.current = delta.quotes;
    if (delta?.adminDocs) adminDocsRef.current = delta.adminDocs;
    if (delta?.knowledgeBase) knowledgeBaseRef.current = delta.knowledgeBase;
    if (delta?.testDrives) testDrivesRef.current = delta.testDrives;
    if (delta?.stockRequests) stockRequestsRef.current = delta.stockRequests;
    if (delta?.auditLogs) auditLogsRef.current = delta.auditLogs;
    if (delta?.docTemplate !== undefined) docTemplateRef.current = delta.docTemplate;

    const payload = {
      cars: delta?.cars ?? carsRef.current,
      reservations: delta?.reservations ?? reservationsRef.current,
      commercials: delta?.commercials ?? commercialsRef.current,
      siteSettings: delta?.siteSettings !== undefined ? delta.siteSettings : siteSettingsRef.current,
      accessories: delta?.accessories ?? accessoriesRef.current,
      quotes: delta?.quotes ?? quotesRef.current,
      adminDocs: delta?.adminDocs ?? adminDocsRef.current,
      knowledgeBase: delta?.knowledgeBase ?? knowledgeBaseRef.current,
      testDrives: delta?.testDrives ?? testDrivesRef.current,
      stockRequests: delta?.stockRequests ?? stockRequestsRef.current,
      auditLogs: delta?.auditLogs ?? auditLogsRef.current,
      docTemplate: delta?.docTemplate !== undefined ? delta.docTemplate : docTemplateRef.current,
    };

    setIsDbSynced(true);

    fetch('/api/db/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch((err) => {
      console.warn('[Chery Sync] Erreur sauvegarde atomique /api/db/save:', err);
    });
  };

  // Site Customization Handler
  const handleUpdateSiteSettings = (newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
    saveStoredSiteSettings(newSettings);
    saveSiteSettingsToFirestore(newSettings);
    triggerInstantDbSave({ siteSettings: newSettings });
    showToast("⚡ Paramètres du site et logo enregistrés dans la base de données !");
  };

  // Security guard: redirect commercial users away from admin tab if switched
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin' && currentUser.role !== 'super_admin' && activeTab === 'admin') {
      setActiveTab('dashboard');
      showToast("🔒 Accès restreint : Seule la Direction et le Super Admin (DSI) peuvent accéder aux réglages.");
    }
  }, [currentUser, activeTab]);

  // Success Toast Banner State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  // Firebase Real-time Firestore Sync & Seeding
  useEffect(() => {
    let isMounted = true;
    seedInitialDataIfEmpty().then(() => {
      if (isMounted) setIsDbSynced(true);
    });

    const unsubscribeCars = onSnapshot(carsCollection, (snapshot) => {
      if (!snapshot.empty) {
        const deletedIds = getDeletedCarIds();
        const fetched = snapshot.docs
          .map((doc) => doc.data() as CarModel)
          .filter((car) => !isVirtualCar(car) && !deletedIds.has(car.id));
        if (fetched.length > 0) {
          setCars(fetched);
          saveStoredCars(fetched);
          triggerInstantDbSave({ cars: fetched });
        }
      }
    }, (err) => console.warn('Cars snapshot listener warning:', err));

    const unsubscribeReservations = onSnapshot(reservationsCollection, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => doc.data() as Reservation);
      setReservations(fetched);
      saveStoredReservations(fetched);
      triggerInstantDbSave({ reservations: fetched });
    }, (err) => console.warn('Reservations snapshot listener warning:', err));

    const unsubscribeTestDrives = onSnapshot(testDrivesCollection, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => doc.data() as TestDriveAppointment);
      setTestDrives(fetched);
      saveStoredTestDrives(fetched);
      triggerInstantDbSave({ testDrives: fetched });
    }, (err) => console.warn('TestDrives snapshot listener warning:', err));

    const unsubscribeStockRequests = onSnapshot(stockRequestsCollection, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => doc.data() as StockRequest);
      setStockRequests(fetched);
      saveStoredStockRequests(fetched);
      triggerInstantDbSave({ stockRequests: fetched });
    }, (err) => console.warn('StockRequests snapshot listener warning:', err));

    const unsubscribeCommercials = onSnapshot(commercialsCollection, (snapshot) => {
      if (!snapshot.empty) {
        const fetched = snapshot.docs.map((doc) => doc.data() as CommercialUser);
        const cleanList = fetched.filter((u) => !isDeprecatedCommercialUser(u));
        if (cleanList.length > 0) {
          setCommercials(cleanList);
          saveStoredCommercials(cleanList);
          triggerInstantDbSave({ commercials: cleanList });
        }
      }
    }, (err) => console.warn('Commercials snapshot listener warning:', err));

    const unsubscribeSettings = onSnapshot(doc(db, 'settings', 'site_settings'), (docSnap) => {
      if (docSnap.exists()) {
        const fetchedSettings = docSnap.data() as SiteSettings;
        setSiteSettings(fetchedSettings);
        saveStoredSiteSettings(fetchedSettings);
        triggerInstantDbSave({ siteSettings: fetchedSettings });
      }
    }, (err) => console.warn('Settings snapshot listener warning:', err));

    const unsubscribeDocTemplate = onSnapshot(doc(db, 'settings', 'doc_template'), (docSnap) => {
      if (docSnap.exists()) {
        const fetchedTemplate = docSnap.data() as DocumentTemplateConfig;
        setDocTemplate(fetchedTemplate);
        saveStoredDocumentTemplate(fetchedTemplate);
        triggerInstantDbSave({ docTemplate: fetchedTemplate });
      }
    }, (err) => console.warn('DocTemplate snapshot listener warning:', err));

    const unsubscribeAccessories = onSnapshot(accessoriesCollection, (snapshot) => {
      if (!snapshot.empty) {
        const fetched = snapshot.docs.map((doc) => doc.data() as CarAccessory);
        setAccessories(fetched);
        saveStoredAccessories(fetched);
        triggerInstantDbSave({ accessories: fetched });
      }
    }, (err) => console.warn('Accessories snapshot listener warning:', err));

    const unsubscribeQuotes = onSnapshot(quotesCollection, (snapshot) => {
      if (!snapshot.empty) {
        const fetched = snapshot.docs.map((doc) => doc.data() as CustomQuote);
        setQuotes(fetched);
        saveStoredQuotes(fetched);
        triggerInstantDbSave({ quotes: fetched });
      }
    }, (err) => console.warn('Quotes snapshot listener warning:', err));

    const unsubscribeAdminDocs = onSnapshot(adminDocsCollection, (snapshot) => {
      if (!snapshot.empty) {
        const fetched = snapshot.docs.map((doc) => doc.data() as AdministrativeDocument);
        setAdminDocs(fetched);
        saveStoredAdminDocuments(fetched);
        triggerInstantDbSave({ adminDocs: fetched });
      }
    }, (err) => console.warn('Admin docs snapshot listener warning:', err));

    const unsubscribeKnowledgeBase = onSnapshot(knowledgeBaseCollection, (snapshot) => {
      if (!snapshot.empty) {
        const fetched = snapshot.docs.map((doc) => doc.data() as KnowledgeBaseItem);
        setKnowledgeBase(fetched);
        saveStoredKnowledgeBase(fetched);
        triggerInstantDbSave({ knowledgeBase: fetched });
      }
    }, (err) => console.warn('Knowledge base snapshot listener warning:', err));

    const unsubscribeAuditLogs = onSnapshot(auditLogsCollection, (snapshot) => {
      const fetched = snapshot.docs
        .map((doc) => doc.data() as AuditLogEntry)
        .filter((l) => l && l.id && !l.id.startsWith('audit-log-'));
      fetched.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setAuditLogs(fetched);
      saveStoredAuditLogs(fetched);
      triggerInstantDbSave({ auditLogs: fetched });
    }, (err) => console.warn('Audit logs snapshot listener warning:', err));

    return () => {
      isMounted = false;
      unsubscribeCars();
      unsubscribeReservations();
      unsubscribeTestDrives();
      unsubscribeStockRequests();
      unsubscribeCommercials();
      unsubscribeSettings();
      unsubscribeDocTemplate();
      unsubscribeAccessories();
      unsubscribeQuotes();
      unsubscribeAdminDocs();
      unsubscribeKnowledgeBase();
      unsubscribeAuditLogs();
    };
  }, []);

  // Sync state changes with localStorage backup
  useEffect(() => {
    saveStoredCars(cars);
  }, [cars]);

  useEffect(() => {
    saveStoredReservations(reservations);
  }, [reservations]);

  useEffect(() => {
    saveStoredTestDrives(testDrives);
  }, [testDrives]);

  useEffect(() => {
    saveStoredStockRequests(stockRequests);
  }, [stockRequests]);

  useEffect(() => {
    saveStoredCommercials(commercials);
  }, [commercials]);

  useEffect(() => {
    saveStoredSiteSettings(siteSettings);

    // Dynamically update browser tab Favicon
    const faviconHref = siteSettings?.faviconUrl || '/favicon.svg';
    let iconLink = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!iconLink) {
      iconLink = document.createElement('link');
      iconLink.rel = 'icon';
      document.head.appendChild(iconLink);
    }
    iconLink.href = faviconHref;

    // Update alternate / apple touch icons
    const alternateIcon = document.querySelector("link[rel='alternate icon']") as HTMLLinkElement | null;
    if (alternateIcon) {
      alternateIcon.href = faviconHref;
    }
    const appleTouchIcon = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement | null;
    if (appleTouchIcon) {
      appleTouchIcon.href = faviconHref;
    }

    // Dynamically update document title if custom site name provided
    if (siteSettings?.siteName) {
      document.title = `${siteSettings.siteName} - Réservation & Gestion de Stock`;
    }
  }, [siteSettings]);

  useEffect(() => {
    saveStoredAdminDocuments(adminDocs);
  }, [adminDocs]);

  useEffect(() => {
    saveStoredAuditLogs(auditLogs);
  }, [auditLogs]);

  // Admin Documents Handlers
  const handleAddAdminDocument = (newDoc: AdministrativeDocument) => {
    const updated = [newDoc, ...adminDocs.filter((d) => d.id !== newDoc.id)];
    setAdminDocs(updated);
    saveStoredAdminDocuments(updated);
    saveAdminDocToFirestore(newDoc);
    triggerInstantDbSave({ adminDocs: updated });
    showToast(`Document "${newDoc.title}" ajouté avec succès !`);
  };

  const handleDeleteAdminDocument = (docId: string) => {
    const updated = adminDocs.filter((d) => d.id !== docId);
    setAdminDocs(updated);
    saveStoredAdminDocuments(updated);
    deleteAdminDocFromFirestore(docId);
    triggerInstantDbSave({ adminDocs: updated });
    showToast('Document administratif supprimé.');
  };

  const isDbLoadedRef = useRef(false);

  // Initialisation stable depuis le fichier de persistance locale data/db.json
  useEffect(() => {
    fetch('/api/db')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data && data.exists) {
          const deletedIds = getDeletedCarIds();
          if (Array.isArray(data.cars) && data.cars.length > 0) {
            const cleanCars = data.cars.filter((c: CarModel) => !isVirtualCar(c) && !deletedIds.has(c.id));
            if (cleanCars.length > 0) {
              setCars(cleanCars);
              saveStoredCars(cleanCars);
            }
          }
          if (Array.isArray(data.reservations)) {
            setReservations(data.reservations);
            saveStoredReservations(data.reservations);
          }
          if (Array.isArray(data.commercials) && data.commercials.length > 0) {
            const cleanComms = data.commercials.filter((u: CommercialUser) => !isDeprecatedCommercialUser(u));
            if (cleanComms.length > 0) {
              setCommercials(cleanComms);
              saveStoredCommercials(cleanComms);
            }
          }
          if (data.siteSettings) {
            setSiteSettings(data.siteSettings);
            saveStoredSiteSettings(data.siteSettings);
          }
          if (Array.isArray(data.adminDocs)) {
            setAdminDocs(data.adminDocs);
            saveStoredAdminDocuments(data.adminDocs);
          }
          if (Array.isArray(data.knowledgeBase)) {
            setKnowledgeBase(data.knowledgeBase);
            saveStoredKnowledgeBase(data.knowledgeBase);
          }
          if (Array.isArray(data.accessories)) {
            setAccessories(data.accessories);
            saveStoredAccessories(data.accessories);
          }
          if (Array.isArray(data.quotes)) {
            setQuotes(data.quotes);
            saveStoredQuotes(data.quotes);
          }
          if (Array.isArray(data.testDrives)) {
            setTestDrives(data.testDrives);
            saveStoredTestDrives(data.testDrives);
          }
          if (Array.isArray(data.stockRequests)) {
            setStockRequests(data.stockRequests);
            saveStoredStockRequests(data.stockRequests);
          }
          if (data.docTemplate) {
            setDocTemplate(data.docTemplate);
            saveStoredDocumentTemplate(data.docTemplate);
          }
          if (Array.isArray(data.auditLogs)) {
            setAuditLogs(data.auditLogs);
            saveStoredAuditLogs(data.auditLogs);
          }
          console.log('[Chery Local DB] Données stables chargées avec succès depuis data/db.json');
        }
      })
      .catch((err) => console.log('[Chery Local DB] Synchronisation active:', err))
      .finally(() => {
        isDbLoadedRef.current = true;
      });
  }, []);

  // Enregistrement manuel contrôlé de la base sans cycle de mise à jour intempestif
  const handleManualSaveDatabase = async () => {
    try {
      saveStoredCars(cars);
      saveStoredReservations(reservations);
      saveStoredCommercials(commercials);
      if (siteSettings) saveStoredSiteSettings(siteSettings);
      saveStoredAccessories(accessories);
      saveStoredQuotes(quotes);
      saveStoredAdminDocuments(adminDocs);
      saveStoredKnowledgeBase(knowledgeBase);
      saveStoredTestDrives(testDrives);
      saveStoredStockRequests(stockRequests);
      saveStoredAuditLogs(auditLogs);
      if (docTemplate) saveStoredDocumentTemplate(docTemplate);

      triggerInstantDbSave();

      cars.forEach((car) => saveCarToFirestore(car));
      if (siteSettings) saveSiteSettingsToFirestore(siteSettings);
      commercials.forEach((user) => saveCommercialToFirestore(user));
      if (docTemplate) saveDocTemplateToFirestore(docTemplate);
      accessories.forEach((a) => saveAccessoryToFirestore(a));
      quotes.forEach((q) => saveQuoteToFirestore(q));
      adminDocs.forEach((d) => saveAdminDocToFirestore(d));
      knowledgeBase.forEach((k) => saveKnowledgeBaseItemToFirestore(k));

      showToast('✓ Modifications enregistrées avec succès et définitivement dans la base de données !');
    } catch (err) {
      showToast('✓ Données enregistrées dans le cache local');
    }
  };

  // Audit Log Management Helpers
  const addAuditLog = (entry: {
    actionType: AuditActionType;
    actionLabel: string;
    details: string;
    userId?: string;
    userName?: string;
    userRole?: UserRole;
    userAgency?: string;
    targetCarId?: string;
    targetCarName?: string;
    targetColorName?: string;
    previousValue?: string | number;
    newValue?: string | number;
    ipOrDevice?: string;
  }) => {
    const newLog: AuditLogEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString(),
      userId: entry.userId || currentUser?.id || 'STA_SYSTEM',
      userName: entry.userName || currentUser?.name || 'Administrateur',
      userRole: entry.userRole || currentUser?.role || 'admin',
      userAgency: entry.userAgency || currentUser?.agency || 'Direction STA',
      actionType: entry.actionType,
      actionLabel: entry.actionLabel,
      details: entry.details,
      targetCarId: entry.targetCarId,
      targetCarName: entry.targetCarName,
      targetColorName: entry.targetColorName,
      previousValue: entry.previousValue,
      newValue: entry.newValue,
      ipOrDevice: entry.ipOrDevice,
    };

    const updated = [newLog, ...auditLogs];
    setAuditLogs(updated);
    saveStoredAuditLogs(updated);
    saveAuditLogToFirestore(newLog);
    triggerInstantDbSave({ auditLogs: updated });
  };

  const handleClearAuditLogs = () => {
    setAuditLogs([]);
    saveStoredAuditLogs([]);
    clearAuditLogsFromFirestore();
    triggerInstantDbSave({ auditLogs: [] });
    showToast("Journal d'audit réinitialisé.");
  };

  const handleDeleteAuditLog = (logId: string) => {
    const updated = auditLogs.filter((l) => l.id !== logId);
    setAuditLogs(updated);
    saveStoredAuditLogs(updated);
    deleteAuditLogFromFirestore(logId);
    triggerInstantDbSave({ auditLogs: updated });
    showToast("Action d'audit supprimée.");
  };

  const handleDeleteMultipleAuditLogs = (logIds: string[]) => {
    const updated = auditLogs.filter((l) => !logIds.includes(l.id));
    setAuditLogs(updated);
    saveStoredAuditLogs(updated);
    deleteMultipleAuditLogsFromFirestore(logIds);
    triggerInstantDbSave({ auditLogs: updated });
    showToast(`${logIds.length} enregistrement(s) d'audit supprimé(s).`);
  };

  const handleResetDefaultLogs = () => {
    setAuditLogs(INITIAL_AUDIT_LOGS);
    saveStoredAuditLogs(INITIAL_AUDIT_LOGS);
    INITIAL_AUDIT_LOGS.forEach((log) => {
      saveAuditLogToFirestore(log);
    });
    triggerInstantDbSave({ auditLogs: INITIAL_AUDIT_LOGS });
    showToast("Journal d'audit synchronisé.");
  };

  // Handler: Open Reservation Modal
  const handleOpenReservationModal = (car?: CarModel, color?: CarColor) => {
    setPreselectedCar(car || null);
    setPreselectedColor(color || null);
    setIsReservationModalOpen(true);
  };

  // Handler: Save New Reservation & Automatically Decrement Stock for the chosen color
  const handleSaveReservation = (newReservation: Reservation) => {
    // 1. Add to reservation list in Firestore & state
    const updatedReservations = [newReservation, ...reservations];
    setReservations(updatedReservations);
    saveStoredReservations(updatedReservations);
    saveReservationToFirestore(newReservation);

    // 2. Decrement stock for chosen color code & update in Firestore
    const updatedCars = cars.map((car) => {
      if (car.id === newReservation.carId) {
        const updatedColors = car.colors.map((col) => {
          if (col.id === newReservation.colorChosen.id) {
            return {
              ...col,
              stock: Math.max(0, col.stock - 1),
              reserved: col.reserved + 1,
            };
          }
          return col;
        });
        const updatedCar = { ...car, colors: updatedColors };
        saveCarToFirestore(updatedCar);
        return updatedCar;
      }
      return car;
    });

    setCars(updatedCars);
    saveStoredCars(updatedCars);

    triggerInstantDbSave({
      reservations: updatedReservations,
      cars: updatedCars,
    });

    const clientDisplayName =
      newReservation.client.type === 'personne_physique'
        ? `${newReservation.client.personnePhysique?.prenom || ''} ${newReservation.client.personnePhysique?.nom || ''}`.trim()
        : newReservation.client.societe?.raisonSociale || 'Client';
    const clientPhone =
      newReservation.client.type === 'personne_physique'
        ? newReservation.client.personnePhysique?.telephone || ''
        : newReservation.client.societe?.telephone || '';

    // 3. Record Audit Log for reservation stock decrement
    addAuditLog({
      actionType: 'reservation_stock_deduct',
      actionLabel: 'Déduction Stock (Réservation)',
      details: `Déduction de 1 unité de stock pour le bon de réservation #${newReservation.id} au nom de ${clientDisplayName} (${clientPhone})`,
      targetCarId: newReservation.carId,
      targetCarName: newReservation.carName,
      targetColorName: newReservation.colorChosen.name,
    });

    // 4. Show Toast notification & open Printable Voucher
    showToast(`Réservation ${newReservation.id} créée avec succès et enregistrée dans la base de données !`);
    setActiveVoucher(newReservation);
  };

  // Handler: Update Reservation Status
  const handleUpdateStatus = (reservationId: string, newStatus: Reservation['status']) => {
    let updatedItem: Reservation | null = null;
    const updated = reservations.map((res) => {
      if (res.id === reservationId) {
        const mod = { ...res, status: newStatus };
        updatedItem = mod;
        return mod;
      }
      return res;
    });
    setReservations(updated);
    saveStoredReservations(updated);
    if (updatedItem) {
      saveReservationToFirestore(updatedItem);
    }
    triggerInstantDbSave({ reservations: updated });
    showToast(`Statut de la réservation mis à jour: ${newStatus}`);
  };

  // Handler: Edit Existing Reservation
  const handleEditReservation = (updatedReservation: Reservation) => {
    const oldReservation = reservations.find((r) => r.id === updatedReservation.id);

    let updatedCars = cars;
    // If color changed, update stock counts for old and new colors
    if (oldReservation && oldReservation.colorChosen?.id !== updatedReservation.colorChosen?.id) {
      updatedCars = cars.map((car) => {
        if (car.id === updatedReservation.carId) {
          const updatedColors = car.colors.map((col) => {
            if (col.id === oldReservation.colorChosen?.id) {
              return {
                ...col,
                stock: col.stock + 1,
                reserved: Math.max(0, col.reserved - 1),
              };
            }
            if (col.id === updatedReservation.colorChosen?.id) {
              return {
                ...col,
                stock: Math.max(0, col.stock - 1),
                reserved: col.reserved + 1,
              };
            }
            return col;
          });
          const updatedCar = { ...car, colors: updatedColors };
          saveCarToFirestore(updatedCar);
          return updatedCar;
        }
        return car;
      });
      setCars(updatedCars);
      saveStoredCars(updatedCars);
    }

    const updatedRes = reservations.map((res) => (res.id === updatedReservation.id ? updatedReservation : res));
    setReservations(updatedRes);
    saveStoredReservations(updatedRes);
    saveReservationToFirestore(updatedReservation);

    triggerInstantDbSave({
      reservations: updatedRes,
      cars: updatedCars,
    });

    showToast(`Réservation ${updatedReservation.id} mise à jour avec succès !`);
  };

  // Admin Handlers with Firestore Persistence & Instant Local DB backup
  const handleUpdateCarStock = (carId: string, updatedColors: CarColor[]) => {
    const targetCar = cars.find((c) => c.id === carId);
    const updatedCars = cars.map((car) => {
      if (car.id === carId) {
        const updated = { ...car, colors: updatedColors };
        saveCarToFirestore(updated);
        return updated;
      }
      return car;
    });
    setCars(updatedCars);
    saveStoredCars(updatedCars);
    triggerInstantDbSave({ cars: updatedCars });

    const oldTotal = targetCar ? targetCar.colors.reduce((sum, c) => sum + (c.stock || 0), 0) : 0;
    const newTotal = updatedColors.reduce((sum, c) => sum + (c.stock || 0), 0);

    addAuditLog({
      actionType: 'stock_update',
      actionLabel: 'Ajustement Stock',
      details: `Mise à jour des stocks par teinte pour ${targetCar?.name || carId} (Total : ${oldTotal} ➔ ${newTotal} unités)`,
      targetCarId: carId,
      targetCarName: targetCar?.name || carId,
      previousValue: oldTotal,
      newValue: newTotal,
    });

    showToast('Stocks de couleurs mis à jour et sauvegardés en base de données !');
  };

  const handleUpdateCarPrice = (carId: string, newPriceTND: number) => {
    const targetCar = cars.find((c) => c.id === carId);
    const oldPrice = targetCar?.priceTND || 0;

    const updatedCars = cars.map((car) => {
      if (car.id === carId) {
        const updated = { ...car, priceTND: newPriceTND };
        saveCarToFirestore(updated);
        return updated;
      }
      return car;
    });
    setCars(updatedCars);
    saveStoredCars(updatedCars);
    triggerInstantDbSave({ cars: updatedCars });

    addAuditLog({
      actionType: 'price_update',
      actionLabel: 'Modification Prix TTC',
      details: `Mise à jour du tarif catalogue pour le modèle ${targetCar?.name || carId} : ${oldPrice.toLocaleString()} TND ➔ ${newPriceTND.toLocaleString()} TND`,
      targetCarId: carId,
      targetCarName: targetCar?.name || carId,
      previousValue: oldPrice,
      newValue: newPriceTND,
    });

    showToast('Prix du véhicule mis à jour et sauvegardé en base de données !');
  };

  const handleAddColorToCar = (carId: string, newColor: CarColor) => {
    const targetCar = cars.find((c) => c.id === carId);
    const updatedCars = cars.map((car) => {
      if (car.id === carId) {
        const updated = { ...car, colors: [...car.colors, newColor] };
        saveCarToFirestore(updated);
        return updated;
      }
      return car;
    });
    setCars(updatedCars);
    saveStoredCars(updatedCars);
    triggerInstantDbSave({ cars: updatedCars });

    addAuditLog({
      actionType: 'color_added',
      actionLabel: 'Nouvelle Teinte Ajoutée',
      details: `Ajout de la teinte "${newColor.name}" avec un stock initial de ${newColor.stock} unités pour le modèle ${targetCar?.name || carId}`,
      targetCarId: carId,
      targetCarName: targetCar?.name || carId,
      targetColorName: newColor.name,
      newValue: newColor.stock,
    });

    showToast(`Nouvelle couleur "${newColor.name}" ajoutée et sauvegardée en base !`);
  };

  const handleEditColor = (carId: string, colorId: string, updatedColorProps: Partial<CarColor>) => {
    const targetCar = cars.find((c) => c.id === carId);
    const oldColor = targetCar?.colors.find((c) => c.id === colorId);

    const updatedCars = cars.map((car) => {
      if (car.id === carId) {
        const updatedColors = car.colors.map((c) =>
          c.id === colorId ? { ...c, ...updatedColorProps } : c
        );
        const updated = { ...car, colors: updatedColors };
        saveCarToFirestore(updated);
        return updated;
      }
      return car;
    });
    setCars(updatedCars);
    saveStoredCars(updatedCars);
    triggerInstantDbSave({ cars: updatedCars });

    addAuditLog({
      actionType: 'color_edited',
      actionLabel: 'Modification Teinte / Stock',
      details: `Ajustement de la teinte "${updatedColorProps.name || oldColor?.name}" (Stock : ${oldColor?.stock ?? 0} ➔ ${updatedColorProps.stock ?? oldColor?.stock ?? 0}) pour ${targetCar?.name || carId}`,
      targetCarId: carId,
      targetCarName: targetCar?.name || carId,
      targetColorName: updatedColorProps.name || oldColor?.name,
      previousValue: oldColor?.stock,
      newValue: updatedColorProps.stock ?? oldColor?.stock,
    });

    showToast('Couleur et stock modifiés dans la base de données !');
  };

  const handleDeleteColor = (carId: string, colorId: string) => {
    const targetCar = cars.find((c) => c.id === carId);
    const targetColor = targetCar?.colors.find((c) => c.id === colorId);

    const updatedCars = cars.map((car) => {
      if (car.id === carId) {
        const updated = { ...car, colors: car.colors.filter((c) => c.id !== colorId) };
        saveCarToFirestore(updated);
        return updated;
      }
      return car;
    });
    setCars(updatedCars);
    saveStoredCars(updatedCars);
    triggerInstantDbSave({ cars: updatedCars });

    addAuditLog({
      actionType: 'color_deleted',
      actionLabel: 'Suppression Teinte',
      details: `Suppression de la teinte "${targetColor?.name || colorId}" pour le modèle ${targetCar?.name || carId}`,
      targetCarId: carId,
      targetCarName: targetCar?.name || carId,
      targetColorName: targetColor?.name,
    });

    showToast('Couleur supprimée du modèle et enregistrée en base !');
  };

  const handleEditCarModel = (updatedCar: CarModel) => {
    // Ensure not in deleted set
    const set = getDeletedCarIds();
    if (set.has(updatedCar.id)) {
      set.delete(updatedCar.id);
      saveDeletedCarIds(set);
    }

    const updatedCars = cars.map((c) => (c.id === updatedCar.id ? updatedCar : c));
    setCars(updatedCars);
    saveStoredCars(updatedCars);
    saveCarToFirestore(updatedCar);
    triggerInstantDbSave({ cars: updatedCars });

    showToast(`Fiche technique & photos du véhicule "${updatedCar.name}" enregistrées définitivement !`);
  };

  const handleAddCarModel = (newCar: CarModel) => {
    // Remove from deleted set if previously deleted
    const set = getDeletedCarIds();
    if (set.has(newCar.id)) {
      set.delete(newCar.id);
      saveDeletedCarIds(set);
    }

    const updatedCars = [...cars.filter((c) => c.id !== newCar.id), newCar];
    setCars(updatedCars);
    saveStoredCars(updatedCars);
    saveCarToFirestore(newCar);
    triggerInstantDbSave({ cars: updatedCars });

    addAuditLog({
      actionType: 'model_added',
      actionLabel: 'Nouveau Modèle Ajouté',
      details: `Ajout au catalogue du nouveau véhicule ${newCar.name} (${newCar.category}) au tarif de ${newCar.priceTND.toLocaleString()} TND TTC`,
      targetCarId: newCar.id,
      targetCarName: newCar.name,
      newValue: newCar.priceTND,
    });

    showToast(`Nouveau modèle "${newCar.name}" ajouté et sauvegardé définitivement (Cloud + Local) !`);
  };

  const handleDeleteCarModel = (carId: string) => {
    const car = cars.find((c) => c.id === carId);

    // Register intentional deletion so reconciliation never resurrects this model
    const set = getDeletedCarIds();
    set.add(carId);
    saveDeletedCarIds(set);

    const updated = cars.filter((c) => c.id !== carId);
    setCars(updated);
    saveStoredCars(updated);
    deleteCarFromFirestore(carId);
    triggerInstantDbSave({ cars: updated });

    addAuditLog({
      actionType: 'model_deleted',
      actionLabel: 'Suppression Modèle',
      details: `Suppression définitive du modèle ${car?.name || carId} du catalogue`,
      targetCarId: carId,
      targetCarName: car?.name,
    });

    showToast(`Modèle "${car?.name || ''}" supprimé définitivement de la base`);
  };

  // User & Session Management Handlers with Instant Database Persistence
  const handleAddCommercial = (newUser: CommercialUser) => {
    const updated = [...commercials, newUser];
    setCommercials(updated);
    saveStoredCommercials(updated);
    saveCommercialToFirestore(newUser);
    triggerInstantDbSave({ commercials: updated });
    showToast(`Nouvelle session enregistrée pour ${newUser.name} dans la base de données !`);
  };

  const handleUpdateCommercial = (updatedUser: CommercialUser) => {
    const updated = commercials.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setCommercials(updated);
    saveStoredCommercials(updated);
    saveCommercialToFirestore(updatedUser);
    triggerInstantDbSave({ commercials: updated });
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    showToast(`Session commerciale "${updatedUser.name}" enregistrée dans la base de données !`);
  };

  const handleUpdateCommercialPassword = (userId: string, newPassword: string) => {
    const updated = commercials.map((u) => {
      if (u.id === userId) {
        const mod = { ...u, password: newPassword };
        saveCommercialToFirestore(mod);
        return mod;
      }
      return u;
    });
    setCommercials(updated);
    saveStoredCommercials(updated);
    triggerInstantDbSave({ commercials: updated });
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, password: newPassword } : null));
    }
    showToast(`Mot de passe mis à jour et sauvegardé dans la base de données !`);
  };

  const handleDeleteCommercial = async (userId: string) => {
    const userToDelete = commercials.find((u) => u.id === userId);
    const updated = commercials.filter((u) => u.id !== userId);
    setCommercials(updated);
    saveStoredCommercials(updated);
    await deleteCommercialFromFirestore(userId);
    triggerInstantDbSave({ commercials: updated });
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(null);
    }
    showToast(`Session de ${userToDelete?.name || 'l\'utilisateur'} supprimée définitivement de la base`);
  };

  const handleImportDatabase = async (importedData: any) => {
    if (!importedData || typeof importedData !== 'object') return;

    if (Array.isArray(importedData.cars) && importedData.cars.length > 0) {
      setCars(importedData.cars);
      saveStoredCars(importedData.cars);
      importedData.cars.forEach((car: CarModel) => saveCarToFirestore(car));
    }
    if (Array.isArray(importedData.reservations)) {
      setReservations(importedData.reservations);
      saveStoredReservations(importedData.reservations);
      importedData.reservations.forEach((res: Reservation) => saveReservationToFirestore(res));
    }
    if (Array.isArray(importedData.commercials) && importedData.commercials.length > 0) {
      setCommercials(importedData.commercials);
      saveStoredCommercials(importedData.commercials);
      importedData.commercials.forEach((comm: CommercialUser) => saveCommercialToFirestore(comm));
    }
    if (importedData.siteSettings) {
      setSiteSettings(importedData.siteSettings);
      saveStoredSiteSettings(importedData.siteSettings);
      saveSiteSettingsToFirestore(importedData.siteSettings);
    }
    if (Array.isArray(importedData.accessories)) {
      setAccessories(importedData.accessories);
      saveStoredAccessories(importedData.accessories);
      importedData.accessories.forEach((acc: CarAccessory) => saveAccessoryToFirestore(acc));
    }
    if (Array.isArray(importedData.quotes)) {
      setQuotes(importedData.quotes);
      saveStoredQuotes(importedData.quotes);
      importedData.quotes.forEach((q: CustomQuote) => saveQuoteToFirestore(q));
    }

    triggerInstantDbSave({
      cars: importedData.cars || cars,
      reservations: importedData.reservations || reservations,
      commercials: importedData.commercials || commercials,
      siteSettings: importedData.siteSettings || siteSettings,
      accessories: importedData.accessories || accessories,
      quotes: importedData.quotes || quotes,
    });

    showToast('Base de données réimportée et synchronisée avec succès dans le Cloud & local !');
  };

  const handleResetToFactoryDefaults = async () => {
    try {
      localStorage.removeItem('chery_tn_deleted_car_ids_v1');
    } catch {}

    setCars(INITIAL_CARS);
    saveStoredCars(INITIAL_CARS);
    INITIAL_CARS.forEach((car) => saveCarToFirestore(car));

    setCommercials(INITIAL_COMMERCIALS);
    saveStoredCommercials(INITIAL_COMMERCIALS);
    INITIAL_COMMERCIALS.forEach((comm) => saveCommercialToFirestore(comm));

    setSiteSettings(DEFAULT_SITE_SETTINGS);
    saveStoredSiteSettings(DEFAULT_SITE_SETTINGS);
    saveSiteSettingsToFirestore(DEFAULT_SITE_SETTINGS);

    triggerInstantDbSave({
      cars: INITIAL_CARS,
      commercials: INITIAL_COMMERCIALS,
      siteSettings: DEFAULT_SITE_SETTINGS,
    });

    showToast('Base de données réinitialisée aux modèles et paramètres d\'origine !');
  };

  // Test Drive Handlers
  const handleScheduleTestDrive = (data: Omit<TestDriveAppointment, 'id' | 'createdAt' | 'status'>) => {
    const newTd: TestDriveAppointment = {
      ...data,
      id: `TD-${new Date().getFullYear()}-${101 + testDrives.length}`,
      status: 'En attente',
      createdAt: new Date().toISOString(),
    };
    const updated = [newTd, ...testDrives];
    setTestDrives(updated);
    saveStoredTestDrives(updated);
    saveTestDriveToFirestore(newTd);
    triggerInstantDbSave({ testDrives: updated });
    showToast(`Rendez-vous Test Drive #${newTd.id} programmé pour ${newTd.clientName} !`);
  };

  const handleUpdateTestDriveStatus = (id: string, status: TestDriveStatus) => {
    const updated = testDrives.map((td) => {
      if (td.id === id) {
        const mod = { ...td, status };
        saveTestDriveToFirestore(mod);
        return mod;
      }
      return td;
    });
    setTestDrives(updated);
    saveStoredTestDrives(updated);
    triggerInstantDbSave({ testDrives: updated });
    showToast(`Statut du RDV Test Drive #${id} mis à jour : ${status}`);
  };

  const handleDeleteTestDrive = (id: string) => {
    const updated = testDrives.filter((td) => td.id !== id);
    setTestDrives(updated);
    saveStoredTestDrives(updated);
    deleteTestDriveFromFirestore(id);
    triggerInstantDbSave({ testDrives: updated });
    showToast(`Rendez-vous Test Drive #${id} supprimé.`);
  };

  const handleOpenTestDriveModal = (car?: CarModel) => {
    setTestDrivePreselectedCar(car || null);
    setIsTestDriveModalOpen(true);
  };

  // Stock / Quota Request Handlers
  const handleCreateStockRequest = (carId: string, carName: string, requestedQuantity: number = 5, reason?: string) => {
    if (!currentUser) return;
    const newReq: StockRequest = {
      id: `REQ-${new Date().getFullYear()}-${1001 + stockRequests.length}`,
      commercialId: currentUser.id,
      commercialName: currentUser.name,
      commercialAgency: currentUser.agency,
      carId,
      carName,
      requestedQuantity,
      reason: reason || 'Quota atteint pour ce modèle dans la session',
      status: 'En attente',
      createdAt: new Date().toISOString(),
    };
    const updated = [newReq, ...stockRequests];
    setStockRequests(updated);
    saveStoredStockRequests(updated);
    saveStockRequestToFirestore(newReq);
    triggerInstantDbSave({ stockRequests: updated });
    showToast(`Demande de quota/stock pour ${carName} (+${requestedQuantity}) transmise à l'administration !`);
  };

  const handleProcessStockRequest = (requestId: string, status: 'Approuvé' | 'Refusé', adminNote?: string) => {
    const targetReq = stockRequests.find((r) => r.id === requestId);
    if (!targetReq) return;

    const updatedReq: StockRequest = {
      ...targetReq,
      status,
      processedAt: new Date().toISOString(),
      adminNote,
    };

    const updatedRequests = stockRequests.map((r) => (r.id === requestId ? updatedReq : r));
    setStockRequests(updatedRequests);
    saveStoredStockRequests(updatedRequests);
    saveStockRequestToFirestore(updatedReq);

    let updatedComms = commercials;
    if (status === 'Approuvé') {
      const addedQty = targetReq.requestedQuantity || 5;
      updatedComms = commercials.map((c) => {
        if (c.id === targetReq.commercialId) {
          const currentQuota = c.quotaPerModel || 5;
          const updatedComm: CommercialUser = {
            ...c,
            quotaPerModel: currentQuota + addedQty,
          };
          saveCommercialToFirestore(updatedComm);
          if (currentUser?.id === c.id) {
            setCurrentUser(updatedComm);
          }
          return updatedComm;
        }
        return c;
      });
      setCommercials(updatedComms);
      saveStoredCommercials(updatedComms);

      addAuditLog({
        actionType: 'stock_request_approved',
        actionLabel: 'Attribution Quota Commercial',
        details: `Validation de la demande #${requestId} : Attribution d'un quota supplémentaire (+${addedQty} unités) pour ${targetReq.commercialName} (${targetReq.commercialAgency}) sur le modèle ${targetReq.carName}`,
        targetCarId: targetReq.carId,
        targetCarName: targetReq.carName,
        newValue: addedQty,
      });

      showToast(`Demande #${requestId} approuvée ! Quota augmenté de +${addedQty} pour ${targetReq.commercialName}.`);
    } else {
      showToast(`Demande #${requestId} refusée.`);
    }

    triggerInstantDbSave({
      stockRequests: updatedRequests,
      commercials: updatedComms,
    });
  };

  const handleDeleteStockRequest = (requestId: string) => {
    const updated = stockRequests.filter((r) => r.id !== requestId);
    setStockRequests(updated);
    saveStoredStockRequests(updated);
    deleteStockRequestFromFirestore(requestId);
    triggerInstantDbSave({ stockRequests: updated });
    showToast(`Demande #${requestId} supprimée.`);
  };

  const handleDeleteReservation = (reservationId: string) => {
    const updated = reservations.filter((r) => r.id !== reservationId);
    setReservations(updated);
    saveStoredReservations(updated);
    deleteReservationFromFirestore(reservationId);
    triggerInstantDbSave({ reservations: updated });
    showToast(`Réservation ${reservationId} supprimée de la base de données`);
  };

  const handleAddDocumentToReservation = (reservationId: string, doc: UploadedDocument) => {
    const updated = reservations.map((r) => {
      if (r.id === reservationId) {
        const newDocs = [...(r.documents || []), doc];
        const isBonCommande = doc.category === 'bon_commande' || doc.name.toLowerCase().includes('bon de commande');
        const newStatus = isBonCommande ? 'Confirmée' : r.status;
        const updatedRes: Reservation = {
          ...r,
          documents: newDocs,
          status: newStatus,
          notes: isBonCommande
            ? (r.notes ? r.notes + ' | ' : '') + '⚡ Validée automatiquement par la réception du Bon de Commande Leasing.'
            : r.notes,
        };
        saveReservationToFirestore(updatedRes);
        return updatedRes;
      }
      return r;
    });
    setReservations(updated);
    saveStoredReservations(updated);
    triggerInstantDbSave({ reservations: updated });
    showToast(`Fichier "${doc.name}" ajouté à la réservation ${reservationId}`);
  };

  const handleDeleteAllReservations = async () => {
    setReservations([]);
    saveStoredReservations([]);
    await deleteAllReservationsFromFirestore();
    triggerInstantDbSave({ reservations: [] });
    showToast('🗑️ Toutes les réservations de test ont été supprimées de la base de données !');
  };

  // Count low/out-of-stock items for header indicator
  const outOfStockCount = cars.flatMap((c) => c.colors.filter((col) => col.stock === 0)).length;

  // Render Login Screen if user logged out
  if (!currentUser) {
    return (
      <div data-theme={theme} data-theme-mode="dark" className="min-h-screen bg-[#090d16] text-slate-100">
        <LoginScreen
          users={commercials}
          siteSettings={siteSettings}
          onLogin={(user) => {
            setCurrentUser(user);
            showToast(`Bienvenue, session activée pour ${user.name} !`);
          }}
          onUpdateUser={handleUpdateCommercial}
        />
      </div>
    );
  }

  const themeContainerClass =
    theme === 'red'
      ? 'bg-[#150507] text-red-50'
      : theme === 'carbon'
      ? 'bg-[#090d16] text-neutral-100'
      : theme === 'electric_cyan'
      ? 'bg-[#03131a] text-cyan-50'
      : theme === 'luxury_gold'
      ? 'bg-[#0e0b07] text-amber-50'
      : theme === 'titanium'
      ? 'bg-[#0b0f19] text-slate-100'
      : 'bg-[#050811] text-slate-100';

  const footerBgClass =
    theme === 'red'
      ? 'bg-red-950/80 border-red-900/50 text-red-200'
      : theme === 'carbon'
      ? 'bg-neutral-950 border-neutral-800 text-neutral-300'
      : theme === 'electric_cyan'
      ? 'bg-cyan-950/80 border-cyan-900/50 text-cyan-200'
      : theme === 'luxury_gold'
      ? 'bg-amber-950/80 border-amber-900/50 text-amber-200'
      : theme === 'titanium'
      ? 'bg-slate-900 border-slate-800 text-slate-300'
      : 'bg-slate-900 border-slate-800 text-slate-400';

  return (
    <div
      data-theme={theme}
      data-theme-mode="dark"
      className={`relative min-h-screen ${themeContainerClass} flex flex-col font-sans selection:bg-red-500 selection:text-white transition-colors duration-300 overflow-x-hidden`}
    >

      {/* Global Site Workspace Background (Image / Vidéo / Thème) */}
      <BackgroundMediaRender
        type={siteSettings?.siteBackgroundType || 'none'}
        imageUrl={siteSettings?.siteBackgroundImageUrl}
        videoUrl={siteSettings?.siteBackgroundVideoUrl}
        overlayOpacity={siteSettings?.siteBackgroundOverlayOpacity ?? 0.85}
        blur={siteSettings?.siteBackgroundBlur ?? false}
      />

      {/* Main Relative Container Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        {/* Navigation Header with Session Switcher */}
        <Header
          currentUser={currentUser}
          allUsers={commercials}
          onSelectUser={(u) => {
            setCurrentUser(u);
            if (u.role === 'admin' || u.role === 'super_admin') {
              showToast(`Session changée : Administration (${u.name})`);
            } else {
              showToast(`Session Commerciale activée : ${u.name} (${u.agency})`);
            }
          }}
          onUpdateUser={handleUpdateCommercial}
          onUpdatePassword={handleUpdateCommercialPassword}
          onLogout={() => {
            setCurrentUser(null);
            showToast('Déconnexion réussie. À bientôt !');
          }}
          activeTab={activeTab}
          setActiveTab={handleSelectTab}
          outOfStockCount={outOfStockCount}
          cars={cars}
          stockRequests={stockRequests}
          theme={theme}
          onThemeChange={setTheme}
          siteSettings={siteSettings}
        />

      {/* Floating Success Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 right-4 z-50 max-w-md bg-emerald-600 text-white p-3.5 rounded-2xl shadow-xl border border-emerald-400 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2 text-xs font-bold">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-100" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1 text-emerald-200 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area with Animated Tab Transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {activeTab === 'dashboard' && (
              <StockDashboard
                cars={cars}
                reservations={reservations}
                stockRequests={stockRequests}
                currentUser={currentUser}
                onOpenReservationModal={handleOpenReservationModal}
                onProcessStockRequest={handleProcessStockRequest}
                onNavigateToAdmin={() => setActiveTab('admin')}
                onEditCarModel={handleEditCarModel}
              />
            )}

            {activeTab === 'reservations' && (
              <ReservationList
                reservations={reservations}
                cars={cars}
                currentCommercial={currentUser}
                onUpdateStatus={handleUpdateStatus}
                onEditReservation={handleEditReservation}
                onDeleteReservation={handleDeleteReservation}
                onDeleteAllReservations={handleDeleteAllReservations}
                onAddDocument={handleAddDocumentToReservation}
                onViewVoucher={(res) => setActiveVoucher(res)}
                onViewDocument={(doc) => setActiveDocument(doc)}
              />
            )}

            {activeTab === 'admin_docs' && (
              <AdministrativeDocuments
                documents={adminDocs}
                currentUser={currentUser}
                onAddDocument={handleAddAdminDocument}
                onDeleteDocument={handleDeleteAdminDocument}
              />
            )}

            {activeTab === 'knowledge_base' && (
              <KnowledgeBaseManager
                items={knowledgeBase}
                onSaveItems={handleSaveKnowledgeBase}
                currentUser={currentUser}
                theme={theme}
              />
            )}

            {activeTab === 'documents_devis' && (
              <DocumentQuoteCustomizer
                templateConfig={docTemplate}
                onSaveTemplateConfig={handleSaveDocTemplate}
                cars={cars}
                accessories={accessories}
                quotes={quotes}
                onSaveQuote={handleSaveQuote}
                onDeleteQuote={handleDeleteQuote}
                currentUser={currentUser}
                theme={theme}
                onConvertToReservation={handleConvertQuoteToReservation}
                initialConfigToQuote={configForQuote}
              />
            )}

            {activeTab === 'admin' && (currentUser.role === 'admin' || currentUser.role === 'super_admin') && (
              <AdminPanel
                currentUser={currentUser}
                cars={cars}
                commercials={commercials}
                reservations={reservations}
                onUpdateCarStock={handleUpdateCarStock}
                onUpdateCarPrice={handleUpdateCarPrice}
                onAddColorToCar={handleAddColorToCar}
                onEditColor={handleEditColor}
                onDeleteColor={handleDeleteColor}
                onEditCarModel={handleEditCarModel}
                onAddCarModel={handleAddCarModel}
                onDeleteCarModel={handleDeleteCarModel}
                onAddCommercial={handleAddCommercial}
                onUpdateCommercial={handleUpdateCommercial}
                onUpdateCommercialPassword={handleUpdateCommercialPassword}
                onDeleteCommercial={handleDeleteCommercial}
                siteSettings={siteSettings}
                onUpdateSiteSettings={handleUpdateSiteSettings}
                stockRequests={stockRequests}
                onProcessStockRequest={handleProcessStockRequest}
                onDeleteStockRequest={handleDeleteStockRequest}
                accessories={accessories}
                quotes={quotes}
                auditLogs={auditLogs}
                onClearAuditLogs={handleClearAuditLogs}
                onDeleteAuditLog={handleDeleteAuditLog}
                onDeleteMultipleAuditLogs={handleDeleteMultipleAuditLogs}
                onResetDefaultLogs={handleResetDefaultLogs}
                onAddManualLog={addAuditLog}
                onImportDatabase={handleImportDatabase}
                onResetToFactoryDefaults={handleResetToFactoryDefaults}
                onManualSave={handleManualSaveDatabase}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className={`${footerBgClass} border-t py-6 text-xs transition-colors duration-300 mt-auto`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="px-2 py-1 rounded bg-black/80 dark:bg-black/90 border border-slate-700/60 shadow-sm flex items-center justify-center min-w-[70px]">
              {siteSettings?.footerLogoUrl && siteSettings.footerLogoUrl !== '/sta_logo_white.svg' && siteSettings.footerLogoUrl !== '/sta_logo_dark.svg' && siteSettings.footerLogoUrl !== '/sta_logo.svg' ? (
                <img
                  src={siteSettings.footerLogoUrl}
                  alt="Footer Logo"
                  className="h-6 w-auto object-contain max-w-[140px]"
                />
              ) : (
                <StaLogo className="h-6 w-auto" variant="white" showText={true} />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight">
                {siteSettings?.footerTitle || "STA — Société Tunisienne d'Automobiles"}
              </span>
              <span className="text-[10px] text-slate-400">
                {siteSettings?.footerSubtitle || "Distributeur Officiel & Réseau Agréé"}
              </span>
            </div>
          </div>
          <div className="text-center md:text-right space-y-0.5">
            <p className="text-slate-400">
              {siteSettings?.footerDescription || "Plateforme réservée aux commerciaux & réseau d'agences agréées."}
            </p>
            <p className="font-medium">
              {siteSettings?.footerCopyright || (
                <>
                  © 2026 STA — Société Tunisienne d'Automobiles. Conçu &amp; Développé par <span className="font-bold text-red-500">Jamai Mongi</span>. Tous droits réservés.
                </>
              )}
            </p>
          </div>
        </div>
      </footer>

      {/* Reservation Creation Modal */}
      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
        cars={cars}
        preselectedCar={preselectedCar}
        preselectedColor={preselectedColor}
        currentCommercial={currentUser}
        reservations={reservations}
        stockRequests={stockRequests}
        onRequestStockQuota={handleCreateStockRequest}
        onSaveReservation={handleSaveReservation}
      />

      {/* Test Drive Scheduling Modal */}
      <TestDriveModal
        isOpen={isTestDriveModalOpen}
        onClose={() => setIsTestDriveModalOpen(false)}
        cars={cars}
        preselectedCar={testDrivePreselectedCar}
        currentUser={currentUser}
        onScheduleTestDrive={handleScheduleTestDrive}
      />

      {/* Printable Voucher Modal */}
      {activeVoucher && (
        <ReservationVoucher
          reservation={activeVoucher}
          siteSettings={siteSettings}
          onClose={() => setActiveVoucher(null)}
          onUpdateVoucherLogo={(newLogoUrl) => {
            const updated = { ...siteSettings, voucherLogoUrl: newLogoUrl };
            handleUpdateSiteSettings(updated);
          }}
        />
      )}

      {/* Document Viewer Modal */}
      {activeDocument && (
        <DocumentViewerModal
          document={activeDocument}
          onClose={() => setActiveDocument(null)}
        />
      )}
      </div>
    </div>
  );
}
