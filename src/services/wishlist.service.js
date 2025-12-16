import api from './api';

const wishlistService = {
  // Get user's wishlist
  getWishlist: () => {
    // Remove /api from the URL since wishlist endpoints don't have it
    return api.get('/users/wishlist', {
      baseURL: api.defaults.baseURL.replace('/api', '')
    });
  },

  // Add game to wishlist
  addToWishlist: (gameId, gameName) => {
    return api.post('/users/wishlist', {
      gameId: gameId,
      gameName: gameName
    }, {
      baseURL: api.defaults.baseURL.replace('/api', '')
    });
  },

  // Remove game from wishlist
  removeFromWishlist: (gameId) => {
    return api.delete(`/users/wishlist/${gameId}`, {
      baseURL: api.defaults.baseURL.replace('/api', '')
    });
  }
};

export default wishlistService;