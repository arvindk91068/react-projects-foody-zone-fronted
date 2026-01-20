import React, { useState } from 'react';
import { MapPin, Clock, User, Phone, Home, Navigation } from 'lucide-react';
import './DeliveryInfo.css';

const DeliveryInfo = ({ onUpdate, initialData, onNext }) => {
  const [deliveryType, setDeliveryType] = useState(initialData.deliveryType || 'delivery');
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    phone: initialData.phone || '',
    address: initialData.address || '',
    apartment: initialData.apartment || '',
    city: initialData.city || '',
    zipCode: initialData.zipCode || '',
    deliveryInstructions: initialData.deliveryInstructions || '',
    deliveryTime: initialData.deliveryTime || 'asap'
  });

  const deliveryTimes = [
    { value: 'asap', label: 'ASAP (30-40 mins)', time: '30-40 mins' },
    { value: '30', label: 'In 30 minutes', time: '30 mins' },
    { value: '45', label: 'In 45 minutes', time: '45 mins' },
    { value: '60', label: 'In 1 hour', time: '1 hour' },
    { value: 'custom', label: 'Schedule for later', time: 'Custom' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const deliveryInfo = {
      ...formData,
      deliveryType,
      timestamp: new Date().toISOString()
    };
    onUpdate(deliveryInfo);
    onNext();
  };

  return (
    <div className="delivery-info">
      <div className="section-header">
        <h2>Delivery Information</h2>
        <p>Enter your details for delivery</p>
      </div>

      {/* Delivery/Pickup Toggle */}
      <div className="delivery-toggle">
        <button
          className={`toggle-btn ${deliveryType === 'delivery' ? 'active' : ''}`}
          onClick={() => setDeliveryType('delivery')}
        >
          <Navigation size={20} />
          <span>Delivery</span>
        </button>
        <button
          className={`toggle-btn ${deliveryType === 'pickup' ? 'active' : ''}`}
          onClick={() => setDeliveryType('pickup')}
        >
          <MapPin size={20} />
          <span>Pickup</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="delivery-form">
        {/* Contact Information */}
        <div className="form-section">
          <h3>Contact Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>
                <User size={16} />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="form-group">
              <label>
                <Phone size={16} />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        {deliveryType === 'delivery' && (
          <div className="form-section">
            <h3>Delivery Address</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>
                  <Home size={16} />
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter street address"
                  required
                />
              </div>
              <div className="form-group">
                <label>Apartment/Suite</label>
                <input
                  type="text"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleChange}
                  placeholder="Apt, suite, etc."
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />
              </div>
              <div className="form-group">
                <label>ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="ZIP code"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Pickup Information */}
        {deliveryType === 'pickup' && (
          <div className="form-section">
            <h3>Pickup Location</h3>
            <div className="pickup-location">
              <div className="location-card">
                <h4>Foody Zone Restaurant</h4>
                <p>123 Food Street, Gourmet City</p>
                <p>📞 (123) 456-7890</p>
                <p className="hours">🕐 Open: 10:00 AM - 11:00 PM</p>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Time */}
        <div className="form-section">
          <h3>
            <Clock size={20} />
            When do you want your order?
          </h3>
          <div className="time-options">
            {deliveryTimes.map(time => (
              <label 
                key={time.value} 
                className={`time-option ${formData.deliveryTime === time.value ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="deliveryTime"
                  value={time.value}
                  checked={formData.deliveryTime === time.value}
                  onChange={handleChange}
                />
                <div className="option-content">
                  <span className="option-label">{time.label}</span>
                  <span className="option-time">{time.time}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Special Instructions */}
        <div className="form-section">
          <h3>Special Instructions</h3>
          <textarea
            name="deliveryInstructions"
            value={formData.deliveryInstructions}
            onChange={handleChange}
            placeholder="Any special instructions for delivery? (e.g., leave at door, call on arrival, etc.)"
            rows={3}
          />
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Continue to Order Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryInfo;