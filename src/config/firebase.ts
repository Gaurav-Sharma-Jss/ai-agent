import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { env } from './env';

const app = initializeApp({
  apiKey: env.firebase.apiKey,
  authDomain: env.firebase.authDomain,
  projectId: env.firebase.projectId,
  storageBucket: env.firebase.storageBucket,
  messagingSenderId: env.firebase.messagingSenderId,
  appId: env.firebase.appId,
  measurementId: env.firebase.measurementId
});

export const db = getFirestore(app);
export const auth = getAuth(app);

// Configure auth settings
auth.useDeviceLanguage();

// Enable offline persistence for Firestore
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support persistence.');
  }
});

// Initialize Firebase Authentication action handlers
const actionCodeSettings = {
  url: window.location.origin,
  handleCodeInApp: true
};

auth.config.authDomain = window.location.hostname;
auth.config.passwordResetURL = `${window.location.origin}/auth/reset-password`;
auth.config.verifyEmailURL = `${window.location.origin}/auth/verify-email`;

export { actionCodeSettings };