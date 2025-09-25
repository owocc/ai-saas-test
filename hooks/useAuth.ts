import { useState, useEffect } from 'react';

export type Plan = 'Hobby' | 'Pro' | 'Enterprise';

export interface TokenHistoryEntry {
  timestamp: number;
  amount: number; // Negative for deduction, positive for addition
  reason: string;
}

export interface CalculationHistoryEntry {
  expression: string;
  result: string;
  cost: number;
  timestamp: number;
}

export interface User {
  name: string;
  email: string;
  plan: Plan;
  tokens: number;
  tokenHistory: TokenHistoryEntry[];
  calculationHistory: CalculationHistoryEntry[];
}

// In a real app, this would be in a secure database
const LOCAL_STORAGE_USERS_KEY = 'calc-ai-users';
const LOCAL_STORAGE_SESSION_KEY = 'calc-ai-session';

const getStoredUsers = (): Record<string, User> => {
  try {
    const users = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    return users ? JSON.parse(users) : {};
  } catch (e) {
    return {};
  }
};

const getStoredSession = (): User | null => {
  try {
    const session = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch (e) {
    return null;
  }
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(getStoredSession());
  const [users, setUsers] = useState<Record<string, User>>(getStoredUsers());

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error("Failed to save users to localStorage", e);
    }
  }, [users]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
      }
    } catch (e) {
      console.error("Failed to save session to localStorage", e);
    }
  }, [user]);

  const updateUserState = (updatedUser: User) => {
    setUser(updatedUser);
    setUsers(prevUsers => ({
      ...prevUsers,
      [updatedUser.email]: updatedUser,
    }));
  };
  
  const register = (name: string, email: string, password: string): { success: boolean, error?: string } => {
    if (users[email]) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    const newUser: User = {
      name,
      email,
      plan: 'Hobby',
      tokens: 0,
      tokenHistory: [],
      calculationHistory: [],
    };
    setUser(newUser);
    setUsers(prev => ({ ...prev, [email]: newUser }));
    return { success: true };
  };

  const login = (email: string, password: string): boolean => {
    const existingUser = users[email];
    if (existingUser) {
      setUser(existingUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const upgradePlan = (newPlan: Plan) => {
    if (!user || user.plan === newPlan) return;
    
    let tokenBonus = 0;
    let reason = `Upgraded to ${newPlan} plan`;
    let newHistory: TokenHistoryEntry[] = user.tokenHistory;

    if (user.plan === 'Hobby' && (newPlan === 'Pro' || newPlan === 'Enterprise')) {
        tokenBonus = 100000;
        reason += ' (Welcome Bonus)';
        const newHistoryEntry: TokenHistoryEntry = {
            timestamp: Date.now(),
            amount: tokenBonus,
            reason: reason,
        };
        newHistory = [newHistoryEntry, ...user.tokenHistory];
    }
    
    const updatedUser: User = { ...user, plan: newPlan, tokens: user.tokens + tokenBonus, tokenHistory: newHistory };
    updateUserState(updatedUser);
  };

  const deductTokens = (amount: number, reason: string) => {
    if (!user || user.tokens < amount) return false;
    
    const newHistoryEntry: TokenHistoryEntry = { timestamp: Date.now(), amount: -amount, reason };
    const updatedUser: User = { ...user, tokens: user.tokens - amount, tokenHistory: [newHistoryEntry, ...user.tokenHistory] };
    updateUserState(updatedUser);
    return true;
  };
  
  const rechargeTokens = (amount: number) => {
    if (!user) return;

    const newHistoryEntry: TokenHistoryEntry = { timestamp: Date.now(), amount: amount, reason: 'Token Recharge' };
    const updatedUser: User = { ...user, tokens: user.tokens + amount, tokenHistory: [newHistoryEntry, ...user.tokenHistory] };
    updateUserState(updatedUser);
  };

  const addCalculationToHistory = (calc: { expression: string; result: string; cost: number; }) => {
    if (!user) return;
    const newEntry: CalculationHistoryEntry = { ...calc, timestamp: Date.now() };
    const updatedUser: User = { ...user, calculationHistory: [newEntry, ...user.calculationHistory].slice(0, 50) };
    updateUserState(updatedUser);
  };

  const clearCalculationHistory = () => {
    if (!user) return;
    const updatedUser: User = { ...user, calculationHistory: [] };
    updateUserState(updatedUser);
  };

  return {
    isAuthenticated: !!user,
    user,
    register,
    login,
    logout,
    upgradePlan,
    deductTokens,
    rechargeTokens,
    addCalculationToHistory,
    clearCalculationHistory,
  };
};
