import React, { useState, useEffect, useRef } from 'react';
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

const Plan: React.FC<{ title: PlanType; price: string; description: string; features: string[], primary?: boolean; onChoose: () => void; isCurrent: boolean; index: number }> = ({ title, price, description, features, primary = false, onChoose, isCurrent, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const intersectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateX = (y / rect.height - 0.5) * -25;
      const rotateY = (x / rect.width - 0.5) * 25;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
      glow.style.setProperty('--glow-x', `${x}px`);
      glow.style.setProperty('--glow-y', `${y}px`);
      glow.style.opacity = '1';
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      glow.style.opacity = '0';
    };

    if (card) {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (card) {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('opacity-0', 'translate-y-8');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (intersectionRef.current) {
      observer.observe(intersectionRef.current);
    }

    return () => {
      if (intersectionRef.current) {
        observer.unobserve(intersectionRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={intersectionRef} 
      className="opacity-0 translate-y-8"
      style={{ transition: 'opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)', transitionDelay: `${index * 150}ms` }}
    >
      <div 
        ref={cardRef} 
        style={{ transformStyle: 'preserve-3d', transition: 'transform 0.2s ease-out' }}
        className={`relative border rounded-xl p-6 flex flex-col h-full backdrop-blur-sm dark:backdrop-brightness-75 ${primary ? 'bg-purple-600/10 dark:bg-purple-900/30 border-purple-500/50' : 'bg-white/10 dark:bg-gray-800/20 border-gray-200/50 dark:border-gray-700/50'}`}
      >
        <div 
          ref={glowRef} 
          className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 pointer-events-none" 
          style={{ background: 'radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(0, 150, 255, 0.15), transparent 40%)' }}
        />
        <div className="relative z-10 flex flex-col h-full">
          <h3 className={`text-lg font-semibold ${primary ? 'text-purple-500 dark:text-purple-300' : 'text-gray-900 dark:text-white'}`}>{title}</h3>
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
              ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200' 
              : 'bg-gray-200/50 text-gray-800 hover:bg-gray-300/70 dark:bg-gray-700/50 dark:text-white dark:hover:bg-gray-600/70'
            }`}
          >
            {isCurrent ? 'Current Plan' : 'Choose Plan'}
          </button>
        </div>
      </div>
    </div>
  );
};


const PricingPage: React.FC<PricingPageProps> = ({ onPlanChosen }) => {
  const { user, upgradePlan } = useAuthContext();
  const [planToPurchase, setPlanToPurchase] = useState<PlanType | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = document.body.scrollHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Digital Rain
    const columns = Math.floor(canvas.width / 20);
    // Fix: Resolved type error by using a map function with Array.from to correctly create a number array.
    const drops: number[] = Array.from({ length: columns }, () => 1);

    // DNA
    let time = 0;
    const dnaParticles: { x: number; y: number; strand: number; speed: number; originalY: number }[] = [];
    const pointsPerStrand = 100;
    const amplitude = 60;
    const frequency = 0.015;

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < pointsPerStrand; j++) {
            dnaParticles.push({
                x: (canvas.width / pointsPerStrand) * j,
                y: 300 + (i === 0 ? -20 : 20),
                strand: i,
                speed: i === 0 ? 0.3 : -0.3,
                originalY: 300 + (i === 0 ? -20 : 20)
            });
        }
    }
    
    function animate() {
      // Digital Rain background
      ctx.fillStyle = document.documentElement.classList.contains('dark') ? 'rgba(0, 0, 0, 0.04)' : 'rgba(249, 250, 251, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const rainColor = document.documentElement.classList.contains('dark') ? 'rgba(100, 100, 255, 0.3)' : 'rgba(100, 100, 255, 0.1)';
      ctx.fillStyle = rainColor;
      ctx.font = '15px monospace';

      for (let i = 0; i < drops.length; i++) {
          const text = String.fromCharCode(0x30A0 + Math.random() * 96);
          ctx.fillText(text, i * 20, drops[i] * 20);
          if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
              drops[i] = 0;
          }
          drops[i]++;
      }
      
      // DNA Animation
      time += 0.01;
      const scrollY = window.scrollY;

      dnaParticles.forEach(p => {
          // Fix: Wrap particle properties in Number() to ensure they are treated as numbers, resolving the arithmetic errors.
          p.x = (Number(p.x) + Number(p.speed));
          if (Number(p.speed) > 0 && Number(p.x) > canvas.width + 50) p.x = -50;
          if (Number(p.speed) < 0 && Number(p.x) < -50) p.x = canvas.width + 50;
          p.y = Number(p.originalY) + scrollY * 0.3 + Math.sin(Number(p.x) * frequency + time) * amplitude;
      });

      const strand1 = dnaParticles.filter(p => p.strand === 0);
      const strand2 = dnaParticles.filter(p => p.strand === 1);
      const dnaColor = document.documentElement.classList.contains('dark') ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.15)';

      // Rungs
      ctx.lineWidth = 1;
      for (let i = 0; i < strand1.length; i++) {
          const p1 = strand1[i];
          let closestP2 = strand2[0];
          let min_dist = Infinity;
          for(let j = 0; j < strand2.length; j++){
              let dist = Math.abs(p1.x - strand2[j].x);
              if(dist < min_dist){
                  min_dist = dist;
                  closestP2 = strand2[j];
              }
          }
          // Fix: Wrap particle properties in Number() to ensure they are treated as numbers, resolving the arithmetic errors.
          const dist_3d = Math.hypot(Number(p1.x) - Number(closestP2.x), Number(p1.y) - Number(closestP2.y));
          if(dist_3d < 100){
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(closestP2.x, closestP2.y);
              ctx.strokeStyle = dnaColor;
              ctx.stroke();
          }
      }

      // Strands
      [strand1, strand2].forEach(strand => {
          strand.sort((a, b) => a.x - b.x);
          ctx.beginPath();
          ctx.moveTo(strand[0].x, strand[0].y);
          for (let i = 1; i < strand.length; i++) {
              ctx.lineTo(strand[i].x, strand[i].y);
          }
          ctx.strokeStyle = dnaColor;
          ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(animate);
    }
    
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  const currentPlan = user ? user.plan : 'Hobby';

  const handleChoosePlan = (chosenPlan: PlanType) => {
    setPlanToPurchase(chosenPlan);
  };

  const handlePaymentSuccess = () => {
    if (planToPurchase) {
        upgradePlan(planToPurchase);
        setPlanToPurchase(null);
        setShowSuccessMessage(true);
        setTimeout(() => {
            setShowSuccessMessage(false);
            onPlanChosen();
        }, 2500);
    }
  };
  
  const selectedPlanData = plansData.find(p => p.title === planToPurchase);

  return (
    <>
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10"></canvas>
      <div className="w-full max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Upgrade to Unlock More Power</h2>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">Choose a plan that fits your needs. Get a <span className="text-yellow-500 dark:text-yellow-300 font-semibold">token bonus</span> with every upgrade!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {plansData.map((plan, index) => (
                   <Plan 
                      key={plan.title}
                      {...plan}
                      index={index}
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
              <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-up">
                  Upgrade Successful! Welcome to the {user?.plan} plan.
              </div>
          )}
      </div>
    </>
  );
};

export default PricingPage;