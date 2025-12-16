import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import purchaseService from '../../../services/purchase.service';
import useAuth from '../../../hooks/useAuth';
import './CartDropdown.css';

const CartDropdown = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && user) {
      fetchCart();
    }
  }, [isOpen, user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await purchaseService.getCart();
      if (response.data.success) {
        setCartItems(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (gameId) => {
    try {
      const response = await purchaseService.removeFromCart(gameId);
      if (response.data.success) {
        setCartItems(cartItems.filter(item => item.gameId !== gameId));
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Failed to remove item from cart. Please try again.');
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;

    try {
      const response = await purchaseService.clearCart();
      if (response.data.success) {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart. Please try again.');
    }
  };

  const checkout = async () => {
    if (!cartItems.length) return;

    setCheckoutLoading(true);
    try {
      const response = await purchaseService.checkout('credit_card');
      if (response.data.success) {
        alert('🎉 Purchase successful! Games added to your library.');
        setCartItems([]);
        onClose();
        navigate('/library');
      } else {
        alert(`Checkout failed: ${response.data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      alert(`Checkout failed: ${errorMsg}`);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0), 0).toFixed(2);
  };

  const calculateTax = () => {
    return (parseFloat(calculateTotal()) * 0.1).toFixed(2);
  };

  const calculateGrandTotal = () => {
    return (parseFloat(calculateTotal()) + parseFloat(calculateTax())).toFixed(2);
  };

  if (!isOpen) return null;

  return (
    <div className="cart-dropdown-overlay" onClick={onClose}>
      <div className="cart-dropdown" onClick={(e) => e.stopPropagation()}>
        <div className="cart-dropdown-header">
          <h3>Shopping Cart ({cartItems.length})</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {!user ? (
          <div className="cart-login-message">
            <p>Please login to view your cart</p>
            <button 
              onClick={() => { 
                onClose(); 
                navigate('/login'); 
              }} 
              className="login-btn"
            >
              Login
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="cart-empty">
            <div className="empty-icon">🛒</div>
            <p>Your cart is empty</p>
            <button 
              onClick={() => { 
                onClose(); 
                navigate('/browse'); 
              }} 
              className="browse-btn"
            >
              Browse Games
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items-list">
              {cartItems.map(item => (
                <div key={item.gameId} className="cart-item">
                  <div className="cart-item-info">
                    <h4 className="cart-item-title">{item.gameName}</h4>
                    <p className="cart-item-price">€{item.price?.toFixed(2) || '0.00'}</p>
                    {item.quantity && item.quantity > 1 && (
                      <p className="cart-item-quantity">Qty: {item.quantity}</p>
                    )}
                  </div>
                  <button
                    className="remove-item-btn"
                    onClick={() => removeFromCart(item.gameId)}
                    title="Remove item"
                    disabled={checkoutLoading}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>€{calculateTotal()}</span>
              </div>
              <div className="summary-row">
                <span>Tax (10%):</span>
                <span>€{calculateTax()}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>€{calculateGrandTotal()}</span>
              </div>

              <div className="cart-actions">
                <button 
                  className="clear-cart-btn" 
                  onClick={clearCart}
                  disabled={checkoutLoading}
                >
                  Clear Cart
                </button>
                <button
                  className="checkout-btn"
                  onClick={checkout}
                  disabled={checkoutLoading || cartItems.length === 0}
                >
                  {checkoutLoading ? 'Processing...' : `Checkout €${calculateGrandTotal()}`}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDropdown;