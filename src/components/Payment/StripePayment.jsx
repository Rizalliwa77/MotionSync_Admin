import React, { useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';

const StripePayment = ({ amount, onError, buttonText }) => {
  const stripe = useStripe();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!stripe) return;

    setIsProcessing(true);
    try {
      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount,
          success_url: `${window.location.origin}/registration-complete`,
          cancel_url: window.location.href,
        }),
      });

      const { sessionId } = await response.json();

      // Redirect to Stripe's hosted checkout page
      const { error } = await stripe.redirectToCheckout({
        sessionId
      });

      if (error) {
        onError(error.message);
      }
    } catch (error) {
      onError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="stripe-form">
      <button 
        type="button"
        onClick={handleCheckout}
        className="proceed-payment-btn"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? 'Processing...' : buttonText || 'TRANSFER TO EXTERNAL PAYMENT METHOD'}
      </button>
    </div>
  );
};

export default StripePayment; 