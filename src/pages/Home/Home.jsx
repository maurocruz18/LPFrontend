import React, { useState, useEffect } from 'react';
import GameCard from '../../components/game/GameCard/GameCard';
import { useNavigate } from 'react-router-dom';
import gamesService from '../../services/games.service';
import './Home.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredGames, setFeaturedGames] = useState([]);
  const [onSaleGames, setOnSaleGames] = useState([]);

  useEffect(() => {
    fetchHomepageData();
  }, []);

  const fetchHomepageData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await gamesService.getHomepage();
      console.log('Homepage response:', response.data);
      
      // The backend returns: { success: true, data: [...] } or { success: true, games: [...] }
      const data = response.data.data || response.data.games || response.data;
      
      if (Array.isArray(data)) {
        // If it returns an array of games, split between featured and on sale
        const gamesWithDiscount = data.filter(game => 
          (game.price?.onSale && game.price?.salePrice) || 
          game.discount > 0 || 
          game.discountPrice
        );
        const gamesWithoutDiscount = data.filter(game => 
          !game.price?.onSale && 
          !game.discount && 
          !game.discountPrice
        );
        
        setOnSaleGames(gamesWithDiscount.slice(0, 4));
        setFeaturedGames(gamesWithoutDiscount.slice(0, 4));
        
        // If there aren't enough games, use all
        if (gamesWithDiscount.length === 0) {
          setOnSaleGames(data.slice(4, 8));
        }
        if (gamesWithoutDiscount.length === 0) {
          setFeaturedGames(data.slice(0, 4));
        }
      } else if (data && typeof data === 'object') {
        // If it returns a structured object
        setFeaturedGames(data.featured || data.games || []);
        setOnSaleGames(data.onSale || data.sales || data.discounted || []);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (err) {
      console.error('Error fetching homepage data:', err);
      setError('Could not load games. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleShopNow = () => {
    navigate('/browse');
  };

  const handleAddToCart = (game) => {
    alert(`${game.name || game.title} added to cart! (Feature in development)`);
  };

  const handleAddToWishlist = (game) => {
    alert(`${game.name || game.title} added to wishlist! (Feature in development)`);
  };

  // Normalize game data to the format expected by GameCard
  const normalizeGame = (game) => {
    // Extract platform names from the platforms array
    const platformNames = game.platforms 
      ? game.platforms.map(p => p.platform?.name || 'Unknown').filter(Boolean)
      : ['PC'];
    
    // Fix: Handle price object
    const priceAmount = typeof game.price === 'object' && game.price !== null
      ? game.price.amount
      : game.price || 0;
    
    // Calculate discount percentage
    const discount = game.price?.onSale && game.price?.amount && game.price?.salePrice
      ? Math.round(((game.price.amount - game.price.salePrice) / game.price.amount) * 100)
      : game.discount || 0;
    
    // Get discounted price
    const discountedPrice = game.price?.salePrice || game.discountPrice || null;
    
    return {
      id: game.steamAppId || game._id, // Use steamAppId as primary ID
      steamAppId: game.steamAppId, // Include steamAppId explicitly
      title: game.name || game.title,
      genre: game.genre || (game.genres && game.genres[0]?.name) || 'Game',
      price: priceAmount, // Now this should be a number
      discountedPrice: discountedPrice,
      discount: discount,
      image: game.backgroundImage || game.image || 'https://via.placeholder.com/300x400/333/fff?text=Game',
      platforms: platformNames,
      rating: game.rating || game.metacritic || 0,
      description: game.description || '',
      onSale: game.price?.onSale || discount > 0 || false
    };
  };

  if (loading) {
    return (
      <div className="homepage">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          fontSize: '1.2rem',
          color: '#bdc3c7'
        }}>
          <div>
            <div style={{ marginBottom: '1rem', textAlign: 'center' }}>🎮</div>
            Loading games...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="homepage">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          minHeight: '60vh',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
          <h2 style={{ color: '#e74c3c', marginBottom: '1rem' }}>Oops!</h2>
          <p style={{ color: '#bdc3c7', marginBottom: '2rem' }}>{error}</p>
          <button 
            onClick={fetchHomepageData}
            style={{
              padding: '1rem 2rem',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to GameStore</h1>
          <p>Discover the best games at amazing prices</p>
          <button 
            className="cta-button"
            onClick={handleShopNow}
            title="Browse our game collection"
          >
            🛍️ Shop Now
          </button>
        </div>
      </section>

      {/* Featured Games */}
      {featuredGames.length > 0 && (
        <section className="featured-section">
          <h2>Featured Games</h2>
          <div className="games-grid">
            {featuredGames.slice(0, 4).map(game => {
              const normalizedGame = normalizeGame(game);
              return (
                <GameCard 
                  key={normalizedGame.id} 
                  game={normalizedGame}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* On Sale Games */}
      {onSaleGames.length > 0 && (
        <section className="sale-section">
          <h2>Special Offers</h2>
          <div className="games-grid">
            {onSaleGames.slice(0, 4).map(game => {
              const normalizedGame = normalizeGame(game);
              return (
                <GameCard 
                  key={normalizedGame.id} 
                  game={normalizedGame}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Empty State - If no games */}
      {featuredGames.length === 0 && onSaleGames.length === 0 && !loading && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          color: '#bdc3c7'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎮</div>
          <h2 style={{ color: '#ecf0f1', marginBottom: '1rem' }}>
            No games available at the moment
          </h2>
          <p>Come back later to see our amazing games!</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;