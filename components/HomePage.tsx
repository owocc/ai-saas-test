import React, { useEffect, useRef, useState } from 'react';
import { CalculatorIcon, SparklesIcon, PriceTagIcon, PaintBrushIcon } from './icons/index.tsx';
import type { View } from '../App.tsx';
import { useAuthContext } from '../contexts/AuthContext.tsx';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="p-[1px] bg-gradient-to-br from-gray-200 to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-black rounded-xl group transition-all duration-500 hover:scale-105 hover:!bg-gradient-to-br hover:from-purple-600 hover:via-purple-800 hover:to-indigo-600">
    <div className="bg-white dark:bg-gray-900 rounded-[11px] p-6 text-center h-full flex flex-col items-center">
      <div className="mb-4 text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors duration-500">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{children}</p>
    </div>
  </div>
);

interface HomePageProps {
  onNavigate: (view: View) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { isAuthenticated } = useAuthContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 2; // Two main strands
    const pointsPerStrand = 150;
    const amplitude = 50;
    const frequency = 0.02;

    class Particle {
      x: number;
      y: number;
      originalY: number;
      color: string;
      speed: number;

      constructor(x: number, y: number, color: string, speed: number) {
        this.x = x;
        this.y = y;
        this.originalY = y;
        this.color = color;
        this.speed = speed;
      }

      draw() {
        if(!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update(time: number) {
        this.x = (this.x + this.speed);
        if (this.speed > 0 && this.x > canvas.width + 100) {
            this.x = -100;
        } else if (this.speed < 0 && this.x < -100) {
            this.x = canvas.width + 100;
        }
        this.y = this.originalY + Math.sin(this.x * frequency + time) * amplitude;
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];

      const isDark = document.documentElement.classList.contains('dark');
      const colors = isDark ? ['#6D28D9', '#9D174D'] : ['#8B5CF6', '#EC4899'];
      const speeds = [0.2, -0.2];

      for (let i = 0; i < particleCount; i++) {
        for (let j = 0; j < pointsPerStrand; j++) {
          const x = (canvas.width + 200) / pointsPerStrand * j - 100;
          const y = canvas.height / 2 + (i === 0 ? -20 : 20);
          particles.push(new Particle(x, y, colors[i], speeds[i]));
        }
      }
    };
    
    let time = 0;
    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = document.documentElement.classList.contains('dark');

      for (let i = 0; i < pointsPerStrand; i++) {
        const p1_index = i;
        const p2_index = i + pointsPerStrand;
        
        const p1 = particles[p1_index];
        const p2 = particles[p2_index];

        p1.update(time);
        p2.update(time);

        const distance = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const opacity = 1 - (distance / 100);
            const rungColor = isDark ? `rgba(109, 40, 217, ${opacity * 0.5})` : `rgba(139, 92, 246, ${opacity * 0.5})`;
            ctx.strokeStyle = rungColor;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
      }

       for (let i = 0; i < particleCount; i++) {
            ctx.beginPath();
            const startIndex = i * pointsPerStrand;
            particles.slice(startIndex, startIndex + pointsPerStrand).sort((a,b) => a.x - b.x);
            ctx.moveTo(particles[startIndex].x, particles[startIndex].y);
            for (let j = 1; j < pointsPerStrand; j++) {
                ctx.lineTo(particles[startIndex + j].x, particles[startIndex + j].y);
            }
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            if (isDark) {
              gradient.addColorStop(0, i === 0 ? 'rgba(109, 40, 217, 0.5)' : 'rgba(157, 23, 77, 0.5)');
              gradient.addColorStop(1, i === 0 ? 'rgba(109, 40, 217, 0.1)' : 'rgba(157, 23, 77, 0.1)');
            } else {
              gradient.addColorStop(0, i === 0 ? 'rgba(139, 92, 246, 0.5)' : 'rgba(236, 72, 153, 0.5)');
              gradient.addColorStop(1, i === 0 ? 'rgba(139, 92, 246, 0.1)' : 'rgba(236, 72, 153, 0.1)');
            }
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.stroke();
       }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    window.addEventListener('resize', init);

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          init();
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true });
    
    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);
  
  const handleGetStarted = () => {
    onNavigate(isAuthenticated ? 'calculator' : 'register');
  };

  const parallaxStyle = (factor: number) => ({
    transform: `translateY(${scrollY * factor}px)`,
  });

  return (
    <div>
       <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 opacity-60 dark:opacity-40"></canvas>
      <div className="flex flex-col items-center">
        <div className="text-center my-16 max-w-3xl min-h-[50vh] flex flex-col justify-center">
          <h1 
            className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 animate-fade-in-up"
            style={{...parallaxStyle(0.5)}}
          >
            The Future of Calculation is Here
          </h1>
          <p 
            className="mt-6 text-lg text-gray-600 dark:text-gray-400 leading-8 animate-fade-in-up"
            style={{ animationDelay: '0.2s', ...parallaxStyle(0.3) }}
          >
            A powerful, intuitive calculator enhanced with artificial intelligence and customizable themes. Perform complex calculations with standard input or just by talking to our AI.
          </p>
          <div 
            className="mt-10 flex items-center justify-center gap-x-6 animate-fade-in-up"
            style={{ animationDelay: '0.4s', ...parallaxStyle(0.1) }}
          >
            <button 
              onClick={handleGetStarted}
              className="rounded-full bg-black dark:bg-white text-white dark:text-black px-5 py-3 text-sm font-semibold shadow-lg hover:bg-gray-800 dark:hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300 transform hover:scale-105"
            >
              Get started
            </button>
            <button onClick={() => onNavigate('pricing')} className="text-sm font-semibold leading-6 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
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
            <FeatureCard icon={<PaintBrushIcon />} title="Customizable Skins">
              Personalize your experience with multiple calculator themes, from modern and minimal to retro and scientific.
            </FeatureCard>
            <FeatureCard icon={<PriceTagIcon />} title="Flexible Pricing">
              Start for free and upgrade as you grow. Our pricing plans are designed to fit the needs of everyone.
            </FeatureCard>
        </div>
        <footer className="text-center py-16 text-gray-500 dark:text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Calc AI. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;