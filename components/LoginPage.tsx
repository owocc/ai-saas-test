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
              className="w-full bg-gray-900/70 border border-gray-700 rounded-lg py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button type="submit" className="w-full bg-purple-600 text-white font-semibold py-2.5 rounded-lg hover:bg-purple-500 transition-colors">
            Log In
          </button>
        </form>
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
