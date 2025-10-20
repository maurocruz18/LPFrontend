import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Layouts
import MainLayout from '../layouts/MainLayout/MainLayout';
import AuthLayout from '../layouts/AuthLayout/AuthLayout';

// Import Auth Pages
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import RecoverPassword from '../pages/Auth/RecoverPassword';

// Import Main Pages
import Home from '../pages/Home/Home';
import Browse from '../pages/Browse/Browse';
import GameDetail from '../pages/GameDetail/GameDetail';
import Settings from '../pages/Settings/Settings';
import Wishlist from '../pages/Wishlist/Wishlist';
import OwnedGames from '../pages/OwnedGames/OwnedGames';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes - Without Main Navigation */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recover-password" element={<RecoverPassword />} />
        </Route>

        {/* Main Routes - With Navigation and Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/game/:id" element={<GameDetail />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/owned-games" element={<OwnedGames />} />
        </Route>

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;