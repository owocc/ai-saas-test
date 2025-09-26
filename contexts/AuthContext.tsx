import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.ts';
import type { User, Plan, Calculation } from '../hooks/useAuth.ts';

type Theme = 'light' | 'dark';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  register: (name: string, email: string, password: string) => { success: boolean; error?: string };
  login: (email: string, password: string) => boolean;
  logout: () => void;
  upgradePlan: (newPlan: Plan) => void;
  deductTokens: (amount: number) => void;
  rechargeTokens: (amount: number) => void;
  addCalculationToHistory: (calculation: Calculation) => void;
  clearCalculationHistory: () => void;
  theme: Theme;
  toggleTheme: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const [theme, setTheme] = useState<Theme>(() => {
    // This now reads the theme from the class set by the script in index.html
    if (typeof window !== 'undefined' && document.documentElement.classList.contains('dark')) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      const root = window.document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return <AuthContext.Provider value={{ ...auth, theme, toggleTheme }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export type { User, Plan };