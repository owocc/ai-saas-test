import React from 'react';
import type { Calculation } from '../hooks/useCalculationHistory.ts';

interface CalculationHistoryProps {
  history: Calculation[];
  onSelect: (value: string) => void;
  onClear: () => void;
}

export const CalculationHistory: React.FC<CalculationHistoryProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-900/50 rounded-lg p-3 max-h-32 overflow-y-auto">
       <div className="flex justify-between items-center mb-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">History</h3>
        <button 
          onClick={onClear} 
          className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
        >
          Clear
        </button>
      </div>
      <ul className="space-y-1">
        {history.map((calc, index) => (
          <li
            key={index}
            onClick={() => onSelect(calc.result)}
            className="flex justify-between items-center text-sm p-1.5 rounded-md hover:bg-gray-700/60 cursor-pointer transition-colors"
          >
            <span className="text-gray-400">{calc.expression} =</span>
            <span className="text-white font-medium">{calc.result}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
