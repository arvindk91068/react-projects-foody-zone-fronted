import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDrawer = ({ isOpen, onClose, onCheckout }) => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    getSubtotal,
    getTotal,
    getItemCount,
    discount,
    applyDiscount 
  } = useCart();
  
  const [promoCode, setPromoCode] = useState('');

  if (!isOpen) return null;

  const handleApplyPromo = () => {
    const promoCodes = {
      'WELCOME10': 10,
      'FOODY25': 25,
      'SIS50': 50
    };
    
    const code = promoCode.toUpperCase();
    if (promoCodes[code]) {
      applyDiscount(promoCodes[code]);
    }
    setPromoCode('');
  };

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-drawer-header">
          <div className="cart-title">
            <ShoppingCart />
            <h3>Your Cart ({getItemCount()} items)</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <ShoppingCart size={48} />
              <p>Your cart is empty</p>
              <button className="continue-shopping" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <h4>{item.title}</h4>
                  <p>${item.finalPrice?.toFixed(2)} each</p>
                </div>
                
                <div className="cart-item-controls">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="cart-item-total">
                  ${(item.finalPrice * item.quantity).toFixed(2)}
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="remove-btn"
                >
                  <X size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="promo-section">
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="promo-input"
              />
              <button onClick={handleApplyPromo} className="promo-btn">
                Apply
              </button>
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${getSubtotal().toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="summary-row discount">
                  <span>Discount ({discount}%)</span>
                  <span>-${(getSubtotal() * discount / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row total">
                <span>Total</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="cart-actions">
              <button onClick={clearCart} className="clear-btn">
                Clear Cart
              </button>
              <button onClick={onCheckout} className="checkout-btn">
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;