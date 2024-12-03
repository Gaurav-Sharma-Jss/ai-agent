import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

interface LoadingToastProps {
  message: string;
  isLoading: boolean;
  onClose: () => void;
}

export function LoadingToast({ message, isLoading, onClose }: LoadingToastProps) {
  const [show, setShow] = useState(false);
  const [showTick, setShowTick] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShow(true);
      setShowTick(false);
    } else if (show) {
      setShowTick(true);
      const timer = setTimeout(() => {
        setShow(false);
        setShowTick(false);
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 flex items-center gap-3 transition-all duration-300">
      {!showTick ? (
        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      ) : (
        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center transform scale-100 transition-transform duration-300">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
      <span className="text-sm font-medium text-gray-700">{message}</span>
    </div>
  );
}