
import React, { useState, useRef, useEffect } from 'react';
import { getAiCalculation } from '../services/geminiService';
import { UserIcon, SparklesIcon, SendIcon } from './icons';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await getAiCalculation(input);
      const modelMessage: Message = { role: 'model', text: aiResponse };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage: Message = { role: 'model', text: 'An error occurred. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col h-[75vh]">
      <div className="flex-grow overflow-y-auto pr-4 -mr-4 space-y-6">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 pt-16">
            <SparklesIcon className="w-12 h-12 mx-auto mb-4"/>
            <h2 className="text-xl font-medium text-gray-300">AI Calculator Chat</h2>
            <p>Ask me a math question like "50 * 3.5" or "sqrt(144)".</p>
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex-shrink-0 flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
            )}
            <div className={`p-3 rounded-lg max-w-md ${msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-700/80 text-gray-200'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
             {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-gray-400" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
            <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex-shrink-0 flex items-center justify-center">
                    <SparklesIcon className="w-5 h-5 text-white" />
                 </div>
                 <div className="p-3 rounded-lg bg-gray-700/80 text-gray-200 flex items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150 mx-1"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
                 </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="mt-6">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a calculation..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-md bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 transition-colors">
            <SendIcon />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIChat;
