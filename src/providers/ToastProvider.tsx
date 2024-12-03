import React from 'react';
import { Toast } from '../components/Toast/Toast';
import { ToastProvider as ToastContextProvider, useToast } from '../contexts/ToastContext';

export function ToastContent() {
  const { toastState, dismissToast } = useToast();

  if (!toastState) return null;

  return (
    <Toast
      title={toastState.title}
      description={toastState.description}
      type={toastState.type}
      onClose={dismissToast}
    />
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastContextProvider>
      {children}
      <ToastContent />
    </ToastContextProvider>
  );
}