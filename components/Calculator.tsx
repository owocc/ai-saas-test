
import React from 'react';
import { useCalculator } from '../hooks/useCalculator';

interface CalculatorProps {
  onCalculate: () => void;
}

const buttonClasses = "bg-gray-700/60 text-xl font-medium text-white rounded-lg h-16 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500";
const operatorButtonClasses = "bg-purple-600/80 hover:bg-purple-600/100";
const equalsButtonClasses = "bg-green-500/80 hover:bg-green-500/100 col-span-2";
const regularButtonClasses = "hover:bg-gray-700/90";

const Calculator: React.FC<CalculatorProps> = ({ onCalculate }) => {
  const { displayValue, handleInput } = useCalculator({ onEquals: onCalculate });

  const buttons = [
    'C', '+/-', '%', '/',
    '7', '8', '9', '*',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '='
  ];
  
  const getButtonClasses = (btn: string) => {
    if (['/', '*', '-', '+'].includes(btn)) return operatorButtonClasses;
    if (btn === '=') return equalsButtonClasses;
    return regularButtonClasses;
  }

  return (
    <div className="w-full max-w-sm mx-auto bg-gray-800/50 border border-gray-700/80 rounded-2xl shadow-2xl shadow-purple-900/10 p-4 backdrop-blur-sm">
      <div className="bg-gray-900/70 rounded-lg p-4 mb-4 text-right">
        <p className="text-4xl font-light text-white break-all">{displayValue}</p>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {buttons.map((btn) => {
            if(btn === '0'){
                 return <button key={btn} onClick={() => handleInput(btn)} className={`${buttonClasses} ${getButtonClasses(btn)} col-span-2`}>{btn}</button>
            }
            if(btn === '='){
                return <button key={btn} onClick={() => handleInput(btn)} className={`${buttonClasses} ${getButtonClasses(btn)}`}>{btn}</button>
            }
            return <button key={btn} onClick={() => handleInput(btn)} className={`${buttonClasses} ${getButtonClasses(btn)}`}>{btn}</button>
        })}
      </div>
    </div>
  );
};

export default Calculator;
