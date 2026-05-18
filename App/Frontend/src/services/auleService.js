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

  getSedeById: async (sede) => {
    const response = await api.get(`/aule/sede/${sede}`);
    return response.data;
  },

  //   getById: async (cf) => {
  //     const response = await api.get(`/docenti/${cf}`);
  //     return response.data;
  //   },

  createA: async (aula) => {
    const response = await api.post('/aule', aula);
    return response.data;
  },

  updateA: async (id, aula) => {
    const response = await api.put(`/aule/aula/${id}`, aula);
    return response.data;
  },

  deleteA: async (id) => {
    const response = await api.delete(`/aule/aula/${id}`);
    return response.data;
  },

  createS: async (sede) => {
    const response = await api.post('/aule/sede', sede);
    return response.data;
  },

  updateS: async (id, sede) => {
    const response = await api.put(`/aule/sede/${id}`, sede);
    return response.data;
  },

  deleteS: async (id) => {
    const response = await api.delete(`/aule/sede/${id}`);
    return response.data;
  }
};