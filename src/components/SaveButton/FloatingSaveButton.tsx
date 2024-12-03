import React from 'react';
import { Save } from 'lucide-react';

interface FloatingSaveButtonProps {
  onSave: () => Promise<void>;
  hasChanges: boolean;
  isLoading?: boolean;
}

export function FloatingSaveButton({ onSave, hasChanges, isLoading }: FloatingSaveButtonProps) {
  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!hasChanges || isLoading) return;
    await onSave();
  };

  if (!hasChanges) return null;

  return (
    <button
      onClick={handleSave}
      disabled={isLoading}
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed z-50"
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <Save className="w-5 h-5" />
      )}
      <span>Save Changes</span>
    </button>
  );
}