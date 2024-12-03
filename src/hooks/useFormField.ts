import { useState, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import { useLoadingToast } from './useLoadingToast';

export function useFormField<T>(
  initialValue: T,
  onSave: (value: T) => Promise<void>,
  debounceMs: number = 1000
) {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue] = useDebounce(value, debounceMs);
  const { showLoading, hideLoading } = useLoadingToast();

  const handleChange = useCallback((newValue: T) => {
    setValue(newValue);
  }, []);

  const handleBlur = useCallback(async () => {
    if (JSON.stringify(debouncedValue) !== JSON.stringify(initialValue)) {
      showLoading('Saving changes...');
      try {
        await onSave(debouncedValue);
      } finally {
        hideLoading();
      }
    }
  }, [debouncedValue, initialValue, onSave, showLoading, hideLoading]);

  return {
    value,
    handleChange,
    handleBlur
  };
}