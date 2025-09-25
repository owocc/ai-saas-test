import { useState, useEffect } from 'react';

export interface Calculation {
  expression: string;
  result: string;
}

export const useCalculationHistory = () => {
  const [history, setHistory] = useState<Calculation[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('calculationHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to parse calculation history from localStorage", error);
    }
  }, []);

  const updateLocalStorage = (newHistory: Calculation[]) => {
    try {
      localStorage.setItem('calculationHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error("Failed to save calculation history to localStorage", error);
    }
  };

  const addToHistory = (calculation: Calculation) => {
    setHistory(prevHistory => {
      const newHistory = [calculation, ...prevHistory].slice(0, 20); // Keep last 20 calculations
      updateLocalStorage(newHistory);
      return newHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    updateLocalStorage([]);
  };

  return { history, addToHistory, clearHistory };
};
