import api from './api';

export const moduliService = {
  getAll: async () => {
    const response = await api.get('/moduli');
    return response.data;
  },

  getByCodiceProgetto: async (codice) => {
    const response = await api.get(`/moduli/codice/${codice}`);
    return response.data;
  },

  getByAnno: async (anno) => {
    const response = await api.get(`/moduli/anno/${anno}`);
    return response.data;
  },

  getAnni: async () => {
    const response = await api.get('/moduli/anni');
    return response.data;
  },

  create: async (progetto) => {
    const response = await api.post('/moduli', progetto);
    return response.data;
  },

  update: async (codice, progetto) => {
    const response = await api.put(`/moduli/${codice}`, progetto);
    return response.data;
  },

  delete: async (codice) => {
    const response = await api.delete(`/moduli/${codice}`);
    return response.data;
  },
};