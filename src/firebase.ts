import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  initializeFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch,
  getDoc,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { CarModel, Reservation, CommercialUser, SiteSettings, CarAccessory, CustomQuote, TestDriveAppointment, StockRequest, AdministrativeDocument, AuditLogEntry, KnowledgeBaseItem, DocumentTemplateConfig } from './types';
import { INITIAL_CARS, INITIAL_RESERVATIONS, INITIAL_COMMERCIALS, DEFAULT_SITE_SETTINGS, isVirtualCar, INITIAL_ADMIN_DOCUMENTS, INITIAL_AUDIT_LOGS, INITIAL_KNOWLEDGE_BASE } from './data/cheryData';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

let firestoreInstance: Firestore;
try {
  firestoreInstance = firebaseConfig.firestoreDatabaseId
    ? initializeFirestore(app, {
        experimentalAutoDetectLongPolling: true,
        ignoreUndefinedProperties: true,
      }, firebaseConfig.firestoreDatabaseId)
    : initializeFirestore(app, {
        experimentalAutoDetectLongPolling: true,
        ignoreUndefinedProperties: true,
      });
} catch {
  firestoreInstance = firebaseConfig.firestoreDatabaseId
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);
}

export const db = firestoreInstance;

// Collection references
export const carsCollection = collection(db, 'cars');
export const reservationsCollection = collection(db, 'reservations');
export const testDrivesCollection = collection(db, 'test_drives');
export const commercialsCollection = collection(db, 'commercials');
export const settingsCollection = collection(db, 'settings');
export const accessoriesCollection = collection(db, 'accessories');
export const quotesCollection = collection(db, 'quotes');
export const stockRequestsCollection = collection(db, 'stock_requests');
export const adminDocsCollection = collection(db, 'admin_documents');
export const auditLogsCollection = collection(db, 'audit_logs');
export const knowledgeBaseCollection = collection(db, 'knowledge_base');

/**
 * Helper to recursively sanitize objects before saving to Firestore.
 * Removes undefined values and ensures valid serialization without deleting user data.
 */
export function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) return data;
  if (typeof data === 'string') {
    // Only warn if a base64 string exceeds 900KB (approaching Firestore's 1MB doc ceiling)
    if (data.startsWith('data:') && data.length > 900000) {
      console.warn('[Firestore Sanitize] Large base64 data string detected (>900KB).');
    }
    return data;
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeForFirestore) as unknown as T;
  }
  if (typeof data === 'object') {
    const sanitized: Record<string, any> = {};
    for (const [key, val] of Object.entries(data)) {
      if (val !== undefined) {
        sanitized[key] = sanitizeForFirestore(val);
      }
    }
    return sanitized as T;
  }
  return data;
}

/**
 * Helper to run a Firestore promise with a safety timeout to prevent hanging when offline
 */
function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 3500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore operation timed out (offline mode active)')), timeoutMs)
    ),
  ]);
}

/**
 * Safe cleanup routines that protect all user-created items from being deleted.
 */
export async function cleanupVirtualCarsFromFirestore() {
  // No-op: never auto-delete user cars
}

export async function cleanupDeprecatedCommercialsFromFirestore() {
  // No-op: never auto-delete user commercial accounts
}

export async function cleanupMockAuditLogsFromFirestore() {
  // No-op: never auto-delete logs
}

/**
 * Seed initial data to Firestore if collections are empty.
 */
export async function seedInitialDataIfEmpty() {
  try {
    const carsSnap = await withTimeout(getDocs(carsCollection), 4000);
    if (carsSnap.empty) {
      console.log('Seeding initial official cars to Firestore...');
      const batch = writeBatch(db);
      INITIAL_CARS.forEach((car) => {
        const docRef = doc(db, 'cars', car.id);
        batch.set(docRef, sanitizeForFirestore(car));
      });
      await withTimeout(batch.commit(), 4000);
    }

    const kbSnap = await withTimeout(getDocs(knowledgeBaseCollection), 4000);
    if (kbSnap.empty && INITIAL_KNOWLEDGE_BASE) {
      console.log('Seeding initial knowledge base to Firestore...');
      const batch = writeBatch(db);
      INITIAL_KNOWLEDGE_BASE.forEach((kb) => {
        const docRef = doc(db, 'knowledge_base', kb.id);
        batch.set(docRef, sanitizeForFirestore(kb));
      });
      await withTimeout(batch.commit(), 4000);
    }

    const commSnap = await withTimeout(getDocs(commercialsCollection), 4000);
    if (commSnap.empty) {
      console.log('Seeding initial commercials to Firestore...');
      const batch = writeBatch(db);
      INITIAL_COMMERCIALS.forEach((comm) => {
        const docRef = doc(db, 'commercials', comm.id);
        batch.set(docRef, sanitizeForFirestore(comm));
      });
      await withTimeout(batch.commit(), 4000);
    }

    const siteSettingsDoc = await withTimeout(getDoc(doc(db, 'settings', 'site_settings')), 4000);
    if (!siteSettingsDoc.exists()) {
      console.log('Seeding initial site settings to Firestore...');
      await withTimeout(setDoc(doc(db, 'settings', 'site_settings'), sanitizeForFirestore(DEFAULT_SITE_SETTINGS)), 4000);
    }

    const adminDocsSnap = await withTimeout(getDocs(adminDocsCollection), 4000);
    if (adminDocsSnap.empty) {
      console.log('Seeding initial administrative documents to Firestore...');
      const batch = writeBatch(db);
      INITIAL_ADMIN_DOCUMENTS.forEach((docItem) => {
        const docRef = doc(db, 'admin_documents', docItem.id);
        batch.set(docRef, sanitizeForFirestore(docItem));
      });
      await withTimeout(batch.commit(), 4000);
    }
  } catch (error) {
    console.warn('Note on seeding initial Firestore data (operating with local state or offline fallback):', error);
  }
}

/**
 * Save site settings doc to Firestore
 */
export async function saveSiteSettingsToFirestore(settings: SiteSettings) {
  try {
    const sanitized = sanitizeForFirestore(settings);
    await setDoc(doc(db, 'settings', 'site_settings'), sanitized);
  } catch (e) {
    console.error('Error saving site settings to Firestore:', e);
  }
}

/**
 * Save accessory to Firestore
 */
export async function saveAccessoryToFirestore(accessory: CarAccessory) {
  try {
    await setDoc(doc(db, 'accessories', accessory.id), sanitizeForFirestore(accessory));
  } catch (e) {
    console.error('Error saving accessory to Firestore:', e);
  }
}

/**
 * Delete accessory from Firestore
 */
export async function deleteAccessoryFromFirestore(accId: string) {
  try {
    await deleteDoc(doc(db, 'accessories', accId));
  } catch (e) {
    console.error('Error deleting accessory from Firestore:', e);
  }
}

/**
 * Save quote to Firestore
 */
export async function saveQuoteToFirestore(quote: CustomQuote) {
  try {
    await setDoc(doc(db, 'quotes', quote.id), sanitizeForFirestore(quote));
  } catch (e) {
    console.error('Error saving quote to Firestore:', e);
  }
}

/**
 * Delete quote from Firestore
 */
export async function deleteQuoteFromFirestore(quoteId: string) {
  try {
    await deleteDoc(doc(db, 'quotes', quoteId));
  } catch (e) {
    console.error('Error deleting quote from Firestore:', e);
  }
}

/**
 * Save single car doc to Firestore with payload safety and fallback
 */
