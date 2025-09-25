import React, { useState, useEffect } from 'react';
import Calculator from './Calculator.tsx';
import { CalculationHistory } from './CalculationHistory.tsx';
import { useAuthContext } from '../contexts/AuthContext.tsx';
import { LockClosedIcon, PaintBrushIcon } from './icons/index.tsx';
import type { View } from '../App.tsx';

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

const SkinSelector: React.FC<{
  activeSkin: Skin,
  setActiveSkin: (skin: Skin) => void,
  onNavigate: (view: View) => void,
}> = ({ activeSkin, setActiveSkin, onNavigate }) => {
  const { user } = useAuthContext();

  return (
    <div className="bg-gray-800/50 border border-gray-700/80 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <PaintBrushIcon className="w-5 h-5 text-purple-400"/>
        <h3 className="text-sm font-semibold text-white">Select a Skin</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {skinOptions.map(skin => {
          const isUnlocked = !skin.isPremium || (user && user.plan !== 'Hobby');
          const isActive = activeSkin === skin.id;

          const handleClick = () => {
            if (isUnlocked) {
              setActiveSkin(skin.id);
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
                  ? 'bg-purple-600 text-white ring-2 ring-offset-2 ring-offset-gray-900 ring-purple-500' 
                  : isUnlocked
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-700 text-gray-400 cursor-pointer'
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
  );
}

const ProCalculatorPage: React.FC<ProCalculatorPageProps> = ({ onNavigate }) => {
  const { user, addCalculationToHistory, clearCalculationHistory } = useAuthContext();
  const [activeSkin, setActiveSkin] = useState<Skin>('modern');
  const [insufficientTokenError, setInsufficientTokenError] = useState(false);

  useEffect(() => {
    if (insufficientTokenError) {
      const timer = setTimeout(() => setInsufficientTokenError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [insufficientTokenError]);

  const handleCalculationComplete = (calculation: { expression: string; result: string; cost: number; }) => {
    setInsufficientTokenError(false);
    addCalculationToHistory(calculation);
  };

  const handleInsufficientTokens = () => {
    setInsufficientTokenError(true);
  };

  const handleUpgradeRequired = () => {
    if (!user) {
      onNavigate('login');
    } else {
      onNavigate('pricing');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-start gap-8">
      <div className="w-full md:w-auto md:flex-1">
        <SkinSelector activeSkin={activeSkin} setActiveSkin={setActiveSkin} onNavigate={onNavigate} />
        <Calculator 
          onCalculationComplete={handleCalculationComplete} 
          skin={activeSkin} 
          onUpgradeRequired={handleUpgradeRequired}
          onInsufficientTokens={handleInsufficientTokens}
          insufficientTokenError={insufficientTokenError}
        />
      </div>
      <div className="w-full md:w-64 lg:w-80">
        <div className="bg-gray-800/50 border border-gray-700/80 rounded-2xl p-4">
          <h2 className="text-lg font-semibold text-white mb-2">Calculation History</h2>
          {user && user.plan === 'Hobby' ? (
             <div className="text-center text-sm text-gray-500 py-8">
                <LockClosedIcon className="w-8 h-8 mx-auto mb-2 text-gray-600"/>
                <p className="font-medium text-gray-400">History is a Pro Feature</p>
                <button onClick={() => onNavigate('pricing')} className="mt-2 text-purple-400 hover:text-purple-300 text-xs font-semibold">Upgrade to Save History</button>
             </div>
          ) : (
            <>
              <CalculationHistory 
                history={user?.calculationHistory || []} 
                onSelect={() => {}} // Selecting from history is complex with the current hook, disabling for now.
                onClear={clearCalculationHistory}
              />
              {(!user?.calculationHistory || user.calculationHistory.length === 0) && (
                <div className="text-center text-sm text-gray-500 py-8">
                  Your calculations will appear here.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProCalculatorPage;
