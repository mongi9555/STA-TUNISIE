import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot, getDocs, writeBatch, getDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { CarModel, Reservation, CommercialUser, SiteSettings, CarAccessory, CustomQuote, TestDriveAppointment, StockRequest } from './types';
import { INITIAL_CARS, INITIAL_RESERVATIONS, INITIAL_COMMERCIALS, DEFAULT_SITE_SETTINGS } from './data/cheryData';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Collection references
export const carsCollection = collection(db, 'cars');
export const reservationsCollection = collection(db, 'reservations');
export const testDrivesCollection = collection(db, 'test_drives');
export const commercialsCollection = collection(db, 'commercials');
export const settingsCollection = collection(db, 'settings');
export const accessoriesCollection = collection(db, 'accessories');
export const quotesCollection = collection(db, 'quotes');
export const stockRequestsCollection = collection(db, 'stock_requests');

/**
 * Seed initial data to Firestore if collections are empty.
 */
export async function seedInitialDataIfEmpty() {
  try {
    const carsSnap = await getDocs(carsCollection);
    if (carsSnap.empty) {
      console.log('Seeding initial cars to Firestore...');
      const batch = writeBatch(db);
      INITIAL_CARS.forEach((car) => {
        const docRef = doc(db, 'cars', car.id);
        batch.set(docRef, car);
      });
      await batch.commit();
    }

    const resSnap = await getDocs(reservationsCollection);
    if (!resSnap.empty) {
      console.log('Clearing existing test reservations from Firestore...');
      const batch = writeBatch(db);
      resSnap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }

    const commSnap = await getDocs(commercialsCollection);
    if (commSnap.empty) {
      console.log('Seeding initial commercials to Firestore...');
      const batch = writeBatch(db);
      INITIAL_COMMERCIALS.forEach((comm) => {
        const docRef = doc(db, 'commercials', comm.id);
        batch.set(docRef, comm);
      });
      await batch.commit();
    }

    const siteSettingsDoc = await getDoc(doc(db, 'settings', 'site_settings'));
    if (!siteSettingsDoc.exists()) {
      console.log('Seeding initial site settings to Firestore...');
      await setDoc(doc(db, 'settings', 'site_settings'), DEFAULT_SITE_SETTINGS);
    }
  } catch (error) {
    console.error('Error seeding initial Firestore data:', error);
  }
}

/**
 * Save site settings doc to Firestore
 */
export async function saveSiteSettingsToFirestore(settings: SiteSettings) {
  try {
    await setDoc(doc(db, 'settings', 'site_settings'), settings);
  } catch (e) {
    console.error('Error saving site settings to Firestore:', e);
  }
}

/**
 * Save accessory to Firestore
 */
export async function saveAccessoryToFirestore(accessory: CarAccessory) {
  try {
    await setDoc(doc(db, 'accessories', accessory.id), accessory);
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
    await setDoc(doc(db, 'quotes', quote.id), quote);
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
    await setDoc(doc(db, 'cars', car.id), car);
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
      batch.set(doc(db, 'cars', car.id), car);
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
    await setDoc(doc(db, 'reservations', res.id), res);
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
