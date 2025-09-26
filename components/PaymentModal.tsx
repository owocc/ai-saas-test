import React, { useState } from 'react';

interface PaymentModalProps {
  title: string;
  description: string;
  itemName: string;
  itemPrice: string;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  title,
  description,
  itemName,
  itemPrice,
  onClose,
  onPaymentSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate network request
    setTimeout(() => {
      onPaymentSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold">&times;</button>
        <h2 className="text-2xl font-bold text-white text-center mb-2">{title}</h2>
        <div className="text-center bg-gray-700/50 p-4 rounded-lg mb-6">
          <p className="text-lg text-gray-300">{description}</p>
          <p className="text-4xl font-bold text-yellow-400 my-1">{itemName}</p>
          <p className="text-xl font-semibold text-white">{itemPrice}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-400">Select Payment Method</h3>
          {['card', 'paypal', 'crypto'].map(method => (
            <label key={method} className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${paymentMethod === method ? 'border-purple-500 bg-purple-900/20' : 'border-gray-700 bg-gray-900/50'}`}>
              <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 focus:ring-purple-600 ring-offset-gray-800 focus:ring-2"/>
              <span className="ml-3 text-sm font-medium text-white capitalize">{method === 'card' ? 'Credit Card' : method}</span>
            </label>
          ))}
        </div>
        
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full mt-8 bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-500 transition-colors disabled:bg-gray-600"
        >
          {isProcessing ? 'Processing...' : `Pay ${itemPrice.split(' ')[0]}`}
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
