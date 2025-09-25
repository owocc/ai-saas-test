import React from 'react';
import type { CalculationHistoryEntry } from '../hooks/useAuth.ts';
import { TokenIcon } from './icons/index.tsx';

interface CalculationHistoryProps {
  history: CalculationHistoryEntry[];
  onSelect: (value: string) => void;
  onClear: () => void;
}

export const CalculationHistory: React.FC<CalculationHistoryProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-900/50 rounded-lg p-3 max-h-[400px] overflow-y-auto">
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
        {history.map((calc) => (
          <li
            key={calc.timestamp}
            onClick={() => onSelect(calc.result)}
            className="flex justify-between items-center text-sm p-1.5 rounded-md hover:bg-gray-700/60 cursor-pointer transition-colors"
          >
            <span className="text-gray-400 truncate pr-2">{calc.expression} =</span>
            <div className="flex items-center gap-4 flex-shrink-0">
              <span className="text-white font-medium">{calc.result}</span>
              <div title={`${calc.cost} tokens`} className="flex items-center gap-1 text-yellow-500 text-xs bg-yellow-900/50 px-1.5 py-0.5 rounded-full">
                <TokenIcon className="w-3 h-3"/>
                <span>{calc.cost}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
