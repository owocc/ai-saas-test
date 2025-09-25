import React from 'react';
import { CheckIcon } from './icons/index.tsx';
import { useAuthContext, Plan as PlanType } from '../contexts/AuthContext.tsx';

interface PricingPageProps {
  onPlanChosen: () => void;
}

const Plan: React.FC<{ title: PlanType; price: string; features: string[], primary?: boolean, onChoose: () => void, isCurrent: boolean }> = ({ title, price, features, primary = false, onChoose, isCurrent }) => (
  <div className={`border rounded-lg p-6 flex flex-col ${primary ? 'bg-purple-600/10 border-purple-500' : 'bg-gray-800/60 border-gray-700'}`}>
    <h3 className={`text-lg font-semibold ${primary ? 'text-purple-300' : 'text-white'}`}>{title}</h3>
    <p className="mt-2 text-3xl font-bold text-white">{price}<span className="text-sm font-normal text-gray-400">/ month</span></p>
    <ul className="mt-6 space-y-3 text-sm text-gray-300 flex-grow">
      {features.map(feature => (
        <li key={feature} className="flex items-center gap-2">
          <CheckIcon />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <button 
      onClick={onChoose}
      disabled={isCurrent}
      className={`mt-8 w-full py-2.5 rounded-md font-semibold text-sm transition-colors ${
        isCurrent
        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
        : primary 
        ? 'bg-purple-500 text-white hover:bg-purple-400' 
        : 'bg-gray-700 text-white hover:bg-gray-600'
      }`}
    >
      {isCurrent ? 'Current Plan' : 'Choose Plan'}
    </button>
  </div>
);

const PricingPage: React.FC<PricingPageProps> = ({ onPlanChosen }) => {
  const { plan, upgradePlan } = useAuthContext();

  const handleChoosePlan = (chosenPlan: PlanType) => {
    upgradePlan(chosenPlan);
    if (chosenPlan !== 'Hobby') {
      onPlanChosen();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white">Upgrade to Unlock More Power</h2>
          <p className="mt-3 text-lg text-gray-400">Choose a plan that fits your needs.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Plan title="Hobby" price="$0" features={["Standard Calculator", "Limited AI Chats", "Community Support"]} onChoose={() => {}} isCurrent={plan === 'Hobby'} />
          <Plan title="Pro" price="$10" features={["Pro Calculator Access", "Unlimited AI Chats", "Calculation History", "Customizable Skins", "Priority Support"]} primary onChoose={() => handleChoosePlan('Pro')} isCurrent={plan === 'Pro'}/>
          <Plan title="Enterprise" price="$25" features={["Everything in Pro", "Team Collaboration", "API Access", "Dedicated Support"]} onChoose={() => handleChoosePlan('Enterprise')} isCurrent={plan === 'Enterprise'}/>
        </div>
    </div>
  );
};

export default PricingPage;
