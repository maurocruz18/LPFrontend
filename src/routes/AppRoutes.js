import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Layouts
import MainLayout from '../layouts/MainLayout/MainLayout';
import AuthLayout from '../layouts/AuthLayout/AuthLayout';

// Import Auth Pages
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';

// Import Main Pages
import Home from '../pages/Home/Home';
import Browse from '../pages/Browse/Browse';
import GameDetailsPage from '../pages/GameDetail/GameDetail';
import Settings from '../pages/Settings/Settings';
import WishlistPage from '../pages/Wishlist/Wishlist';
import OwnedGames from '../pages/OwnedGames/OwnedGames';

// Import Protected Route
import ProtectedRoute from './ProtectedRoute';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes - Without Main Navigation */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Main Routes - With Navigation and Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/games" element={<Browse />} />
          <Route path="/game/:id" element={<GameDetailsPage/>} />
          
          {/* Protected Routes */}
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/wishlist" 
            element={
              <ProtectedRoute>
                <WishlistPage/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/owned-games" 
            element={
              <ProtectedRoute>
                <OwnedGames />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/library" 
            element={
              <ProtectedRoute>
                <OwnedGames />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;