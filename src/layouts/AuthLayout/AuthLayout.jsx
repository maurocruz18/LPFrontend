import React from 'react';
import { Outlet } from 'react-router-dom';
import './AuthLayout.css';

function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-logo">
          <h1>GameStore</h1>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;