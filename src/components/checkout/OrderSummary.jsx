import React, { useState, useEffect } from 'react';
import { Plus, Minus, X, Tag } from 'lucide-react';
import './OrderSummary.css';

const OrderSummary = ({ compact = false, onEditDelivery, onNext, onBack }) => {
  const [cart, setCart] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(2.99);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem('foodyzone_cart')) || [];
    setCart(savedCart);
    
    // Check for free delivery
    const subtotal = calculateSubtotal(savedCart);
    if (subtotal > 25) {
      setDeliveryFee(0);
    }
  }, []);

  const calculateSubtotal = (items) => {
    return items.reduce((total, item) => {
      const price = item.price === "SIS50" ? item.originalPrice / 2 : item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const calculateTax = (amount) => {
    return amount * 0.08; // 8% tax
  };

  const applyPromoCode = () => {
    const codes = {
      'WELCOME10': 10,
      'FOODY25': 25,
      'SIS50': 50
    };
    
    const code = promoCode.toUpperCase();
    if (codes[code]) {
      setDiscount(codes[code]);
      alert(`Promo code applied! ${codes[code]}% discount`);
    } else {
      alert('Invalid promo code');
    }
  };

  const updateQuantity = (id, change) => {
    const updatedCart = cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        if (newQuantity < 1) {
          return null;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item !== null);
    
    setCart(updatedCart);
    localStorage.setItem('foodyzone_cart', JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('foodyzone_cart', JSON.stringify(updatedCart));
  };

  const subtotal = calculateSubtotal(cart);
  const tax = calculateTax(subtotal);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal + deliveryFee + tax - discountAmount;

  if (compact) {
    return (
      <div className="order-summary-compact">
        <h3>Order Summary</h3>
        <div className="summary-items">
          {cart.map(item => (
            <div key={item.id} className="summary-item">
              <span className="item-name">{item.title} ×{item.quantity}</span>
              <span className="item-price">
                ${((item.price === "SIS50" ? item.originalPrice / 2 : item.price) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        
        <div className="summary-totals">
          <div className="total-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="total-row">
            <span>Delivery</span>
            <span>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
          </div>
          {discount > 0 && (
            <div className="total-row discount">
              <span>Discount ({discount}%)</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="total-row">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="total-row grand-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-summary">
      <div className="summary-header">
        <h2>Order Review</h2>
        <p>Review your items before payment</p>
      </div>

      {/* Delivery Info Summary */}
      <div className="delivery-summary">
        <div className="summary-card">
          <div className="card-header">
            <h4>Delivery Information</h4>
            <button className="edit-btn" onClick={onEditDelivery}>
              Edit
            </button>
          </div>
          <div className="card-content">
            <p><strong>Name:</strong> John Doe</p>
            <p><strong>Phone:</strong> (123) 456-7890</p>
            <p><strong>Address:</strong> 123 Main St, Apt 4B, City</p>
            <p><strong>Delivery Time:</strong> ASAP (30-40 mins)</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="order-items">
        <h3>Your Order ({cart.length} items)</h3>
        <div className="items-list">
          {cart.map(item => (
            <div key={item.id} className="order-item">
              <div className="item-info">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
                {item.category === 'deal' && (
                  <span className="deal-tag">
                    <Tag size={12} />
                    50% OFF Deal
                  </span>
                )}
              </div>
              
              <div className="item-controls">
                <div className="quantity-control">
                  <button onClick={() => updateQuantity(item.id, -1)}>
                    <Minus size={14} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>
                    <Plus size={14} />
                  </button>
                </div>
                <div className="item-price">
                  ${((item.price === "SIS50" ? item.originalPrice / 2 : item.price) * item.quantity).toFixed(2)}
                </div>
                <button 
                  className="remove-item"
                  onClick={() => removeItem(item.id)}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promo Code */}
      <div className="promo-section">
        <div className="promo-input-group">
          <input
            type="text"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <button onClick={applyPromoCode}>Apply</button>
        </div>
        <div className="promo-suggestions">
          <span>Try: WELCOME10, FOODY25, SIS50</span>
        </div>
      </div>

      {/* Order Totals */}
      <div className="order-totals">
        <div className="total-row">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="total-row">
          <span>Delivery Fee</span>
          <span className={deliveryFee === 0 ? 'free' : ''}>
            {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
          </span>
        </div>
        {discount > 0 && (
          <div className="total-row discount">
            <span>Discount ({discount}%)</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="total-row">
          <span>Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="total-row grand-total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      {onNext && onBack && (
        <div className="summary-actions">
          <button className="btn-secondary" onClick={onBack}>
            Back to Delivery
          </button>
          <button className="btn-primary" onClick={onNext}>
            Continue to Payment
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;