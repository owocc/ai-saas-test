
import React from 'react';
import { CloseIcon, CheckIcon } from './icons';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Plan: React.FC<{ title: string; price: string; features: string[], primary?: boolean }> = ({ title, price, features, primary = false }) => (
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
    <button className={`mt-8 w-full py-2.5 rounded-md font-semibold text-sm transition-colors ${primary ? 'bg-purple-500 text-white hover:bg-purple-400' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
      Choose Plan
    </button>
  </div>
);

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900/80 border border-gray-700 rounded-2xl w-full max-w-4xl m-4 p-8 relative shadow-2xl shadow-purple-900/20 transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <CloseIcon />
        </button>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Upgrade to Unlock More Power</h2>
          <p className="mt-2 text-gray-400">Choose a plan that fits your needs.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Plan title="Hobby" price="$0" features={["Standard Calculator", "10 AI Chats/day", "Community Support"]} />
          <Plan title="Pro" price="$10" features={["Standard Calculator", "Unlimited AI Chats", "Calculation History", "Priority Support"]} primary />
          <Plan title="Enterprise" price="$25" features={["Everything in Pro", "Team Collaboration", "API Access", "Dedicated Support"]} />
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
