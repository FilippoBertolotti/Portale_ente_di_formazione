import api from './api';

export const lezioniService = {
  getAllLezioni: async () => {
    const response = await api.get('/lezioni');
    return response.data;
  },
  getByProgetto: async (codiceProgetto) => {
    const response = await api.get(`/lezioni/progetto/${codiceProgetto}`);
    return response.data;
  },
  getAllNote: async () => {
    const response = await api.get('/lezioni/note');
    return response.data;
  },
  getComingLezioni: async () => {
    const response = await api.get('/lezioni/coming');
    return response.data;
  },
  getComingNote: async () => {
    const response = await api.get('/lezioni/coming/note');
    return response.data;
  },
  createLezione: async (lezioneData) => {
    const response = await api.post('/lezioni', lezioneData);
    return response;
  },
  createNota: async (notaData) => {
    const response = await api.post('/lezioni/nota', notaData);
    return response;
  },
  updateLezione: async (id, lezioneData) => {
    const response = await api.put(`/lezioni/${id}`, lezioneData);
    return response;
  },
  updateNota: async (id, notaData) => {
    const response = await api.put(`/lezioni/nota/${id}`, notaData);
    return response;
  },
  deleteLezione: async (id) => {
    const response = await api.delete(`/lezioni/${id}`);
    return response;
  },
  deleteNota: async (id) => {
    const response = await api.delete(`/lezioni/nota/${id}`);
    return response;
  }
};