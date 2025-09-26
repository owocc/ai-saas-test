import React from 'react';
import { LogoIcon, TokenIcon, SunIcon, MoonIcon } from './icons/index.tsx';
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
  const activeClasses = "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white";
  const inactiveClasses = "text-gray-500 dark:text-gray-400 hover:bg-gray-200/60 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {children}
      {isPro && <span className="text-xs text-purple-500 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50 px-1.5 py-0.5 rounded-full">Pro</span>}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ activeView, onNavigate }) => {
  const { isAuthenticated, user, logout, theme, toggleTheme } = useAuthContext();

  return (
    <header className="py-4 flex justify-between items-center">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
        <LogoIcon className="w-8 h-8 text-black dark:text-white" />
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Calc AI</h1>
      </div>
      <nav className="hidden md:flex items-center p-1 bg-white/50 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg">
        <NavItem onClick={() => onNavigate('home')} isActive={activeView === 'home'}>Home</NavItem>
        <NavItem onClick={() => onNavigate('calculator')} isActive={activeView === 'calculator'} isPro>Calculator</NavItem>
        <NavItem onClick={() => onNavigate('ai-chat')} isActive={activeView === 'ai-chat'} isPro>AI Chat</NavItem>
        <NavItem onClick={() => onNavigate('pricing')} isActive={activeView === 'pricing'}>Pricing</NavItem>
      </nav>
      <div className="flex items-center gap-2">
        <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200/70 dark:hover:bg-gray-700">
            {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5 text-yellow-400" />}
        </button>
        {isAuthenticated && user ? (
          <div className="flex items-center gap-4">
            <div className="group relative">
              <button className="flex items-center gap-2 text-sm p-1.5 rounded-lg hover:bg-gray-200/70 dark:hover:bg-gray-700">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white text-left">{user.name}</span>
                     <div className="flex items-center gap-1 text-yellow-500 dark:text-yellow-400 bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded-full text-xs">
                        <TokenIcon className="w-3 h-3" />
                        <span>{user.tokens.toLocaleString()}</span>
                     </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-left">{user.plan} Plan</p>
                </div>
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-20">
                <div className="py-1">
                  <a onClick={() => onNavigate('dashboard')} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Dashboard</a>
                  <a onClick={() => onNavigate('recharge')} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Recharge</a>
                  <a onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Log Out</a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={() => onNavigate('login')} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-700 rounded-full transition-colors">
              Log In
            </button>
            <button onClick={() => onNavigate('register')} className="rounded-full bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-sm font-semibold shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors">
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;