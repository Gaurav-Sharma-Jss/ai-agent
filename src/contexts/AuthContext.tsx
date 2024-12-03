import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types/auth';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  signUpWithEmail,
  signInWithEmail,
  sendVerificationEmail as sendVerificationEmailService,
  sendPasswordReset
} from '../services/auth/authService';
import { updateUserDocument, getUserDocument } from '../services/auth/userService';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userData = await getUserDocument(firebaseUser.uid);
          if (userData) {
            setUser({
              ...userData,
              emailVerified: firebaseUser.emailVerified
            });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    signUp: async (email, password, name) => {
      try {
        const newUser = await signUpWithEmail(email, password, name);
        setUser(newUser);
        toast({
          title: 'Success',
          description: 'Account created! Please check your email for verification.',
          type: 'success'
        });
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message,
          type: 'error'
        });
        throw error;
      }
    },
    signIn: async (email, password) => {
      try {
        const userData = await signInWithEmail(email, password);
        setUser(userData);
        toast({
          title: 'Welcome back!',
          description: 'Successfully signed in',
          type: 'success'
        });
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message,
          type: 'error'
        });
        throw error;
      }
    },
    signOut: async () => {
      try {
        await auth.signOut();
        setUser(null);
        toast({
          title: 'Goodbye!',
          description: 'Successfully signed out',
          type: 'success'
        });
      } catch (error: any) {
        toast({
          title: 'Error',
          description: 'Failed to sign out',
          type: 'error'
        });
        throw error;
      }
    },
    updateUser: async (data) => {
      if (!user?.id) return;
      try {
        await updateUserDocument(user.id, data);
        setUser(prev => prev ? { ...prev, ...data } : null);
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
          type: 'success'
        });
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message,
          type: 'error'
        });
        throw error;
      }
    },
    sendVerificationEmail: async () => {
      if (!auth.currentUser) {
        throw new Error('No authenticated user');
      }
      try {
        await sendVerificationEmailService(auth.currentUser);
        toast({
          title: 'Email Sent',
          description: 'Verification email has been sent. Please check your inbox.',
          type: 'success'
        });
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message,
          type: 'error'
        });
        throw error;
      }
    },
    sendPasswordReset: async (email) => {
      try {
        await sendPasswordReset(email);
        toast({
          title: 'Email Sent',
          description: 'Password reset instructions have been sent',
          type: 'success'
        });
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message,
          type: 'error'
        });
        throw error;
      }
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}