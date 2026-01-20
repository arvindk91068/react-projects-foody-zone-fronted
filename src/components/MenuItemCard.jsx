import React from 'react';
import { Star, Clock, Heart, Plus } from 'lucide-react';

const MenuItemCard = ({ 
  item, 
  onAddToCart, 
  onToggleFavorite,
  isFavorite 
}) => {
  const {
    title,
    description,
    price,
    originalPrice,
    category,
    rating,
    prepTime,
    calories,
    popular,
    ingredients = [],
    vegan,
    spicy,
    discount
  } = item;

  const isDeal = category === 'deal';

  return (
    <div className={`menu-item-card ${popular ? 'popular' : ''} ${isDeal ? 'deal' : ''}`}>
      <div className="card-header">
        {popular && <div className="popular-badge">🔥 Popular</div>}
        {isDeal && discount && <div className="deal-badge">🎯 {discount}</div>}
        {vegan && <div className="vegan-badge">🌱 Vegan</div>}
        {spicy && <div className="spicy-badge">🌶️ Spicy</div>}
        
        <button 
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={() => onToggleFavorite(item.id)}
        >
          <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      
      <div className="card-body">
        <div className="item-title-section">
          <h3 className="item-title">{title}</h3>
          {rating && (
            <div className="item-rating">
              <Star size={16} fill="currentColor" />
              <span>{rating}</span>
            </div>
          )}
        </div>
        
        <p className="item-description">{description}</p>
        
        {ingredients.length > 0 && (
          <div className="item-ingredients">
            <span className="ingredients-label">Ingredients:</span>
            <div className="ingredients-tags">
              {ingredients.slice(0, 3).map(ingredient => (
                <span key={ingredient} className="ingredient-tag">
                  {ingredient}
                </span>
              ))}
              {ingredients.length > 3 && (
                <span className="more-tag">
                  +{ingredients.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="card-footer">
        <div className="item-details">
          <div className="detail-group">
            <Clock size={16} />
            <span>{prepTime}</span>
          </div>
          {calories && (
            <div className="detail-group">
              <span>🔥</span>
              <span>{calories} cal</span>
            </div>
          )}
        </div>
        
        <div className="price-section">
          {isDeal ? (
            <div className="deal-pricing">
              <span className="original-price">${originalPrice}</span>
              <div className="deal-price">
                <span className="price-value">{price}</span>
                <span className="price-label">50% OFF</span>
              </div>
            </div>
          ) : (
            <div className="regular-price">${price}</div>
          )}
          
          <button 
            className={`add-to-cart-btn ${isDeal ? 'deal-btn' : ''}`}
            onClick={() => onAddToCart(item)}
          >
            <Plus size={20} />
            {isDeal ? 'Grab Deal' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;