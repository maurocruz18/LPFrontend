import api from './api';

const gamesService = {
  getHomepage: () => {
    return api.get('/games/homepage'); // Remove /api if baseURL has /api
  },

  searchGames: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add all parameters to the query
    Object.entries(params).forEach(([key, value]) => {
      // Handle boolean values
      if (typeof value === 'boolean') {
        queryParams.append(key, value.toString());
      }
      // Handle other values (skip null/undefined/empty)
      else if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    return api.get(`/games/search?${queryParams.toString()}`);
  },

  // Get all genres
  getGenres: () => {
    return api.get('/games/genres');
  },

  // Get game by SteamAppID
  getGameBySteamAppId: (steamAppId) => {
    return api.get(`/games/${steamAppId}`);
  },

  // Get game by ID (as fallback)
  getGameById: (gameId) => {
    return api.get(`/games/${gameId}`);
  },
};

export default gamesService;