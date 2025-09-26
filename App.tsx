import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import HomePage from './components/HomePage.tsx';
import AIChat from './components/AIChat.tsx';
import PricingPage from './components/PricingPage.tsx';
import ProCalculatorPage from './components/ProCalculatorPage.tsx';
import LoginPage from './components/LoginPage.tsx';
import RegisterPage from './components/RegisterPage.tsx';
import DashboardPage from './components/DashboardPage.tsx';
import RechargePage from './components/RechargePage.tsx';
import { useAuthContext } from './contexts/AuthContext.tsx';

export type View = 'home' | 'calculator' | 'ai-chat' | 'pricing' | 'login' | 'register' | 'dashboard' | 'recharge';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const { isAuthenticated } = useAuthContext();

  const handleNavigation = (view: View) => {
    window.location.hash = `/${view}`;
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '') || 'home';
      setCurrentView(hash as View);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial load

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const protectedViews: View[] = ['calculator', 'ai-chat', 'dashboard', 'recharge'];
    if (!isAuthenticated && protectedViews.includes(currentView)) {
      handleNavigation('login');
    }
    if (isAuthenticated && (currentView === 'login' || currentView === 'register')) {
      handleNavigation('dashboard');
    }
  }, [currentView, isAuthenticated]);
  
  const renderContent = () => {
    const protectedViews: View[] = ['calculator', 'ai-chat', 'dashboard', 'recharge'];
    if (!isAuthenticated && protectedViews.includes(currentView)) {
      return null; // Don't render protected content if not authenticated, effect will redirect
    }

    switch (currentView) {
      case 'home':
        return <HomePage onNavigate={handleNavigation} />;
      case 'calculator':
        return <ProCalculatorPage onNavigate={handleNavigation} />;
      case 'ai-chat':
        return <AIChat />;
      case 'pricing':
        return <PricingPage onPlanChosen={() => handleNavigation(isAuthenticated ? 'calculator' : 'register')} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigation} />;
      case 'register':
        return <RegisterPage onNavigate={handleNavigation} />;
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigation} />;
      case 'recharge':
        return <RechargePage onNavigate={handleNavigation} />;
      default:
        window.location.hash = '/home';
        return <HomePage onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-100 font-sans antialiased">
      <div className="relative z-10 container mx-auto px-4">
        <Header activeView={currentView} onNavigate={handleNavigation} />
        <main className="mt-16">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
