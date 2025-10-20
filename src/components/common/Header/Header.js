import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Mock data for notifications
  const notifications = [
    { id: 1, message: "New game added to your wishlist is on sale!", time: "2 hours ago" },
    { id: 2, message: "Your friend sent you a game recommendation", time: "5 hours ago" },
    { id: 3, message: "Cyberpunk 2077 has a new update", time: "1 day ago" }
  ];

  // Mock data for cart
  const cartItems = [
    { id: 1, title: "The Witcher 3", price: 29.99, image: "https://via.placeholder.com/60x80" },
    { id: 2, title: "Red Dead Redemption 2", price: 39.99, image: "https://via.placeholder.com/60x80" }
  ];

  const cartTotal = cartItems.reduce((total, item) => total + item.price, 0);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left Section - Home & Browse */}
        <div className="navbar-left">
          <Link to="/" className="navbar-link">
            <span className="icon">🏠</span>
            Home
          </Link>
          <Link to="/browse" className="navbar-link">
            <span className="icon">🎮</span>
            Browse
          </Link>
        </div>

        {/* Center Section - Search Bar */}
        <div className="navbar-center">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search for games..." 
              className="search-input"
            />
            <button className="search-button">
              <span className="icon">🔍</span>
            </button>
          </div>
        </div>

        {/* Right Section - Icons */}
        <div className="navbar-right">
          {/* Notifications */}
          <div className="navbar-icon-container">
            <button 
              className="navbar-icon-button"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowCart(false);
                setShowUserMenu(false);
              }}
            >
              <span className="icon">🔔</span>
              <span className="badge">3</span>
            </button>

            {showNotifications && (
              <div className="dropdown-menu notifications-menu">
                <div className="dropdown-header">
                  <h3>Notifications</h3>
                </div>
                <div className="dropdown-content">
                  {notifications.map(notif => (
                    <div key={notif.id} className="notification-item">
                      <p className="notification-message">{notif.message}</p>
                      <span className="notification-time">{notif.time}</span>
                    </div>
                  ))}
                </div>
                <div className="dropdown-footer">
                  <button className="view-all-btn">View All Notifications</button>
                </div>
              </div>
            )}
          </div>

          {/* Shopping Cart */}
          <div className="navbar-icon-container">
            <button 
              className="navbar-icon-button"
              onClick={() => {
                setShowCart(!showCart);
                setShowNotifications(false);
                setShowUserMenu(false);
              }}
            >
              <span className="icon">🛒</span>
              <span className="badge">{cartItems.length}</span>
            </button>

            {showCart && (
              <div className="dropdown-menu cart-menu">
                <div className="dropdown-header">
                  <h3>Shopping Cart</h3>
                </div>
                <div className="dropdown-content">
                  {cartItems.length > 0 ? (
                    <>
                      {cartItems.map(item => (
                        <div key={item.id} className="cart-item">
                          <img src={item.image} alt={item.title} className="cart-item-image" />
                          <div className="cart-item-info">
                            <h4>{item.title}</h4>
                            <p className="cart-item-price">${item.price}</p>
                          </div>
                          <button className="remove-btn">✕</button>
                        </div>
                      ))}
                      <div className="cart-total">
                        <span>Total:</span>
                        <span className="total-price">${cartTotal.toFixed(2)}</span>
                      </div>
                    </>
                  ) : (
                    <p className="empty-message">Your cart is empty</p>
                  )}
                </div>
                <div className="dropdown-footer">
                  <button className="checkout-btn">Proceed to Checkout</button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="navbar-icon-container">
            <button 
              className="navbar-icon-button user-button"
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
                setShowCart(false);
              }}
            >
              <span className="icon">👤</span>
            </button>

            {showUserMenu && (
              <div className="dropdown-menu user-menu">
                <div className="dropdown-header user-header">
                  <div className="user-avatar">👤</div>
                  <div className="user-info">
                    <h3>John Doe</h3>
                    <p>john.doe@email.com</p>
                  </div>
                </div>
                <div className="dropdown-content">
                  <Link to="/owned-games" className="user-menu-item">
                    <span className="icon">📚</span>
                    My Games
                  </Link>
                  <Link to="/wishlist" className="user-menu-item">
                    <span className="icon">❤️</span>
                    Wishlist
                  </Link>
                  <Link to="/settings" className="user-menu-item">
                    <span className="icon">⚙️</span>
                    Settings
                  </Link>
                  <div className="user-stats">
                    <div className="stat-item">
                      <span className="stat-value">42</span>
                      <span className="stat-label">Games Owned</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">8</span>
                      <span className="stat-label">Wishlist</span>
                    </div>
                  </div>
                </div>
                <div className="dropdown-footer">
                  <button className="logout-btn">Logout</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;