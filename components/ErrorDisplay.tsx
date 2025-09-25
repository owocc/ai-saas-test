import React from 'react';

interface ErrorDisplayProps {
  error: Error;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => (
  <div className="min-h-screen bg-red-900/50 text-red-100 flex items-center justify-center p-4">
    <div className="bg-red-800/50 border border-red-600 rounded-lg p-8 max-w-2xl w-full">
      <h1 className="text-2xl font-bold text-red-200 mb-2">Application Error</h1>
      <p className="text-red-300 mb-4">The application could not start due to a critical error.</p>
      <div className="bg-red-900/70 p-4 rounded-md">
        <p className="font-mono text-sm text-red-200 whitespace-pre-wrap">{error.message}</p>
      </div>
       <p className="text-xs text-red-400 mt-4">Please check the console for more details and ensure your environment is configured correctly.</p>
    </div>
  </div>
);

export default ErrorDisplay;
