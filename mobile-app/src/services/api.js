import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.3.87:5000/api';

console.log('🔗 API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    console.log('📤 Request:', config.method?.toUpperCase(), config.url);
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log('❌ Request Error:', error.message);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log('❌ Response Error:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', JSON.stringify(error.response.data));
    } else if (error.request) {
      console.log('   No response received - network error or server unreachable');
    }
    return Promise.reject(error);
  }
);

export default api;
