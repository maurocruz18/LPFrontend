
import React, { useState } from 'react';
import GameCard from '../../components/game/GameCard/GameCard';
import { mockGames } from '../../data/mockGames';
import './Wishlist.css';

const WishlistPage = () => {

  const [wishlistItems, setWishlistItems] = useState(mockGames.slice(0, 4));
  const [sortBy, setSortBy] = useState('added');

  const removeFromWishlist = (gameId) => {
    setWishlistItems(prev => prev.filter(game => game.id !== gameId));
  };

  const moveAllToCart = () => {
    alert('All items moved to cart! (This would be implemented with backend)');

  };

  const clearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      setWishlistItems([]);
    }
  };

  // Calculate total value
  const totalValue = wishlistItems.reduce((total, game) => {
    return total + (game.discountedPrice || game.price);
  }, 0);

  // Calculate total savings
  const totalSavings = wishlistItems.reduce((total, game) => {
    return game.discount ? total + (game.price - game.discountedPrice) : total;
  }, 0);

  // Sort wishlist items
  const sortedWishlist = [...wishlistItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.discountedPrice || a.price) - (b.discountedPrice || b.price);
      case 'price-high':
        return (b.discountedPrice || b.price) - (a.discountedPrice || a.price);
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.title.localeCompare(b.title);
      case 'added':
      default:
        return a.id - b.id; // Using ID as proxy for addition date
    }
  });

  return (
    <div className="wishlist-page">
      {/* Page Header */}
      <div className="wishlist-header">
        <div className="header-content">
          <h1>My Wishlist</h1>
          <p>Games you've saved for later</p>
        </div>
      </div>

      {/* Wishlist Actions */}
      {wishlistItems.length > 0 && (
        <div className="wishlist-actions">
          <div className="actions-left">
            <button className="action-btn primary" onClick={moveAllToCart}>
              🛒 Add All to Cart
            </button>
            <button className="action-btn secondary" onClick={clearWishlist}>
              🗑️ Clear Wishlist
            </button>
          </div>
          <div className="actions-right">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="added">Date Added</option>
              <option value="name">Name (A-Z)</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>
      )}

      {/* Wishlist Content */}
      <div className="wishlist-content">
        {wishlistItems.length > 0 ? (
          <>
            {/* Games Grid */}
            <div className="wishlist-grid">
              {sortedWishlist.map(game => (
                <WishlistGameCard 
                  key={game.id} 
                  game={game} 
                  onRemove={removeFromWishlist}
                />
              ))}
            </div>

            {/* Recommendations Section */}
            <div className="recommendations-section">
              <h2>You Might Also Like</h2>
              <div className="recommendations-grid">
                {mockGames
                  .filter(game => !wishlistItems.some(wishlistGame => wishlistGame.id === game.id))
                  .slice(0, 4)
                  .map(game => (
                    <GameCard key={game.id} game={game} />
                  ))
                }
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="wishlist-empty">
            <div className="empty-icon">❤️</div>
            <h2>Your Wishlist is Empty</h2>
            <p>Start adding games you love to your wishlist!</p>
            <div className="empty-actions">
              <a href="/games" className="browse-btn">Browse Games</a>
              <a href="/" className="home-btn">Go to Homepage</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Custom Wishlist Game Card with remove functionality
const WishlistGameCard = ({ game, onRemove }) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    // Add a small delay for the animation
    setTimeout(() => {
      onRemove(game.id);
    }, 300);
  };

  const addToCart = () => {
    alert(`Added ${game.title} to cart! (This would be implemented with backend)`);
  };

  return (
    <div className={`wishlist-game-card ${isRemoving ? 'removing' : ''}`}>
      <div className="game-card-main">
        <GameCard game={game} />
      </div>
      
      <div className="wishlist-actions-card">
        <button className="action-btn-card primary" onClick={addToCart}>
          Add to Cart
        </button>
        <button className="action-btn-card remove" onClick={handleRemove}>
          Remove
        </button>
        
        {game.discount && (
          <div className="sale-badge-card">
            -{game.discount}% OFF
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;