export async function saveCarToFirestore(car: CarModel): Promise<boolean> {
  try {
    let carToSave: CarModel = { ...car };

    // Offload heavy base64 images to avoid exceeding Firestore 1MB document ceiling
    if (typeof window !== 'undefined' && carToSave.imageUrl && carToSave.imageUrl.startsWith('data:image') && carToSave.imageUrl.length > 50000) {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: `car_${carToSave.id}.jpg`, fileData: carToSave.imageUrl }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.url) {
            carToSave.imageUrl = data.url;
          }
        }
      } catch (uploadErr) {
        console.warn('[Firestore Car Save] Image upload fallback:', uploadErr);
      }
    }

    // Also offload any heavy base64 gallery images
    if (typeof window !== 'undefined' && Array.isArray(carToSave.galleryImages) && carToSave.galleryImages.length > 0) {
      const processedGallery: string[] = [];
      for (let i = 0; i < carToSave.galleryImages.length; i++) {
        const img = carToSave.galleryImages[i];
        if (typeof img === 'string' && img.startsWith('data:image') && img.length > 50000) {
          try {
            const res = await fetch('/api/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ fileName: `car_${carToSave.id}_gal_${i}.jpg`, fileData: img }),
            });
            if (res.ok) {
              const data = await res.json();
              if (data.success && data.url) {
                processedGallery.push(data.url);
                continue;
              }
            }
          } catch (uploadErr) {
            console.warn('[Firestore Car Save] Gallery image upload fallback:', uploadErr);
          }
        }
        processedGallery.push(img);
      }
      carToSave.galleryImages = processedGallery;
    }

    if (typeof window !== 'undefined' && carToSave.ficheTechniqueUrl && carToSave.ficheTechniqueUrl.startsWith('data:') && carToSave.ficheTechniqueUrl.length > 50000) {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: `fiche_${carToSave.id}`, fileData: carToSave.ficheTechniqueUrl }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.url) {
            carToSave.ficheTechniqueUrl = data.url;
          }
        }
      } catch (uploadErr) {
        console.warn('[Firestore Car Save] Fiche upload fallback:', uploadErr);
      }
    }

    const sanitized = sanitizeForFirestore(carToSave);
    await setDoc(doc(db, 'cars', carToSave.id), sanitized);
    console.log(`[Firestore] Modèle "${carToSave.name}" (${carToSave.id}) sauvegardé avec succès.`);
    return true;
  } catch (e) {
    console.error('Error saving car to Firestore:', e);
    return false;
  }
}

/**
 * Delete car doc from Firestore
 */
export async function deleteCarFromFirestore(carId: string) {
  try {
    await deleteDoc(doc(db, 'cars', carId));
  } catch (e) {
    console.error('Error deleting car from Firestore:', e);
  }
}

/**
 * Save all cars array to Firestore (batch write)
 */
export async function saveCarsToFirestore(cars: CarModel[]) {
  try {
    const batch = writeBatch(db);
    cars.forEach((car) => {
      batch.set(doc(db, 'cars', car.id), sanitizeForFirestore(car));
    });
    await batch.commit();
  } catch (e) {
    console.error('Error saving cars batch to Firestore:', e);
  }
}

/**
 * Save single reservation to Firestore
 */
export async function saveReservationToFirestore(res: Reservation) {
  try {
    await setDoc(doc(db, 'reservations', res.id), sanitizeForFirestore(res));
  } catch (e) {
    console.error('Error saving reservation to Firestore:', e);
  }
}

/**
 * Delete reservation from Firestore
 */
export async function deleteReservationFromFirestore(resId: string) {
  try {
    await deleteDoc(doc(db, 'reservations', resId));
  } catch (e) {
    console.error('Error deleting reservation from Firestore:', e);
  }
}

/**
 * Delete all reservations from Firestore
 */
export async function deleteAllReservationsFromFirestore() {
  try {
    const snap = await getDocs(reservationsCollection);
    const batch = writeBatch(db);
    snap.docs.forEach((d) => {
      batch.delete(d.ref);
    });
    await batch.commit();
  } catch (e) {
    console.error('Error clearing reservations in Firestore:', e);
  }
}

/**
 * Save single test drive appointment to Firestore
 */
export async function saveTestDriveToFirestore(testDrive: TestDriveAppointment) {
  try {
    await setDoc(doc(db, 'test_drives', testDrive.id), testDrive);
  } catch (e) {
    console.error('Error saving test drive to Firestore:', e);
  }
}

/**
 * Delete test drive appointment from Firestore
 */
export async function deleteTestDriveFromFirestore(testDriveId: string) {
  try {
    await deleteDoc(doc(db, 'test_drives', testDriveId));
  } catch (e) {
    console.error('Error deleting test drive from Firestore:', e);
  }
}

/**
 * Save single commercial user to Firestore
 */
