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
    // Initialize state from the class set by the inline script in index.html.
    // This ensures no hydration mismatch between a server-rendered assumption and the client reality.
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    // Fallback for environments without a DOM.
    return 'light';
  });

  // Effect to apply the current theme class to the <html> element.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme !== 'dark');
  }, [theme]);

  // Effect to listen for changes in the user's OS theme preference.
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only apply the OS theme if the user hasn't manually chosen a theme.
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      // When the user manually toggles, we store their preference to override the OS setting.
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
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
