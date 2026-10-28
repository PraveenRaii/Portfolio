import api from './api';

export const authService = {
  async register(data) {
    return await api.post('/auth/register', data);
  },

  async login(credentials) {
    return await api.post('/auth/login', credentials);
  },

  async getMe() {
    return await api.get('/auth/me');
  },

  async logout() {
    return await api.post('/auth/logout');
  },

  async forgotPassword(email) {
    return await api.post('/auth/forgot-password', { email });
  },

  async resetPassword(data) {
    return await api.post('/auth/reset-password', data);
  },

  async updatePassword(data) {
    return await api.put('/auth/update-password', data);
  },
};
