import api from './api';

export const progettiService = {
  getAll: async () => {
    const response = await api.get('/progetti');
    return response.data;
  },

  getById: async (codice) => {
    const response = await api.get(`/progetti/${codice}`);
    return response.data;
  },

  create: async (progetto) => {
    const response = await api.post('/progetti', progetto);
    return response.data;
  },

  update: async (codice, progetto) => {
    const response = await api.put(`/progetti/${codice}`, progetto);
    return response.data;
  },

  delete: async (codice) => {
    const response = await api.delete(`/progetti/${codice}`);
    return response.data;
  },
};