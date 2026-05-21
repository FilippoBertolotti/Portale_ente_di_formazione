import api from './api';
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  haCodiceProgetto: (codiceCercato) => {
    const user = authService.getCurrentUser();
    // Gestione caso user.codiceProgetto sia undefined/null
    if (!user.codicecoordinatore) return false;

    const codice = codiceCercato.trim();

    // Se è un array, controlla se include il codice
    if (Array.isArray(user.codicecoordinatore)) {
      return user.codicecoordinatore.map((codice) => codice.trim()).includes(codice);
    }

    // Se è una stringa singola, confronta direttamente
    if (typeof user.codicecoordinatore === 'string') {
      return user.codicecoordinatore.trim() === codice;
    }

    return false;
  }
};