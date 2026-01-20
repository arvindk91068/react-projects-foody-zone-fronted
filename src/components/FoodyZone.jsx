import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  X,
  Plus,
  Minus,
  Search,
  Heart,
  ChevronRight,
  CheckCircle,
  Truck,
  Package,
  Home,
  Shield,
  CreditCard,
  Wallet,
  Smartphone,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './FoodyZone.css';

const FoodyZone = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [checkoutStep, setCheckoutStep] = useState(0); // 0 = cart, 1 = delivery, 2 = payment, 3 = confirmation
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: '',
    phone: '',
    address: '',
    deliveryTime: 'asap',
    instructions: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderId, setOrderId] = useState('');

  const menuItems = [
    {
      id: 1,
      title: "Bolded Eggs",
      description: "Fresh eggs with special seasoning, perfectly boiled to perfection.",
      price: 12.99,
      category: "breakfast",
      rating: 4.5,
      prepTime: "15 min",
      popular: true,
      spicyLevel: 0,
      vegetarian: true
    },
    {
      id: 2,
      title: "RAMEN",
      description: "Authentic Japanese ramen with rich broth and fresh noodles.",
      price: 14.99,
      category: "main",
      rating: 4.8,
      prepTime: "20 min",
      popular: true,
      spicyLevel: 3,
      vegetarian: false
    },
    {
      id: 3,
      title: "GRILLED CHICKEN",
      description: "Juicy chicken grilled with special herbs and spices.",
      price: 16.99,
      category: "main",
      rating: 4.7,
      prepTime: "25 min",
      popular: false,
      spicyLevel: 1,
      vegetarian: false
    },
    {
      id: 4,
      title: "SIS50 COMBO",
      description: "Special meal combo with 50% discount!",
      price: "SIS50",
      originalPrice: 29.99,
      category: "deal",
      discount: "50% OFF",
      popular: true
    },
    {
      id: 5,
      title: "CHOCO CAKE",
      description: "Decadent chocolate cake with rich ganache topping.",
      price: 8.99,
      category: "dessert",
      rating: 4.9,
      prepTime: "10 min",
      popular: true,
      spicyLevel: 0,
      vegetarian: true
    },
    {
      id: 6,
      title: "MEGA BURGER",
      description: "Double patty burger with cheese and special sauce.",
      price: 13.99,
      category: "main",
      rating: 4.6,
      prepTime: "18 min",
      popular: false,
      spicyLevel: 2,
      vegetarian: false
    },
    {
      id: 7,
      title: "VEGAN BOWL",
      description: "Fresh vegetables with quinoa and tahini dressing.",
      price: 11.99,
      category: "main",
      rating: 4.4,
      prepTime: "15 min",
      popular: false,
      spicyLevel: 0,
      vegan: true,
      vegetarian: true
    },
    {
      id: 8,
      title: "SMOOTHIE BLAST",
      description: "Mixed berries smoothie with protein boost.",
      price: 6.99,
      category: "beverage",
      rating: 4.3,
      prepTime: "5 min",
      popular: true,
      spicyLevel: 0,
      vegan: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All Items', icon: '🍽️' },
    { id: 'main', name: 'Main Course', icon: '🍛' },
    { id: 'breakfast', name: 'Breakfast', icon: '🥞' },
    { id: 'dessert', name: 'Desserts', icon: '🍰' },
    { id: 'beverage', name: 'Beverages', icon: '🥤' },
    { id: 'deal', name: 'Special Deals', icon: '🎯' },
    { id: 'vegetarian', name: 'Vegetarian', icon: '🥬' },
    { id: 'spicy', name: 'Spicy', icon: '🌶️' }
  ];

  const deliveryTimes = [
    { value: 'asap', label: 'ASAP (30-40 mins)', time: '30-40 mins' },
    { value: '30', label: 'In 30 minutes', time: '30 mins' },
    { value: '45', label: 'In 45 minutes', time: '45 mins' },
    { value: '60', label: 'In 1 hour', time: '1 hour' },
    { value: 'custom', label: 'Schedule for later', time: 'Custom' }
  ];

  const paymentMethods = [
    { id: 'card', label: 'Credit/Debit Card', icon: <CreditCard /> },
    { id: 'wallet', label: 'Digital Wallet', icon: <Wallet /> },
    { id: 'upi', label: 'UPI', icon: <Smartphone /> },
    { id: 'cod', label: 'Cash on Delivery', icon: <Lock /> }
  ];

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('foodyzone_cart');
    const savedFavorites = localStorage.getItem('foodyzone_favorites');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);

  // Save cart and favorites to localStorage
  useEffect(() => {
    localStorage.setItem('foodyzone_cart', JSON.stringify(cart));
    localStorage.setItem('foodyzone_favorites', JSON.stringify(favorites));
  }, [cart, favorites]);

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      const finalPrice = item.price === "SIS50" ? item.originalPrice / 2 : item.price;
      setCart([...cart, { ...item, quantity: 1, finalPrice }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, change) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        if (newQuantity < 1) {
          removeFromCart(id);
          return item;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.finalPrice * item.quantity), 0);
  };

  const getDeliveryFee = () => {
    return getSubtotal() > 25 ? 0 : 2.99;
  };

  const getTax = () => {
    return getSubtotal() * 0.08; // 8% tax
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const delivery = getDeliveryFee();
    const tax = getTax();
    return (subtotal + delivery + tax).toFixed(2);
  };

  const getItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleDeliveryInfoChange = (field, value) => {
    setDeliveryInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    setCheckoutStep(1);
  };

  const handleDeliveryNext = () => {
    if (!deliveryInfo.name || !deliveryInfo.phone || !deliveryInfo.address) {
      alert('Please fill in all required delivery information');
      return;
    }
    setCheckoutStep(2);
  };

  const handlePaymentNext = () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    setCheckoutStep(3);
    
    // Simulate order processing
    const newOrderId = 'ORD' + Date.now().toString().slice(-8);
    setOrderId(newOrderId);
    
    // Clear cart after order
    setTimeout(() => {
      setCart([]);
      setOrderCompleted(true);
    }, 2000);
  };

  const handleBackToCart = () => {
    setCheckoutStep(0);
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'vegetarian' ? item.vegetarian :
       selectedCategory === 'spicy' ? item.spicyLevel > 0 :
       item.category === selectedCategory);
    
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const renderCheckoutContent = () => {
    switch (checkoutStep) {
      case 1:
        return (
          <div className="checkout-step delivery-step">
            <div className="step-header">
              <button className="back-to-cart" onClick={handleBackToCart}>
                <ArrowLeft size={20} />
                Back to Cart
              </button>
              <h2>Delivery Information</h2>
              <div className="step-indicator">Step 1 of 3</div>
            </div>

            <div className="delivery-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={deliveryInfo.name}
                  onChange={(e) => handleDeliveryInfoChange('name', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  value={deliveryInfo.phone}
                  onChange={(e) => handleDeliveryInfoChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label>Delivery Address *</label>
                <textarea
                  value={deliveryInfo.address}
                  onChange={(e) => handleDeliveryInfoChange('address', e.target.value)}
                  placeholder="Enter your complete address"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Delivery Time</label>
                <div className="time-options">
                  {deliveryTimes.map(time => (
                    <label key={time.value} className="time-option">
                      <input
                        type="radio"
                        name="deliveryTime"
                        value={time.value}
                        checked={deliveryInfo.deliveryTime === time.value}
                        onChange={(e) => handleDeliveryInfoChange('deliveryTime', e.target.value)}
                      />
                      <div className="option-content">
                        <span className="option-label">{time.label}</span>
                        <span className="option-time">{time.time}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Special Instructions (Optional)</label>
                <textarea
                  value={deliveryInfo.instructions}
                  onChange={(e) => handleDeliveryInfoChange('instructions', e.target.value)}
                  placeholder="Any special instructions for delivery?"
                  rows={2}
                />
              </div>

              <div className="form-actions">
                <button className="btn-secondary" onClick={handleBackToCart}>
                  Back
                </button>
                <button className="btn-primary" onClick={handleDeliveryNext}>
                  Continue to Payment
                </button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="checkout-step payment-step">
            <div className="step-header">
              <button className="back-to-cart" onClick={() => setCheckoutStep(1)}>
                <ArrowLeft size={20} />
                Back to Delivery
              </button>
              <h2>Payment Method</h2>
              <div className="step-indicator">Step 2 of 3</div>
            </div>

            <div className="payment-methods">
              {paymentMethods.map(method => (
                <div
                  key={method.id}
                  className={`payment-method ${paymentMethod === method.id ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod(method.id)}
                >
                  <div className="method-icon">
                    {method.icon}
                  </div>
                  <div className="method-label">
                    {method.label}
                  </div>
                  <div className="method-radio">
                    <div className={`radio-dot ${paymentMethod === method.id ? 'active' : ''}`} />
                  </div>
                </div>
              ))}
            </div>

            {paymentMethod === 'card' && (
              <div className="card-details">
                <div className="form-group">
                  <label>Card Number</label>
                  <input type="text" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input type="text" placeholder="MM/YY" />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input type="password" placeholder="123" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input type="text" placeholder="John Doe" />
                </div>
              </div>
            )}

            <div className="security-assurance">
              <Shield size={20} />
              <span>Your payment is secured with 256-bit SSL encryption</span>
            </div>

            <div className="form-actions">
              <button className="btn-secondary" onClick={() => setCheckoutStep(1)}>
                Back
              </button>
              <button className="btn-primary" onClick={handlePaymentNext}>
                Place Order & Pay
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="checkout-step confirmation-step">
            {!orderCompleted ? (
              <>
                <div className="processing-order">
                  <div className="spinner"></div>
                  <h3>Processing Your Order...</h3>
                  <p>Please wait while we confirm your order details</p>
                </div>
              </>
            ) : (
              <>
                <div className="confirmation-header">
                  <CheckCircle className="success-icon" size={80} />
                  <h2>Order Confirmed!</h2>
                  <p className="order-id">Order ID: {orderId}</p>
                  <p className="thank-you">
                    Thank you for your order! Your food is being prepared.
                  </p>
                </div>

                <div className="order-tracking">
                  <div className="tracking-step active">
                    <div className="step-icon">
                      <CheckCircle size={24} />
                    </div>
                    <div className="step-content">
                      <h4>Order Received</h4>
                      <p>We've received your order</p>
                      <span className="step-time">Just now</span>
                    </div>
                  </div>

                  <div className="tracking-step">
                    <div className="step-icon">
                      <Package size={24} />
                    </div>
                    <div className="step-content">
                      <h4>Preparing</h4>
                      <p>Chef is working on your order</p>
                      <span className="step-time">Estimated: 5-10 mins</span>
                    </div>
                  </div>

                  <div className="tracking-step">
                    <div className="step-icon">
                      <Truck size={24} />
                    </div>
                    <div className="step-content">
                      <h4>On the Way</h4>
                      <p>Driver will pick up your order</p>
                      <span className="step-time">Estimated: 15-20 mins</span>
                    </div>
                  </div>

                  <div className="tracking-step">
                    <div className="step-icon">
                      <Home size={24} />
                    </div>
                    <div className="step-content">
                      <h4>Delivered</h4>
                      <p>Enjoy your meal!</p>
                      <span className="step-time">Estimated: 30 mins total</span>
                    </div>
                  </div>
                </div>

                <div className="confirmation-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      setCheckoutStep(0);
                      setShowCart(false);
                    }}
                  >
                    Continue Shopping
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => {
                      // In a real app, this would navigate to order tracking
                      alert(`Track your order with ID: ${orderId}`);
                    }}
                  >
                    Track Order
                  </button>
                </div>
              </>
            )}
          </div>
        );

      default:
        return (
          <>
            <div className="cart-header">
              <h3>Your Cart ({getItemCount()} items)</h3>
              <button className="close-btn" onClick={() => setShowCart(false)}>
                <X />
              </button>
            </div>

            <div className="cart-items">
              {cart.length === 0 ? (
                <p className="empty-cart">Your cart is empty</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{item.title}</h4>
                      <p>${item.finalPrice?.toFixed(2)} each</p>
                    </div>
                    
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.id, -1)}>
                        <Minus size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}>
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <div className="item-total">
                      ${(item.finalPrice * item.quantity).toFixed(2)}
                    </div>
                    
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Delivery Fee</span>
                    <span>{getDeliveryFee() === 0 ? 'FREE' : `$${getDeliveryFee().toFixed(2)}`}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax (8%)</span>
                    <span>${getTax().toFixed(2)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>${getTotal()}</span>
                  </div>
                </div>
                
                <button 
                  className="checkout-btn"
                  onClick={handleProceedToCheckout}
                >
                  Proceed to Checkout
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="foody-zone">
      {/* Header */}
      <header className="header">
        <div className="project-tag">Foody Zone</div>
        <h1 className="title">
          <span className="title-primary">Foody</span>
          <span className="title-secondary">Zone</span>
        </h1>
        
        <div className="search-bar">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="header-actions">
          <button 
            className="favorites-btn"
            onClick={() => setSelectedCategory(favorites.length > 0 ? 'favorites' : 'all')}
          >
            <Heart className={favorites.length > 0 ? 'filled' : ''} />
            <span className="badge">{favorites.length}</span>
          </button>
          
          <div className="cart-icon" onClick={() => setShowCart(true)}>
            <ShoppingCart />
            {cart.length > 0 && <span className="cart-badge">{getItemCount()}</span>}
            <span className="cart-total">${getTotal()}</span>
          </div>
        </div>
      </header>

      {/* Categories */}
      <div className="categories">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span className="btn-icon">{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Features */}
      <div className="features">
        <div className="feature">
          <Clock /> <span>30 min delivery</span>
        </div>
        <div className="feature">
          <Star /> <span>4.8 Rating</span>
        </div>
        <div className="feature">
          <MapPin /> <span>Free delivery</span>
        </div>
        <div className="feature">
          <Phone /> <span>24/7 Support</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="menu-grid">
        {filteredItems.map(item => (
          <div key={item.id} className={`menu-card ${item.popular ? 'popular' : ''}`}>
            {item.popular && <div className="popular-badge">🔥 Popular</div>}
            {item.spicyLevel > 0 && (
              <div className="spicy-badge">
                {'🌶️'.repeat(item.spicyLevel)}
              </div>
            )}
            {item.vegetarian && !item.vegan && <div className="veg-badge">🥬 Veg</div>}
            {item.vegan && <div className="vegan-badge">🌱 Vegan</div>}
            
            <button 
              className={`favorite-btn ${favorites.includes(item.id) ? 'active' : ''}`}
              onClick={() => toggleFavorite(item.id)}
            >
              <Heart fill={favorites.includes(item.id) ? 'currentColor' : 'none'} />
            </button>

            <h3>{item.title}</h3>
            <p>{item.description}</p>
            
            <div className="item-details">
              <div className="rating">
                <Star /> <span>{item.rating}</span>
              </div>
              <div className="time">
                <Clock /> <span>{item.prepTime}</span>
              </div>
            </div>

            <div className="price-section">
              {item.category === 'deal' ? (
                <>
                  <span className="original-price">${item.originalPrice}</span>
                  <span className="deal-price">{item.price}</span>
                </>
              ) : (
                <span className="price">${item.price}</span>
              )}
              <button className="add-btn" onClick={() => addToCart(item)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Sidebar with Checkout Process */}
      {showCart && (
        <div className="cart-overlay" onClick={() => setShowCart(false)}>
          <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
            {renderCheckoutContent()}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Foody Zone</h3>
            <p>Delicious food delivered fast. Quality ingredients, amazing taste.</p>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>📍 123 Food Street, City</p>
            <p>📞 (123) 456-7890</p>
            <p>✉️ info@foodyzone.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 Foody Zone. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { menuAPI, cartAPI, orderAPI, promoAPI } from './services/api';

// Inside your component:
const [menuItems, setMenuItems] = useState([]);

useEffect(() => {
  fetchMenuItems();
}, [selectedCategory, searchTerm]);

const fetchMenuItems = async () => {
  try {
    const response = await menuAPI.getMenuItems(selectedCategory, searchTerm);
    setMenuItems(response.data);
  } catch (error) {
    console.error('Error fetching menu:', error);
  }
};

const handleCheckout = async () => {
  try {
    const orderData = {
      items: cart,
      deliveryInfo: {
        name: 'John Doe',
        phone: '1234567890',
        address: '123 Main St, City',
        deliveryTime: 'asap'
      },
      paymentMethod: 'cod'
    };
    
    const response = await orderAPI.placeOrder(orderData);
    console.log('Order placed:', response.data);
    alert(`Order confirmed! Order ID: ${response.data.orderId}`);
    setCart([]);
  } catch (error) {
    console.error('Error placing order:', error);
    alert('Failed to place order');
  }
};
export default FoodyZone;