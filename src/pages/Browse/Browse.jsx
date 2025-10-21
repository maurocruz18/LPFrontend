
import React, { useState, useEffect } from 'react';
import GameCard from '../../components/GameCard/GameCard';
import { mockGames } from '../../data/mockGames';
import './Browse.css';

const BrowsePage = () => {
  const [games, setGames] = useState(mockGames);
  const [filteredGames, setFilteredGames] = useState(mockGames);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    platform: 'all',
    onSale: false
  });

  // Available filter options
  const categories = ['all', 'RPG', 'Action', 'Sports', 'FPS', 'Sandbox'];
  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'under20', label: 'Under $20' },
    { value: '20-40', label: '$20 - $40' },
    { value: '40-60', label: '$40 - $60' },
    { value: 'over60', label: 'Over $60' }
  ];
  const platforms = ['all', 'PC', 'PS5', 'PS4', 'XBOX', 'Switch', 'Mobile'];

  // Filter and sort games
  useEffect(() => {
    let results = [...games];

    // Apply search filter
    if (searchTerm) {
      results = results.filter(game =>
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.developer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category !== 'all') {
      results = results.filter(game => game.genre === filters.category);
    }

    // Apply price range filter
    if (filters.priceRange !== 'all') {
      switch (filters.priceRange) {
        case 'under20':
          results = results.filter(game => 
            (game.discountedPrice || game.price) < 20
          );
          break;
        case '20-40':
          results = results.filter(game => {
            const price = game.discountedPrice || game.price;
            return price >= 20 && price <= 40;
          });
          break;
        case '40-60':
          results = results.filter(game => {
            const price = game.discountedPrice || game.price;
            return price >= 40 && price <= 60;
          });
          break;
        case 'over60':
          results = results.filter(game => 
            (game.discountedPrice || game.price) > 60
          );
          break;
        default:
          break;
      }
    }

    // Apply platform filter
    if (filters.platform !== 'all') {
      results = results.filter(game => 
        game.platforms.includes(filters.platform)
      );
    }

    // Apply sale filter
    if (filters.onSale) {
      results = results.filter(game => game.discount);
    }

    // Apply sorting
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
          // For mock data, we'll use ID as proxy for release date
          return b.id - a.id;
        default:
          return 0;
      }
    });

    setFilteredGames(results);
  }, [games, searchTerm, sortBy, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      priceRange: 'all',
      platform: 'all',
      onSale: false
    });
    setSearchTerm('');
    setSortBy('name');
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

          {/* Search Filter */}
          <div className="filter-group">
            <label className="filter-label">Search</label>
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-filter"
            />
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <div className="filter-options">
              {categories.map(category => (
                <button
                  key={category}
                  className={`filter-option ${filters.category === category ? 'active' : ''}`}
                  onClick={() => handleFilterChange('category', category)}
                >
                  {category === 'all' ? 'All Categories' : category}
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
              {platforms.map(platform => (
                <button
                  key={platform}
                  className={`filter-option ${filters.platform === platform ? 'active' : ''}`}
                  onClick={() => handleFilterChange('platform', platform)}
                >
                  {platform === 'all' ? 'All Platforms' : platform}
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
              Showing {filteredGames.length} of {games.length} games
            </div>
            <div className="sort-options">
              <label>Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
                <option value="rating">Rating</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Games Grid */}
          {filteredGames.length > 0 ? (
            <div className="games-grid">
              {filteredGames.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h3>No games found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;