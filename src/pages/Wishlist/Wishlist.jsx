import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import GameCard from "../../components/game/GameCard/GameCard";
import wishlistService from "../../services/wishlist.service";
import gamesService from "../../services/games.service";
import useAuth from "../../hooks/useAuth";
import "./Wishlist.css";

const WishlistPage = () => {
	const navigate = useNavigate();
	const { user, getAuthHeader } = useAuth();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [wishlistItems, setWishlistItems] = useState([]);
	const [gameDetails, setGameDetails] = useState([]);
	const [recommendedGames, setRecommendedGames] = useState([]);
	const [sortBy, setSortBy] = useState("added");
	const [addingToCart, setAddingToCart] = useState({});
	// Redirect if not logged in
	useEffect(() => {
		if (!user) {
			navigate("/login");
		}
	}, [user, navigate]);

	// Fetch wishlist data
	useEffect(() => {
		if (user) {
			fetchWishlistData();
		}
	}, [user]);

	const fetchWishlistData = async () => {
		setLoading(true);
		setError(null);

		try {
			// 1. Fetch wishlist items
			const wishlistResponse = await wishlistService.getWishlist();

			if (wishlistResponse.data.success) {
				const items = wishlistResponse.data.data || [];
				setWishlistItems(items);

				// Save to localStorage for quick access in GameCard
				localStorage.setItem("userWishlist", JSON.stringify(items));

				// 2. Fetch game details for each wishlist item
				const gamePromises = items.map((item) =>
					gamesService.getGameBySteamAppId(item.gameId).catch((err) => {
						console.error(`Error fetching game ${item.gameId}:`, err);
						return null;
					})
				);

				const gameResponses = await Promise.all(gamePromises);
				const games = gameResponses
					.filter((response) => response && response.data.success)
					.map((response) => ({
						...response.data.data,
						steamAppId: response.data.data.steamAppId,
						addedAt: items.find(
							(item) => item.gameId === response.data.data.steamAppId
						)?.addedAt,
					}));

				setGameDetails(games);

				// 3. Fetch recommended games
				const recommendationsResponse = await gamesService.searchGames({
					limit: 8,
					sortBy: "-rating",
				});

				if (recommendationsResponse.data.success) {
					// Filter out games already in wishlist
					const wishlistGameIds = items.map((item) => item.gameId);
					const recommendations = recommendationsResponse.data.data
						.filter((game) => !wishlistGameIds.includes(game.steamAppId))
						.slice(0, 4);
					setRecommendedGames(recommendations);
				}
			} else {
				setError("Failed to load wishlist");
			}
		} catch (err) {
			console.error("Error fetching wishlist data:", err);
			setError("Could not load your wishlist. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleRemoveFromWishlist = async (gameId) => {
		try {
			const response = await wishlistService.removeFromWishlist(gameId);

			if (response.data.success) {
				// Update state
				setWishlistItems((prev) =>
					prev.filter((item) => item.gameId !== gameId)
				);
				setGameDetails((prev) =>
					prev.filter((game) => game.steamAppId !== gameId)
				);

				// Update localStorage
				const wishlist = JSON.parse(
					localStorage.getItem("userWishlist") || "[]"
				);
				const updatedWishlist = wishlist.filter(
					(item) => item.gameId !== gameId
				);
				localStorage.setItem("userWishlist", JSON.stringify(updatedWishlist));

				alert("Game removed from wishlist!");
			}
		} catch (error) {
			console.error("Error removing from wishlist:", error);
			alert("Failed to remove game from wishlist. Please try again.");
		}
	};

	const handleAddToCart = async (game) => {
		const gameId = game.steamAppId || game.id;

		setAddingToCart((prev) => ({ ...prev, [gameId]: true }));

		try {
			const baseUrl = process.env.REACT_APP_API_URL.replace("/api", "");
			const response = await fetch(`${baseUrl}/users/cart`, {
				method: "POST",
				headers: {
					...getAuthHeader(),
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					gameId: gameId,
					gameName: game.name || game.title,
					price: getGamePrice(game),
				}),
			});

			if (response.ok) {
				alert(`${game.name || game.title} added to cart!`);
			} else {
				const errorData = await response.json();
				alert(`Failed to add to cart: ${errorData.message || "Unknown error"}`);
			}
		} catch (error) {
			console.error("Error adding to cart:", error);
			alert("Failed to add game to cart. Please try again.");
		} finally {
			setAddingToCart((prev) => ({ ...prev, [gameId]: false }));
		}
	};

	const getGamePrice = (game) => {
		if (game.price?.onSale && game.price?.salePrice) {
			return game.price.salePrice;
		}
		if (typeof game.price === "object" && game.price.amount) {
			return game.price.amount;
		}
		return game.price || 0;
	};

	const moveAllToCart = async () => {
		if (!gameDetails.length) return;

		if (window.confirm(`Add all ${gameDetails.length} games to cart?`)) {
			try {
				// Add each game to cart
				const baseUrl = process.env.REACT_APP_API_URL.replace("/api", "");
				const addPromises = gameDetails.map((game) =>
					fetch(`${baseUrl}/users/cart`, {
						method: "POST",
						headers: {
							...getAuthHeader(),
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							gameId: game.steamAppId || game.id,
							gameName: game.name || game.title,
							price: getGamePrice(game),
						}),
					})
				);

				await Promise.all(addPromises);
				alert(`${gameDetails.length} games added to cart!`);
			} catch (error) {
				console.error("Error adding games to cart:", error);
				alert("Failed to add some games to cart. Please try again.");
			}
		}
	};

	const clearWishlist = async () => {
		if (
			window.confirm("Are you sure you want to clear your entire wishlist?")
		) {
			try {
				// Remove each game individually
				const removePromises = wishlistItems.map((item) =>
					wishlistService.removeFromWishlist(item.gameId)
				);

				await Promise.all(removePromises);

				// Clear state
				setWishlistItems([]);
				setGameDetails([]);

				// Clear localStorage
				localStorage.setItem("userWishlist", JSON.stringify([]));

				alert("Wishlist cleared!");
			} catch (error) {
				console.error("Error clearing wishlist:", error);
				alert("Failed to clear wishlist. Please try again.");
			}
		}
	};

	// Sort wishlist items
	const sortedGames = [...gameDetails].sort((a, b) => {
		const getPrice = (game) => {
			const price =
				typeof game.price === "object" ? game.price.amount : game.price;
			return game.price?.onSale && game.price?.salePrice
				? game.price.salePrice
				: price || 0;
		};

		switch (sortBy) {
			case "price-low":
				return getPrice(a) - getPrice(b);
			case "price-high":
				return getPrice(b) - getPrice(a);
			case "rating":
				return (b.rating || 0) - (a.rating || 0);
			case "name":
				return (a.name || "").localeCompare(b.name || "");
			case "added":
			default:
				return new Date(b.addedAt || 0) - new Date(a.addedAt || 0);
		}
	});

	// Calculate statistics
	const totalValue = gameDetails.reduce((total, game) => {
		const price =
			typeof game.price === "object" ? game.price.amount : game.price;
		const salePrice = game.price?.salePrice;
		return total + (salePrice || price || 0);
	}, 0);

	const totalSavings = gameDetails.reduce((total, game) => {
		if (game.price?.onSale && game.price?.amount && game.price?.salePrice) {
			return total + (game.price.amount - game.price.salePrice);
		}
		return total;
	}, 0);

	if (loading) {
		return (
			<div className="wishlist-page">
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						minHeight: "60vh",
						fontSize: "1.2rem",
						color: "#6c757d",
					}}
				>
					<div>
						<div style={{ marginBottom: "1rem", textAlign: "center" }}>❤️</div>
						Loading your wishlist...
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="wishlist-page">
				<div className="wishlist-empty">
					<div className="empty-icon">😕</div>
					<h2>Oops!</h2>
					<p>{error}</p>
					<div className="empty-actions">
						<button onClick={fetchWishlistData} className="browse-btn">
							Try Again
						</button>
						<Link to="/" className="home-btn">
							Go to Homepage
						</Link>
					</div>
				</div>
			</div>
		);
	}

	if (gameDetails.length === 0) {
		return (
			<div className="wishlist-page">
				<div className="wishlist-empty">
					<div className="empty-icon">❤️</div>
					<h2>Your Wishlist is Empty</h2>
					<p>Start adding games you love to your wishlist!</p>
					<div className="empty-actions">
						<Link to="/browse" className="browse-btn">
							Browse Games
						</Link>
						<Link to="/" className="home-btn">
							Go to Homepage
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="wishlist-page">
			{/* Page Header */}
			<div className="wishlist-header">
				<div className="header-content">
					<h1>My Wishlist</h1>
					<p>Games you've saved for later</p>
				</div>
				<div className="wishlist-stats">
					<div className="stat-item">
						<span className="stat-number">{gameDetails.length}</span>
						<span className="stat-label">Games</span>
					</div>
					<div className="stat-item">
						<span className="stat-number">€{totalValue.toFixed(2)}</span>
						<span className="stat-label">Total Value</span>
					</div>
					{totalSavings > 0 && (
						<div className="stat-item savings">
							<span className="stat-number">€{totalSavings.toFixed(2)}</span>
							<span className="stat-label">Total Savings</span>
						</div>
					)}
				</div>
			</div>

			{/* Wishlist Actions */}
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

			{/* Games Grid */}
			<div className="wishlist-grid">
				{sortedGames.map((game) => (
					<WishlistGameCard
						key={game.steamAppId || game._id}
						game={game}
						onRemove={handleRemoveFromWishlist}
						onAddToCart={handleAddToCart}
					/>
				))}
			</div>

			{/* Recommendations Section */}
			{recommendedGames.length > 0 && (
				<div className="recommendations-section">
					<h2>You Might Also Like</h2>
					<div className="recommendations-grid">
						{recommendedGames.map((game) => (
							<GameCard
								key={game.steamAppId || game._id}
								game={{
									...game,
									steamAppId: game.steamAppId,
									title: game.name,
									price: game.price,
									backgroundImage: game.backgroundImage,
									genres: game.genres,
								}}
								onAddToCart={handleAddToCart}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

// Custom Wishlist Game Card
const WishlistGameCard = ({ game, onRemove, onAddToCart }) => {
	const [isRemoving, setIsRemoving] = useState(false);

	const gameId = game.steamAppId || game.id;
	const gameTitle = game.name || game.title;

	// Calculate discount
	const discount =
		game.price?.onSale && game.price?.amount && game.price?.salePrice
			? Math.round(
					((game.price.amount - game.price.salePrice) / game.price.amount) * 100
			  )
			: 0;

	const handleRemove = () => {
		setIsRemoving(true);
		setTimeout(() => {
			onRemove(gameId);
		}, 300);
	};

	const handleAddToCartClick = () => {
		onAddToCart(game);
	};

	return (
		<div className={`wishlist-game-card ${isRemoving ? "removing" : ""}`}>
			<div className="game-card-main">
				<GameCard
					game={{
						...game,
						steamAppId: game.steamAppId,
						title: game.name,
						price: game.price,
						backgroundImage: game.backgroundImage,
						genres: game.genres,
					}}
					onAddToCart={handleAddToCartClick}
				/>
			</div>

			<div className="wishlist-actions-card">
				<button
					className="action-btn-card primary"
					onClick={handleAddToCartClick}
				>
					Add to Cart
				</button>
				<button className="action-btn-card remove" onClick={handleRemove}>
					Remove
				</button>

				{discount > 0 && (
					<div className="sale-badge-card">-{discount}% OFF</div>
				)}
			</div>
		</div>
	);
};

export default WishlistPage;
