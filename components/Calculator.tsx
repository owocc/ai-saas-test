import React from 'react';
import { useCalculator } from '../hooks/useCalculator.ts';
import { PiIcon, SquareRootIcon } from './icons/index.tsx';
import type { View } from '../App.tsx';

type Skin = 'modern' | 'noir' | 'scientific' | 'retro';

interface CalculatorProps {
  onCalculationComplete: (calculation: { expression: string; result: string; cost: number; }) => void;
  skin: Skin;
  onUpgradeRequired: () => void;
  onInsufficientTokens: () => void;
  insufficientTokenError: boolean;
}

const skins: Record<Skin, Record<string, string>> = {
  modern: {
    container: "bg-gray-800/50 border-gray-700/80 shadow-purple-900/10",
    display: "bg-gray-900/70 text-white",
    button: "bg-gray-700/60 text-white focus:ring-purple-500",
    buttonHover: "hover:bg-gray-700/90",
    operatorButton: "bg-purple-600/80 text-white",
    operatorButtonHover: "hover:bg-purple-600",
    equalsButton: "bg-green-500/80 text-white",
    equalsButtonHover: "hover:bg-green-500",
  },
  noir: {
    container: "bg-black border-gray-800 shadow-gray-700/10",
    display: "bg-gray-800/50 text-white font-mono",
    button: "bg-gray-800 text-gray-200 focus:ring-gray-400",
    buttonHover: "hover:bg-gray-700",
    operatorButton: "bg-gray-300 text-black",
    operatorButtonHover: "hover:bg-white",
    equalsButton: "bg-white text-black",
    equalsButtonHover: "hover:bg-gray-200",
  },
  scientific: {
    container: "bg-gradient-to-b from-gray-500 to-gray-700 border-gray-800 shadow-black/20",
    display: "bg-[#2E3D30] text-[#CFF1D5] font-mono shadow-inner",
    button: "bg-gray-800 text-white shadow-md border-b-2 border-gray-900 active:border-b-0 active:mt-0.5",
    buttonHover: "hover:bg-gray-700",
    operatorButton: "bg-orange-600 text-white shadow-md border-b-2 border-orange-800 active:border-b-0 active:mt-0.5",
    operatorButtonHover: "hover:bg-orange-500",
    equalsButton: "bg-blue-600 text-white shadow-md border-b-2 border-blue-800 active:border-b-0 active:mt-0.5",
    equalsButtonHover: "hover:bg-blue-500",
  },
  retro: {
    container: "bg-[#DCD5C4] border-[#B5AE9A] shadow-black/20 font-sans",
    display: "bg-[#7A8A8C] text-[#E02626] font-mono shadow-inner border-2 border-[#545F61]",
    button: "bg-[#4B4A48] text-white rounded-md shadow-md border-b-2 border-black active:border-b-0 active:mt-0.5",
    buttonHover: "hover:bg-gray-900",
    operatorButton: "bg-[#A63B3B] text-white rounded-md shadow-md border-b-2 border-[#6D2727] active:border-b-0 active:mt-0.5",
    operatorButtonHover: "hover:bg-red-800",
    equalsButton: "bg-[#3B8068] text-white rounded-md shadow-md border-b-2 border-[#244F40] active:border-b-0 active:mt-0.5",
    equalsButtonHover: "hover:bg-green-800",
  }
};

const Calculator: React.FC<CalculatorProps> = ({ onCalculationComplete, skin, onUpgradeRequired, onInsufficientTokens, insufficientTokenError }) => {
  const { displayValue, handleInput } = useCalculator({ onCalculationComplete, onUpgradeRequired, onInsufficientTokens });
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
    const base = "text-xl font-medium rounded-lg h-16 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2";
    if (['/', '*', '-', '+', '^'].includes(btn)) return `${base} ${s.operatorButton} ${s.operatorButtonHover}`;
    if (btn === '=') return `${base} ${s.equalsButton} ${s.equalsButtonHover} ${skin !== 'scientific' && 'col-span-2'}`;
    return `${base} ${s.button} ${s.buttonHover}`;
  }

  const gridClass = skin === 'scientific' ? 'grid-cols-5' : 'grid-cols-4';

  return (
    <div className={`w-full max-w-sm mx-auto rounded-2xl shadow-2xl p-4 backdrop-blur-sm border ${s.container} relative`}>
      <div className={`rounded-lg p-4 mb-4 text-right overflow-hidden ${s.display}`}>
        <p className="text-4xl font-light break-all">{displayValue}</p>
      </div>
      
      {insufficientTokenError && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] bg-red-800/90 border border-red-600 rounded-lg p-4 text-center text-white backdrop-blur-sm">
          <h3 className="font-bold">Insufficient Tokens</h3>
          <p className="text-sm text-red-200">Please recharge on your dashboard to continue.</p>
        </div>
      )}

      <div className={`grid ${gridClass} gap-3 mt-4 ${insufficientTokenError ? 'opacity-20 pointer-events-none' : ''}`}>
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
