import axios from 'axios';

// Get base URLs from environment or use defaults
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
const BASE_URL = API_BASE_URL.replace('/api', '');

// Create axios instances for different base URLs
const apiWithPrefix = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiWithoutPrefix = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to both instances
[apiWithPrefix, apiWithoutPrefix].forEach(instance => {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
});

const purchaseService = {
  // Get user's cart - uses /users/cart (no /api prefix)
  getCart: () => {
    return apiWithoutPrefix.get('/users/cart');
  },

  // Add game to cart - uses /users/cart (no /api prefix)
  addToCart: (gameData) => {
    return apiWithoutPrefix.post('/users/cart', gameData);
  },

  // Remove game from cart - uses /users/cart (no /api prefix)
  removeFromCart: (gameId) => {
    return apiWithoutPrefix.delete(`/users/cart/${gameId}`);
  },

  // Clear entire cart - uses /users/cart (no /api prefix)
  clearCart: () => {
    return apiWithoutPrefix.delete('/users/cart');
  },

  // Checkout cart - uses /api/purchases/checkout
  checkout: (paymentMethod = 'credit_card') => {
    return apiWithPrefix.post('/purchases/checkout', {
      paymentMethod
    });
  },

  // Purchase single game immediately - uses /api/purchases/game
  purchaseGame: (gameId, paymentMethod = 'credit_card') => {
    return apiWithPrefix.post(`/purchases/game/${gameId}`, {
      paymentMethod
    });
  },

  // Get purchase history - uses /api/purchases/history
  getPurchaseHistory: (page = 1, limit = 20) => {
    return apiWithPrefix.get(`/purchases/history?page=${page}&limit=${limit}`);
  },

  // Get transaction details - uses /api/purchases/transaction
  getTransactionDetails: (transactionId) => {
    return apiWithPrefix.get(`/purchases/transaction/${transactionId}`);
  },

  // Get user's library/owned games - uses /users/library (no /api prefix)
  getLibrary: () => {
    return apiWithoutPrefix.get('/users/library');
  },

  // Rate a game - uses /api/games
  rateGame: (gameId, rating, comment = '') => {
    return apiWithPrefix.post(`/games/${gameId}/rating`, {
      rating,
      comment
    });
  },

  // Get game ratings - uses /api/games
  getGameRatings: (gameId, page = 1, limit = 10) => {
    return apiWithPrefix.get(`/games/${gameId}/ratings?page=${page}&limit=${limit}`);
  }
};

export default purchaseService;