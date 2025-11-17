const axios = require('axios');

class RawgService {
  constructor() {
    this.baseURL = process.env.RAWG_BASE_URL || 'https://api.rawg.io/api';
    this.apiKey = process.env.RAWG_API_KEY;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000
    });
  }

  // Fetch games with optional filters
  async getGames(params = {}) {
    try {
      const response = await this.client.get('/games', {
        params: {
          key: this.apiKey,
          page: params.page || 1,
          page_size: params.pageSize || 20,
          search: params.search,
          ordering: params.ordering || '-released',
          genres: params.genres,
          platforms: params.platforms,
          dates: params.dates
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro RAWG getGames:', error.message);
      throw error;
    }
  }

  // Details of a specific game
  async getGameDetails(gameId) {
    try {
      const response = await this.client.get(`/games/${gameId}`, {
        params: { key: this.apiKey }
      });
      return response.data;
    } catch (error) {
      console.error(`Erro RAWG gameDetails ${gameId}:`, error.message);
      throw error;
    }
  }

  // Game screenshots
  async getGameScreenshots(gameId) {
    try {
      const response = await this.client.get(`/games/${gameId}/screenshots`, {
        params: { key: this.apiKey }
      });
      return response.data;
    } catch (error) {
      console.error(`Erro screenshots ${gameId}:`, error.message);
      return { results: [] };
    }
  }

  // Featured games (high rating)
  async getFeaturedGames() {
    return this.getGames({
      pageSize: 50,
      ordering: '-rating',
      metacritic: '80,100'
    });
  }

  // Recent games (last 3 months)
  async getRecentGames() {
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);

    return this.getGames({
      pageSize: 50,
      ordering: '-released',
      dates: `${threeMonthsAgo.toISOString().split('T')[0]},${today.toISOString().split('T')[0]}`
    });
  }

  // Popular games (by number of additions)
  async getPopularGames() {
    return this.getGames({
      pageSize: 50,
      ordering: '-added'
    });
  }

  // Search by name
  async searchGames(searchTerm, page = 1, pageSize = 20) {
    return this.getGames({
      search: searchTerm,
      page,
      pageSize
    });
  }

  // List of available genres
  async getGenres() {
    try {
      const response = await this.client.get('/genres', {
        params: { key: this.apiKey }
      });
      return response.data;
    } catch (error) {
      console.error('Erro getGenres:', error.message);
      return { results: [] };
    }
  }

  // List of available platforms
  async getPlatforms() {
    try {
      const response = await this.client.get('/platforms', {
        params: { key: this.apiKey }
      });
      return response.data;
    } catch (error) {
      console.error('Erro getPlatforms:', error.message);
      return { results: [] };
    }
  }
}

module.exports = new RawgService();