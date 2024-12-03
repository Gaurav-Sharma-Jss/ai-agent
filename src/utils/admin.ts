import { doc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { sendPasswordResetEmail, deleteUser as deleteFirebaseUser } from 'firebase/auth';

export async function setAdminRole(userId: string) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role: 'admin',
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error setting admin role:', error);
    throw new Error('Failed to update user role');
  }
}

export async function deleteUser(userId: string) {
  try {
    // Delete user's agents
    const agentsRef = collection(db, 'agents');
    const agentsQuery = query(agentsRef, where('userId', '==', userId));
    const agentsSnapshot = await getDocs(agentsQuery);
    
    const batch = agentsSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(batch);

    // Delete user document
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);

    // Delete Firebase auth user if it exists
    try {
      const user = auth.currentUser;
      if (user && user.uid === userId) {
        await deleteFirebaseUser(user);
      }
    } catch (error) {
      console.error('Error deleting Firebase auth user:', error);
      // Continue even if auth deletion fails
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
}

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}