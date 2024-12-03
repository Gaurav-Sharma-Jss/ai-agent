import { useState, useCallback, useEffect } from 'react';
import { useLoadingToast } from './useLoadingToast';

export function useFormChanges<T>(initialData: T | null) {
  const [currentData, setCurrentData] = useState<T | null>(initialData);
  const [hasChanges, setHasChanges] = useState(false);
  const { showLoading, hideLoading } = useLoadingToast();

  useEffect(() => {
    setCurrentData(initialData);
    setHasChanges(false);
  }, [initialData]);

  const updateField = useCallback((field: keyof T, value: any) => {
    setCurrentData(prev => {
      if (!prev) return prev;
      const newData = { ...prev, [field]: value };
      const hasChanged = JSON.stringify(newData) !== JSON.stringify(initialData);
      setHasChanges(hasChanged);
      return newData;
    });
  }, [initialData]);

  const saveChanges = useCallback(async (onSave: (data: T) => Promise<void>) => {
    if (!currentData || !hasChanges) return;
    
    showLoading('Saving changes...');
    try {
      await onSave(currentData);
      setHasChanges(false);
    } finally {
      hideLoading();
    }
  }, [currentData, hasChanges, showLoading, hideLoading]);

  const resetChanges = useCallback(() => {
    setCurrentData(initialData);
    setHasChanges(false);
  }, [initialData]);

  return {
    currentData,
    hasChanges,
    updateField,
    saveChanges,
    resetChanges
  };
}