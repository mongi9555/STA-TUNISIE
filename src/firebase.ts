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
import { CarModel, Reservation, CommercialUser, SiteSettings, CarAccessory, CustomQuote, TestDriveAppointment, StockRequest, AdministrativeDocument, AuditLogEntry } from './types';
import { INITIAL_CARS, INITIAL_RESERVATIONS, INITIAL_COMMERCIALS, DEFAULT_SITE_SETTINGS, isVirtualCar, INITIAL_ADMIN_DOCUMENTS, INITIAL_AUDIT_LOGS } from './data/cheryData';

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
 * Seed initial data to Firestore if collections are empty.
 */
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
 * Deletes any virtual/mock placeholder cars from Firestore database.
 */
export async function cleanupVirtualCarsFromFirestore() {
  try {
    const carsSnap = await withTimeout(getDocs(carsCollection), 4000);
    const virtualDocs = carsSnap.docs.filter((d) => {
      const data = d.data() as CarModel;
      return isVirtualCar(data) || isVirtualCar(d.id);
    });

    if (virtualDocs.length > 0) {
      console.log(`[Firestore Cleanup] Deleting ${virtualDocs.length} virtual cars from Firestore...`);
      const batch = writeBatch(db);
      virtualDocs.forEach((d) => {
        batch.delete(d.ref);
      });
      await withTimeout(batch.commit(), 4000);
      console.log('[Firestore Cleanup] Virtual cars successfully deleted from Firestore.');
    }
  } catch (error) {
    console.warn('Note on virtual cars cleanup from Firestore (offline or queued):', error);
  }
}

/**
 * Clean up deprecated demo commercials from Firestore if present
 */
export async function cleanupDeprecatedCommercialsFromFirestore() {
  try {
    const deprecatedIds = ['comm-1', 'comm-2', 'comm-3'];
    for (const id of deprecatedIds) {
      const docRef = doc(db, 'commercials', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await deleteDoc(docRef);
        console.log(`[Firestore Cleanup] Deleted obsolete commercial doc by ID: ${id}`);
      }
    }

    // Also scan existing commercials in Firestore to delete any matching deprecated profiles
    const snap = await getDocs(commercialsCollection);
    for (const d of snap.docs) {
      const data = d.data() as any;
      const name = (data.name || '').toLowerCase();
      const email = (data.email || '').toLowerCase();
      if (
        deprecatedIds.includes(d.id) ||
        name.includes('direction commerciale') ||
        name.includes('karim ben salem') ||
        name.includes('sarra mansour') ||
        email.includes('admin@chery-tunisie.tn') ||
        email.includes('karim.bensalem') ||
        email.includes('sarra.mansour')
      ) {
        await deleteDoc(doc(db, 'commercials', d.id));
        console.log(`[Firestore Cleanup] Purged deprecated commercial document: ${d.id} (${data.name})`);
      }
    }
  } catch (err) {
    console.warn('Note on commercial cleanup from Firestore:', err);
  }
}

/**
 * Clean up legacy mock/example audit logs from Firestore (e.g. audit-log-1 to audit-log-10)
 */
export async function cleanupMockAuditLogsFromFirestore() {
  try {
    const snap = await withTimeout(getDocs(auditLogsCollection), 4000);
    const mockDocs = snap.docs.filter((d) => {
      const id = d.id;
      return id.startsWith('audit-log-') || id.includes('mock');
    });

    if (mockDocs.length > 0) {
      console.log(`[Firestore Cleanup] Deleting ${mockDocs.length} mock audit logs from Firestore...`);
      const batch = writeBatch(db);
      mockDocs.forEach((d) => {
        batch.delete(d.ref);
      });
      await withTimeout(batch.commit(), 4000);
      console.log('[Firestore Cleanup] Mock audit logs successfully deleted from Firestore.');
    }
  } catch (error) {
    console.warn('Note on mock audit logs cleanup from Firestore:', error);
  }
}

/**
 * Seed initial data to Firestore if collections are empty.
 */
export async function seedInitialDataIfEmpty() {
  try {
    // First, purge any leftover virtual cars, deprecated commercial sessions & mock audit logs
    await cleanupVirtualCarsFromFirestore();
    await cleanupDeprecatedCommercialsFromFirestore();
    await cleanupMockAuditLogsFromFirestore();

    const carsSnap = await withTimeout(getDocs(carsCollection), 4000);
    const validCars = carsSnap.docs.filter((d) => !isVirtualCar(d.data() as CarModel));

    if (validCars.length === 0) {
      console.log('Seeding initial official cars to Firestore...');
      const batch = writeBatch(db);
      INITIAL_CARS.forEach((car) => {
        const docRef = doc(db, 'cars', car.id);
        batch.set(docRef, sanitizeForFirestore(car));
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
 * Save single car doc to Firestore
 */
export async function saveCarToFirestore(car: CarModel) {
  try {
    await setDoc(doc(db, 'cars', car.id), sanitizeForFirestore(car));
  } catch (e) {
    console.error('Error saving car to Firestore:', e);
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


