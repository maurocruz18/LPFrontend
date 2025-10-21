
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/AuthForm.css';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import HomePage from './pages/Home/Home';
import GameDetailsPage from './pages/GameDetail/GameDetail';
import BrowsePage from './pages/Browse/Browse';
import LoginPage from './pages/Login/Login';
import RegisterPage from './pages/Register/Register';
import WishlistPage from './pages/Wishlist/Wishlist ';
import OwnedGamesPage from './pages/OwnedGames/OwnedGames';
import SettingsPage from './pages/Settings/Settings';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/games" element={<BrowsePage />} />
            <Route path="/game/:id" element={<GameDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/library" element={<OwnedGamesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;