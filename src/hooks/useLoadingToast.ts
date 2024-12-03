import { useState, useCallback } from 'react';

export function useLoadingToast() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const showLoading = useCallback((msg: string) => {
    setMessage(msg);
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const resetToast = useCallback(() => {
    setMessage('');
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    message,
    showLoading,
    hideLoading,
    resetToast
  };
}