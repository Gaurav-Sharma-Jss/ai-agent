import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  title: string;
  description?: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
};

const toastStyles = {
  success: 'bg-green-50 border-green-500 text-green-800',
  error: 'bg-red-50 border-red-500 text-red-800',
  warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
  info: 'bg-blue-50 border-blue-500 text-blue-800'
};

export function Toast({ title, description, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const Icon = toastIcons[type];

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 max-w-md rounded-lg border-l-4 p-4 shadow-lg transition-all duration-300',
        toastStyles[type]
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-medium">{title}</h3>
          {description && <p className="mt-1 text-sm opacity-90">{description}</p>}
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <XCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}