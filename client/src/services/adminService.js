import api from './api';

export const adminService = {
  // 1. Dashboard
  async getDashboardStats() {
    return await api.get('/admin/dashboard');
  },

  // 2. Projects
  async getProjects() {
    return await api.get('/admin/projects');
  },
  async createProject(formData) {
    return await api.post('/admin/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  async updateProject(id, formData) {
    return await api.put(`/admin/projects/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  async deleteProject(id) {
    return await api.delete(`/admin/projects/${id}`);
  },
  async reorderProjects(orders) {
    return await api.put('/admin/projects-reorder', { orders });
  },

  // 3. Skills
  async getSkills() {
    return await api.get('/admin/skills');
  },
  async createSkill(data) {
    return await api.post('/admin/skills', data);
  },
  async updateSkill(id, data) {
    return await api.put(`/admin/skills/${id}`, data);
  },
  async deleteSkill(id) {
    return await api.delete(`/admin/skills/${id}`);
  },

  // 4. Education & Certificates
  async createEducation(data) {
    return await api.post('/admin/education', data);
  },
  async updateEducation(id, data) {
    return await api.put(`/admin/education/${id}`, data);
  },
  async deleteEducation(id) {
    return await api.delete(`/admin/education/${id}`);
  },

  async createCertificate(formData) {
    return await api.post('/admin/certificates', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  async updateCertificate(id, formData) {
    return await api.put(`/admin/certificates/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  async deleteCertificate(id) {
    return await api.delete(`/admin/certificates/${id}`);
  },

  // 5. Users
  async getUsers(search = '') {
    return await api.get(`/admin/users?search=${encodeURIComponent(search)}`);
  },
  async toggleBlockUser(id) {
    return await api.patch(`/admin/users/${id}/block`);
  },
  async deleteUser(id) {
    return await api.delete(`/admin/users/${id}`);
  },

  // 6. Testimonials
  async getTestimonials() {
    return await api.get('/admin/testimonials');
  },
  async updateTestimonialStatus(id, status) {
    return await api.patch(`/admin/testimonials/${id}/status`, { status });
  },
  async deleteTestimonial(id) {
    return await api.delete(`/admin/testimonials/${id}`);
  },

  // 7. Messages
  async getMessages() {
    return await api.get('/admin/messages');
  },
  async markMessageAsRead(id) {
    return await api.patch(`/admin/messages/${id}/read`);
  },
  async replyMessage(id, replyText) {
    return await api.post(`/admin/messages/${id}/reply`, { replyText });
  },
  async deleteMessage(id) {
    return await api.delete(`/admin/messages/${id}`);
  },

  // 8. Profile Settings & Resume
  async getProfile() {
    return await api.get('/admin/profile');
  },
  async updateProfile(formData) {
    return await api.put('/admin/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  async uploadResume(formData) {
    return await api.post('/admin/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
