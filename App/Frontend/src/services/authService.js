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
    console.log('Verifica codice progetto per utente:', user, 'con codice cercato:', codiceCercato);

    // AGGIUNGI: controlla se user esiste
    if (!user) return false;

    // CORREZIONE: usa codiceprogetto, non codicecoordinatore
    const progettiUtente = user.codicecoordinatore;

    if (!progettiUtente) return false;
    if (!codiceCercato) return false;

    // TRIM su entrambi i valori per rimuovere spazi
    const codice = codiceCercato.toString().trim();

    if (Array.isArray(progettiUtente)) {
      // TRIM anche sui valori dell'array
      const progettiNormalizzati = progettiUtente.map(p => p?.toString().trim());
      console.log('Controllando codice nei progetti:', progettiNormalizzati, 'contro codice:', codice);
      return progettiNormalizzati.includes(codice);
    }

    if (typeof progettiUtente === 'string') {
      return progettiUtente.trim() === codice;
    }

    return false;
  }
};