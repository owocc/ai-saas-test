import React, { useState } from 'react';
import Header from './components/Header.tsx';
import HomePage from './components/HomePage.tsx';
import AIChat from './components/AIChat.tsx';
import PricingPage from './components/PricingPage.tsx';
import ProCalculatorPage from './components/ProCalculatorPage.tsx';
import { useAuthContext } from './contexts/AuthContext.tsx';

export type View = 'home' | 'calculator' | 'ai-chat' | 'pricing';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const { isAuthenticated, plan } = useAuthContext();

  const handleNavigation = (view: View) => {
    if ((view === 'calculator' || view === 'ai-chat') && (!isAuthenticated || plan === 'Hobby')) {
      setCurrentView('pricing');
    } else {
      setCurrentView(view);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onNavigate={handleNavigation} />;
      case 'calculator':
        return <ProCalculatorPage />;
      case 'ai-chat':
        return <AIChat />;
      case 'pricing':
        return <PricingPage onPlanChosen={() => handleNavigation('calculator')} />;
      default:
        return <HomePage onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans antialiased">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-gray-800/50 to-gray-900 z-0"></div>
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
