import api from './api';

export const lezioniService = {
  getAllLezioni: async () => {
    const response = await api.get('/lezioni');
    return response.data;
  },
  getComingLezioni: async () => {
    const response = await api.get('/lezioni/coming');
    return response.data;
  }
};