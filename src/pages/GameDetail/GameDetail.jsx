import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import gamesService from '../../services/games.service';
import wishlistService from '../../services/wishlist.service';
import './GameDetail.css';

const GameDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  // Fetch game data
  useEffect(() => {
    const fetchGameDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await gamesService.getGameBySteamAppId(id);
        
        if (response.data.success) {
          const gameData = response.data.data;
          setGame(gameData);
          
          // Create screenshots array from background image
          setScreenshots([
            gameData.backgroundImage,
            gameData.backgroundImage.replace('header.jpg', 'capsule_616x353.jpg'),
            gameData.backgroundImage.replace('header.jpg', 'library_600x900.jpg')
          ]);
          
          // Check if game is in wishlist
          checkWishlistStatus(gameData.steamAppId);
        } else {
          setError('Game not found');
        }
      } catch (error) {
        console.error('Error fetching game details:', error);
        setError('Failed to load game details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGameDetails();
    }
  }, [id]);

  // Check if game is in user's wishlist
  const checkWishlistStatus = async (gameId) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      const response = await wishlistService.getWishlist();
      if (response.data.success) {
        const isInList = response.data.data.some(item => item.gameId === gameId);
        setIsInWishlist(isInList);
      }
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to add games to your wishlist');
      navigate('/login');
      return;
    }
    
    if (wishlistLoading || !game) return;
    
    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        // Remove from wishlist
        await wishlistService.removeFromWishlist(game.steamAppId);
        setIsInWishlist(false);
        alert('Game removed from wishlist');
      } else {
        // Add to wishlist
        await wishlistService.addToWishlist(game.steamAppId, game.name);
        setIsInWishlist(true);
        alert('Game added to wishlist!');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      alert('Failed to update wishlist. Please try again.');
    } finally {
      setWishlistLoading(false);
    }
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to add games to cart');
      navigate('/login');
      return;
    }
    
    if (cartLoading || !game) return;
    
    setCartLoading(true);
    try {
      const price = game.price?.onSale ? game.price.salePrice : game.price?.amount || 0;
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/cart`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: game.steamAppId,
          gameName: game.name,
          price: price * quantity,
          quantity: quantity
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`${game.name} added to cart!`);
      } else {
        const errorData = await response.json();
        alert(`Failed to add to cart: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add game to cart. Please try again.');
    } finally {
      setCartLoading(false);
    }
  };

  // Handle buy now (add to cart and go to checkout)
  const handleBuyNow = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to purchase games');
      navigate('/login');
      return;
    }
    
    if (cartLoading || !game) return;
    
    setCartLoading(true);
    try {
      const price = game.price?.onSale ? game.price.salePrice : game.price?.amount || 0;
      
      // First add to cart
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/cart`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: game.steamAppId,
          gameName: game.name,
          price: price * quantity,
          quantity: quantity
        }),
      });

      if (response.ok) {
        // Then checkout immediately
        const checkoutResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/purchases/checkout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentMethod: 'credit_card'
          }),
        });

        if (checkoutResponse.ok) {
          const data = await checkoutResponse.json();
          alert('Purchase successful! Game added to your library.');
          navigate('/library');
        } else {
          const errorData = await checkoutResponse.json();
          alert(`Checkout failed: ${errorData.message || 'Unknown error'}`);
        }
      } else {
        const errorData = await response.json();
        alert(`Failed to add to cart: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error during purchase:', error);
      alert('Failed to complete purchase. Please try again.');
    } finally {
      setCartLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderTabContent = () => {
    if (!game) return null;

    switch (activeTab) {
      case 'description':
        return (
          <div className="tab-content">
            <p>{game.description}</p>
            <div className="game-details-info">
              <div className="detail-item">
                <strong>Developer:</strong> {game.developers?.map(d => d.name).join(', ') || 'Unknown'}
              </div>
              <div className="detail-item">
                <strong>Publisher:</strong> {game.publishers?.map(p => p.name).join(', ') || 'Unknown'}
              </div>
              <div className="detail-item">
                <strong>Release Date:</strong> {formatDate(game.released)}
              </div>
              <div className="detail-item">
                <strong>Genre:</strong> {game.genres?.map(g => g.name).join(', ') || 'Unknown'}
              </div>
              <div className="detail-item">
                <strong>ESRB Rating:</strong> {game.esrbRating?.name || 'Not Rated'}
              </div>
              <div className="detail-item">
                <strong>Metacritic Score:</strong> {game.metacritic || 'N/A'}
              </div>
            </div>
          </div>
        );
      
      case 'features':
        return (
          <div className="tab-content">
            <h3>Game Features</h3>
            <p>This game includes the following features:</p>
            <div className="features-list">
              {game.genres?.map((genre, index) => (
                <span key={index} className="feature-tag">{genre.name}</span>
              ))}
              <span className="feature-tag">
                {game.price?.onSale ? 'On Sale' : 'Standard Edition'}
              </span>
              {game.isExplicit && (
                <span className="feature-tag">Mature Content</span>
              )}
              <span className="feature-tag">
                {game.platforms?.length > 1 ? 'Multi-Platform' : 'Single Platform'}
              </span>
            </div>
          </div>
        );
      
      case 'requirements':
        return (
          <div className="tab-content">
            <div className="requirements-section">
              <h3>System Requirements</h3>
              <p>Please note: System requirements may vary based on your specific platform.</p>
              
              {game.platforms?.map((platform, index) => (
                <div key={index} style={{ marginBottom: '2rem' }}>
                  <h4>{platform.platform.name} Requirements</h4>
                  <div className="requirements-list">
                    <div>
                      <strong>Platform:</strong> {platform.platform.name}
                    </div>
                    <div>
                      <strong>Storage:</strong> Minimum 20GB available space
                    </div>
                    <div>
                      <strong>Additional Notes:</strong> Internet connection required for activation
                    </div>
                  </div>
                </div>
              ))}
              
              {game.platforms?.length === 0 && (
                <p>System requirements not available for this game.</p>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="game-details-page">
        <div className="game-details-container" style={{ textAlign: 'center', padding: '4rem' }}>
          <div className="spinner"></div>
          <h3>Loading game details...</h3>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="game-details-page">
        <div className="game-details-container" style={{ textAlign: 'center', padding: '4rem' }}>
          <div className="game-not-found">
            <h3>{error || 'Game not found'}</h3>
            <p>The game you're looking for doesn't exist or has been removed.</p>
            <button 
              onClick={() => navigate('/browse')}
              className="clear-filters-btn"
              style={{ marginTop: '1rem' }}
            >
              Browse Games
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate discount percentage if on sale
  const discountPercentage = game.price?.onSale && game.price?.amount && game.price?.salePrice
    ? Math.round(((game.price.amount - game.price.salePrice) / game.price.amount) * 100)
    : 0;

  // Calculate total price
  const price = game.price?.onSale ? game.price.salePrice : game.price?.amount || 0;
  const totalPrice = price * quantity;

  return (
    <div className="game-details-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link> &gt; <Link to="/browse">Games</Link> &gt; <span>{game.name}</span>
      </nav>

      <div className="game-details-container">
        {/* Left Column - Images */}
        <div className="game-images">
          <div className="main-image">
            <img 
              src={screenshots[selectedImage] || game.backgroundImage} 
              alt={`${game.name} screenshot ${selectedImage + 1}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/600x400/2c3e50/ecf0f1?text=Game+Image';
              }}
            />
          </div>
          {screenshots.length > 1 && (
            <div className="image-thumbnails">
              {screenshots.map((screenshot, index) => (
                <img
                  key={index}
                  src={screenshot}
                  alt={`Thumbnail ${index + 1}`}
                  className={selectedImage === index ? 'active' : ''}
                  onClick={() => setSelectedImage(index)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/80x60/34495e/bdc3c7?text=Thumb';
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Game Info */}
        <div className="game-info">
          <h1 className="game-title">{game.name}</h1>
          
          <div className="game-meta">
            <span className="developer">
              By {game.developers?.map(d => d.name).join(', ') || 'Unknown'}
            </span>
            <div className="rating">
              {'★'.repeat(Math.floor(game.rating || 0))}
              {'☆'.repeat(5 - Math.floor(game.rating || 0))}
              <span>({game.rating?.toFixed(1) || 'N/A'})</span>
              {game.metacritic && (
                <span style={{ 
                  background: game.metacritic >= 75 ? '#27ae60' : 
                             game.metacritic >= 50 ? '#f39c12' : '#e74c3c',
                  color: 'white',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  marginLeft: '0.5rem'
                }}>
                  Metacritic: {game.metacritic}
                </span>
              )}
            </div>
          </div>

          <div className="platforms">
            {game.platforms?.map((platform, index) => (
              <span key={index} className="platform-tag">
                {platform.platform.name}
              </span>
            ))}
            {(!game.platforms || game.platforms.length === 0) && (
              <span className="platform-tag">Multi-Platform</span>
            )}
          </div>

          {/* Price and Purchase Section */}
          <div className="purchase-section">
            <div className="price-info">
              {game.price?.onSale && game.price?.salePrice ? (
                <>
                  <span className="original-price">
                    ${game.price.amount.toFixed(2)}
                  </span>
                  <span className="discounted-price">
                    ${game.price.salePrice.toFixed(2)}
                  </span>
                  {discountPercentage > 0 && (
                    <span className="discount-badge">-{discountPercentage}%</span>
                  )}
                </>
              ) : (
                <span className="price">
                  ${game.price?.amount?.toFixed(2) || '0.00'}
                </span>
              )}
            </div>

            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 10}
                >
                  +
                </button>
              </div>
            </div>

            <div className="purchase-buttons">
              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={cartLoading}
              >
                {cartLoading ? 'Adding...' : `Add to Cart ($${totalPrice.toFixed(2)})`}
              </button>
              <button 
                className="buy-now-btn"
                onClick={handleBuyNow}
                disabled={cartLoading}
              >
                {cartLoading ? 'Processing...' : `Buy Now ($${totalPrice.toFixed(2)})`}
              </button>
              
              {/* Wishlist Button */}
              <button 
                className={`wishlist-btn-detail ${isInWishlist ? 'in-wishlist' : ''}`}
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                {wishlistLoading ? '...' : (isInWishlist ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist')}
              </button>
            </div>

            {/* Show if user already owns the game */}
            {game.userOwnsGame && (
              <div style={{
                marginTop: '1rem',
                padding: '0.8rem',
                background: '#27ae60',
                borderRadius: '8px',
                color: 'white',
                textAlign: 'center',
                fontSize: '0.9rem'
              }}>
                ✅ You already own this game! <Link to="/library" style={{ color: 'white', textDecoration: 'underline' }}>Go to Library</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="tabs-section">
        <div className="tabs-header">
          <button 
            className={activeTab === 'description' ? 'active' : ''}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button 
            className={activeTab === 'features' ? 'active' : ''}
            onClick={() => setActiveTab('features')}
          >
            Features
          </button>
          <button 
            className={activeTab === 'requirements' ? 'active' : ''}
            onClick={() => setActiveTab('requirements')}
          >
            System Requirements
          </button>
        </div>
        
        <div className="tabs-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default GameDetailsPage;