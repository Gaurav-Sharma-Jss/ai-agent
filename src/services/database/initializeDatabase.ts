import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { COLLECTIONS, SYSTEM_DOCUMENTS } from './collections';
import { initializeSystemSettings } from './systemSettings';
import { initializeUserCounter } from './userCounter';

export async function initializeDatabase(): Promise<void> {
  try {
    // Initialize core system components
    await Promise.allSettled([
      initializeSystemSettings(),
      initializeUserCounter()
    ]);
  } catch (error) {
    console.error('Error initializing database:', error);
    // Don't throw, allow the application to continue
  }
}