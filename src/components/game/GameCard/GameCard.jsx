import React from "react";
import "./GameCard.css";
import { Link } from "react-router-dom";

const GameCard = ({ game, onAddToCart, onAddToWishlist }) => {
	const handleAddToCart = (e) => {
		e.preventDefault();
		if (onAddToCart) {
			onAddToCart(game);
		}
	};

	const handleAddToWishlist = (e) => {
		e.preventDefault();
		if (onAddToWishlist) {
			onAddToWishlist(game);
		}
	};

	return (
		<div className="game-card">
			<Link to={`/game/${game.id}`} className="game-image-link">
				<div className="game-image">
					<img src={game.image} alt={game.title} />
					{game.discount && (
						<span className="discount-badge">-{game.discount}%</span>
					)}
				</div>
			</Link>
			
			<div className="game-info">
				<h3 className="game-title">{game.title}</h3>
				<p className="game-genre">{game.genre}</p>
				
				<div className="game-platforms">
					{game.platforms.slice(0, 3).map((platform) => (
						<span
							key={platform}
							className={`platform-icon ${platform.toLowerCase()}`}
							title={platform}
						>
							{platform}
						</span>
					))}
				</div>
				
				<div className="game-price">
					{game.discount ? (
						<>
							<span className="original-price">${game.price}</span>
							<span className="discounted-price">${game.discountedPrice}</span>
						</>
					) : (
						<span className="price">${game.price}</span>
					)}
				</div>
				
				<div className="game-actions">
					<button 
						className="add-to-cart-btn"
						onClick={handleAddToCart}
						title="Add this game to your cart"
					>
						🛒 Add to Cart
					</button>
					<button 
						className="wishlist-btn" 
						onClick={handleAddToWishlist}
						title="Add this game to your wishlist"
						aria-label="Add to wishlist"
					>
						❤️
					</button>
				</div>
			</div>
		</div>
	);
};

export default GameCard;