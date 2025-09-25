import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import ErrorDisplay from './components/ErrorDisplay.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

let AppToShow = <App />;

// This is an async IIFE to handle the top-level await for the dynamic import.
(async () => {
  try {
    // Pre-flight check to ensure the service can initialize.
    // This will throw an error if the VITE_API_KEY is missing.
    await import('./services/geminiService.ts');
  } catch (error) {
    if (error instanceof Error) {
      AppToShow = <ErrorDisplay error={error} />;
    } else {
      AppToShow = <ErrorDisplay error={new Error("An unknown error occurred during initialization.")} />;
    }
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AuthProvider>
        {AppToShow}
      </AuthProvider>
    </React.StrictMode>
  );
})();
