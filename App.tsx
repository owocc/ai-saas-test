
import React, { useState } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import AIChat from './components/AIChat';
import PricingModal from './components/PricingModal';

type View = 'calculator' | 'ai-chat';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('calculator');
  const [isPricingModalOpen, setPricingModalOpen] = useState(false);

  const handleShowPricing = () => {
    setPricingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans antialiased">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-gray-800/50 to-gray-900 z-0"></div>
      <div className="relative z-10 container mx-auto px-4">
        <Header currentView={currentView} setCurrentView={setCurrentView} />
        <main className="mt-16">
          {currentView === 'calculator' && <HomePage onCalculate={handleShowPricing} />}
          {currentView === 'ai-chat' && <AIChat />}
        </main>
      </div>
      <PricingModal isOpen={isPricingModalOpen} onClose={() => setPricingModalOpen(false)} />
    </div>
  );
};

export default App;
