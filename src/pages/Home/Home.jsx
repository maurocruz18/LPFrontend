import React from 'react';
import GameCard from '../../components/game/GameCard/GameCard';
import { mockGames } from '../../data/mockGames';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const HomePage = () => {
  const navigate = useNavigate();
  const featuredGames = mockGames.slice(0, 4);
  const onSaleGames = mockGames.filter(game => game.discount);

  const handleShopNow = () => {
    navigate('/browse');
  };

  const handleAddToCart = (game) => {
    alert(`${game.title} adicionado ao carrinho! (Funcionalidade em desenvolvimento)`);
  };

  const handleAddToWishlist = (game) => {
    alert(`${game.title} adicionado à wishlist! (Funcionalidade em desenvolvimento)`);
  };

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
      <section className="featured-section">
        <h2>Featured Games</h2>
        <div className="games-grid">
          {featuredGames.map(game => (
            <GameCard 
              key={game.id} 
              game={game}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          ))}
        </div>
      </section>

      {/* On Sale Games */}
      <section className="sale-section">
        <h2>Special Offers</h2>
        <div className="games-grid">
          {onSaleGames.map(game => (
            <GameCard 
              key={game.id} 
              game={game}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;