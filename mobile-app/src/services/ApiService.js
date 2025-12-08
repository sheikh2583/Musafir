import api from './api';

class ApiService {
  // Authentication methods
  static async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }

  static async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  }

  static async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  }

  // User methods
  static async getUserProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  }

  static async updateUserProfile(userData) {
    const response = await api.put('/users/profile', userData);
    return response.data;
  }

  static async searchUsers(query) {
    const response = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }

  static async getUserById(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  }

  // Message methods
  static async getMessages() {
    const response = await api.get('/messages');
    return response.data;
  }

  static async sendMessage(messageData) {
    const response = await api.post('/messages', messageData);
    return response.data;
  }

  static async deleteMessage(messageId) {
    const response = await api.delete(`/messages/${messageId}`);
    return response.data;
  }

  // Generic data methods
  static async getData(endpoint) {
    const response = await api.get(endpoint);
    return response.data;
  }

  static async postData(endpoint, data) {
    const response = await api.post(endpoint, data);
    return response.data;
  }

  static async putData(endpoint, data) {
    const response = await api.put(endpoint, data);
    return response.data;
  }

  static async deleteData(endpoint) {
    const response = await api.delete(endpoint);
    return response.data;
  }

  // File upload method (if needed)
  static async uploadFile(endpoint, formData) {
    const response = await api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export default ApiService;