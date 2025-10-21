import React from "react";
import "./GameCard.css";
import { Link } from "react-router-dom";

const GameCard = ({ game }) => {
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
					{game.platforms.map((platform) => (
						<span
							key={platform}
							className={`platform-icon ${platform.toLowerCase()}`}
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
					<button className="add-to-cart-btn">Add to Cart</button>
					<button className="wishlist-btn" title="Add to wishlist">
						❤️
					</button>
				</div>
				<button className="add-to-cart-btn">Add to Cart</button>
			</div>
		</div>
	);
};

export default GameCard;
