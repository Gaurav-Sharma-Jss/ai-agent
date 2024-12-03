import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { COLLECTIONS, SYSTEM_DOCUMENTS } from './collections';

interface UserCount {
  total: number;
  lastUpdated: Date;
}

const DEFAULT_COUNT: UserCount = {
  total: 0,
  lastUpdated: new Date()
};

export async function initializeUserCounter(): Promise<void> {
  const countRef = doc(db, COLLECTIONS.USER_COUNTS, SYSTEM_DOCUMENTS.USER_COUNT);
  
  try {
    const countDoc = await getDoc(countRef);
    if (!countDoc.exists()) {
      await setDoc(countRef, DEFAULT_COUNT);
    }
  } catch (error) {
    console.error('Error initializing user counter:', error);
    // Continue execution even if counter initialization fails
  }
}