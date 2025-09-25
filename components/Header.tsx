
import React from 'react';
import { CalculatorIcon, SparklesIcon } from './icons';

interface HeaderProps {
  currentView: 'calculator' | 'ai-chat';
  setCurrentView: (view: 'calculator' | 'ai-chat') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const navItemClasses = "px-3 py-1.5 text-sm font-medium rounded-md transition-colors";
  const activeClasses = "bg-gray-700/80 text-white";
  const inactiveClasses = "text-gray-400 hover:bg-gray-700/50 hover:text-gray-200";

  return (
    <header className="py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
         <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-md"></div>
        <h1 className="text-lg font-semibold text-white">Calc AI</h1>
      </div>
      <nav className="flex items-center p-1 bg-gray-800/50 border border-gray-700 rounded-lg">
        <button
          onClick={() => setCurrentView('calculator')}
          className={`${navItemClasses} ${currentView === 'calculator' ? activeClasses : inactiveClasses}`}
        >
          Calculator
        </button>
        <button
          onClick={() => setCurrentView('ai-chat')}
          className={`${navItemClasses} ${currentView === 'ai-chat' ? activeClasses : inactiveClasses}`}
        >
          AI Chat
        </button>
      </nav>
      <div>
        <button className="px-4 py-2 text-sm font-medium bg-white text-gray-900 rounded-md hover:bg-gray-200 transition-colors">
          Sign Up
        </button>
      </div>
    </header>
  );
};

export default Header;
