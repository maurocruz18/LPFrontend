import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import useAuth from "../../../hooks/useAuth";

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [cartCount, setCartCount] = useState(0);
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const handleSearch = (e) => {
		e.preventDefault();
		if (searchTerm.trim()) {
			navigate(`/browse?search=${encodeURIComponent(searchTerm)}`);
			setSearchTerm("");
			setIsMenuOpen(false);
		}
	};

	const handleLogout = () => {
		logout();
		navigate("/login");
		setIsMenuOpen(false);
	};

	return (
		<nav className="navbar">
			<div className="nav-container">
				{/* Logo */}
				<div className="nav-logo">
					<Link
						to="/"
						className="logo-link"
						onClick={() => setIsMenuOpen(false)}
					>
						<span className="logo-icon">🎮</span>
						GameStore
					</Link>
				</div>

				{/* Search Bar */}
				<form className="nav-search" onSubmit={handleSearch}>
					<input
						type="text"
						placeholder="Search games..."
						className="search-input"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<button type="submit" className="search-btn" title="Search games">
						🔍
					</button>
				</form>

				{/* Navigation Links */}
				<div className={`nav-links ${isMenuOpen ? "nav-links-active" : ""}`}>
					<Link
						to="/"
						className="nav-link"
						onClick={() => setIsMenuOpen(false)}
					>
						Home
					</Link>
					<Link
						to="/browse"
						className="nav-link"
						onClick={() => setIsMenuOpen(false)}
					>
						Browse Games
					</Link>

					{user && (
						<>
							<Link
								to="/library"
								className="nav-link"
								onClick={() => setIsMenuOpen(false)}
							>
								📚 My Library
							</Link>
							<Link
								to="/settings"
								className="nav-link"
								onClick={() => setIsMenuOpen(false)}
							>
								⚙️ Settings
							</Link>
						</>
					)}
				</div>

				{/* User Actions */}
				<div className={`nav-actions ${isMenuOpen ? "nav-actions-active" : ""}`}>
					{user ? (
						<>
							<div className="user-info">
								<span className="user-name" title={`Logged in as ${user.name}`}>
									👤 {user.name.split(" ")[0]}
								</span>
							</div>

							<Link
								to="/wishlist"
								className="nav-action-btn"
								title="View wishlist"
							>
								<span className="action-icon">❤️</span>
								<span className="action-text">Wishlist</span>
							</Link>

							<button
								className="nav-action-btn logout-btn"
								onClick={handleLogout}
								title="Logout"
							>
								<span className="action-icon">🚪</span>
								<span className="action-text">Logout</span>
							</button>

							<Link
								to="/cart"
								className="nav-action-btn cart-btn"
								title="View shopping cart"
							>
								<span className="action-icon">🛒</span>
								<span className="action-text">Cart</span>
								{cartCount > 0 && (
									<span className="cart-count">{cartCount}</span>
								)}
							</Link>
						</>
					) : (
						<>
							<Link
								to="/login"
								className="nav-action-btn"
								title="Sign in to your account"
							>
								<span className="action-icon">👤</span>
								<span className="action-text">Login</span>
							</Link>

							<Link
								to="/register"
								className="nav-action-btn register-btn"
								title="Create a new account"
							>
								<span className="action-icon">✏️</span>
								<span className="action-text">Register</span>
							</Link>

							<Link
								to="/cart"
								className="nav-action-btn cart-btn"
								title="View shopping cart"
							>
								<span className="action-icon">🛒</span>
								<span className="action-text">Cart</span>
								{cartCount > 0 && (
									<span className="cart-count">{cartCount}</span>
								)}
							</Link>
						</>
					)}
				</div>

				{/* Mobile Menu Button */}
				<button
					className="mobile-menu-btn"
					onClick={toggleMenu}
					aria-label="Toggle navigation menu"
					title="Toggle menu"
				>
					<span></span>
					<span></span>
					<span></span>
				</button>
			</div>
		</nav>
	);
};

export default Navbar;
