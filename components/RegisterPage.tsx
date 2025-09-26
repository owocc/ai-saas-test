import React, { useState } from 'react';
import type { View } from '../App.tsx';
import { useAuthContext } from '../contexts/AuthContext.tsx';

interface RegisterPageProps {
  onNavigate: (view: View) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuthContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = register(name, email, password);
    if (!result.success) {
      setError(result.error || 'An unexpected error occurred.');
    } else {
      onNavigate('dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/80 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">Create an Account</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2" htmlFor="name">Name</label>
            <input 
              type="text" 
              id="name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-3 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2" htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-3 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2" htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-3 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button type="submit" className="w-full bg-purple-600 text-white font-semibold py-2.5 rounded-lg hover:bg-purple-500 transition-colors">
            Register
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{' '}
          <a onClick={() => onNavigate('login')} className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 cursor-pointer">
            Log in here
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;