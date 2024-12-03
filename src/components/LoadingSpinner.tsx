import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="inline-block">
      <div className="w-4 h-4 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
    </div>
  );
}