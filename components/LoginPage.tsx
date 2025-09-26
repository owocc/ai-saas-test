import React, { useState } from 'react';
import type { View } from '../App.tsx';
import { useAuthContext } from '../contexts/AuthContext.tsx';

interface LoginPageProps {
  onNavigate: (view: View) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuthContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(email, password);
    if (!success) {
      setError('Invalid email or password. Please try again.');
    } else {
      onNavigate('dashboard');
    }
  };

  const handleDemoLogin = () => {
    setError('');
    const success = login('user@example.com', 'password123');
    if (success) {
      onNavigate('dashboard');
    } else {
      setError('Could not log in with the demo account. It might have been deleted.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="bg-gray-800/50 border border-gray-700/80 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Log In</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="bg-red-900/50 text-red-300 border border-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="user@example.com"
              className="w-full bg-gray-900/70 border border-gray-700 rounded-lg py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="password123"
              className="w-full bg-gray-900/70 border border-gray-700 rounded-lg py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button type="submit" className="w-full bg-purple-600 text-white font-semibold py-2.5 rounded-lg hover:bg-purple-500 transition-colors">
            Log In
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-800 text-gray-500">Or</span>
          </div>
        </div>
        
        <button 
          type="button" 
          onClick={handleDemoLogin}
          className="w-full bg-gray-700 text-white font-semibold py-2.5 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Log in as Demo User
        </button>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account?{' '}
          <a onClick={() => onNavigate('register')} className="font-medium text-purple-400 hover:text-purple-300 cursor-pointer">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;