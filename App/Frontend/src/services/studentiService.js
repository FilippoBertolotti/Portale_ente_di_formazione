import api from './api';

export const studentiService = {
  getAll: async () => {
    const response = await api.get(`/studenti`);
    return response.data;
  },

  getSearch: async (search) => {
    const response = await api.get(`/studenti/${search}`);
    return response.data;
  },

  getByCodice: async (codice) => {
    const response = await api.get(`/studenti/codice/${codice}`);
    return response.data;
  },

  getByAnno: async (anno) => {
    const response = await api.get(`/studenti/anno/${anno}`);
    return response.data;
  },

  getCount: async () => {
    const response = await api.get('/studenti/conta');
    return response.data;
  },

  getIncrement: async () => {
    const response = await api.get('/studenti/incremento');
    return response.data;
  },

  getTrend: async () => {
    const response = await api.get('/studenti/andamento');
    return response.data;
  },

  getComposition: async () => {
    const response = await api.get('/studenti/composizione');
    return response.data;
  },

  getAnni: async () => {
    const response = await api.get(`/studenti/anni`);
    return response.data;
  },

//   getById: async (cf) => {
//     const response = await api.get(`/studenti/${cf}`);
//     return response.data;
//   },

//   create: async (studente) => {
//     const response = await api.post('/studenti', studente);
//     return response.data;
//   },

//   update: async (cf, studente) => {
//     const response = await api.put(`/studenti/${cf}`, studente);
//     return response.data;
//   },

//   delete: async (cf) => {
//     const response = await api.delete(`/studenti/${cf}`);
//     return response.data;
//   },
};