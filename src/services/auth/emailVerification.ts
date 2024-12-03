import { 
  sendEmailVerification as firebaseSendEmailVerification,
  User as FirebaseUser 
} from 'firebase/auth';
import { auth, actionCodeSettings } from '../../config/firebase';
import { AuthError } from './errors';

let lastEmailSentTimestamp = 0;
const RATE_LIMIT_DURATION = 60000; // 1 minute

export async function sendVerificationEmail(user: FirebaseUser): Promise<void> {
  const now = Date.now();
  const timeElapsed = now - lastEmailSentTimestamp;
  
  if (timeElapsed < RATE_LIMIT_DURATION) {
    const remainingSeconds = Math.ceil((RATE_LIMIT_DURATION - timeElapsed) / 1000);
    throw new AuthError(
      `Please wait ${remainingSeconds} seconds before requesting another verification email`,
      'auth/rate-limited'
    );
  }

  try {
    const settings = {
      ...actionCodeSettings,
      url: auth.config.verifyEmailURL
    };

    await firebaseSendEmailVerification(user, settings);
    lastEmailSentTimestamp = now;
  } catch (error: any) {
    if (error.code === 'auth/unauthorized-continue-uri') {
      throw new AuthError(
        'Unable to send verification email. Please try again later.',
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
      'Failed to send verification email. Please try again.',
      error.code || 'auth/unknown'
    );
  }
}