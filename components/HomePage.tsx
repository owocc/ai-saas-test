
import React from 'react';
import Calculator from './Calculator';
import { CalculatorIcon, SparklesIcon, PriceTagIcon } from './icons';

interface HomePageProps {
  onCalculate: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-gray-800/50 border border-gray-700/80 rounded-lg p-6">
    <div className="flex items-center gap-3 mb-3">
      {icon}
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
    <p className="text-gray-400 text-sm leading-relaxed">{children}</p>
  </div>
);


const HomePage: React.FC<HomePageProps> = ({ onCalculate }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="text-center my-16 max-w-2xl">
        <h1 className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
          The Future of Calculation is Here
        </h1>
        <p className="mt-6 text-lg text-gray-400 leading-8">
          A powerful, intuitive calculator enhanced with artificial intelligence. Perform complex calculations with standard input or just by talking to our AI.
        </p>
      </div>

      <Calculator onCalculate={onCalculate} />

      <div className="w-full max-w-5xl mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard icon={<CalculatorIcon />} title="Standard Calculator">
            A familiar, user-friendly interface for all your day-to-day calculations. Sleek, fast, and reliable.
          </FeatureCard>
          <FeatureCard icon={<SparklesIcon />} title="AI-Powered Chat">
            Switch to AI mode and ask for calculations in plain English. From simple sums to complex queries, let our AI do the heavy lifting.
          </FeatureCard>
          <FeatureCard icon={<PriceTagIcon />} title="Flexible Pricing">
            Start for free and upgrade as you grow. Our pricing plans are designed to fit the needs of individuals and teams alike.
          </FeatureCard>
      </div>
       <footer className="text-center py-16 text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Calc AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
