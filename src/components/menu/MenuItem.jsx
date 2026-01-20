// components/menu/MenuItem.jsx
import React, { useState, memo } from 'react';
import { Star, Clock, Heart, Plus, Minus, AlertCircle } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useFavorites } from '../../hooks/useFavorites';
import ImageWithFallback from '../ui/ImageWithFallback';
import './MenuItem.css';

const MenuItem = memo(({ item }) => {
  const { addToCart, cart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);
  const [showCustomize, setShowCustomize] = useState(false);
  const [customizations, setCustomizations] = useState({});

  const cartItem = cart.find(cartItem => cartItem.id === item.id);
  const itemInCart = !!cartItem;

  const handleAddToCart = () => {
    addToCart({
      ...item,
      quantity,
      customizations,
      totalPrice: calculateTotalPrice()
    });
    setQuantity(1);
    setCustomizations({});
  };

  const calculateTotalPrice = () => {
    let total = item.price * quantity;
    Object.values(customizations).forEach(customization => {
      total += customization.price * quantity;
    });
    return total;
  };

  const handleCustomizationChange = (optionId, choiceId) => {
    const option = item.customizationOptions?.find(opt => opt.id === optionId);
    const choice = option?.choices.find(ch => ch.id === choiceId);
    
    setCustomizations(prev => ({
      ...prev,
      [optionId]: {
        optionName: option.name,
        choiceName: choice.name,
        price: choice.price
      }
    }));
  };

  return (
    <div className="menu-item-card" data-testid={`menu-item-${item.id}`}>
      <div className="card-image">
        <ImageWithFallback
          src={item.image}
          alt={item.title}
          fallbackSrc="/images/food-placeholder.jpg"
        />
        {item.isNew && <span className="new-badge">NEW</span>}
        {item.discount > 0 && (
          <span className="discount-badge">-{item.discount}%</span>
        )}
        <button
          className={`favorite-btn ${isFavorite(item.id) ? 'active' : ''}`}
          onClick={() => toggleFavorite(item.id)}
          aria-label={isFavorite(item.id) ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={20} />
        </button>
      </div>

      <div className="card-content">
        <div className="item-header">
          <h3 className="item-title">{item.title}</h3>
          <div className="item-meta">
            {item.rating && (
              <span className="rating">
                <Star size={14} fill="currentColor" />
                {item.rating}
              </span>
            )}
            {item.prepTime && (
              <span className="prep-time">
                <Clock size={14} />
                {item.prepTime}
              </span>
            )}
          </div>
        </div>

        <p className="item-description">{item.description}</p>

        {item.dietaryInfo && (
          <div className="dietary-tags">
            {item.dietaryInfo.map(tag => (
              <span key={tag} className={`dietary-tag ${tag.toLowerCase()}`}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {item.ingredients && (
          <div className="ingredients">
            <span className="ingredients-label">Ingredients:</span>
            <div className="ingredients-list">
              {item.ingredients.slice(0, 3).map(ing => (
                <span key={ing} className="ingredient">{ing}</span>
              ))}
              {item.ingredients.length > 3 && (
                <span className="more-ingredients">
                  +{item.ingredients.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {item.spicyLevel > 0 && (
          <div className="spicy-indicator">
            <span>Spicy Level:</span>
            <div className="spicy-dots">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`spicy-dot ${i < item.spicyLevel ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="customize-section">
          <button
            className="customize-btn"
            onClick={() => setShowCustomize(!showCustomize)}
          >
            <AlertCircle size={16} />
            Customize
          </button>

          {showCustomize && item.customizationOptions && (
            <div className="customization-options">
              {item.customizationOptions.map(option => (
                <div key={option.id} className="customization-option">
                  <h4>{option.name} {option.required && <span className="required">*</span>}</h4>
                  <div className="option-choices">
                    {option.choices.map(choice => (
                      <label key={choice.id} className="choice-label">
                        <input
                          type={option.multiple ? 'checkbox' : 'radio'}
                          name={option.id}
                          value={choice.id}
                          onChange={() => handleCustomizationChange(option.id, choice.id)}
                          checked={customizations[option.id]?.choiceName === choice.name}
                        />
                        <span className="choice-name">{choice.name}</span>
                        {choice.price > 0 && (
                          <span className="choice-price">+${choice.price}</span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card-footer">
          <div className="price-section">
            {item.originalPrice && item.discount > 0 ? (
              <div className="discount-price">
                <span className="original-price">${item.originalPrice.toFixed(2)}</span>
                <span className="current-price">
                  ${(item.price * (1 - item.discount / 100)).toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="current-price">${item.price.toFixed(2)}</span>
            )}
            
            {customizations && Object.keys(customizations).length > 0 && (
              <span className="customization-price">
                +${Object.values(customizations).reduce((sum, c) => sum + c.price, 0).toFixed(2)}
              </span>
            )}
          </div>

          <div className="action-section">
            {itemInCart ? (
              <div className="cart-controls">
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
                >
                  <Minus size={16} />
                </button>
                <span className="quantity">{cartItem.quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.id, cartItem.quantity + 1)}
                >
                  <Plus size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className="quantity-selector">
                  <button
                    className="quantity-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="quantity">{quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  className="add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={showCustomize && !validateCustomizations()}
                >
                  <Plus size={18} />
                  Add to Cart
                  {quantity > 1 && <span className="total-price">${calculateTotalPrice().toFixed(2)}</span>}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default MenuItem;