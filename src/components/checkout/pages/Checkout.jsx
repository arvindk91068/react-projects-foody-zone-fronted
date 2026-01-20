import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, CreditCard, MapPin, Package, Shield } from 'lucide-react';
import CheckoutForm from '../components/checkout/CheckoutForm';
import OrderSummary from '../components/checkout/OrderSummary';
import PaymentForm from '../components/checkout/PaymentForm';
import DeliveryInfo from '../components/checkout/DeliveryInfo';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderDetails, setOrderDetails] = useState({
    deliveryInfo: {},
    paymentInfo: {},
    orderNotes: ''
  });
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const steps = [
    { id: 1, title: 'Delivery', icon: <MapPin />, description: 'Address & Time' },
    { id: 2, title: 'Order Review', icon: <Package />, description: 'Confirm Items' },
    { id: 3, title: 'Payment', icon: <CreditCard />, description: 'Payment Method' },
    { id: 4, title: 'Confirmation', icon: <CheckCircle />, description: 'Order Complete' }
  ];

  const handleBackToCart = () => {
    navigate('/cart');
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete order
      completeOrder();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDeliveryInfoUpdate = (info) => {
    setOrderDetails(prev => ({
      ...prev,
      deliveryInfo: info
    }));
  };

  const handlePaymentInfoUpdate = (info) => {
    setOrderDetails(prev => ({
      ...prev,
      paymentInfo: info
    }));
  };

  const completeOrder = async () => {
    // Simulate API call
    const newOrderId = 'ORD' + Date.now().toString().slice(-8);
    setOrderId(newOrderId);
    setOrderCompleted(true);
    setCurrentStep(4);
    
    // Clear cart (you would dispatch a Redux action here)
    localStorage.removeItem('foodyzone_cart');
    
    // Redirect to order confirmation after 5 seconds
    setTimeout(() => {
      navigate(`/order-confirmation/${newOrderId}`);
    }, 5000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <DeliveryInfo 
            onUpdate={handleDeliveryInfoUpdate}
            initialData={orderDetails.deliveryInfo}
            onNext={handleNextStep}
          />
        );
      case 2:
        return (
          <OrderSummary 
            onEditDelivery={() => setCurrentStep(1)}
            onNext={handleNextStep}
            onBack={handlePreviousStep}
          />
        );
      case 3:
        return (
          <PaymentForm 
            onUpdate={handlePaymentInfoUpdate}
            initialData={orderDetails.paymentInfo}
            onNext={handleNextStep}
            onBack={handlePreviousStep}
          />
        );
      case 4:
        return (
          <div className="order-confirmation">
            <div className="confirmation-header">
              <CheckCircle className="success-icon" size={80} />
              <h2>Order Confirmed!</h2>
              <p className="order-id">Order ID: {orderId}</p>
              <p className="confirmation-message">
                Thank you for your order! Your food is being prepared.
              </p>
            </div>
            
            <div className="order-timeline">
              <div className="timeline-step active">
                <div className="step-icon">✅</div>
                <div className="step-content">
                  <h4>Order Received</h4>
                  <p>We've received your order</p>
                  <span className="step-time">Just now</span>
                </div>
              </div>
              
              <div className="timeline-step">
                <div className="step-icon">👨‍🍳</div>
                <div className="step-content">
                  <h4>Preparing</h4>
                  <p>Chef is working on your order</p>
                  <span className="step-time">Estimated: 5-10 mins</span>
                </div>
              </div>
              
              <div className="timeline-step">
                <div className="step-icon">🚚</div>
                <div className="step-content">
                  <h4>On the Way</h4>
                  <p>Driver will pick up your order</p>
                  <span className="step-time">Estimated: 15-20 mins</span>
                </div>
              </div>
              
              <div className="timeline-step">
                <div className="step-icon">🏠</div>
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
                onClick={() => navigate('/menu')}
              >
                Order More
              </button>
              <button 
                className="btn-primary"
                onClick={() => navigate(`/track-order/${orderId}`)}
              >
                Track Order
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Header */}
        <div className="checkout-header">
          <button 
            className="back-btn"
            onClick={handleBackToCart}
          >
            <ArrowLeft size={20} />
            Back to Cart
          </button>
          <h1>Checkout</h1>
          <div className="security-badge">
            <Shield size={16} />
            <span>Secure Checkout</span>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className={`step ${currentStep >= step.id ? 'active' : ''} ${currentStep === step.id ? 'current' : ''}`}
            >
              <div className="step-number">
                {currentStep > step.id ? '✓' : step.id}
              </div>
              <div className="step-info">
                <span className="step-title">{step.title}</span>
                <span className="step-desc">{step.description}</span>
              </div>
              {index < steps.length - 1 && (
                <div className="step-connector"></div>
              )}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="checkout-content">
          <div className="checkout-main">
            {renderStepContent()}
          </div>
          
          {/* Order Summary Sidebar */}
          {currentStep < 4 && (
            <div className="checkout-sidebar">
              <OrderSummary compact={true} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;