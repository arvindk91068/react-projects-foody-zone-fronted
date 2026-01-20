// hooks/useCart.js
import { useContext, useCallback } from 'react';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  const { cart, addItem, removeItem, updateQuantity, clearCart } = context;

  const addToCart = useCallback((item) => {
    addItem(item);
    toast.success(`${item.title} added to cart!`, {
      position: "bottom-right",
      autoClose: 3000,
    });
  }, [addItem]);

  const getTotal = useCallback(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  const getItemCount = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  return {
    cart,
    addToCart,
    removeFromCart: removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
    isEmpty: cart.length === 0
  };
};