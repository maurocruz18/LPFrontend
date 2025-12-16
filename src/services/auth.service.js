import api from './api';

const authService = {
  login: (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  register: (name, email, password, dateOfBirth) => {
    return api.post('/auth/register', { 
      name, 
      email, 
      password, 
      dateOfBirth 
    });
  },

  getMe: () => {
    return api.get('/auth/me');
  },

  updateProfile: (name, phone) => {
    return api.put('/auth/profile', { name, phone });
  },

  changePassword: (currentPassword, newPassword) => {
    return api.put('/auth/profile', { currentPassword, newPassword });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authService;