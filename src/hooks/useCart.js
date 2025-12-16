import { useState, useEffect, useCallback } from 'react';
import useAuth from './useAuth';
import cartService from '../services/cart.service';

const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      return;
    }

    setLoading(true);
    try {
      const data = await cartService.getCart();
      setCartItems(data.data || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addToCart = async (gameData) => {
    if (!user) {
      throw new Error('Please login to add items to cart');
    }

    try {
      const data = await cartService.addToCart(gameData);
      await fetchCart(); // Refresh cart
      return data;
    } catch (error) {
      throw error;
    }
  };

  const removeFromCart = async (gameId) => {
    try {
      const data = await cartService.removeFromCart(gameId);
      await fetchCart(); // Refresh cart
      return data;
    } catch (error) {
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const data = await cartService.clearCart();
      await fetchCart(); // Refresh cart
      return data;
    } catch (error) {
      throw error;
    }
  };

  const checkout = async (paymentMethod = 'credit_card') => {
    try {
      const data = await cartService.checkout(paymentMethod);
      await fetchCart(); // Refresh cart after checkout
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Fetch cart on mount and when user changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cartItems,
    cartCount: cartItems.length,
    loading,
    addToCart,
    removeFromCart,
    clearCart,
    checkout,
    refreshCart: fetchCart,
    calculateTotal: () => {
      return cartItems.reduce((total, item) => total + (item.price || 0), 0).toFixed(2);
    }
  };
};

export default useCart;