import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };
    
    case 'APPLY_DISCOUNT':
      return {
        ...state,
        discount: action.payload
      };
    
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        items: []
      };
    
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, {
    items: [],
    orders: [],
    discount: 0
  });

  const { setItem, getItem } = useLocalStorage();

  // Persist cart to localStorage
  React.useEffect(() => {
    setItem('cart', cartState.items);
    setItem('orders', cartState.orders);
  }, [cartState.items, cartState.orders, setItem]);

  const addToCart = useCallback((item) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  }, []);

  const removeFromCart = useCallback((id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const applyDiscount = useCallback((discount) => {
    dispatch({ type: 'APPLY_DISCOUNT', payload: discount });
  }, []);

  const addOrder = useCallback((order) => {
    dispatch({ type: 'ADD_ORDER', payload: order });
  }, []);

  const getSubtotal = useCallback(() => {
    return cartState.items.reduce((total, item) => 
      total + (item.finalPrice * item.quantity), 0);
  }, [cartState.items]);

  const getTotal = useCallback(() => {
    const subtotal = getSubtotal();
    const discountAmount = (subtotal * cartState.discount) / 100;
    return subtotal - discountAmount;
  }, [getSubtotal, cartState.discount]);

  const getItemCount = useCallback(() => {
    return cartState.items.reduce((total, item) => total + item.quantity, 0);
  }, [cartState.items]);

  const value = {
    cart: cartState.items,
    orders: cartState.orders,
    discount: cartState.discount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyDiscount,
    addOrder,
    getSubtotal,
    getTotal,
    getItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};