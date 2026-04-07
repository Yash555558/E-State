import api from './api';

export const propertyService = {
  getAll: async (params = {}) => {
    const response = await api.get('/properties', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/properties', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.put(`/properties/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  }
};
