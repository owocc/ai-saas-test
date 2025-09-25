import { useState } from 'react';

export type Plan = 'Hobby' | 'Pro' | 'Enterprise';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [plan, setPlan] = useState<Plan>('Hobby');

  const signIn = () => setIsAuthenticated(true);

  const signOut = () => {
    setIsAuthenticated(false);
    setPlan('Hobby'); // Reset to default plan on sign out
  };
  
  const upgradePlan = (newPlan: Plan) => {
    if (newPlan !== 'Hobby') {
      if (!isAuthenticated) {
        signIn();
      }
      setPlan(newPlan);
    }
  };

  return {
    isAuthenticated,
    plan,
    signIn,
    signOut,
    upgradePlan,
  };
};