import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';

interface UserMenuProps {
  onAdminClick: () => void;
  onSettingsClick: () => void;
}

export function UserMenu({ onAdminClick, onSettingsClick }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const handleMenuClick = (action: 'admin' | 'settings') => {
    setIsOpen(false);
    if (action === 'admin') {
      onAdminClick();
    } else {
      onSettingsClick();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <span className="text-sm font-medium text-gray-700">{user.name}</span>
      </button>

      <div
        className={cn(
          "absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 transition-all transform origin-top-right",
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        <div className="px-4 py-2 border-b">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>

        <button
          onClick={() => handleMenuClick('settings')}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <Settings className="w-4 h-4" />
          Account Settings
        </button>

        {user.role === 'admin' && (
          <button
            onClick={() => handleMenuClick('admin')}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Shield className="w-4 h-4" />
            Admin Dashboard
          </button>
        )}

        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}