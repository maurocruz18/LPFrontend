
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { mockGames } from '../../data/mockGames';
import './GameDetail.css';

const GameDetailsPage = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Find the game by ID
  const game = mockGames.find(g => g.id === parseInt(id));

  if (!game) {
    return <div className="game-not-found">Game not found!</div>;
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className="tab-content">
            <p>{game.description}</p>
            <div className="game-details-info">
              <div className="detail-item">
                <strong>Developer:</strong> {game.developer}
              </div>
              <div className="detail-item">
                <strong>Publisher:</strong> {game.publisher}
              </div>
              <div className="detail-item">
                <strong>Release Date:</strong> {game.releaseDate}
              </div>
              <div className="detail-item">
                <strong>Genre:</strong> {game.genre}
              </div>
            </div>
          </div>
        );
      
      case 'features':
        return (
          <div className="tab-content">
            <div className="features-list">
              {game.features.map((feature, index) => (
                <span key={index} className="feature-tag">{feature}</span>
              ))}
            </div>
          </div>
        );
      
      case 'requirements':
        return (
          <div className="tab-content">
            <div className="requirements-section">
              <h4>Minimum Requirements</h4>
              <div className="requirements-list">
                <div><strong>OS:</strong> {game.systemRequirements.minimum.os}</div>
                <div><strong>Processor:</strong> {game.systemRequirements.minimum.processor}</div>
                <div><strong>Memory:</strong> {game.systemRequirements.minimum.memory}</div>
                <div><strong>Graphics:</strong> {game.systemRequirements.minimum.graphics}</div>
                <div><strong>Storage:</strong> {game.systemRequirements.minimum.storage}</div>
              </div>
              
              <h4>Recommended Requirements</h4>
              <div className="requirements-list">
                <div><strong>OS:</strong> {game.systemRequirements.recommended.os}</div>
                <div><strong>Processor:</strong> {game.systemRequirements.recommended.processor}</div>
                <div><strong>Memory:</strong> {game.systemRequirements.recommended.memory}</div>
                <div><strong>Graphics:</strong> {game.systemRequirements.recommended.graphics}</div>
                <div><strong>Storage:</strong> {game.systemRequirements.recommended.storage}</div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="game-details-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <a href="/">Home</a> &gt; <a href="/games">Games</a> &gt; <span>{game.title}</span>
      </nav>

      <div className="game-details-container">
        {/* Left Column - Images */}
        <div className="game-images">
          <div className="main-image">
            <img 
              src={game.screenshots[selectedImage]} 
              alt={`${game.title} screenshot ${selectedImage + 1}`}
            />
          </div>
          <div className="image-thumbnails">
            {game.screenshots.map((screenshot, index) => (
              <img
                key={index}
                src={screenshot}
                alt={`Thumbnail ${index + 1}`}
                className={selectedImage === index ? 'active' : ''}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        {/* Right Column - Game Info */}
        <div className="game-info">
          <h1 className="game-title">{game.title}</h1>
          
          <div className="game-meta">
            <span className="developer">By {game.developer}</span>
            <div className="rating">
              {'★'.repeat(Math.floor(game.rating))}
              {'☆'.repeat(5 - Math.floor(game.rating))}
              <span>({game.rating})</span>
            </div>
          </div>

          <div className="platforms">
            {game.platforms.map(platform => (
              <span key={platform} className="platform-tag">{platform}</span>
            ))}
          </div>

          {/* Price and Purchase Section */}
          <div className="purchase-section">
            <div className="price-info">
              {game.discount ? (
                <>
                  <span className="original-price">${game.price}</span>
                  <span className="discounted-price">${game.discountedPrice}</span>
                  <span className="discount-badge">-{game.discount}%</span>
                </>
              ) : (
                <span className="price">${game.price}</span>
              )}
            </div>

            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button onClick={() => handleQuantityChange(-1)}>-</button>
                <span>{quantity}</span>
                <button onClick={() => handleQuantityChange(1)}>+</button>
              </div>
            </div>

            <div className="purchase-buttons">
              <button className="add-to-cart-btn">Add to Cart</button>
              <button className="buy-now-btn">Buy Now</button>
            </div>
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