import React from 'react';
import type { View } from '../App.tsx';
import { useAuthContext } from '../contexts/AuthContext.tsx';
import { TokenIcon } from './icons/index.tsx';

interface DashboardPageProps {
  onNavigate: (view: View) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user, rechargeTokens } = useAuthContext();

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Welcome, {user.name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Balance and Recharge */}
        <div className="md:col-span-1 space-y-8">
          <div className="bg-gray-800/50 border border-gray-700/80 rounded-lg p-6">
            <h2 className="text-sm font-semibold text-gray-400 mb-2">TOKEN BALANCE</h2>
            <div className="flex items-center gap-3">
              <TokenIcon className="w-8 h-8 text-yellow-400" />
              <p className="text-4xl font-bold text-white">{user.tokens.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700/80 rounded-lg p-6">
            <h2 className="text-sm font-semibold text-gray-400 mb-3">Recharge Tokens</h2>
            <p className="text-xs text-gray-500 mb-4">Simulate purchasing more tokens for your account.</p>
            <button 
              onClick={() => rechargeTokens(5000)}
              className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-500 transition-colors"
            >
              Add 5,000 Tokens
            </button>
          </div>

           <div className="bg-gray-800/50 border border-gray-700/80 rounded-lg p-6">
            <h2 className="text-sm font-semibold text-gray-400 mb-3">Current Plan</h2>
            <p className="text-xl font-bold text-purple-400 mb-3">{user.plan}</p>
            <button 
              onClick={() => onNavigate('pricing')}
              className="w-full bg-purple-600/50 text-purple-200 font-semibold py-2 rounded-lg hover:bg-purple-600/80 transition-colors"
            >
              Upgrade Plan
            </button>
          </div>
        </div>

        {/* Right Column: Token Usage History */}
        <div className="md:col-span-2 bg-gray-800/50 border border-gray-700/80 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-gray-400 mb-4">TOKEN USAGE HISTORY</h2>
          <div className="max-h-96 overflow-y-auto pr-2 -mr-2">
            {user.tokenHistory.length > 0 ? (
              <ul className="space-y-3">
                {user.tokenHistory.map((entry) => (
                  <li key={entry.timestamp} className="flex justify-between items-center text-sm p-3 bg-gray-900/50 rounded-md">
                    <div>
                      <p className="font-medium text-gray-300">{entry.reason}</p>
                      <p className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</p>
                    </div>
                    <div className={`font-semibold ${entry.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {entry.amount >= 0 ? '+' : ''}{entry.amount.toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500">No token usage history yet.</p>
                <button onClick={() => onNavigate('calculator')} className="mt-2 text-sm text-purple-400 hover:underline">Make your first calculation</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
