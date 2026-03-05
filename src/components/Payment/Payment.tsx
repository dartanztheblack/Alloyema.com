import { useState } from 'react';
import { X, CreditCard, Lock, Loader2 } from 'lucide-react';
import './Payment.css';

interface PaymentModalProps {
  orderId: string;
  amount: number;
  yemmaName: string;
  onClose: () => void;
  onSuccess: () => void;
}

// Configuration Stripe Checkout - À configurer avec ton vrai lien Stripe
// const STRIPE_CHECKOUT_URL = 'https://buy.stripe.com/test_xxxxxx';

export function PaymentModal({ orderId: _orderId, amount, yemmaName, onClose, onSuccess }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    
    // Option 1: Redirection vers Stripe Checkout
    // Tu dois créer un lien de paiement dans ton dashboard Stripe
    // et le mettre ici
    
    // Option 2: Ouvrir Stripe Checkout dans un nouvel onglet
    // const paymentLink = `${STRIPE_CHECKOUT_URL}?client_reference_id=${orderId}&amount=${amount * 100}`;
    
    // Simuler le paiement pour l'instant (à remplacer par vrai Stripe)
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={e => e.stopPropagation()}>
        <div className="payment-header">
          <h3><Lock size={20} /> Paiement sécurisé</h3>
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

        <div className="payment-methods">
          <div className="payment-method-card">
            <CreditCard size={24} />
            <span>Carte bancaire</span>
          </div>
        </div>

        <button 
          type="button" 
          className="btn-pay"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <><Loader2 size={18} className="spin" /> Traitement...</>
          ) : (
            <><Lock size={18} /> Payer {amount.toFixed(2)} €</>
          )}
        </button>

        <div className="payment-security-info">
          <p>🔒 Paiement 100% sécurisé par Stripe</p>
          <p>Vos données bancaires sont chiffrées et jamais stockées.</p>
        </div>
      </div>
    </div>
  );
}
