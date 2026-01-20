import React, { useState } from 'react';
import { CreditCard, Wallet, Smartphone, Lock, Shield, Check } from 'lucide-react';
import './PaymentForm.css';

const PaymentForm = ({ onUpdate, initialData, onNext, onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState(initialData.method || 'card');
  const [cardDetails, setCardDetails] = useState({
    number: initialData.cardNumber || '',
    name: initialData.cardName || '',
    expiry: initialData.cardExpiry || '',
    cvv: initialData.cardCvv || ''
  });
  const [saveCard, setSaveCard] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const paymentMethods = [
    { id: 'card', label: 'Credit/Debit Card', icon: <CreditCard />, popular: true },
    { id: 'wallet', label: 'Digital Wallet', icon: <Wallet /> },
    { id: 'upi', label: 'UPI', icon: <Smartphone /> },
    { id: 'cod', label: 'Cash on Delivery', icon: <Lock /> }
  ];

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'number') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
      if (formattedValue.length > 19) formattedValue = formattedValue.substring(0, 19);
    } else if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1/');
      if (formattedValue.length > 5) formattedValue = formattedValue.substring(0, 5);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) formattedValue = formattedValue.substring(0, 4);
    }
    
    setCardDetails(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const paymentInfo = {
      method: paymentMethod,
      cardDetails: paymentMethod === 'card' ? cardDetails : null,
      saveCard,
      timestamp: new Date().toISOString()
    };
    
    onUpdate(paymentInfo);
    onNext();
  };

  const validateCard = () => {
    if (paymentMethod !== 'card') return true;
    
    const { number, name, expiry, cvv } = cardDetails;
    const cardNumberValid = number.replace(/\s/g, '').length === 16;
    const nameValid = name.trim().length >= 3;
    const expiryValid = /^\d{2}\/\d{2}$/.test(expiry);
    const cvvValid = cvv.length >= 3;
    
    return cardNumberValid && nameValid && expiryValid && cvvValid && termsAccepted;
  };

  return (
    <div className="payment-form">
      <div className="section-header">
        <h2>Payment Method</h2>
        <p>Choose your preferred payment method</p>
      </div>

      {/* Payment Methods */}
      <div className="payment-methods">
        {paymentMethods.map(method => (
          <div
            key={method.id}
            className={`payment-method ${paymentMethod === method.id ? 'selected' : ''} ${method.popular ? 'popular' : ''}`}
            onClick={() => setPaymentMethod(method.id)}
          >
            <div className="method-icon">
              {method.icon}
            </div>
            <div className="method-info">
              <span className="method-label">{method.label}</span>
              {method.popular && <span className="popular-badge">Most Popular</span>}
            </div>
            <div className="method-radio">
              <div className={`radio-dot ${paymentMethod === method.id ? 'active' : ''}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Card Details Form */}
      {paymentMethod === 'card' && (
        <form className="card-details-form">
          <div className="form-section">
            <h3>Card Details</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Card Number</label>
                <input
                  type="text"
                  name="number"
                  value={cardDetails.number}
                  onChange={handleCardChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                />
              </div>
              <div className="form-group full-width">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  name="name"
                  value={cardDetails.name}
                  onChange={handleCardChange}
                  placeholder="John Doe"
                />
              </div>
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="text"
                  name="expiry"
                  value={cardDetails.expiry}
                  onChange={handleCardChange}
                  placeholder="MM/YY"
                  maxLength="5"
                />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input
                  type="password"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardChange}
                  placeholder="123"
                  maxLength="4"
                />
              </div>
            </div>
            
            <div className="card-security">
              <div className="security-badges">
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" />
              </div>
              <div className="security-info">
                <Lock size={14} />
                <span>Your payment is secured with SSL encryption</span>
              </div>
            </div>
          </div>

          <div className="form-check">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={saveCard}
                onChange={(e) => setSaveCard(e.target.checked)}
              />
              <span>Save card for future purchases</span>
            </label>
          </div>
        </form>
      )}

      {/* UPI Details */}
      {paymentMethod === 'upi' && (
        <div className="upi-details">
          <div className="form-section">
            <h3>UPI Payment</h3>
            <div className="upi-input-group">
              <input
                type="text"
                placeholder="Enter UPI ID (e.g., 1234567890@upi)"
              />
              <button className="verify-btn">Verify</button>
            </div>
            <div className="upi-apps">
              <button className="upi-app">
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/8e/Google_Pay_Logo.svg" alt="Google Pay" />
              </button>
              <button className="upi-app">
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/40/Paytm_Logo_%28standalone%29.svg" alt="Paytm" />
              </button>
              <button className="upi-app">
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/PhonePe_Logo.svg" alt="PhonePe" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COD Message */}
      {paymentMethod === 'cod' && (
        <div className="cod-message">
          <div className="message-icon">
            <Lock size={32} />
          </div>
          <h4>Cash on Delivery</h4>
          <p>Pay with cash when your order arrives. Please have exact change ready.</p>
          <p className="cod-note">
            Note: A small convenience fee may apply for COD orders.
          </p>
        </div>
      )}

      {/* Terms and Conditions */}
      <div className="terms-section">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            required
          />
          <span>
            I agree to the Terms & Conditions and Privacy Policy. I understand that my payment will be processed securely.
          </span>
        </label>
      </div>

      {/* Security Assurance */}
      <div className="security-assurance">
        <div className="assurance-item">
          <Shield size={20} />
          <div className="assurance-text">
            <strong>100% Secure Payment</strong>
            <span>Your data is protected with bank-level security</span>
          </div>
        </div>
        <div className="assurance-item">
          <Check size={20} />
          <div className="assurance-text">
            <strong>Money-Back Guarantee</strong>
            <span>Full refund if food doesn't arrive in 60 minutes</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="payment-actions">
        <button className="btn-secondary" onClick={onBack}>
          Back to Order Review
        </button>
        <button 
          className="btn-primary" 
          onClick={handleSubmit}
          disabled={!validateCard()}
        >
          {paymentMethod === 'cod' ? 'Place Order (COD)' : `Pay Now`}
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;