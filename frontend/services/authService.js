import api from './api';
import Cookies from 'js-cookie';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.success && response.data.data.token) {
      Cookies.set('token', response.data.data.token, { expires: 7 });
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success && response.data.data.token) {
      Cookies.set('token', response.data.data.token, { expires: 7 });
    }
    return response.data;
  },

  logout: () => {
    Cookies.remove('token');
  },

  getCurrentUser: () => {
    const token = Cookies.get('token');
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return { id: payload.id };
    } catch (error) {
      return null;
    }
  }
};
