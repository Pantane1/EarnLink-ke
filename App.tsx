
import React, { useState, useEffect, useCallback } from 'react';
import { api } from './services/mockService.ts';
import { User, Transaction } from './types.ts';
import LandingPage from './pages/LandingPage.tsx';
import AuthPage from './pages/AuthPage.tsx';
import Dashboard from './pages/Dashboard.tsx';
import WithdrawPage from './pages/WithdrawPage.tsx';
import AdminPage from './pages/AdminPage.tsx';
import HowItWorksPage from './pages/HowItWorksPage.tsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.tsx';
import TermsOfUsePage from './pages/TermsOfUsePage.tsx';
import ContactPage from './pages/ContactPage.tsx';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import Toast from './components/Toast.tsx';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard' | 'withdraw' | 'admin' | 'how-it-works' | 'privacy' | 'terms' | 'contact'>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [toasts, setToasts] = useState<{id: string, message: string, type: 'success' | 'error'}[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    const currentUser = api.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setView('dashboard');
    }
    const adminFlag = localStorage.getItem('earnlink_is_admin');
    if (adminFlag === 'true') setIsAdmin(true);
  }, []);

  const handleAuthSuccess = (newUser: User) => {
    setUser(newUser);
    setView('dashboard');
    addToast(`Welcome back, ${newUser.username}!`);
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setIsAdmin(false);
    setView('landing');
  };

  const refreshUser = () => {
    const updated = api.getCurrentUser();
    if (updated) setUser({ ...updated });
  };

  const navigateTo = (newView: typeof view) => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-emerald-950 text-emerald-50 selection:bg-emerald-500 overflow-x-hidden flex flex-col">
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-emerald-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-emerald-400 rounded-full blur-[120px]"></div>
      </div>

      <Header user={user} currentView={view} setView={navigateTo} onLogout={handleLogout} />

      <main className="relative z-10 flex-1">
        {view === 'landing' && <LandingPage onStart={() => navigateTo('auth')} onHowItWorks={() => navigateTo('how-it-works')} />}
        {view === 'how-it-works' && <HowItWorksPage onBack={() => navigateTo('landing')} onStart={() => navigateTo('auth')} />}
        {view === 'auth' && <AuthPage onSuccess={handleAuthSuccess} onAdminLogin={() => { setIsAdmin(true); navigateTo('admin'); }} />}
        {view === 'privacy' && <PrivacyPolicyPage onBack={() => navigateTo('landing')} />}
        {view === 'terms' && <TermsOfUsePage onBack={() => navigateTo('landing')} />}
        {view === 'contact' && <ContactPage onBack={() => navigateTo('landing')} addToast={addToast} />}
        {view === 'dashboard' && user && (
          <Dashboard 
            user={user} 
            onNavigateWithdraw={() => navigateTo('withdraw')} 
            onLogout={handleLogout} 
            addToast={addToast}
          />
        )}
        {view === 'withdraw' && user && (
          <WithdrawPage 
            user={user} 
            onBack={() => navigateTo('dashboard')} 
            onSuccess={() => { refreshUser(); navigateTo('dashboard'); }}
            addToast={addToast}
          />
        )}
        {view === 'admin' && isAdmin && (
          <AdminPage onLogout={handleLogout} />
        )}
      </main>

      <Footer setView={navigateTo} />

      <div className="fixed bottom-4 right-4 z-[110] flex flex-col gap-2">
        {toasts.map(t => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => setToasts(prev => prev.filter(toast => toast.id !== t.id))} />
        ))}
      </div>
    </div>
  );
};

export default App;