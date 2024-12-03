import React, { useState, FormEvent } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ImageSelector({ value, onChange }: ImageSelectorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState(value);

  const defaultImages = [
    'https://images.unsplash.com/photo-1531379410502-63bfe8cdaf6f?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1464475355873-c68befb75ce9?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150&h=150&fit=crop'
  ];

  const handleImageSelect = (url: string) => {
    onChange(url);
    setIsEditing(false);
  };

  const handleCustomUrl = (e: FormEvent) => {
    e.preventDefault();
    if (imageUrl && imageUrl.trim()) {
      onChange(imageUrl);
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative group">
            <img
              src={value}
              alt="Agent"
              className="w-16 h-16 rounded-full object-cover"
            />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <Upload className="w-6 h-6 text-gray-400" />
          </div>
        )}
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="text-blue-600 text-sm hover:underline"
        >
          {value ? 'Change Image' : 'Add Image'}
        </button>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Select Agent Image</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              {defaultImages.map((url) => (
                <img
                  key={url}
                  src={url}
                  alt="Agent option"
                  className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleImageSelect(url)}
                />
              ))}
            </div>

            <form onSubmit={handleCustomUrl} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Or enter image URL
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="https://..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}