import React from 'react';
import GameCard from '../../components/game/GameCard';
import { mockGames } from '../../data/mockGames';
import './HomePage.css';

const HomePage = () => {
  const featuredGames = mockGames.slice(0, 4);
  const onSaleGames = mockGames.filter(game => game.discount);

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to GameStore</h1>
          <p>Discover the best games at amazing prices</p>
          <button className="cta-button">Shop Now</button>
        </div>
      </section>

      {/* Featured Games */}
      <section className="featured-section">
        <h2>Featured Games</h2>
        <div className="games-grid">
          {featuredGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* On Sale Games */}
      <section className="sale-section">
        <h2>Special Offers</h2>
        <div className="games-grid">
          {onSaleGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;