import api from './api';

export const publicService = {
  async getPortfolioData() {
    return await api.get('/public/data');
  },

  async recordVisit(path = window.location.pathname) {
    try {
      return await api.post('/public/visit', { path });
    } catch (e) {
      // non-blocking
      return null;
    }
  },

  async submitContact(data) {
    return await api.post('/public/contact', data);
  },

  async getResumeDownload() {
    return await api.get('/public/resume');
  },
};
