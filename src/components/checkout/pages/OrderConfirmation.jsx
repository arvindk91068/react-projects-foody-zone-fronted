import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, MapPin, Truck, Package, Home, ShoppingBag } from 'lucide-react';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [estimatedDelivery, setEstimatedDelivery] = useState('');

  useEffect(() => {
    // Simulate fetching order details
    const estimated = new Date();
    estimated.setMinutes(estimated.getMinutes() + 30);
    setEstimatedDelivery(estimated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    // Mock order data
    setOrder({
      id: orderId,
      items: [
        { name: 'RAMEN', quantity: 1, price: 14.99 },
        { name: 'CHOCO CAKE', quantity: 1, price: 8.99 },
      ],
      total: 23.98,
      deliveryAddress: '123 Main St, Apt 4B, Gourmet City',
      deliveryTime: 'ASAP (30-40 mins)',
      paymentMethod: 'Credit Card',
      status: 'confirmed'
    });
  }, [orderId]);

  const trackOrderSteps = [
    {
      stage: 'Order Confirmed',
      description: 'We have received your order',
      time: 'Just now',
      icon: <CheckCircle />,
      active: true
    },
    {
      stage: 'Preparing',
      description: 'Chef is preparing your order',
      time: 'Estimated: 5-10 mins',
      icon: <Package />,
      active: false
    },
    {
      stage: 'On the Way',
      description: 'Driver is heading to you',
      time: 'Estimated: 15-20 mins',
      icon: <Truck />,
      active: false
    },
    {
      stage: 'Delivered',
      description: 'Enjoy your meal!',
      time: `Estimated: ${estimatedDelivery}`,
      icon: <Home />,
      active: false
    }
  ];

  if (!order) {
    return <div className="loading">Loading order details...</div>;
  }

  return (
    <div className="order-confirmation-page">
      <div className="confirmation-container">
        {/* Header */}
        <div className="confirmation-header">
          <CheckCircle className="success-icon" size={80} />
          <h1>Order Confirmed!</h1>
          <p className="order-id">Order ID: {order.id}</p>
          <p className="thank-you">
            Thank you for your order! We're preparing your food with care.
          </p>
        </div>

        {/* Order Summary */}
        <div className="order-summary-section">
          <h2>
            <ShoppingBag size={24} />
            Order Summary
          </h2>
          <div className="order-items">
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <span className="item-name">{item.name} ×{item.quantity}</span>
                <span className="item-price">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="order-total">
            <span>Total:</span>
            <span className="total-amount">${order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="delivery-info-section">
          <h2>
            <MapPin size={24} />
            Delivery Information
          </h2>
          <div className="info-grid">
            <div className="info-item">
              <strong>Delivery Address:</strong>
              <p>{order.deliveryAddress}</p>
            </div>
            <div className="info-item">
              <strong>Delivery Time:</strong>
              <p>{order.deliveryTime}</p>
            </div>
            <div className="info-item">
              <strong>Payment Method:</strong>
              <p>{order.paymentMethod}</p>
            </div>
            <div className="info-item">
              <strong>Estimated Delivery:</strong>
              <p className="delivery-time">{estimatedDelivery}</p>
            </div>
          </div>
        </div>

        {/* Order Tracking */}
        <div className="tracking-section">
          <h2>
            <Clock size={24} />
            Order Tracking
          </h2>
          <div className="tracking-timeline">
            {trackOrderSteps.map((step, index) => (
              <div key={index} className={`tracking-step ${step.active ? 'active' : ''}`}>
                <div className="step-icon">
                  {step.icon}
                </div>
                <div className="step-content">
                  <h4>{step.stage}</h4>
                  <p>{step.description}</p>
                  <span className="step-time">{step.time}</span>
                </div>
                {index < trackOrderSteps.length - 1 && (
                  <div className="step-connector"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="order-details">
          <h3>Order Details</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span>Order Number:</span>
              <strong>{order.id}</strong>
            </div>
            <div className="detail-item">
              <span>Order Date:</span>
              <strong>{new Date().toLocaleDateString()}</strong>
            </div>
            <div className="detail-item">
              <span>Order Time:</span>
              <strong>{new Date().toLocaleTimeString()}</strong>
            </div>
            <div className="detail-item">
              <span>Status:</span>
              <strong className="status-confirmed">Confirmed</strong>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="confirmation-actions">
          <button 
            className="btn-secondary"
            onClick={() => navigate('/menu')}
          >
            <ShoppingBag size={18} />
            Order More
          </button>
          <button 
            className="btn-primary"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>

        {/* Support */}
        <div className="support-section">
          <p>Need help with your order?</p>
          <div className="support-options">
            <button className="support-btn">
              📞 Call Support
            </button>
            <button className="support-btn">
              💬 Live Chat
            </button>
            <button className="support-btn">
              📧 Email Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;