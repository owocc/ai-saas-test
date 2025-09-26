import React, { useState } from 'react';
import { TokenIcon } from './icons/index.tsx';
import type { View } from '../App.tsx';
import { useAuthContext } from '../contexts/AuthContext.tsx';
import PaymentModal from './PaymentModal.tsx';

interface RechargePageProps {
  onNavigate: (view: View) => void;
}

interface TokenPackage {
  amount: number;
  price: string;
  bonus?: string;
  isPopular?: boolean;
}

const packages: TokenPackage[] = [
  { amount: 5000, price: '$1.99' },
  { amount: 20000, price: '$4.99', bonus: '10% bonus' },
  { amount: 100000, price: '$9.99', isPopular: true, bonus: '25% bonus' },
  { amount: 500000, price: '$24.99', bonus: '50% bonus' },
];

const RechargePage: React.FC<RechargePageProps> = ({ onNavigate }) => {
  const [selectedPackage, setSelectedPackage] = useState<TokenPackage | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { rechargeTokens } = useAuthContext();
  
  const handlePaymentSuccess = (amount: number) => {
    rechargeTokens(amount);
    setSelectedPackage(null); // Close modal
    setShowSuccessMessage(true);
    setTimeout(() => {
        setShowSuccessMessage(false);
        onNavigate('dashboard');
    }, 2500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white">Recharge Your Tokens</h2>
          <p className="mt-3 text-lg text-gray-400">Choose a package that suits your needs and continue calculating.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map(pkg => (
            <div 
              key={pkg.amount} 
              className={`relative border rounded-lg p-6 flex flex-col text-center transition-all transform hover:-translate-y-1 cursor-pointer ${pkg.isPopular ? 'bg-purple-600/10 border-purple-500' : 'bg-gray-800/60 border-gray-700'}`}
              onClick={() => setSelectedPackage(pkg)}
            >
              {pkg.isPopular && <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">POPULAR</div>}
              <div className="flex justify-center my-4">
                <TokenIcon className="w-12 h-12 text-yellow-400"/>
              </div>
              <h3 className="text-3xl font-bold text-white">{pkg.amount.toLocaleString()}</h3>
              <p className="text-gray-300 mb-4">Tokens</p>
              {pkg.bonus && <p className="text-sm text-green-400 font-semibold mb-4">{pkg.bonus}</p>}
              <div className="flex-grow"></div>
              <div className="mt-auto bg-gray-700/50 text-white font-semibold py-2.5 rounded-lg">
                {pkg.price}
              </div>
            </div>
          ))}
        </div>
        {selectedPackage && (
          <PaymentModal 
            title="Complete Your Purchase"
            description="You are purchasing"
            itemName={`${selectedPackage.amount.toLocaleString()} Tokens`}
            itemPrice={selectedPackage.price}
            onClose={() => setSelectedPackage(null)}
            onPaymentSuccess={() => handlePaymentSuccess(selectedPackage.amount)}
          />
        )}
        {showSuccessMessage && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
                Payment Successful! Tokens added to your account.
            </div>
        )}
    </div>
  );
};

export default RechargePage;
