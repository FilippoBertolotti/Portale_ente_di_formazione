import api from './api';

export const chatService = {
  query: async (message) => {
    const response = await api.post('/chat', { message });
    return response.data;
  }
};