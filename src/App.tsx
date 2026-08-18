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
  INITIAL_COMMERCIALS,
  INITIAL_CARS,
  DEFAULT_SITE_SETTINGS,
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
  seedInitialDataIfEmpty,
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
import { TestDriveList } from './components/TestDriveList';
import { TestDriveModal } from './components/TestDriveModal';
import { StaLogo } from './components/StaLogo';
import { CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Theme state initialization
  const [theme, setTheme] = useState<ThemeMode>(() => (localStorage.getItem('chery_theme') as ThemeMode) || 'dark');

  useEffect(() => {
    localStorage.setItem('chery_theme', theme);
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

  // Persistence for Knowledge Base, Docs, Accessories, and Quotes
  const handleSaveKnowledgeBase = (newItems: KnowledgeBaseItem[]) => {
    setKnowledgeBase(newItems);
    saveStoredKnowledgeBase(newItems);
    showToast('Base de Connaissances mise à jour et enregistrée !');
  };

  const handleSaveDocTemplate = (newConfig: DocumentTemplateConfig) => {
    setDocTemplate(newConfig);
    saveStoredDocumentTemplate(newConfig);
    showToast('Paramètres des documents et devis mis à jour !');
  };

  const handleSaveAccessories = (newAccessories: CarAccessory[]) => {
    setAccessories(newAccessories);
    saveStoredAccessories(newAccessories);
    newAccessories.forEach((acc) => saveAccessoryToFirestore(acc));
    showToast('Catalogue des accessoires mis à jour et synchronisé dans le cloud !');
  };

  const handleSaveQuote = (newQuote: CustomQuote) => {
    const updated = [newQuote, ...quotes.filter((q) => q.id !== newQuote.id)];
    setQuotes(updated);
    saveStoredQuotes(updated);
    saveQuoteToFirestore(newQuote);
    showToast(`Devis ${newQuote.quoteNumber} créé et enregistré dans la base cloud !`);
  };

  const handleDeleteQuote = (quoteId: string) => {
    const updated = quotes.filter((q) => q.id !== quoteId);
    setQuotes(updated);
    saveStoredQuotes(updated);
    deleteQuoteFromFirestore(quoteId);
    showToast('Devis supprimé de l\'historique');
  };

  const handleConvertQuoteToReservation = (quote: CustomQuote) => {
    const car = cars.find((c) => c.id === quote.config.carId) || cars[0];
    const color = car?.colors.find((col) => col.id === quote.config.colorId) || car?.colors[0];
    setPreselectedCar(car);
    setPreselectedColor(color || null);
    setIsReservationModalOpen(true);
    showToast(`Conversion du devis ${quote.quoteNumber} en réservation...`);
  };


  // Site Customization Handler
  const handleUpdateSiteSettings = (newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
    saveStoredSiteSettings(newSettings);
    saveSiteSettingsToFirestore(newSettings);
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
        const fetched = snapshot.docs.map((doc) => doc.data() as CarModel);
        setCars(fetched);
      }
    }, (err) => console.warn('Cars snapshot listener warning:', err));

    const unsubscribeReservations = onSnapshot(reservationsCollection, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => doc.data() as Reservation);
      setReservations(fetched);
    }, (err) => console.warn('Reservations snapshot listener warning:', err));

    const unsubscribeTestDrives = onSnapshot(testDrivesCollection, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => doc.data() as TestDriveAppointment);
      setTestDrives(fetched);
    }, (err) => console.warn('TestDrives snapshot listener warning:', err));

    const unsubscribeStockRequests = onSnapshot(stockRequestsCollection, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => doc.data() as StockRequest);
      setStockRequests(fetched);
    }, (err) => console.warn('StockRequests snapshot listener warning:', err));

    const unsubscribeCommercials = onSnapshot(commercialsCollection, (snapshot) => {
      if (!snapshot.empty) {
        const fetched = snapshot.docs.map((doc) => doc.data() as CommercialUser);
        const merged = [...fetched];
        INITIAL_COMMERCIALS.forEach((initUser) => {
          if (!merged.some((u) => u.id === initUser.id)) {
            merged.unshift(initUser);
            saveCommercialToFirestore(initUser);
          }
        });
        setCommercials(merged);
      }
    }, (err) => console.warn('Commercials snapshot listener warning:', err));

    const unsubscribeSettings = onSnapshot(doc(db, 'settings', 'site_settings'), (docSnap) => {
      if (docSnap.exists()) {
        const fetchedSettings = docSnap.data() as SiteSettings;
        setSiteSettings(fetchedSettings);
        saveStoredSiteSettings(fetchedSettings);
      }
    }, (err) => console.warn('Settings snapshot listener warning:', err));

    const unsubscribeAccessories = onSnapshot(accessoriesCollection, (snapshot) => {
      if (!snapshot.empty) {
        const fetched = snapshot.docs.map((doc) => doc.data() as CarAccessory);
        setAccessories(fetched);
      }
    }, (err) => console.warn('Accessories snapshot listener warning:', err));

    const unsubscribeQuotes = onSnapshot(quotesCollection, (snapshot) => {
      if (!snapshot.empty) {
        const fetched = snapshot.docs.map((doc) => doc.data() as CustomQuote);
        setQuotes(fetched);
      }
    }, (err) => console.warn('Quotes snapshot listener warning:', err));

    return () => {
      isMounted = false;
      unsubscribeCars();
      unsubscribeReservations();
      unsubscribeTestDrives();
      unsubscribeStockRequests();
      unsubscribeCommercials();
      unsubscribeSettings();
      unsubscribeAccessories();
      unsubscribeQuotes();
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
  }, [siteSettings]);

  const isDbLoadedRef = useRef(false);

  // Fallback: Load state from local project folder (data/db.json) ONLY if Firestore hasn't populated state
  useEffect(() => {
    fetch('/api/db')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data && data.exists) {
          if (Array.isArray(data.cars) && data.cars.length > 0) {
            setCars((prev) => (prev.length === 0 ? data.cars : prev));
          }
          if (Array.isArray(data.reservations) && data.reservations.length > 0) {
            setReservations((prev) => (prev.length === 0 ? data.reservations : prev));
          }
          if (Array.isArray(data.commercials) && data.commercials.length > 0) {
            setCommercials((prev) => {
              if (prev.length === 0) {
                const mergedComm = [...data.commercials];
                INITIAL_COMMERCIALS.forEach((initUser) => {
                  if (!mergedComm.some((u) => u.id === initUser.id)) {
                    mergedComm.unshift(initUser);
                  }
                });
                return mergedComm;
              }
              return prev;
            });
          }
          if (data.siteSettings) {
            setSiteSettings((prev) => (prev ? prev : data.siteSettings));
          }
          console.log('[Chery Local DB] Synchronisation locale prête');
        }
      })
      .catch((err) => console.log('[Chery Local DB] Synchronisation active via Cloud Firebase.', err))
      .finally(() => {
        isDbLoadedRef.current = true;
      });
  }, []);

  // Automatically save state to data/db.json in the project folder whenever data updates (debounced)
  useEffect(() => {
    if (!isDbLoadedRef.current || cars.length === 0) return;

    const timer = setTimeout(async () => {
      try {
        await fetch('/api/db/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cars, reservations, commercials, siteSettings, accessories, quotes }),
        });
      } catch (err) {
        // En mode client pur, sauvegarde locale déjà gérée
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [cars, reservations, commercials, siteSettings, accessories, quotes]);

  // Handler: Open Reservation Modal
  const handleOpenReservationModal = (car?: CarModel, color?: CarColor) => {
    setPreselectedCar(car || null);
    setPreselectedColor(color || null);
    setIsReservationModalOpen(true);
  };

  // Handler: Save New Reservation & Automatically Decrement Stock for the chosen color
  const handleSaveReservation = (newReservation: Reservation) => {
    // 1. Add to reservation list in Firestore & state
    setReservations((prev) => [newReservation, ...prev]);
    saveReservationToFirestore(newReservation);

    // 2. Decrement stock for chosen color code & update in Firestore
    setCars((prevCars) =>
      prevCars.map((car) => {
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
      })
    );

    // 3. Show Toast notification & open Printable Voucher
    showToast(`Réservation ${newReservation.id} créée avec succès et enregistrée dans la base de données !`);
    setActiveVoucher(newReservation);
  };

  // Handler: Update Reservation Status
  const handleUpdateStatus = (reservationId: string, newStatus: Reservation['status']) => {
    setReservations((prev) =>
      prev.map((res) => {
        if (res.id === reservationId) {
          const updated = { ...res, status: newStatus };
          saveReservationToFirestore(updated);
          return updated;
        }
        return res;
      })
    );
    showToast(`Statut de la réservation mis à jour: ${newStatus}`);
  };

  // Admin Handlers with Firestore Persistence
  const handleResetStockToDefault = () => {
    setCars(INITIAL_CARS);
    saveStoredCars(INITIAL_CARS);
    INITIAL_CARS.forEach((car) => {
      saveCarToFirestore(car);
    });
    showToast('⚡ Modifications de stock annulées : Stocks réinitialisés aux valeurs par défaut !');
  };

  const handleUpdateCarStock = (carId: string, updatedColors: CarColor[]) => {
    setCars((prev) =>
      prev.map((car) => {
        if (car.id === carId) {
          const updated = { ...car, colors: updatedColors };
          saveCarToFirestore(updated);
          return updated;
        }
        return car;
      })
    );
    showToast('Stocks de couleurs mis à jour et sauvegardés !');
  };

  const handleUpdateCarPrice = (carId: string, newPriceTND: number) => {
    setCars((prev) =>
      prev.map((car) => {
        if (car.id === carId) {
          const updated = { ...car, priceTND: newPriceTND };
          saveCarToFirestore(updated);
          return updated;
        }
        return car;
      })
    );
    showToast('Prix du véhicule mis à jour et sauvegardé !');
  };

  const handleAddColorToCar = (carId: string, newColor: CarColor) => {
    setCars((prev) =>
      prev.map((car) => {
        if (car.id === carId) {
          const updated = { ...car, colors: [...car.colors, newColor] };
          saveCarToFirestore(updated);
          return updated;
        }
        return car;
      })
    );
    showToast(`Nouvelle couleur "${newColor.name}" ajoutée et sauvegardée !`);
  };

  const handleEditColor = (carId: string, colorId: string, updatedColorProps: Partial<CarColor>) => {
    setCars((prev) =>
      prev.map((car) => {
        if (car.id === carId) {
          const updatedColors = car.colors.map((c) =>
            c.id === colorId ? { ...c, ...updatedColorProps } : c
          );
          const updated = { ...car, colors: updatedColors };
          saveCarToFirestore(updated);
          return updated;
        }
        return car;
      })
    );
    showToast('Couleur et stock modifiés dans la base de données !');
  };

  const handleDeleteColor = (carId: string, colorId: string) => {
    setCars((prev) =>
      prev.map((car) => {
        if (car.id === carId) {
          const updated = { ...car, colors: car.colors.filter((c) => c.id !== colorId) };
          saveCarToFirestore(updated);
          return updated;
        }
        return car;
      })
    );
    showToast('Couleur supprimée du modèle');
  };

  const handleEditCarModel = (updatedCar: CarModel) => {
    setCars((prev) => prev.map((c) => (c.id === updatedCar.id ? updatedCar : c)));
    saveCarToFirestore(updatedCar);
    showToast(`Fiche technique & photos du véhicule "${updatedCar.name}" enregistrées !`);
  };

  const handleAddCarModel = (newCar: CarModel) => {
    setCars((prev) => [...prev, newCar]);
    saveCarToFirestore(newCar);
    showToast(`Nouveau modèle "${newCar.name}" ajouté à la base de données !`);
  };

  const handleDeleteCarModel = (carId: string) => {
    const car = cars.find((c) => c.id === carId);
    setCars((prev) => prev.filter((c) => c.id !== carId));
    deleteCarFromFirestore(carId);
    showToast(`Modèle "${car?.name || ''}" supprimé de la base de données`);
  };

  // User & Session Management Handlers
  const handleAddCommercial = (newUser: CommercialUser) => {
    setCommercials((prev) => [...prev, newUser]);
    saveCommercialToFirestore(newUser);
    showToast(`Nouvelle session enregistrée pour ${newUser.name} !`);
  };

  const handleUpdateCommercial = (updatedUser: CommercialUser) => {
    setCommercials((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    saveCommercialToFirestore(updatedUser);
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    showToast(`Session utilisateur "${updatedUser.name}" mise à jour !`);
  };

  const handleUpdateCommercialPassword = (userId: string, newPassword: string) => {
    setCommercials((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, password: newPassword };
          saveCommercialToFirestore(updated);
          return updated;
        }
        return u;
      })
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, password: newPassword } : null));
    }
    showToast(`Mot de passe mis à jour avec succès dans la base !`);
  };

  const handleDeleteCommercial = (userId: string) => {
    const userToDelete = commercials.find((u) => u.id === userId);
    setCommercials((prev) => prev.filter((u) => u.id !== userId));
    deleteCommercialFromFirestore(userId);
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(null);
    }
    showToast(`Session de ${userToDelete?.name || 'l\'utilisateur'} supprimée`);
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

    try {
      await fetch('/api/db/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cars: importedData.cars || cars,
          reservations: importedData.reservations || reservations,
          commercials: importedData.commercials || commercials,
          siteSettings: importedData.siteSettings || siteSettings,
          accessories: importedData.accessories || accessories,
          quotes: importedData.quotes || quotes,
        }),
      });
    } catch (_) {}

    showToast('Base de données réimportée et synchronisée avec succès dans le Cloud & local !');
  };

  const handleResetToFactoryDefaults = async () => {
    setCars(INITIAL_CARS);
    saveStoredCars(INITIAL_CARS);
    INITIAL_CARS.forEach((car) => saveCarToFirestore(car));

    setCommercials(INITIAL_COMMERCIALS);
    saveStoredCommercials(INITIAL_COMMERCIALS);
    INITIAL_COMMERCIALS.forEach((comm) => saveCommercialToFirestore(comm));

    setSiteSettings(DEFAULT_SITE_SETTINGS);
    saveStoredSiteSettings(DEFAULT_SITE_SETTINGS);
    saveSiteSettingsToFirestore(DEFAULT_SITE_SETTINGS);

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
    setTestDrives((prev) => [newTd, ...prev]);
    saveStoredTestDrives([newTd, ...testDrives]);
    saveTestDriveToFirestore(newTd);
    showToast(`Rendez-vous Test Drive #${newTd.id} programmé pour ${newTd.clientName} !`);
  };

  const handleUpdateTestDriveStatus = (id: string, status: TestDriveStatus) => {
    setTestDrives((prev) =>
      prev.map((td) => {
        if (td.id === id) {
          const updated = { ...td, status };
          saveTestDriveToFirestore(updated);
          return updated;
        }
        return td;
      })
    );
    showToast(`Statut du RDV Test Drive #${id} mis à jour : ${status}`);
  };

  const handleDeleteTestDrive = (id: string) => {
    setTestDrives((prev) => prev.filter((td) => td.id !== id));
    deleteTestDriveFromFirestore(id);
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
    setStockRequests((prev) => [newReq, ...prev]);
    saveStoredStockRequests([newReq, ...stockRequests]);
    saveStockRequestToFirestore(newReq);
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

    setStockRequests((prev) =>
      prev.map((r) => (r.id === requestId ? updatedReq : r))
    );
    saveStockRequestToFirestore(updatedReq);

    if (status === 'Approuvé') {
      const addedQty = targetReq.requestedQuantity || 5;
      setCommercials((prev) =>
        prev.map((c) => {
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
        })
      );
      showToast(`Demande #${requestId} approuvée ! Quota augmenté de +${addedQty} pour ${targetReq.commercialName}.`);
    } else {
      showToast(`Demande #${requestId} refusée.`);
    }
  };

  const handleDeleteStockRequest = (requestId: string) => {
    setStockRequests((prev) => prev.filter((r) => r.id !== requestId));
    deleteStockRequestFromFirestore(requestId);
    showToast(`Demande #${requestId} supprimée.`);
  };

  const handleDeleteReservation = (reservationId: string) => {
    setReservations((prev) => {
      const updated = prev.filter((r) => r.id !== reservationId);
      saveStoredReservations(updated);
      return updated;
    });
    deleteReservationFromFirestore(reservationId);
    showToast(`Réservation ${reservationId} supprimée de la base de données`);
  };

  const handleAddDocumentToReservation = (reservationId: string, doc: UploadedDocument) => {
    setReservations((prev) => {
      const updated = prev.map((r) => {
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
      saveStoredReservations(updated);
      return updated;
    });
    showToast(`Fichier "${doc.name}" ajouté à la réservation ${reservationId}`);
  };

  const handleDeleteAllReservations = async () => {
    setReservations([]);
    saveStoredReservations([]);
    await deleteAllReservationsFromFirestore();
    try {
      await fetch('/api/db/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cars, reservations: [], commercials }),
      });
    } catch (err) {
      // client side ignore
    }
    showToast('🗑️ Toutes les réservations de test ont été supprimées de la base de données !');
  };

  // Count low/out-of-stock items for header indicator
  const outOfStockCount = cars.flatMap((c) => c.colors.filter((col) => col.stock === 0)).length;

  // Render Login Screen if user logged out
  if (!currentUser) {
    return (
      <LoginScreen
        users={commercials}
        siteSettings={siteSettings}
        onLogin={(user) => {
          setCurrentUser(user);
          showToast(`Bienvenue, session activée pour ${user.name} !`);
        }}
        onUpdateUser={handleUpdateCommercial}
      />
    );
  }

  const themeContainerClass =
    theme === 'light'
      ? 'bg-slate-100 text-slate-900'
      : theme === 'red'
      ? 'bg-[#150507] text-red-50'
      : theme === 'carbon'
      ? 'bg-[#090a0f] text-neutral-100'
      : theme === 'electric_cyan'
      ? 'bg-[#03131a] text-cyan-50'
      : theme === 'luxury_gold'
      ? 'bg-[#120e0a] text-amber-50'
      : theme === 'titanium'
      ? 'bg-[#111518] text-slate-100'
      : 'bg-slate-950 text-slate-100';

  const footerBgClass =
    theme === 'light'
      ? 'bg-white border-slate-200 text-slate-600'
      : theme === 'red'
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
    <div className={`relative min-h-screen ${themeContainerClass} flex flex-col font-sans selection:bg-red-500 selection:text-white transition-colors duration-300 overflow-x-hidden`}>

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
                onResetStockToDefault={handleResetStockToDefault}
                onProcessStockRequest={handleProcessStockRequest}
                onNavigateToAdmin={() => setActiveTab('admin')}
              />
            )}

            {activeTab === 'catalog' && (
              <CarCatalog
                cars={cars}
                currentUser={currentUser}
                reservations={reservations}
                onOpenReservationModal={handleOpenReservationModal}
                onOpenTestDriveModal={handleOpenTestDriveModal}
              />
            )}

            {activeTab === 'test_drives' && (
              <TestDriveList
                testDrives={testDrives}
                cars={cars}
                currentUser={currentUser}
                onOpenTestDriveModal={handleOpenTestDriveModal}
                onUpdateStatus={handleUpdateTestDriveStatus}
                onDeleteTestDrive={handleDeleteTestDrive}
              />
            )}

            {activeTab === 'reservations' && (
              <ReservationList
                reservations={reservations}
                currentCommercial={currentUser}
                onUpdateStatus={handleUpdateStatus}
                onDeleteReservation={handleDeleteReservation}
                onDeleteAllReservations={handleDeleteAllReservations}
                onAddDocument={handleAddDocumentToReservation}
                onViewVoucher={(res) => setActiveVoucher(res)}
                onViewDocument={(doc) => setActiveDocument(doc)}
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
                onImportDatabase={handleImportDatabase}
                onResetToFactoryDefaults={handleResetToFactoryDefaults}
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
          onClose={() => setActiveVoucher(null)}
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
