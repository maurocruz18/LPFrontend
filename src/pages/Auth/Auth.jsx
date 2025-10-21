
import React from 'react';
import './Auth.css';

const AuthPage = ({ children, title, subtitle }) => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side - Branding */}
        <div className="auth-branding">
          <div className="brand-content">
            <div className="brand-logo">
              <span className="logo-icon">🎮</span>
              <h1>GameStore</h1>
            </div>
            <h2 className="brand-tagline">
              Your Gateway to Gaming Excellence
            </h2>
            <div className="brand-features">
              <div className="feature">
                <span className="feature-icon">⭐</span>
                <span>Exclusive Deals</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🚀</span>
                <span>Instant Downloads</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🛡️</span>
                <span>Secure Payments</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-section">
          <div className="form-container">
            <div className="form-header">
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;