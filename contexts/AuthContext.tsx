import React, { createContext, useContext } from 'react';
import { useAuth, Plan, Skin } from '../hooks/useAuth.ts';

interface AuthContextType {
  isAuthenticated: boolean;
  plan: Plan;
  unlockedSkins: Set<Skin>;
  signIn: () => void;
  signOut: () => void;
  upgradePlan: (newPlan: Plan) => void;
  unlockSkin: (skin: Skin) => void;
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

export type { Plan, Skin };
