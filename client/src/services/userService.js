import api from './api';

export const userService = {
  async getDashboard() {
    return await api.get('/user/dashboard');
  },

  async getSavedProjects() {
    return await api.get('/user/projects/saved');
  },

  async toggleBookmark(projectId) {
    return await api.post(`/user/projects/${projectId}/bookmark`);
  },

  async toggleLike(projectId) {
    return await api.post(`/user/projects/${projectId}/like`);
  },

  async submitTestimonial(data) {
    return await api.post('/user/testimonials', data);
  },

  async getMyTestimonials() {
    return await api.get('/user/testimonials');
  },

  async sendMessage(data) {
    return await api.post('/user/messages', data);
  },

  async getMyMessages() {
    return await api.get('/user/messages');
  },

  async updateProfile(formData) {
    return await api.put('/user/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async deleteAccount() {
    return await api.delete('/user/account');
  },
};
