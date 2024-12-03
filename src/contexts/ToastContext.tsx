import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast } from '../components/Toast/Toast';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastState {
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (props: ToastState) => void;
  toastState: ToastState | null;
  dismissToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toastState, setToastState] = useState<ToastState | null>(null);

  const toast = useCallback(({ title, description, type }: ToastState) => {
    setToastState({ title, description, type });
  }, []);

  const dismissToast = useCallback(() => {
    setToastState(null);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, toastState, dismissToast }}>
      {children}
      {toastState && (
        <Toast
          title={toastState.title}
          description={toastState.description}
          type={toastState.type}
          onClose={dismissToast}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}