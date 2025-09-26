import React from 'react';
import { useCalculator } from '../hooks/useCalculator.ts';
import { PiIcon, SquareRootIcon, TokenIcon } from './icons/index.tsx';
import type { View } from '../App.tsx';

type Skin = 'modern' | 'noir' | 'scientific' | 'retro';

interface CalculatorProps {
  onCalculationComplete: (calculation: { expression: string; result: string; cost: number }) => void;
  skin: Skin;
  onUpgradeRequired: () => void;
  onInsufficientTokens: () => void;
  insufficientTokenError: boolean;
}

const skins: Record<Skin, Record<string, string>> = {
  modern: {
    container: "bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-xl dark:shadow-purple-900/20",
    display: "bg-white dark:bg-black/50 text-gray-800 dark:text-white",
    button: "bg-white dark:bg-gray-800/80 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-purple-500",
    operatorButton: "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 hover:bg-purple-200/70 dark:hover:bg-purple-900",
    equalsButton: "bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-500",
  },
  noir: {
    container: "bg-gray-200 dark:bg-black border-gray-300 dark:border-gray-800 shadow-xl dark:shadow-gray-700/20 font-mono",
    display: "bg-white dark:bg-gray-800/50 text-black dark:text-white",
    button: "bg-white dark:bg-gray-800 text-black dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-gray-400",
    operatorButton: "bg-black dark:bg-gray-300 text-white dark:text-black hover:bg-gray-800 dark:hover:bg-white",
    equalsButton: "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200",
  },
  scientific: {
    container: "bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-500 dark:to-gray-700 border-gray-400 dark:border-gray-800 shadow-2xl dark:shadow-black/20",
    display: "bg-[#D9E2D5] dark:bg-[#2E3D30] text-[#253628] dark:text-[#CFF1D5] font-mono shadow-inner border-2 border-gray-300 dark:border-black/20",
    button: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white shadow-md border-b-2 border-gray-300 dark:border-gray-900 active:border-b-0 active:mt-0.5 hover:bg-white dark:hover:bg-gray-700",
    operatorButton: "bg-orange-400 dark:bg-orange-600 text-white shadow-md border-b-2 border-orange-600 dark:border-orange-800 active:border-b-0 active:mt-0.5 hover:bg-orange-500 dark:hover:bg-orange-500",
    equalsButton: "bg-blue-500 dark:bg-blue-600 text-white shadow-md border-b-2 border-blue-700 dark:border-blue-800 active:border-b-0 active:mt-0.5 hover:bg-blue-600 dark:hover:bg-blue-500",
  },
  retro: {
    container: "bg-[#DCD5C4] dark:bg-[#3C3524] border-[#B5AE9A] dark:border-[#15120A] shadow-xl dark:shadow-black/20 font-sans",
    display: "bg-[#7A8A8C] dark:bg-[#3A4A4C] text-[#E02626] font-mono shadow-inner border-2 border-[#545F61] dark:border-[#141F21]",
    button: "bg-[#4B4A48] dark:bg-[#2B2A28] text-white dark:text-gray-200 rounded-md shadow-md border-b-2 border-black dark:border-black active:border-b-0 active:mt-0.5 hover:bg-gray-900 dark:hover:bg-black/50",
    operatorButton: "bg-[#A63B3B] dark:bg-[#861B1B] text-white rounded-md shadow-md border-b-2 border-[#6D2727] dark:border-[#4D0707] active:border-b-0 active:mt-0.5 hover:bg-red-800 dark:hover:bg-red-900",
    equalsButton: "bg-[#3B8068] dark:bg-[#1B6048] text-white rounded-md shadow-md border-b-2 border-[#244F40] dark:border-[#042F20] active:border-b-0 active:mt-0.5 hover:bg-green-800 dark:hover:bg-green-900",
  }
};

const Calculator: React.FC<CalculatorProps> = ({ onCalculationComplete, skin, onUpgradeRequired, onInsufficientTokens, insufficientTokenError }) => {
  const { displayValue, handleInput, expressionPreview, potentialCost } = useCalculator({ onCalculationComplete, onUpgradeRequired, onInsufficientTokens });
  const s = skins[skin];

  const baseButtons = ['C', '+/-', '%', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '='];
  const scientificButtons = ['C', '√', 'π', '^', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '+/-', '0', '.', '='];
  const buttons = skin === 'scientific' ? scientificButtons : baseButtons;

  const getButtonContent = (btn: string) => {
    if (btn === '√') return <SquareRootIcon className="w-6 h-6 mx-auto" />;
    if (btn === 'π') return <PiIcon className="w-6 h-6 mx-auto" />;
    return btn;
  }
  
  const getButtonClasses = (btn: string) => {
    const base = "text-2xl font-medium rounded-lg h-16 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2";
    if (['/', '*', '-', '+', '^'].includes(btn)) return `${base} ${s.operatorButton}`;
    if (btn === '=') return `${base} ${s.equalsButton} ${skin !== 'scientific' && 'col-span-2'}`;
    return `${base} ${s.button}`;
  }

  const gridClass = skin === 'scientific' ? 'grid-cols-5' : 'grid-cols-4';

  return (
    <div className={`w-full max-w-sm mx-auto rounded-2xl shadow-2xl p-4 sm:p-6 backdrop-blur-sm border ${s.container} relative`}>
      <div className={`rounded-lg p-4 mb-6 text-right overflow-hidden ${s.display} min-h-[110px] flex flex-col justify-between`}>
        <div className="h-6 flex justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{expressionPreview}</p>
            {potentialCost > 0 && (
                <div className="flex items-center gap-1 text-yellow-400 animate-fade-in">
                    <span className="text-xs font-bold">{potentialCost}</span>
                    <TokenIcon className="w-3 h-3"/>
                </div>
            )}
        </div>
        <p className="text-5xl font-light break-all">{displayValue}</p>
      </div>
      
      {insufficientTokenError && (
        <div className="absolute inset-4 top-[134px] bg-red-800/90 border border-red-600 rounded-lg p-4 text-center text-white backdrop-blur-sm z-10 flex flex-col items-center justify-center">
          <h3 className="font-bold">Insufficient Tokens</h3>
          <p className="text-sm text-red-200">Please recharge to continue calculating.</p>
        </div>
      )}

      <div className={`grid ${gridClass} gap-3 sm:gap-4 ${insufficientTokenError ? 'opacity-20 pointer-events-none' : ''}`}>
        {buttons.map((btn) => {
            const isZero = btn === '0';
            const doubleWidth = isZero && skin !== 'scientific';
            const isEquals = btn === '=';
            const equalsDoubleWidth = isEquals && skin === 'scientific';

            return (
              <button 
                key={btn} 
                onClick={() => handleInput(btn)} 
                className={`${getButtonClasses(btn)} ${doubleWidth ? 'col-span-2' : ''} ${equalsDoubleWidth ? 'col-span-2' : ''}`}
              >
                {getButtonContent(btn)}
              </button>
            )
        })}
      </div>
    </div>
  );
};

export default Calculator;