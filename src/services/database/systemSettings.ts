import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { COLLECTIONS, SYSTEM_DOCUMENTS } from './collections';

export interface SystemSettings {
  initialized: boolean;
  version: string;
  lastUpdated: Date;
}

const DEFAULT_SETTINGS: SystemSettings = {
  initialized: true,
  version: '1.0.0',
  lastUpdated: new Date()
};

export async function initializeSystemSettings(): Promise<void> {
  const settingsRef = doc(db, COLLECTIONS.SETTINGS, SYSTEM_DOCUMENTS.SYSTEM_SETTINGS);
  
  try {
    const settingsDoc = await getDoc(settingsRef);
    if (!settingsDoc.exists()) {
      await setDoc(settingsRef, DEFAULT_SETTINGS);
    }
  } catch (error) {
    console.error('Error initializing system settings:', error);
    // Continue execution even if settings initialization fails
  }
}