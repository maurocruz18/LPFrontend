import api from './api';

const cartService = {
  // Get user's cart
  getCart: () => {
    // Remove /api from the URL since cart endpoints don't have it
    return api.get('/users/cart', {
      baseURL: api.defaults.baseURL.replace('/api', '')
    });
  },

  // Add game to cart
  addToCart: (gameData) => {
    return api.post('/users/cart', gameData, {
      baseURL: api.defaults.baseURL.replace('/api', '')
    });
  },

  // Remove game from cart
  removeFromCart: (gameId) => {
    return api.delete(`/users/cart/${gameId}`, {
      baseURL: api.defaults.baseURL.replace('/api', '')
    });
  },

  // Clear entire cart
  clearCart: () => {
    return api.delete('/users/cart', {
      baseURL: api.defaults.baseURL.replace('/api', '')
    });
  },

  // Checkout cart
  checkout: (paymentMethod = 'credit_card') => {
    // Checkout endpoint has /api prefix
    return api.post('/api/purchases/checkout', {
      paymentMethod
    });
  },

  // Purchase single game
  purchaseGame: (gameId, paymentMethod = 'credit_card') => {
    return api.post(`/api/purchases/game/${gameId}`, {
      paymentMethod
    });
  }
};

export default cartService;