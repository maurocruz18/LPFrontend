import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import purchaseService from '../../services/purchase.service';
import useAuth from '../../hooks/useAuth';
import './OwnedGames.css';

const OwnedGamesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Rating modal state
  const [ratingModal, setRatingModal] = useState({
    isOpen: false,
    gameId: null,
    gameName: '',
    gameSteamId: null
  });
  const [ratingData, setRatingData] = useState({ rating: 5, comment: '' });
  const [ratingLoading, setRatingLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch library data on mount
  useEffect(() => {
    if (user) {
      fetchLibrary();
    }
  }, [user]);

  // Apply filters and sorting whenever games, search, filter, or sort changes
  useEffect(() => {
    applyFiltersAndSort();
  }, [games, searchTerm, filter, sortBy]);

  const fetchLibrary = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.REACT_APP_API_URL.replace('/api', '');
      
      const response = await fetch(`${baseUrl}/users/library`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success && data.data) {
        const libraryGames = data.data.map(game => ({
          id: game.gameId || game._id,
          steamAppId: game.gameId,
          title: game.gameName,
          isInstalled: true,
          playTime: game.playTime || 0,
          purchaseDate: game.purchaseDate || new Date().toISOString(),
          userRating: game.userRating || null,
          userComment: game.userComment || '',
          backgroundImage: 'https://via.placeholder.com/350x200/2c3e50/ecf0f1?text=Game'
        }));
        setGames(libraryGames);
      } else {
        setError(data.message || 'Failed to load library');
      }
    } catch (err) {
      console.error('Error fetching library:', err);
      setError('Could not load your library. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...games];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(game =>
        (game.title || '').toLowerCase().includes(term) ||
        (game.developer || '').toLowerCase().includes(term)
      );
    }

    // Status filter
    if (filter === 'rated') {
      result = result.filter(game => game.userRating);
    } else if (filter === 'not-rated') {
      result = result.filter(game => !game.userRating);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.title || '').localeCompare(b.title || '');
        case 'play-time':
          return (b.playTime || 0) - (a.playTime || 0);
        case 'rating':
          return (b.userRating || 0) - (a.userRating || 0);
        case 'recent':
        default:
          return new Date(b.purchaseDate || 0) - new Date(a.purchaseDate || 0);
      }
    });

    setFilteredGames(result);
  };

  const openRatingModal = (gameId, gameName, steamAppId) => {
    setRatingModal({ isOpen: true, gameId, gameName, gameSteamId: steamAppId });
    
    // Check if game already has a rating and populate
    const gameData = games.find(g => g.id === gameId);
    if (gameData?.userRating) {
      setRatingData({ 
        rating: gameData.userRating, 
        comment: gameData.userComment || '' 
      });
    } else {
      setRatingData({ rating: 5, comment: '' });
    }
  };

  const closeRatingModal = () => {
    setRatingModal({ isOpen: false, gameId: null, gameName: '', gameSteamId: null });
    setRatingData({ rating: 5, comment: '' });
  };

  const submitRating = async () => {
    if (!ratingModal.gameSteamId) return;

    setRatingLoading(true);
    try {
      const response = await purchaseService.rateGame(
        ratingModal.gameSteamId,
        ratingData.rating,
        ratingData.comment
      );

      if (response.data.success) {
        // Update local game data with new rating
        setGames(prevGames =>
          prevGames.map(game =>
            game.id === ratingModal.gameId
              ? { 
                  ...game, 
                  userRating: ratingData.rating, 
                  userComment: ratingData.comment 
                }
              : game
          )
        );
        alert('✅ Rating submitted successfully!');
        closeRatingModal();
      } else {
        alert('Failed to submit rating');
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setRatingLoading(false);
    }
  };

  const playGame = (gameId, gameName) => {
    alert(`🎮 Launching ${gameName}...\n\nIn a real app, this would launch your game!`);
  };

  const installGame = (gameId, gameName) => {
    alert(`📥 Installing ${gameName}...\n\nIn a real app, this would start the download!`);
  };

  const uninstallGame = (gameId, gameName) => {
    if (window.confirm(`Are you sure you want to uninstall ${gameName}?`)) {
      alert(`🗑️ Uninstalling ${gameName}...`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTotalPlayTime = () => {
    return games.reduce((total, game) => total + (game.playTime || 0), 0);
  };

  if (loading) {
    return (
      <div className="owned-games-page">
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div className="spinner"></div>
          <h3>Loading your library...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="owned-games-page">
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h3 style={{ color: '#e74c3c' }}>😕 {error}</h3>
          <button 
            onClick={fetchLibrary}
            style={{
              marginTop: '1rem',
              padding: '0.8rem 1.5rem',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="owned-games-page">
      {/* Page Header */}
      <div className="owned-games-header">
        <div className="header-content">
          <h1>📚 My Library</h1>
          <p>Your purchased games and collection</p>
        </div>

        {/* Stats */}
        <div className="library-stats" style={{ display: 'flex', gap: '20px' }}>
          <div className="stat-item" style={{ 
            background: '#f8f9fa', 
            padding: '15px 20px', 
            borderRadius: '8px',
            textAlign: 'center',
            minWidth: '120px'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3498db' }}>
              {games.length}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '5px' }}>
              Games Owned
            </div>
          </div>
          <div className="stat-item" style={{ 
            background: '#f8f9fa', 
            padding: '15px 20px', 
            borderRadius: '8px',
            textAlign: 'center',
            minWidth: '120px'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#27ae60' }}>
              {getTotalPlayTime()}h
            </div>
            <div style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '5px' }}>
              Total Playtime
            </div>
          </div>
          <div className="stat-item" style={{ 
            background: '#f8f9fa', 
            padding: '15px 20px', 
            borderRadius: '8px',
            textAlign: 'center',
            minWidth: '120px'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f39c12' }}>
              {games.filter(g => g.userRating).length}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '5px' }}>
              Games Rated
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="controls-bar">
        <div className="search-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search your library..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <div className="filter-controls">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Games</option>
            <option value="rated">Rated by Me</option>
            <option value="not-rated">Not Rated</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="recent">Recently Added</option>
            <option value="name">Name (A-Z)</option>
            <option value="play-time">Play Time</option>
            <option value="rating">My Rating</option>
          </select>
        </div>
      </div>

      {/* Games Grid */}
      <div className="owned-games-content">
        {filteredGames.length > 0 ? (
          <div className="owned-games-grid">
            {filteredGames.map(game => (
              <OwnedGameCard
                key={game.id}
                game={game}
                onPlay={playGame}
                onInstall={installGame}
                onUninstall={uninstallGame}
                onRate={openRatingModal}
              />
            ))}
          </div>
        ) : (
          <div className="no-games-found">
            <div className="empty-icon">🎮</div>
            <h2>No Games Found</h2>
            <p>
              {games.length === 0
                ? "You don't have any games yet. Start shopping!"
                : 'No games match your search criteria.'}
            </p>
            {games.length > 0 && (
              <button
                className="clear-filters-btn"
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {ratingModal.isOpen && (
        <div 
          className="rating-modal-overlay"
          onClick={closeRatingModal}
        >
          <div 
            className="rating-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Rate: {ratingModal.gameName}</h2>
              <button 
                className="modal-close-btn"
                onClick={closeRatingModal}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="rating-section">
                <label>Your Rating (1-5 stars)</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      className={`star-btn ${star <= ratingData.rating ? 'active' : ''}`}
                      onClick={() => setRatingData({ ...ratingData, rating: star })}
                      disabled={ratingLoading}
                      title={`${star} star${star !== 1 ? 's' : ''}`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              <div className="comment-section">
                <label>Your Review (Optional)</label>
                <textarea
                  placeholder="Share your thoughts about this game..."
                  value={ratingData.comment}
                  onChange={(e) => setRatingData({ ...ratingData, comment: e.target.value })}
                  disabled={ratingLoading}
                  rows="4"
                  className="comment-textarea"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="modal-btn cancel"
                onClick={closeRatingModal}
                disabled={ratingLoading}
              >
                Cancel
              </button>
              <button
                className="modal-btn submit"
                onClick={submitRating}
                disabled={ratingLoading}
              >
                {ratingLoading ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Owned Game Card Component
const OwnedGameCard = ({ game, onPlay, onInstall, onUninstall, onRate }) => {
  const gameId = game.id;
  const gameName = game.title || 'Unknown Game';

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`owned-game-card ${game.isInstalled ? 'installed' : ''}`}>
      <div className="game-info-section">
        <div className="game-header">
          <h3 className="game-title">🎮 {gameName}</h3>
          {game.isInstalled && (
            <span className="installed-badge">INSTALLED</span>
          )}
        </div>

        <div className="game-meta">
          {game.purchaseDate && (
            <div className="meta-item">
              <span className="meta-label">Purchased:</span>
              <span className="meta-value">{formatDate(game.purchaseDate)}</span>
            </div>
          )}
          {game.playTime !== undefined && (
            <div className="meta-item">
              <span className="meta-label">Play Time:</span>
              <span className="meta-value">{game.playTime}h</span>
            </div>
          )}
        </div>

        {/* Rating Display */}
        <div className="rating-display">
          {game.userRating ? (
            <div className="user-rating">
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    className={i < Math.floor(game.userRating) ? 'star-filled' : 'star-empty'}
                  >
                    ⭐
                  </span>
                ))}
              </div>
              <span className="rating-text">{game.userRating}/5</span>
            </div>
          ) : (
            <div className="no-rating">Not rated yet</div>
          )}
        </div>

        <div className="game-actions">
          {game.isInstalled && (
            <button
              className="action-btn primary"
              onClick={() => onPlay(gameId, gameName)}
            >
              ▶️ Play
            </button>
          )}
          <button
            className="action-btn rate"
            onClick={() => onRate(gameId, gameName, game.steamAppId)}
          >
            ⭐ {game.userRating ? 'Update' : 'Rate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnedGamesPage;