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

  getStats: async (sede, piano) => {
    let url = '/aule/stats';

    // Costruisce l'URI in base ai filtri selezionati
    if (sede && piano) {
      url += `/sede/${sede}/piano/${piano}`;
    } else if (sede) {
      url += `/sede/${sede}`;
    } else if (piano) {
      url += `/piano/${piano}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  getSedeByNome: async (sede) => {
    const response = await api.get(`/aule/sede/${sede}`);
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