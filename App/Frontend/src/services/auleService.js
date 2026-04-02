import api from './api';

export const auleService = {
  getAllAule: async () => {
    const response = await api.get('/aule');
    return response.data;
  },

  getAllSedi: async () => {
    const response = await api.get('/aule/sedi');
    return response.data;
  },

  getCountA: async () => {
    const response = await api.get('/aule/contaA');
    return response.data;
  },

  getCountS: async () => {
    const response = await api.get('/aule/contaS');
    return response.data;
  },

  getPiani: async () => {
    const response = await api.get('/aule/piani');
    return response.data;
  },

//   getById: async (cf) => {
//     const response = await api.get(`/docenti/${cf}`);
//     return response.data;
//   },

//   create: async (docente) => {
//     const response = await api.post('/docenti', docente);
//     return response.data;
//   },

//   update: async (cf, docente) => {
//     const response = await api.put(`/docenti/${cf}`, docente);
//     return response.data;
//   },

//   delete: async (cf) => {
//     const response = await api.delete(`/docenti/${cf}`);
//     return response.data;
//   },
};