import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GameCard from '../../components/game/GameCard/GameCard';
import gamesService from '../../services/games.service';
import './Browse.css';

const BrowsePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const [allGames, setAllGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Initialize searchTerm from URL query parameter if present
  const initialSearch = queryParams.get('search') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('name');
  const [filters, setFilters] = useState({
    genre: 'all',
    priceRange: 'all',
    platform: 'all',
    onSale: false
  });

  const [genres, setGenres] = useState([]);
  const [availablePlatforms] = useState([
    'All Platforms',
    'PC',
    'PlayStation 5',
    'PlayStation 4',
    'Xbox Series X/S',
    'Xbox One',
    'Nintendo Switch'
  ]);

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'free', label: 'Free' },
    { value: 'under20', label: 'Under $20' },
    { value: '20-40', label: '$20 - $40' },
    { value: '40-60', label: '$40 - $60' },
    { value: 'over60', label: 'Over $60' }
  ];

  // Load all games on component mount
  useEffect(() => {
    const fetchAllGames = async () => {
      setLoading(true);
      try {
        // Fetch all games with pagination
        let currentPage = 1;
        let totalPages = 1;
        let allGamesData = [];
        
        do {
          const response = await gamesService.searchGames({
            page: currentPage,
            limit: 100 // Fetch more games per page
          });
          
          if (response.data.success) {
            const formattedGames = response.data.data.map(game => ({
              id: game.steamAppId || game._id, // Use steamAppId as primary ID
              steamAppId: game.steamAppId,
              title: game.name,
              genre: game.genres?.map(g => g.name).join(', ') || 'Unknown',
              genresArray: game.genres?.map(g => g.name) || [],
              developer: game.developers?.map(d => d.name).join(', ') || 'Unknown',
              // Fix: Handle price object
              price: typeof game.price === 'object' && game.price !== null ? game.price.amount : game.price || 0,
              discountedPrice: game.price?.onSale ? game.price?.salePrice : null,
              discount: game.price?.onSale && game.price?.amount && game.price?.salePrice 
                ? Math.round(((game.price.amount - game.price.salePrice) / game.price.amount) * 100) 
                : 0,
              rating: game.rating || 0,
              platforms: game.platforms?.map(p => p.platform.name) || [],
              backgroundImage: game.backgroundImage,
              releaseDate: game.released,
              metacritic: game.metacritic,
              description: game.description,
              onSale: game.price?.onSale || false
            }));
            
            allGamesData = [...allGamesData, ...formattedGames];
            totalPages = response.data.pages || 1;
            currentPage++;
          }
        } while (currentPage <= totalPages && totalPages > 1);
        
        setAllGames(allGamesData);
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllGames();
  }, []);

  // Load genres on component mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await gamesService.getGenres();
        if (response.data.success) {
          setGenres(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, []);

  // Apply filters whenever filters, search term, or sort changes
  useEffect(() => {
    if (allGames.length === 0) return;
    
    let results = [...allGames];
    
    // 1. Apply search filter - prioritize the search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      results = results.filter(game => 
        game.title.toLowerCase().includes(term) ||
        game.developer.toLowerCase().includes(term) ||
        game.genre.toLowerCase().includes(term)
      );
    }
    
    // 2. Apply genre filter
    if (filters.genre !== 'all') {
      results = results.filter(game => 
        game.genresArray.includes(filters.genre)
      );
    }
    
    // 3. Apply platform filter
    if (filters.platform !== 'all') {
      results = results.filter(game => 
        game.platforms.some(platform => 
          platform.toLowerCase().includes(filters.platform.toLowerCase())
        )
      );
    }
    
    // 4. Apply price range filter
    if (filters.priceRange !== 'all') {
      results = results.filter(game => {
        const price = game.discountedPrice || game.price;
        
        switch (filters.priceRange) {
          case 'free':
            return price === 0;
          case 'under20':
            return price > 0 && price < 20;
          case '20-40':
            return price >= 20 && price <= 40;
          case '40-60':
            return price >= 40 && price <= 60;
          case 'over60':
            return price > 60;
          default:
            return true;
        }
      });
    }
    
    // 5. Apply on sale filter
    if (filters.onSale) {
      results = results.filter(game => game.onSale);
    }
    
    // 6. Apply sorting
    results.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'price-low':
          return (a.discountedPrice || a.price) - (b.discountedPrice || b.price);
        case 'price-high':
          return (b.discountedPrice || b.price) - (a.discountedPrice || a.price);
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.releaseDate) - new Date(a.releaseDate);
        default:
          return 0;
      }
    });
    
    setFilteredGames(results);
  }, [allGames, searchTerm, filters, sortBy]);

  // Update URL when search term changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
    }
    
    const newUrl = params.toString() ? `/browse?${params.toString()}` : '/browse';
    navigate(newUrl, { replace: true });
  }, [searchTerm, navigate]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      genre: 'all',
      priceRange: 'all',
      platform: 'all',
      onSale: false
    });
    setSearchTerm('');
    setSortBy('name');
  };

  // Function to handle search from within Browse page
  const handleBrowseSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // The useEffect above will handle the navigation
    }
  };

  return (
    <div className="browse-page">
      {/* Page Header */}
      <div className="browse-header">
        <h1>Browse Games</h1>
        <p>Discover your next favorite game from our extensive collection</p>
      </div>

      <div className="browse-container">
        {/* Sidebar - Filters */}
        <div className="filters-sidebar">
          <div className="filters-header">
            <h3>Filters</h3>
            <button className="clear-filters" onClick={clearFilters}>
              Clear All
            </button>
          </div>

          {/* Search Filter in Browse page */}
          <div className="filter-group">
            <label className="filter-label">Search</label>
            <form onSubmit={handleBrowseSearch}>
              <input
                type="text"
                placeholder="Search by game name, developer, or genre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-filter"
                disabled={loading || allGames.length === 0}
              />
            </form>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <div className="filter-options">
              <button
                className={`filter-option ${filters.genre === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange('genre', 'all')}
                disabled={loading}
              >
                All Categories
              </button>
              {genres.map(genre => (
                <button
                  key={genre.slug}
                  className={`filter-option ${filters.genre === genre.name ? 'active' : ''}`}
                  onClick={() => handleFilterChange('genre', genre.name)}
                  disabled={loading}
                >
                  {genre.name} ({genre.gameCount})
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="filter-group">
            <label className="filter-label">Price Range</label>
            <div className="filter-options">
              {priceRanges.map(range => (
                <button
                  key={range.value}
                  className={`filter-option ${filters.priceRange === range.value ? 'active' : ''}`}
                  onClick={() => handleFilterChange('priceRange', range.value)}
                  disabled={loading}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Platform Filter */}
          <div className="filter-group">
            <label className="filter-label">Platform</label>
            <div className="filter-options">
              {availablePlatforms.map(platform => (
                <button
                  key={platform}
                  className={`filter-option ${filters.platform === platform ? 'active' : ''}`}
                  onClick={() => handleFilterChange('platform', platform)}
                  disabled={loading}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          {/* On Sale Filter */}
          <div className="filter-group">
            <label className="filter-label checkbox-label">
              <input
                type="checkbox"
                checked={filters.onSale}
                onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                disabled={loading}
              />
              On Sale Only
            </label>
          </div>
        </div>

        {/* Main Content - Games Grid */}
        <div className="games-main">
          {/* Results Header */}
          <div className="results-header">
            <div className="results-count">
              {loading ? (
                'Loading all games...'
              ) : allGames.length === 0 ? (
                'No games available'
              ) : (
                <>
                  Showing {filteredGames.length} of {allGames.length} games
                  {searchTerm && (
                    <span style={{ display: 'block', fontSize: '0.9rem', color: '#3498db', marginTop: '0.5rem' }}>
                      Search: "{searchTerm}"
                    </span>
                  )}
                </>
              )}
            </div>
            <div className="sort-options">
              <label>Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
                disabled={loading || allGames.length === 0}
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
                <option value="rating">Rating</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="no-results">
              <h3>Loading games...</h3>
              <p>Please wait while we fetch all games from the server</p>
              <div className="spinner"></div>
            </div>
          ) : filteredGames.length > 0 ? (
            <div className="games-grid">
              {filteredGames.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : allGames.length > 0 ? (
            <div className="no-results">
              <h3>No games found</h3>
              <p>
                {searchTerm ? (
                  <>
                    No games found for "<strong>{searchTerm}</strong>"
                    <br />
                    Try different search terms or clear the search
                  </>
                ) : (
                  'Try adjusting your filters or search terms'
                )}
              </p>
              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="no-results">
              <h3>No games available</h3>
              <p>There are currently no games in the database</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;