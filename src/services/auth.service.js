import api from './api';

const authService = {
  login: (email, password) => {
    return api.post('/auth/login', { email, password })
      .then(response => {
        if (response.data.success && response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response;
      });
  },

  register: (name, email, password, dateOfBirth) => {
    return api.post('/auth/register', {  // Remove /api
      name, 
      email, 
      password, 
      dateOfBirth 
    });
  },

  getMe: () => {
    return api.get('/auth/me'); // Remove /api
  },

  updateProfile: (name, phone) => {
    return api.put('/auth/profile', { name, phone }); // Remove /api
  },

  changePassword: (currentPassword, newPassword) => {
    return api.put('/auth/profile', { currentPassword, newPassword }); // Remove /api
  },

  updateSettings: (settingsData) => {
    return api.put('/auth/settings', settingsData); // Remove /api
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authService;