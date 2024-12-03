import { sendPasswordResetEmail } from 'firebase/auth';
import { auth, actionCodeSettings } from '../../config/firebase';
import { AuthError } from './errors';

export async function sendPasswordReset(email: string): Promise<void> {
  try {
    const settings = {
      ...actionCodeSettings,
      url: auth.config.passwordResetURL
    };

    await sendPasswordResetEmail(auth, email, settings);
  } catch (error: any) {
    console.error('Error sending password reset email:', error);
    
    if (error.code === 'auth/unauthorized-continue-uri') {
      throw new AuthError(
        'Unable to send password reset email. Please try again later.',
        error.code
      );
    }
    if (error.code === 'auth/user-not-found') {
      throw new AuthError(
        'No account found with this email address',
        error.code
      );
    }
    if (error.code === 'auth/too-many-requests') {
      throw new AuthError(
        'Too many requests. Please try again in a few minutes.',
        error.code
      );
    }
    
    throw new AuthError(
      'Failed to send password reset email. Please try again.',
      error.code || 'auth/unknown'
    );
  }
}