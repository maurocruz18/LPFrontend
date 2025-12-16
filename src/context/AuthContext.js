import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [error, setError] = useState(null);

  // Verificar token ao carregar a app
  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await authService.getMe(); // This should call /auth/me
      const userData = response.data.data; // Note: response.data.data from Postman
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      console.error('Token inválido:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authService.login(email, password);
      const { token: newToken, user: userData } = response.data.data;

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(newToken);
      setUser(userData);

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao fazer login';
      setError(errorMessage);
      throw err;
    }
  };

  const register = async (name, email, password, dateOfBirth) => {
    try {
      setError(null);
      const response = await authService.register(
        name,
        email,
        password,
        dateOfBirth
      );
      const { token: newToken, user: userData } = response.data.data;

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(newToken);
      setUser(userData);

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao registar';
      setError(errorMessage);
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    setError(null);
  };

  const updateProfile = async (name, phone) => {
    try {
      setError(null);
      const response = await authService.updateProfile(name, phone);
      
      const updatedUser = response.data.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar perfil';
      setError(errorMessage);
      throw err;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      const response = await authService.changePassword(currentPassword, newPassword);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao alterar senha';
      setError(errorMessage);
      throw err;
    }
  };

  const updateSettings = async (settingsData) => {
    try {
      setError(null);
      const response = await authService.updateSettings(settingsData);
      
      // Atualizar o user com as novas settings
      const updatedUser = {
        ...user,
        settings: {
          ...user.settings,
          ...settingsData
        }
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar configurações';
      setError(errorMessage);
      throw err;
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    updateSettings,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};