import React, { useState } from 'react';
import { CheckIcon } from './icons/index.tsx';
import { useAuthContext } from '../contexts/AuthContext.tsx';
import type { Plan as PlanType } from '../hooks/useAuth.ts';
import PaymentModal from './PaymentModal.tsx';

interface PricingPageProps {
  onPlanChosen: () => void;
}

const plansData: { title: PlanType; price: string; description: string; features: string[], primary?: boolean }[] = [
    { 
        title: "Hobby", 
        price: "$0", 
        description: "For personal use and exploration.",
        features: ["Standard Calculator", "Basic AI Chat", "Community Support"],
    },
    { 
        title: "Pro", 
        price: "$10", 
        description: "For professionals and power users.",
        features: ["Pro Calculator Access", "Unlimited AI Chats", "Calculation History", "All Calculator Skins", "100,000 Token Bonus", "Priority Support"], 
        primary: true,
    },
    { 
        title: "Enterprise", 
        price: "$25", 
        description: "For teams and businesses.",
        features: ["Everything in Pro", "Team Collaboration", "API Access", "Dedicated Support"],
    }
];

const Plan: React.FC<{ title: PlanType; price: string; description: string, features: string[], primary?: boolean, onChoose: () => void, isCurrent: boolean }> = ({ title, price, description, features, primary = false, onChoose, isCurrent }) => (
  <div className={`border rounded-lg p-6 flex flex-col ${primary ? 'bg-purple-600/10 border-purple-500' : 'bg-white dark:bg-gray-800/60 border-gray-200 dark:border-gray-700'}`}>
    <h3 className={`text-lg font-semibold ${primary ? 'text-purple-600 dark:text-purple-300' : 'text-gray-900 dark:text-white'}`}>{title}</h3>
    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
    <p className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">{price}<span className="text-sm font-normal text-gray-500 dark:text-gray-400">/ month</span></p>
    <ul className="mt-6 space-y-3 text-sm text-gray-600 dark:text-gray-300 flex-grow">
      {features.map(feature => (
        <li key={feature} className="flex items-start gap-2">
          <CheckIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <button 
      onClick={onChoose}
      disabled={isCurrent}
      className={`mt-8 w-full py-2.5 rounded-md font-semibold text-sm transition-colors ${
        isCurrent
        ? 'bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed'
        : primary 
        ? 'bg-purple-500 text-white hover:bg-purple-400' 
        : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
      }`}
    >
      {isCurrent ? 'Current Plan' : 'Choose Plan'}
    </button>
  </div>
);

const PricingPage: React.FC<PricingPageProps> = ({ onPlanChosen }) => {
  const { user, upgradePlan } = useAuthContext();
  const [planToPurchase, setPlanToPurchase] = useState<PlanType | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const currentPlan = user ? user.plan : 'Hobby';

  const handleChoosePlan = (chosenPlan: PlanType) => {
    setPlanToPurchase(chosenPlan);
  };

  const handlePaymentSuccess = () => {
    if (planToPurchase) {
        upgradePlan(planToPurchase);
        setPlanToPurchase(null); // Close modal
        setShowSuccessMessage(true);
        setTimeout(() => {
            setShowSuccessMessage(false);
            onPlanChosen(); // Navigate away
        }, 2500);
    }
  };
  
  const selectedPlanData = plansData.find(p => p.title === planToPurchase);

  return (
    <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Upgrade to Unlock More Power</h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">Choose a plan that fits your needs. Get a <span className="text-yellow-500 dark:text-yellow-300 font-semibold">token bonus</span> with every upgrade!</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plansData.map(plan => (
                 <Plan 
                    key={plan.title}
                    {...plan}
                    onChoose={() => handleChoosePlan(plan.title)} 
                    isCurrent={currentPlan === plan.title}
                 />
            ))}
        </div>

        {selectedPlanData && (
          <PaymentModal 
            title="Upgrade Your Plan"
            description="You are upgrading to the"
            itemName={`${selectedPlanData.title} Plan`}
            itemPrice={`${selectedPlanData.price}/month`}
            onClose={() => setPlanToPurchase(null)}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}

        {showSuccessMessage && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
                Upgrade Successful! Welcome to the {user?.plan} plan.
            </div>
        )}
    </div>
  );
};

export default PricingPage;