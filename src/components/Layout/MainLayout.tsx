import React from 'react';
import { EmailVerificationBanner } from '../EmailVerificationBanner';
import { UserMenu } from '../UserProfile/UserMenu';

interface MainLayoutProps {
  children: React.ReactNode;
  onAdminClick: () => void;
  onSettingsClick: () => void;
}

export function MainLayout({ children, onAdminClick, onSettingsClick }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <EmailVerificationBanner />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">AI Agent Manager</h1>
          <UserMenu
            onAdminClick={onAdminClick}
            onSettingsClick={onSettingsClick}
          />
        </div>
        {children}
      </div>
    </div>
  );
}