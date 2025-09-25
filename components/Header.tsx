import React from 'react';
import { LogoIcon, TokenIcon } from './icons/index.tsx';
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
  const { isAuthenticated, user, logout } = useAuthContext();

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
        {isAuthenticated && user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-1.5">
              <TokenIcon className="w-5 h-5 text-yellow-400" />
              <div className="text-white font-semibold">{user.tokens.toLocaleString()}</div>
            </div>
            <div className="group relative">
              <button className="flex items-center gap-2 text-sm p-1.5 rounded-lg hover:bg-gray-700/50">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="font-medium text-white">{user.name}</span>
                  <span className="block text-xs text-gray-500">{user.plan} Plan</span>
                </div>
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                <a onClick={() => onNavigate('dashboard')} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/70 cursor-pointer">Dashboard</a>
                <a onClick={logout} className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-700/70 cursor-pointer">Sign Out</a>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('login')}
              className="px-4 py-2 text-sm font-medium text-gray-200 rounded-md hover:bg-gray-700/50 transition-colors">
              Log In
            </button>
            <button
              onClick={() => onNavigate('register')}
              className="px-4 py-2 text-sm font-medium bg-white text-gray-900 rounded-md hover:bg-gray-200 transition-colors">
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;