import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { User } from '../../types/auth';
import { COLLECTIONS } from '../database/collections';

export async function createUserDocument(userId: string, userData: Omit<User, 'id'>): Promise<void> {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await setDoc(userRef, {
      ...userData,
      createdAt: new Date(),
      lastLogin: new Date(),
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error creating user document:', error);
    throw new Error('Failed to create user account');
  }
}

export async function getUserDocument(userId: string): Promise<User | null> {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return null;
    }

    const data = userDoc.data();
    return {
      id: userDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      lastLogin: data.lastLogin?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date()
    } as User;
  } catch (error) {
    console.error('Error getting user document:', error);
    return null;
  }
}

export async function updateUserDocument(userId: string, data: Partial<User>): Promise<void> {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating user document:', error);
    throw new Error('Failed to update user profile');
  }
}

export async function updateUserAgentCount(userId: string, change: number): Promise<void> {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const currentCount = userDoc.data().agentCount || 0;
    await updateDoc(userRef, {
      agentCount: Math.max(0, currentCount + change),
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating user agent count:', error);
    // Don't throw as this is a non-critical operation
  }
}