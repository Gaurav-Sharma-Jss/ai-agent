import { useState, useCallback } from 'react';
import { ToastType } from '../components/Toast/Toast';

interface ToastState {
  title: string;
  description?: string;
  type: ToastType;
}

export function useToast() {
  const [toastState, setToastState] = useState<ToastState | null>(null);

  const toast = useCallback(({ title, description, type }: ToastState) => {
    setToastState({ title, description, type });
  }, []);

  const dismissToast = useCallback(() => {
    setToastState(null);
  }, []);

  return {
    toast,
    dismissToast,
    toastState
  };
}