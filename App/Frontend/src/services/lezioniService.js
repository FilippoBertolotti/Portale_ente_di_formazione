import api from './api';

export const lezioniService = {
  getComingLezioni: async () => {
    const response = await api.get('/lezioni');
    return response.data;
  }
};