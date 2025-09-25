import React, { useState } from 'react';
import Calculator from './Calculator.tsx';
import { useCalculationHistory } from '../hooks/useCalculationHistory.ts';
import { CalculationHistory } from './CalculationHistory.tsx';
import { useAuthContext } from '../contexts/AuthContext.tsx';
import { LockClosedIcon, PaintBrushIcon } from './icons/index.tsx';
import type { Skin } from '../contexts/AuthContext.tsx';

const skinOptions: { id: Skin, name: string, isPremium: boolean }[] = [
  { id: 'modern', name: 'Modern', isPremium: false },
  { id: 'noir', name: 'Noir', isPremium: false },
  { id: 'scientific', name: 'Scientific', isPremium: true },
  { id: 'retro', name: 'Retro', isPremium: true },
];

const SkinSelector: React.FC<{
  activeSkin: Skin,
  setActiveSkin: (skin: Skin) => void
}> = ({ activeSkin, setActiveSkin }) => {
  const { unlockedSkins, unlockSkin } = useAuthContext();

  return (
    <div className="bg-gray-800/50 border border-gray-700/80 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <PaintBrushIcon className="w-5 h-5 text-purple-400"/>
        <h3 className="text-sm font-semibold text-white">Select a Skin</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {skinOptions.map(skin => {
          const isUnlocked = unlockedSkins.has(skin.id);
          const isActive = activeSkin === skin.id;

          if (skin.isPremium && !isUnlocked) {
            return (
               <button key={skin.id} onClick={() => unlockSkin(skin.id)} className="group relative w-full h-16 bg-gray-700 rounded-lg flex items-center justify-center text-sm font-medium text-gray-400 hover:bg-gray-600 transition-colors">
                <LockClosedIcon className="w-4 h-4 mr-2" />
                <span>{skin.name}</span>
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                  <span className="text-white text-xs font-semibold">Unlock</span>
                </div>
              </button>
            )
          }

          return (
            <button key={skin.id} onClick={() => setActiveSkin(skin.id)} className={`w-full h-16 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-purple-600 text-white ring-2 ring-offset-2 ring-offset-gray-900 ring-purple-500' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
              {skin.name}
            </button>
          )
        })}
      </div>
    </div>
  );
}

const ProCalculatorPage: React.FC = () => {
  const { history, addToHistory, clearHistory } = useCalculationHistory();
  const { isAuthenticated, plan } = useAuthContext();
  const [activeSkin, setActiveSkin] = useState<Skin>('modern');

  const handleCalculationComplete = (calculation: { expression: string; result: string }) => {
    if (isAuthenticated && plan !== 'Hobby') {
      addToHistory(calculation);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-start gap-8">
      <div className="w-full md:w-auto md:flex-1">
        <SkinSelector activeSkin={activeSkin} setActiveSkin={setActiveSkin} />
        <Calculator onCalculationComplete={handleCalculationComplete} skin={activeSkin} />
      </div>
      <div className="w-full md:w-64 lg:w-72">
        <div className="bg-gray-800/50 border border-gray-700/80 rounded-2xl p-4">
          <h2 className="text-lg font-semibold text-white mb-2">Calculation History</h2>
          <CalculationHistory 
            history={history} 
            onSelect={() => {}} // Selecting from history is complex with the current hook, disabling for now.
            onClear={clearHistory}
          />
           {history.length === 0 && (
            <div className="text-center text-sm text-gray-500 py-8">
              Your calculations will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProCalculatorPage;