export async function saveCommercialToFirestore(commercial: CommercialUser) {
  try {
    await setDoc(doc(db, 'commercials', commercial.id), commercial);
  } catch (e) {
    console.error('Error saving commercial to Firestore:', e);
  }
}

/**
 * Delete commercial from Firestore
 */
export async function deleteCommercialFromFirestore(commercialId: string) {
  try {
    await deleteDoc(doc(db, 'commercials', commercialId));
  } catch (e) {
    console.error('Error deleting commercial from Firestore:', e);
  }
}

/**
 * Save stock request to Firestore
 */
export async function saveStockRequestToFirestore(req: StockRequest) {
  try {
    await setDoc(doc(db, 'stock_requests', req.id), req);
  } catch (e) {
    console.error('Error saving stock request to Firestore:', e);
  }
}

/**
 * Delete stock request from Firestore
 */
export async function deleteStockRequestFromFirestore(reqId: string) {
  try {
    await deleteDoc(doc(db, 'stock_requests', reqId));
  } catch (e) {
    console.error('Error deleting stock request from Firestore:', e);
  }
}

/**
 * Save administrative document to Firestore
 */
export async function saveAdminDocToFirestore(adminDoc: AdministrativeDocument) {
  try {
    await setDoc(doc(db, 'admin_documents', adminDoc.id), sanitizeForFirestore(adminDoc));
  } catch (e) {
    console.error('Error saving administrative document to Firestore:', e);
  }
}

/**
 * Delete administrative document from Firestore
 */
export async function deleteAdminDocFromFirestore(docId: string) {
  try {
    await deleteDoc(doc(db, 'admin_documents', docId));
  } catch (e) {
    console.error('Error deleting administrative document from Firestore:', e);
  }
}

/**
 * Save audit log entry to Firestore
 */
export async function saveAuditLogToFirestore(auditLog: AuditLogEntry) {
  try {
    await setDoc(doc(db, 'audit_logs', auditLog.id), sanitizeForFirestore(auditLog));
  } catch (e) {
    console.error('Error saving audit log to Firestore:', e);
  }
}

/**
 * Delete single audit log entry from Firestore
 */
export async function deleteAuditLogFromFirestore(logId: string) {
  try {
    await deleteDoc(doc(db, 'audit_logs', logId));
  } catch (e) {
    console.error('Error deleting audit log from Firestore:', e);
  }
}

/**
 * Delete multiple audit logs from Firestore
 */
export async function deleteMultipleAuditLogsFromFirestore(logIds: string[]) {
  try {
    const batch = writeBatch(db);
    logIds.forEach((id) => {
      batch.delete(doc(db, 'audit_logs', id));
    });
    await batch.commit();
  } catch (e) {
    console.error('Error deleting multiple audit logs in Firestore:', e);
  }
}

/**
 * Clear all audit logs from Firestore
 */
export async function clearAuditLogsFromFirestore() {
  try {
    const snap = await getDocs(auditLogsCollection);
    const batch = writeBatch(db);
    snap.docs.forEach((d) => {
      batch.delete(d.ref);
    });
    await batch.commit();
  } catch (e) {
    console.error('Error clearing audit logs in Firestore:', e);
  }
}

/**
 * Save Knowledge Base item to Firestore
 */
export async function saveKnowledgeBaseItemToFirestore(item: KnowledgeBaseItem) {
  try {
    await setDoc(doc(db, 'knowledge_base', item.id), sanitizeForFirestore(item));
  } catch (e) {
    console.error('Error saving knowledge base item to Firestore:', e);
  }
}

/**
 * Delete Knowledge Base item from Firestore
 */
export async function deleteKnowledgeBaseItemFromFirestore(itemId: string) {
  try {
    await deleteDoc(doc(db, 'knowledge_base', itemId));
  } catch (e) {
    console.error('Error deleting knowledge base item from Firestore:', e);
  }
}

/**
 * Save Document Template Config to Firestore
 */
export async function saveDocTemplateToFirestore(config: DocumentTemplateConfig) {
  try {
    await setDoc(doc(db, 'settings', 'doc_template'), sanitizeForFirestore(config));
  } catch (e) {
    console.error('Error saving document template to Firestore:', e);
  }
}



