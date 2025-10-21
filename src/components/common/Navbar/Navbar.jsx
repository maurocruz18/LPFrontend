import React, { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<nav className="navbar">
			<div className="nav-container">
				{/* Logo */}
				<div className="nav-logo">
					<a href="/" className="logo-link">
						<span className="logo-icon">🎮</span>
						GameStore
					</a>
				</div>

				{/* Search Bar */}
				<div className="nav-search">
					<input
						type="text"
						placeholder="Search games..."
						className="search-input"
					/>
					<button className="search-btn">🔍</button>
				</div>

				{/* Navigation Links */}
				<div className={`nav-links ${isMenuOpen ? "nav-links-active" : ""}`}>
					<a href="/" className="nav-link">
						Home
					</a>
					<a href="/games" className="nav-link">
						Games
					</a>
					<a href="/categories" className="nav-link">
						Categories
					</a>
					<a href="/deals" className="nav-link nav-deals">
						Deals
					</a>
					<a href="/new" className="nav-link">
						New Releases
					</a>
				</div>

				{/* User Actions */}

				<div className="nav-actions">
					<a href="/library" className="nav-action-btn">
						<span className="action-icon">📚</span>
						<span className="action-text">My Games</span>
					</a>
					<a href="/wishlist" className="nav-action-btn">
						<span className="action-icon">❤️</span>
						<span className="action-text">Wishlist</span>
					</a>
					<a href="/login" className="nav-action-btn">
						<span className="action-icon">👤</span>
						<span className="action-text">Login</span>
					</a>
					<button className="nav-action-btn cart-btn">
						<span className="action-icon">🛒</span>
						<span className="action-text">Cart</span>
						<span className="cart-count">0</span>
					</button>
				</div>

				{/* Mobile Menu Button */}
				<button className="mobile-menu-btn" onClick={toggleMenu}>
					<span></span>
					<span></span>
					<span></span>
				</button>
			</div>

			{/* Categories Dropdown (Optional) */}
			<div className="nav-categories">
				<div className="categories-container">
					<a href="/category/action" className="category-link">
						Action
					</a>
					<a href="/category/rpg" className="category-link">
						RPG
					</a>
					<a href="/category/sports" className="category-link">
						Sports
					</a>
					<a href="/category/strategy" className="category-link">
						Strategy
					</a>
					<a href="/category/adventure" className="category-link">
						Adventure
					</a>
					<a href="/category/indie" className="category-link">
						Indie
					</a>
					<a href="/category/shooter" className="category-link">
						Shooter
					</a>
					<a href="/category/racing" className="category-link">
						Racing
					</a>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
