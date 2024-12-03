import React, { useEffect } from 'react';
import { useAgentStore } from './store/agentStore';
import { AgentsList } from './components/Agents/AgentsList';
import { LoadingToast } from './components/Toast/LoadingToast';
import { useLoadingToast } from './hooks/useLoadingToast';
import { useAuth } from './contexts/AuthContext';
import { AuthForm } from './components/Auth/AuthForm';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { AccountSettings } from './components/UserProfile/AccountSettings';
import { MainLayout } from './components/Layout/MainLayout';
import { TabsContainer } from './components/Layout/TabsContainer';
import { initializeDatabase } from './services/database/initializeDatabase';

function App() {
  const { loadAgents, isLoading: isAppLoading } = useAgentStore();
  const { isLoading, message, showLoading, hideLoading, resetToast } = useLoadingToast();
  const { user, loading: authLoading } = useAuth();
  const [authMode, setAuthMode] = React.useState<'signin' | 'signup'>('signin');
  const [currentView, setCurrentView] = React.useState<'main' | 'admin' | 'settings'>('main');

  useEffect(() => {
    const init = async () => {
      try {
        await initializeDatabase();
      } catch (error) {
        // Database initialization errors are handled internally
      }
    };
    init();
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      try {
        showLoading('Loading your agents...');
        await loadAgents(user.id);
      } catch (error) {
        console.error('Data loading error:', error);
      } finally {
        hideLoading();
      }
    };
    loadUserData();
  }, [user, loadAgents, showLoading, hideLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthForm
        mode={authMode}
        onToggleMode={() => setAuthMode(mode => mode === 'signin' ? 'signup' : 'signin')}
      />
    );
  }

  if (currentView === 'admin' && user.role === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <button
              onClick={() => setCurrentView('main')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to App
            </button>
          </div>
          <AdminDashboard />
        </div>
      </div>
    );
  }

  if (currentView === 'settings') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Account Settings</h1>
            <button
              onClick={() => setCurrentView('main')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to App
            </button>
          </div>
          <AccountSettings />
        </div>
      </div>
    );
  }

  return (
    <MainLayout
      onAdminClick={() => setCurrentView('admin')}
      onSettingsClick={() => setCurrentView('settings')}
    >
      <div className="flex gap-8">
        <AgentsList />
        <TabsContainer />
      </div>

      {isLoading && (
        <LoadingToast
          message={message}
          isLoading={isLoading}
          onClose={resetToast}
        />
      )}
    </MainLayout>
  );
}

export default App;