import { useState } from 'react';

export type Plan = 'Hobby' | 'Pro' | 'Enterprise';
export type Skin = 'modern' | 'noir' | 'scientific' | 'retro';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [plan, setPlan] = useState<Plan>('Hobby');
  const [unlockedSkins, setUnlockedSkins] = useState(new Set<Skin>(['modern', 'noir']));

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

  const unlockSkin = (skin: Skin) => {
    setUnlockedSkins(prev => new Set(prev).add(skin));
  };

  return {
    isAuthenticated,
    plan,
    unlockedSkins,
    signIn,
    signOut,
    upgradePlan,
    unlockSkin,
  };
};
