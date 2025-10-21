
import React, { useState } from 'react';
import { mockGames } from '../../data/mockGames';
import './OwnedGames.css';

const OwnedGamesPage = () => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [searchTerm, setSearchTerm] = useState('');

  // For demo purposes, we'll use the first 6 games as owned games
  // In a real app, this would come from user purchase history
  const ownedGames = mockGames.slice(0, 6).map(game => ({
    ...game,
    purchaseDate: new Date(2024, 0, Math.floor(Math.random() * 30) + 1), // Random dates in Jan 2024
    playTime: Math.floor(Math.random() * 100), // Random play time in hours
    lastPlayed: new Date(2024, 0, Math.floor(Math.random() * 30) + 1), // Random last played dates
    isInstalled: Math.random() > 0.5 // Random installation status
  }));

  // Filter and sort games
  const filteredGames = ownedGames
    .filter(game => {
      // Search filter
      if (searchTerm && !game.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Status filter
      switch (filter) {
        case 'installed':
          return game.isInstalled;
        case 'not-installed':
          return !game.isInstalled;
        case 'recently-played':
          return game.lastPlayed > new Date(2024, 0, 15); // Played in last 15 days
        default:
          return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'play-time':
          return b.playTime - a.playTime;
        case 'recent':
        default:
          return new Date(b.purchaseDate) - new Date(a.purchaseDate);
      }
    });

  const totalPlayTime = ownedGames.reduce((total, game) => total + game.playTime, 0);
  const installedCount = ownedGames.filter(game => game.isInstalled).length;

  const installGame = (gameId) => {
    alert(`Installing game (ID: ${gameId}) - This would trigger download in real app`);
    // In real app: Update game installation status and trigger download
  };

  const playGame = (gameId) => {
    alert(`Launching game (ID: ${gameId}) - This would launch the game in real app`);
    // In real app: Launch the game executable
  };

  const uninstallGame = (gameId) => {
    if (window.confirm('Are you sure you want to uninstall this game?')) {
      alert(`Uninstalling game (ID: ${gameId}) - This would remove game files in real app`);
      // In real app: Update installation status and remove files
    }
  };

  return (
    <div className="owned-games-page">
      {/* Page Header */}
      <div className="owned-games-header">
        <div className="header-content">
          <h1>My Games Library</h1>
          <p>Your purchased games and download manager</p>
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
            <option value="installed">Installed</option>
            <option value="not-installed">Not Installed</option>
            <option value="recently-played">Recently Played</option>
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="recent">Recently Added</option>
            <option value="name">Name (A-Z)</option>
            <option value="play-time">Play Time</option>
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
                onInstall={installGame}
                onPlay={playGame}
                onUninstall={uninstallGame}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="no-games-found">
            <div className="empty-icon">🎮</div>
            <h2>No Games Found</h2>
            <p>Try adjusting your search or filter criteria</p>
            <button 
              className="clear-filters-btn"
              onClick={() => {
                setSearchTerm('');
                setFilter('all');
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {ownedGames.length > 0 && (
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-btn">
              <span className="action-icon">📥</span>
              Install All
            </button>
            <button className="action-btn">
              <span className="action-icon">🔄</span>
              Check for Updates
            </button>
            <button className="action-btn">
              <span className="action-icon">📊</span>
              View Play Statistics
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Owned Game Card Component
const OwnedGameCard = ({ game, onInstall, onPlay, onUninstall }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeSince = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - new Date(date));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <div className={`owned-game-card ${game.isInstalled ? 'installed' : ''}`}>
      <div className="game-image-section">
        <img src={game.image} alt={game.title} className="game-image" />
        <div className="game-overlay">
          {game.isInstalled ? (
            <button 
              className="play-button"
              onClick={() => onPlay(game.id)}
            >
              ▶️ Play
            </button>
          ) : (
            <button 
              className="install-button"
              onClick={() => onInstall(game.id)}
            >
              📥 Install
            </button>
          )}
        </div>
        {game.isInstalled && (
          <div className="installed-badge">INSTALLED</div>
        )}
      </div>

      <div className="game-info-section">
        <h3 className="game-title">{game.title}</h3>
        <p className="game-genre">{game.genre}</p>
        
        <div className="game-meta">
          <div className="meta-item">
            <span className="meta-label">Play Time:</span>
            <span className="meta-value">{game.playTime}h</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Last Played:</span>
            <span className="meta-value">
              {game.lastPlayed ? getTimeSince(game.lastPlayed) : 'Never'}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Purchased:</span>
            <span className="meta-value">{formatDate(game.purchaseDate)}</span>
          </div>
        </div>

        <div className="platform-tags">
          {game.platforms.map(platform => (
            <span key={platform} className="platform-tag">{platform}</span>
          ))}
        </div>

        <div className="game-actions">
          {game.isInstalled ? (
            <>
              <button 
                className="action-btn secondary"
                onClick={() => onPlay(game.id)}
              >
                Play
              </button>
              <button 
                className="action-btn danger"
                onClick={() => onUninstall(game.id)}
              >
                Uninstall
              </button>
            </>
          ) : (
            <button 
              className="action-btn primary"
              onClick={() => onInstall(game.id)}
            >
              Install
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnedGamesPage;