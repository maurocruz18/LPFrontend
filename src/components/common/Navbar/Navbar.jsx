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

		</nav>
	);
};

export default Navbar;
