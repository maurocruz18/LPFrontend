import React, { useState, useEffect } from "react";
import "./GameCard.css";
import { Link, useNavigate } from "react-router-dom";

// If wishlist.service.js is in src/services/, use this:
import wishlistService from "../../../services/wishlist.service";

// If useAuth hook is in src/hooks/, use this:
import useAuth from "../../../hooks/useAuth";

// Alternative: Use relative paths based on your actual structure
// Or check if you have these files first

// For now, let's check what services you have:
// Based on your earlier files, you have auth.service.js and games.service.js
// You need to create wishlist.service.js first

const GameCard = ({ game, onAddToCart }) => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [isInWishlist, setIsInWishlist] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const gameId = game.steamAppId || game.id;
	const gameTitle = game.title || game.name;
	const gameGenre =
		game.genre ||
		(Array.isArray(game.genres)
			? game.genres[0]?.name || game.genres[0]
			: "Game");
	const gameImage =
		game.image ||
		game.backgroundImage ||
		game.imageUrl ||
		game.headerImage ||
		"https://via.placeholder.com/300x400/333/fff?text=Game";

	// Handle platforms
	let gamePlatforms = ["PC"];
	if (Array.isArray(game.platforms)) {
		gamePlatforms = game.platforms
			.map((p) => {
				if (p && typeof p === "object") {
					return p.platform?.name || p.name || "Unknown";
				}
				return p || "Unknown";
			})
			.filter(Boolean);
	} else if (game.platforms) {
		gamePlatforms = [game.platforms];
	}

	// Handle price
	const gamePrice =
		typeof game.price === "object" && game.price !== null
			? game.price.amount || 0
			: game.price || 0;

	const numericGamePrice = Number(gamePrice) || 0;

	const gameDiscount =
		game.discount ||
		(game.price?.onSale && game.price?.amount && game.price?.salePrice
			? Math.round(
					((game.price.amount - game.price.salePrice) / game.price.amount) * 100
			  )
			: 0);

	const gameDiscountedPrice =
		game.price?.salePrice ||
		game.discountedPrice ||
		game.discountPrice ||
		(gameDiscount > 0
			? numericGamePrice - (numericGamePrice * gameDiscount) / 100
			: null);

	const formatPrice = (price) => {
		const num = Number(price);
		return isNaN(num) ? "0.00" : num.toFixed(2);
	};

	// Check if game is in wishlist (you might want to fetch this from parent)
	useEffect(() => {
		// This would ideally come from parent component or context
		// For now, we'll check localStorage or wait for parent to pass this prop
		const checkWishlistStatus = () => {
			if (user && gameId) {
				// You could fetch wishlist here or get it from context
				const wishlist = JSON.parse(
					localStorage.getItem("userWishlist") || "[]"
				);
				setIsInWishlist(wishlist.some((item) => item.gameId === gameId));
			}
		};

		checkWishlistStatus();
	}, [user, gameId]);

	const handleAddToCart = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (onAddToCart) {
			onAddToCart(game);
		}
	};

	const handleAddToWishlist = async (e) => {
		e.preventDefault();
		e.stopPropagation();

		if (!user) {
			navigate("/login");
			return;
		}

		if (isLoading) return;

		setIsLoading(true);
		try {
			if (isInWishlist) {
				// Remove from wishlist
				await wishlistService.removeFromWishlist(gameId);
				setIsInWishlist(false);
				// Update local storage
				const wishlist = JSON.parse(
					localStorage.getItem("userWishlist") || "[]"
				);
				const updatedWishlist = wishlist.filter(
					(item) => item.gameId !== gameId
				);
				localStorage.setItem("userWishlist", JSON.stringify(updatedWishlist));
			} else {
				// Add to wishlist
				await wishlistService.addToWishlist(gameId, gameTitle);
				setIsInWishlist(true);
				// Update local storage
				const wishlist = JSON.parse(
					localStorage.getItem("userWishlist") || "[]"
				);
				wishlist.push({
					gameId: gameId,
					gameName: gameTitle,
					addedAt: new Date().toISOString(),
				});
				localStorage.setItem("userWishlist", JSON.stringify(wishlist));
			}
		} catch (error) {
			console.error("Error updating wishlist:", error);
			alert("Failed to update wishlist. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="game-card">
			<Link to={`/game/${gameId}`} className="game-image-link">
				<div className="game-image">
					<img
						src={gameImage}
						alt={gameTitle}
						onError={(e) => {
							e.target.src =
								"https://via.placeholder.com/300x400/333/fff?text=Game";
						}}
					/>
					{gameDiscount > 0 && (
						<span className="discount-badge">-{gameDiscount}%</span>
					)}
				</div>
			</Link>

			<div className="game-info">
				<h3 className="game-title">{gameTitle}</h3>
				<p className="game-genre">{gameGenre}</p>

				<div className="game-platforms">
					{gamePlatforms.slice(0, 3).map((platform, index) => {
						const platformString = String(platform || "");
						const platformKey = platformString.toLowerCase();

						return (
							<span
								key={`${platformKey}-${index}`}
								className={`platform-icon ${platformKey}`}
								title={platformString}
							>
								{platformString}
							</span>
						);
					})}
				</div>

				<div className="game-price">
					{gameDiscount > 0 && gameDiscountedPrice ? (
						<>
							<span className="original-price">
								€{formatPrice(numericGamePrice)}
							</span>
							<span className="discounted-price">
								€{formatPrice(gameDiscountedPrice)}
							</span>
						</>
					) : (
						<span className="price">€{formatPrice(numericGamePrice)}</span>
					)}
				</div>

				<div className="game-actions">
					<button
						className="add-to-cart-btn"
						onClick={handleAddToCart}
						title="Add this game to your cart"
						disabled={isLoading}
					>
						{isLoading ? "..." : "🛒 Add to Cart"}
					</button>
					<button
						className={`wishlist-btn ${isInWishlist ? "in-wishlist" : ""}`}
						onClick={handleAddToWishlist}
						title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
						aria-label={
							isInWishlist ? "Remove from wishlist" : "Add to wishlist"
						}
						disabled={isLoading}
					>
						{isLoading ? "..." : isInWishlist ? "❤️" : "🤍"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default GameCard;
