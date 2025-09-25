import React from 'react';
import { CalculatorIcon, SparklesIcon, PriceTagIcon, PaintBrushIcon } from './icons/index.tsx';
import type { View } from '../App.tsx';
import { useAuthContext } from '../contexts/AuthContext.tsx';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-gray-800/50 border border-gray-700/80 rounded-lg p-6 text-center">
    <div className="flex justify-center items-center gap-3 mb-3">
      {icon}
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
    <p className="text-gray-400 text-sm leading-relaxed">{children}</p>
  </div>
);

interface HomePageProps {
  onNavigate: (view: View) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { isAuthenticated } = useAuthContext();
  
  const handleGetStarted = () => {
    if (isAuthenticated) {
      onNavigate('calculator');
    } else {
      onNavigate('register');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-center my-16 max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
          The Future of Calculation is Here
        </h1>
        <p className="mt-6 text-lg text-gray-400 leading-8">
          A powerful, intuitive calculator enhanced with artificial intelligence and customizable themes. Perform complex calculations with standard input or just by talking to our AI.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
            <button 
              onClick={handleGetStarted}
              className="rounded-md bg-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition-colors"
            >
              Get started
            </button>
            <button onClick={() => onNavigate('pricing')} className="text-sm font-semibold leading-6 text-gray-300 hover:text-white transition-colors">
              View pricing <span aria-hidden="true">→</span>
            </button>
          </div>
      </div>

      <div className="w-full max-w-6xl mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard icon={<CalculatorIcon />} title="Pro Calculator">
            A familiar, user-friendly interface for all your day-to-day calculations. Sleek, fast, and reliable.
          </FeatureCard>
          <FeatureCard icon={<SparklesIcon />} title="AI-Powered Chat">
            Switch to AI mode and ask for calculations in plain English. Let our AI do the heavy lifting for you.
          </FeatureCard>
           <FeatureCard icon={<PaintBrushIcon className="w-6 h-6 text-purple-400" />} title="Customizable Skins">
            Personalize your experience with multiple calculator themes, from modern and minimal to retro and scientific.
          </FeatureCard>
          <FeatureCard icon={<PriceTagIcon />} title="Flexible Pricing">
            Start for free and upgrade as you grow. Our pricing plans are designed to fit the needs of everyone.
          </FeatureCard>
      </div>
       <footer className="text-center py-16 text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Calc AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;