import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth.ts';
import type { User, Plan, Calculation } from '../hooks/useAuth.ts';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export type { User, Plan };
