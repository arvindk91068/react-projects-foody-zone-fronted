import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  User, 
  ShoppingCart, 
  Heart,
  TrendingUp,
  ChevronDown
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const Header = ({ 
  onSearch, 
  onToggleCart, 
  onToggleMobileMenu,
  onSelectCategory,
  searchTerm 
}) => {
  const { getItemCount, getTotal } = useCart();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e) => {
    onSearch(e.target.value);
  };

  return (
    <header className="header">
      <div className="header-top">
        <button 
          className="mobile-menu-btn"
          onClick={onToggleMobileMenu}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
        
       
        <div className="user-section">
          <div 
            className="user-info"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <User size={20} />
            <span>Guest</span>
            <ChevronDown size={16} />
            
            {showUserMenu && (
              <div className="user-menu">
                <button>Profile</button>
                <button>Orders</button>
                <button>Settings</button>
                <button>Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="header-main">
      
        
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search dishes, ingredients..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className="search-shortcut" title="Press Ctrl+K">
            Ctrl+K
          </div>
        </div>
        
        <div className="header-actions">
          <button 
            className="favorites-btn"
            onClick={() => onSelectCategory('favorites')}
            aria-label="View favorites"
          >
            <Heart size={20} />
            <span className="badge">0</span>
          </button>
          
          <button 
            className="cart-toggle"
            onClick={onToggleCart}
            aria-label="Open cart"
          >
            <ShoppingCart size={20} />
            <span className="cart-count">{getItemCount()}</span>
            <span className="cart-total">${getTotal().toFixed(2)}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;