import { useState, useEffect } from 'react';

export type Plan = 'Hobby' | 'Pro' | 'Enterprise';

export interface Calculation {
  expression: string;
  result: string;
  cost: number;
}
export interface User {
  name: string;
  email: string;
  plan: Plan;
  tokens: number;
  history: Calculation[];
}

interface UserRecord extends User {
  password_mock: string;
}

// In-memory user store for simplicity.
const users: Record<string, UserRecord> = {
    'user@example.com': {
        name: 'Demo User',
        email: 'user@example.com',
        password_mock: 'password123',
        plan: 'Hobby',
        tokens: 1000,
        history: [],
    }
};

const getInitialUser = (): User | null => {
    try {
        const item = window.sessionStorage.getItem('user');
        return item ? JSON.parse(item) : null;
    } catch (error) {
        return null;
    }
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(getInitialUser);

  useEffect(() => {
    try {
      if (user) {
        window.sessionStorage.setItem('user', JSON.stringify(user));
        // Also update the in-memory store to persist across logins/logouts in the same session
        if (users[user.email]) {
            users[user.email] = { ...users[user.email], ...user };
        }
      } else {
        window.sessionStorage.removeItem('user');
      }
    } catch (error) {
      console.error("Failed to update session storage", error);
    }
  }, [user]);

  const register = (name: string, email: string, password: string): { success: boolean, error?: string } => {
    if (users[email]) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    const newUser: UserRecord = {
      name,
      email,
      password_mock: password,
      plan: 'Hobby',
      tokens: 1000,
      history: [],
    };
    users[email] = newUser;
    setUser(newUser);
    return { success: true };
  };

  const login = (email: string, password: string): boolean => {
    const existingUser = users[email];
    if (existingUser && existingUser.password_mock === password) { 
      setUser({
        name: existingUser.name,
        email: existingUser.email,
        plan: existingUser.plan,
        tokens: existingUser.tokens,
        history: existingUser.history,
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const upgradePlan = (newPlan: Plan) => {
    if (!user || user.plan === newPlan) return;

    let bonusTokens = 0;
    if (newPlan === 'Pro') bonusTokens = 100000;
    if (newPlan === 'Enterprise') bonusTokens = 10000000;
    
    setUser(prevUser => {
        if (!prevUser) return null;
        return { 
            ...prevUser, 
            plan: newPlan,
            tokens: prevUser.tokens + bonusTokens,
        };
    });
  };

  const deductTokens = (amount: number) => {
    setUser(prevUser => {
        if (!prevUser) return null;
        return {
            ...prevUser,
            tokens: Math.max(0, prevUser.tokens - amount)
        };
    });
  };
  
  const rechargeTokens = (amount: number) => {
      setUser(prevUser => {
          if (!prevUser) return null;
          return {
              ...prevUser,
              tokens: prevUser.tokens + amount,
          }
      })
  }

  const addCalculationToHistory = (calculation: Calculation) => {
    setUser(prevUser => {
        if (!prevUser) return null;
        const newHistory = [calculation, ...prevUser.history].slice(0, 50); // Keep last 50
        return {
            ...prevUser,
            history: newHistory,
        }
    });
  };

  const clearCalculationHistory = () => {
      setUser(prevUser => {
          if (!prevUser) return null;
          return {
              ...prevUser,
              history: []
          }
      });
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
