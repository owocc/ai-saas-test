import React from 'react';
import { LogoIcon, UserCircleIcon } from './icons/index.tsx';
import { useAuthContext } from '../contexts/AuthContext.tsx';
import type { View } from '../App.tsx';

interface HeaderProps {
  activeView: View;
  onNavigate: (view: View) => void;
}

const NavItem: React.FC<{
  onClick: () => void;
  isActive: boolean;
  isPro?: boolean;
  children: React.ReactNode;
}> = ({ onClick, isActive, isPro, children }) => {
  const baseClasses = "px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5";
  const activeClasses = "bg-gray-700/80 text-white";
  const inactiveClasses = "text-gray-400 hover:bg-gray-700/50 hover:text-gray-200";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {children}
      {isPro && <span className="text-xs text-purple-400 bg-purple-900/50 px-1.5 py-0.5 rounded-full">Pro</span>}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ activeView, onNavigate }) => {
  const { isAuthenticated, plan, signIn, signOut } = useAuthContext();

  return (
    <header className="py-4 flex justify-between items-center">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
        <LogoIcon />
        <h1 className="text-lg font-semibold text-white">Calc AI</h1>
      </div>
      <nav className="hidden md:flex items-center p-1 bg-gray-800/50 border border-gray-700 rounded-lg">
        <NavItem onClick={() => onNavigate('home')} isActive={activeView === 'home'}>Home</NavItem>
        <NavItem onClick={() => onNavigate('calculator')} isActive={activeView === 'calculator'} isPro>Calculator</NavItem>
        <NavItem onClick={() => onNavigate('ai-chat')} isActive={activeView === 'ai-chat'} isPro>AI Chat</NavItem>
        <NavItem onClick={() => onNavigate('pricing')} isActive={activeView === 'pricing'}>Pricing</NavItem>
      </nav>
      <div>
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <UserCircleIcon className="w-6 h-6 text-gray-400" />
              <div>
                <span className="font-medium text-white">User</span>
                <span className="block text-xs text-gray-500">{plan} Plan</span>
              </div>
            </div>
            <button
              onClick={signOut}
              className="px-4 py-2 text-sm font-medium bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors">
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={signIn}
            className="px-4 py-2 text-sm font-medium bg-white text-gray-900 rounded-md hover:bg-gray-200 transition-colors">
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
