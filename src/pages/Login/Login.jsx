// src/pages/LoginPage/LoginPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthPage from '../Auth/Auth';
import './Login.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just log the data. Backend integration will come later.
    console.log('Login attempt:', formData);
    alert('Login functionality will be implemented with backend integration');
  };

  return (
    <AuthPage
      title="Welcome Back"
      subtitle="Sign in to your GameStore account"
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="form-options">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="forgot-password">
            Forgot password?
          </Link>
        </div>

        <button type="submit" className="auth-button primary">
          Sign In
        </button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="social-auth">
          <button type="button" className="social-button google">
            <span className="social-icon">🔍</span>
            Continue with Google
          </button>
          <button type="button" className="social-button steam">
            <span className="social-icon">🎮</span>
            Continue with Steam
          </button>
          <button type="button" className="social-button discord">
            <span className="social-icon">💬</span>
            Continue with Discord
          </button>
        </div>

        <div className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Sign up</Link>
        </div>
      </form>
    </AuthPage>
  );
};

export default LoginPage;