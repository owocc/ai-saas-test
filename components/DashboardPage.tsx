import React from 'react';
import type { View } from '../App.tsx';
import { useAuthContext } from '../contexts/AuthContext.tsx';
import { TokenIcon } from './icons/index.tsx';

interface DashboardPageProps {
  onNavigate: (view: View) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuthContext();

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Welcome, {user.name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 md:col-span-1">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Account</h2>
          <p className="text-base text-gray-700 dark:text-gray-300 mb-1">Email: {user.email}</p>
          <p className="text-base text-gray-700 dark:text-gray-300 mb-4">Plan: <span className="font-semibold text-purple-600 dark:text-purple-400">{user.plan}</span></p>
           <button 
            onClick={() => onNavigate('calculator')}
            className="w-full bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white font-semibold py-2.5 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Go to Calculator
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 md:col-span-2">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Your Tokens</h2>
            <div className="flex items-center gap-4 mb-4">
              <TokenIcon className="w-10 h-10 text-yellow-400"/>
              <div>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">{user.tokens.toLocaleString()}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Tokens available</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => onNavigate('recharge')}
                className="flex-1 bg-green-600 text-white font-semibold py-2.5 rounded-lg hover:bg-green-500 transition-colors"
              >
                Recharge Tokens
              </button>
              <button 
                onClick={() => onNavigate('pricing')}
                className="flex-1 bg-purple-600 text-white font-semibold py-2.5 rounded-lg hover:bg-purple-500 transition-colors"
              >
                {user.plan === 'Hobby' ? 'Upgrade Plan' : 'Manage Plan'}
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
