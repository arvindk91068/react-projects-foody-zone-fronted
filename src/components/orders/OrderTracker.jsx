// components/orders/OrderTracker.jsx
import React, { useState, useEffect } from 'react';
import { MapPin, Clock, CheckCircle, Truck, Package } from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';
import './OrderTracker.css';

const OrderTracker = ({ orderId }) => {
  const [orderStatus, setOrderStatus] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const socket = useSocket();

  const statusSteps = [
    { id: 1, label: 'Order Placed', icon: <Package />, completed: true },
    { id: 2, label: 'Preparing', icon: <Clock /> },
    { id: 3, label: 'On the Way', icon: <Truck /> },
    { id: 4, label: 'Delivered', icon: <CheckCircle /> },
  ];

  useEffect(() => {
    if (socket) {
      socket.emit('track-order', orderId);
      
      socket.on('order-update', (update) => {
        setOrderStatus(update.status);
        setDeliveryLocation(update.location);
        setEstimatedTime(update.estimatedDelivery);
      });

      socket.on('driver-location', (location) => {
        setDeliveryLocation(location);
      });

      return () => {
        socket.off('order-update');
        socket.off('driver-location');
      };
    }
  }, [socket, orderId]);

  return (
    <div className="order-tracker">
      <div className="tracker-header">
        <h3>Order #{orderId}</h3>
        <div className="tracker-status">
          <span className={`status-badge ${orderStatus?.toLowerCase()}`}>
            {orderStatus}
          </span>
        </div>
      </div>

      <div className="tracker-timeline">
        {statusSteps.map((step, index) => (
          <div key={step.id} className="timeline-step">
            <div className={`step-icon ${index < 2 ? 'completed' : ''}`}>
              {step.icon}
            </div>
            <div className="step-label">{step.label}</div>
            <div className="step-time">
              {index === 0 && '10:30 AM'}
              {index === 1 && '10:45 AM'}
              {index === 2 && 'Estimated 11:15 AM'}
            </div>
          </div>
        ))}
      </div>

      {deliveryLocation && (
        <div className="delivery-map">
          <div className="map-header">
            <MapPin size={20} />
            <span>Live Delivery Tracking</span>
          </div>
          <div className="map-container">
            {/* Integration with Google Maps or Mapbox would go here */}
            <div className="map-placeholder">
              <div className="driver-marker">
                <Truck size={24} />
              </div>
              <div className="route-line"></div>
              <div className="destination-marker">
                <MapPin size={24} />
              </div>
            </div>
          </div>
          <div className="delivery-info">
            <div className="info-item">
              <span className="label">Driver:</span>
              <span className="value">John Doe</span>
            </div>
            <div className="info-item">
              <span className="label">Vehicle:</span>
              <span className="value">Honda Scooter #AB123</span>
            </div>
            <div className="info-item">
              <span className="label">ETA:</span>
              <span className="value">{estimatedTime}</span>
            </div>
          </div>
        </div>
      )}

      <div className="tracker-actions">
        <button className="btn-secondary">Contact Driver</button>
        <button className="btn-primary">View Order Details</button>
      </div>
    </div>
  );
};