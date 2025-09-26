import React, { useState, useEffect } from 'react';
import Calculator from './Calculator.tsx';
import { useAuthContext } from '../contexts/AuthContext.tsx';
import { LockClosedIcon, PaintBrushIcon, TokenIcon } from './icons/index.tsx';
import type { View } from '../App.tsx';
import type { Calculation } from '../hooks/useAuth.ts';

type Skin = 'modern' | 'noir' | 'scientific' | 'retro';

interface ProCalculatorPageProps {
  onNavigate: (view: View) => void;
}

const skinOptions: { id: Skin, name: string, isPremium: boolean }[] = [
  { id: 'modern', name: 'Modern', isPremium: false },
  { id: 'noir', name: 'Noir', isPremium: false },
  { id: 'scientific', name: 'Scientific', isPremium: true },
  { id: 'retro', name: 'Retro', isPremium: true },
];

const FloatingSkinSelector: React.FC<{
  activeSkin: Skin;
  setActiveSkin: (skin: Skin) => void;
  onNavigate: (view: View) => void;
}> = ({ activeSkin, setActiveSkin, onNavigate }) => {
  const { user } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 w-14 h-14 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg flex items-center justify-center text-purple-600 dark:text-purple-400 z-20 hover:scale-110 transition-transform"
        aria-label="Select calculator skin"
      >
        <PaintBrushIcon className="w-6 h-6" />
      </button>

      <div
        className={`fixed bottom-24 left-6 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-4 z-20 transition-all duration-300 ease-in-out
          ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`
        }
      >
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
                <PaintBrushIcon className="w-5 h-5 text-purple-600 dark:text-purple-400"/>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Select a Skin</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none">&times;</button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {skinOptions.map(skin => {
            const isUnlocked = !skin.isPremium || (user && user.plan !== 'Hobby');
            const isActive = activeSkin === skin.id;

            const handleClick = () => {
              if (isUnlocked) {
                setActiveSkin(skin.id);
                setIsOpen(false);
              } else {
                onNavigate('pricing');
              }
            };

            return (
              <button
                key={skin.id}
                onClick={handleClick}
                className={`group relative w-full h-16 rounded-lg text-sm font-medium transition-all flex items-center justify-center
                  ${isActive 
                    ? 'bg-purple-600 text-white ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-purple-500' 
                    : isUnlocked
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-pointer'
                  }`}
              >
                {!isUnlocked && <LockClosedIcon className="w-4 h-4 mr-2" />}
                <span>{skin.name}</span>
                 {!isUnlocked && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                      <span className="text-white text-xs font-semibold">Upgrade to Pro</span>
                    </div>
                  )}
              </button>
            )
          })}
        </div>
      </div>
    </>
  );
}

const ProCalculatorPage: React.FC<ProCalculatorPageProps> = ({ onNavigate }) => {
  const { user, clearCalculationHistory } = useAuthContext();
  const [activeSkin, setActiveSkin] = useState<Skin>('modern');
  const [history, setHistory] = useState<Calculation[]>(user?.history || []);
  const [insufficientTokenError, setInsufficientTokenError] = useState(false);

  useEffect(() => {
    if (user) {
      setHistory(user.history);
    }
  }, [user]);

  const handleUpgradeRequired = () => {
    if (!user) {
      onNavigate('login');
    } else {
      onNavigate('pricing');
    }
  };
  
  const handleCalculationComplete = (calculation: Calculation) => {
    setHistory(prev => [calculation, ...prev]);
    setInsufficientTokenError(false);
  };

  const handleInsufficientTokens = () => {
    setInsufficientTokenError(true);
  };

  const handleClearHistory = () => {
    clearCalculationHistory();
    setHistory([]);
  };

  const isHistoryUnlocked = user && user.plan !== 'Hobby';

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-start gap-8">
      <div className="w-full md:w-auto md:flex-1">
        <Calculator 
          onCalculationComplete={handleCalculationComplete} 
          skin={activeSkin} 
          onUpgradeRequired={handleUpgradeRequired}
          onInsufficientTokens={handleInsufficientTokens}
          insufficientTokenError={insufficientTokenError}
        />
      </div>
      <div className="w-full md:w-64 lg:w-80">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Calculation History</h2>
            {isHistoryUnlocked && history.length > 0 && (
              <button onClick={handleClearHistory} className="text-xs text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400">Clear</button>
            )}
          </div>
          {isHistoryUnlocked ? (
            <div className="h-[480px] overflow-y-auto space-y-2 pr-2 -mr-2">
              {history.length > 0 ? history.map((calc, index) => (
                <div key={index} className="bg-gray-100 dark:bg-gray-700 p-2.5 rounded-md">
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{calc.expression}</p>
                  <div className="flex justify-between items-end">
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{calc.result}</p>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <span className="text-xs font-bold">{calc.cost}</span>
                      <TokenIcon className="w-3 h-3"/>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center text-sm text-gray-500 py-8">
                  <p>Your calculation history will appear here.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-sm text-gray-500 py-8">
              <LockClosedIcon className="w-8 h-8 mx-auto mb-2 text-gray-600"/>
              <p className="font-medium text-gray-700 dark:text-gray-400">History is a Pro Feature</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Upgrade your plan to save and view past calculations.</p>
              <button onClick={() => onNavigate('pricing')} className="mt-3 text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 text-sm font-semibold">Upgrade Plan</button>
            </div>
          )}
        </div>
      </div>
      <FloatingSkinSelector activeSkin={activeSkin} setActiveSkin={setActiveSkin} onNavigate={onNavigate} />
    </div>
  );
};

export default ProCalculatorPage;