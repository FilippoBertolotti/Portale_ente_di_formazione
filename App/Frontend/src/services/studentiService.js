import api from './api';

export const studentiService = {
  getAll: async () => {
    const response = await api.get('/studenti');
    return response.data;
  },

  getCount: async () => {
    const response = await api.get('/studenti/conta');
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