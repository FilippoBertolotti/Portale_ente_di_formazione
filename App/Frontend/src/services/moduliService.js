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

  getActiveByAnno: async (anno) => {
    const response = await api.get(`/moduli/attiviAnno/${anno}`);
    return response.data;
  },

  getAnni: async () => {
    const response = await api.get('/moduli/anni');
    return response.data;
  },

  create: async (progetto) => {
    const response = await api.post('/moduli', progetto);
    return response;
  },

  update: async (id, dati) => {
    const response = await api.put(`/moduli/${id}`, dati);
    return response;
  },

  delete: async (id) => {
    const response = await api.delete(`/moduli/${id}`);
    return response;
  },

  addTeacherToModule: async (id, cfDocente) => {
    const response = await api.post(`/moduli/${id}/teacher`, { cfDocente });
    return response;
  },

  removeTeacherFromModule: async (id, cfDocente) => {
    const response = await api.delete(`/moduli/${id}/teacher`, { data: { cfDocente } });
    return response;
  }
};