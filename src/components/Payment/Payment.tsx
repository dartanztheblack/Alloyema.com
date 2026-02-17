import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { X, CreditCard, Lock } from 'lucide-react';
import './Payment.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

interface PaymentModalProps {
  orderId: string;
  amount: number;
  yemmaName: string;
  onClose: () => void;
  onSuccess: () => void;
}

function PaymentForm({ orderId, amount, yemmaName, onClose, onSuccess }: PaymentModalProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    try {
      // Create payment intent on your backend
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount * 100, orderId }),
      });

      const { clientSecret } = await response.json();

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setError(result.error.message || 'Une erreur est survenue');
      } else {
        // Payment successful
        await addDoc(collection(db, 'payments'), {
          orderId,
          amount,
          status: 'completed',
          stripePaymentId: result.paymentIntent.id,
          createdAt: serverTimestamp(),
        });

        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="payment-header">
        <h3>Paiement sécurisé</h3>
        <button type="button" className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      <div className="payment-summary">
        <p>Commande chez <strong>{yemmaName}</strong></p>
        <div className="amount">
          <span>Total à payer</span>
          <h2>{amount.toFixed(2)} €</h2>
        </div>
      </div>

      <div className="card-element-wrapper">
        <label>
          <CreditCard size={18} />
          Numéro de carte
        </label>
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': { color: '#aab7c4' },
              },
            },
          }}
        />
      </div>

      {error && <div className="payment-error">{error}</div>}

      <button 
        type="submit" 
        className="btn-pay"
        disabled={!stripe || loading}
      >
        <Lock size={18} />
        {loading ? 'Traitement...' : `Payer ${amount.toFixed(2)} €`}
      </button>

      <p className="payment-security">
        🔒 Paiement sécurisé par Stripe
      </p>
    </form>
  );
}

export function PaymentModal(props: PaymentModalProps) {
  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <Elements stripe={stripePromise}>
          <PaymentForm {...props} />
        </Elements>
      </div>
    </div>
  );
}
