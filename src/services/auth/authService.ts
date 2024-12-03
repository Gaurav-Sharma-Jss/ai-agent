import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { auth } from '../../config/firebase';
import { createUserDocument, getUserDocument } from './userService';
import { User } from '../../types/auth';
import { AUTH_CONFIG } from '../../config/auth';
import { AuthError } from './errors';
import { sendVerificationEmail } from './emailVerification';
import { sendPasswordReset } from './passwordReset';

export async function signUpWithEmail(email: string, password: string, name: string): Promise<User> {
  try {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(firebaseUser, { displayName: name });
    
    const userData: Omit<User, 'id'> = {
      email: email.toLowerCase().trim(),
      name,
      role: 'user',
      createdAt: new Date(),
      agentCount: 0,
      lastLogin: new Date(),
      emailVerified: false
    };

    await createUserDocument(firebaseUser.uid, userData);
    await sendVerificationEmail(firebaseUser);

    return { ...userData, id: firebaseUser.uid };
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw new AuthError(AUTH_CONFIG.ERROR_MESSAGES.EMAIL_IN_USE, error.code);
    }
    throw new AuthError(error.message || AUTH_CONFIG.ERROR_MESSAGES.DEFAULT, error.code || 'auth/unknown');
  }
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  try {
    const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
    const userData = await getUserDocument(firebaseUser.uid);
    
    if (!userData) {
      throw new AuthError(AUTH_CONFIG.ERROR_MESSAGES.USER_NOT_FOUND, 'auth/user-not-found');
    }

    return {
      ...userData,
      emailVerified: firebaseUser.emailVerified
    };
  } catch (error: any) {
    if (error.code === 'auth/invalid-credential') {
      throw new AuthError(AUTH_CONFIG.ERROR_MESSAGES.INVALID_CREDENTIALS, error.code);
    }
    throw new AuthError(error.message || AUTH_CONFIG.ERROR_MESSAGES.DEFAULT, error.code || 'auth/unknown');
  }
}

export { sendPasswordReset, sendVerificationEmail };