import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database.js';
import authRoutes from "./routes/auth.js";
import progettiRoutes from "./routes/progetti.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware per logging delle richieste
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Route di test per verificare la connessione al database
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'ok',
      message: 'Server e database funzionanti',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    console.error('Errore health check:', error);
    res.status(500).json({
      status: 'error',
      message: 'Errore nella connessione al database',
      error: error.message
    });
  }
});

// Route base
app.get('/', (req, res) => {
  res.json({
    message: 'API Sistema Gestione Ente Formazione',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      corsi: '/api/corsi',
      studenti: '/api/studenti',
      docenti: '/api/docenti',
      aule: '/api/aule',
      sedi: '/api/sedi',
      lezioni: '/api/lezioni'
    }
  });
});

// Importa le routes (da creare)
// import authRoutes from './routes/auth.js';
// import corsiRoutes from './routes/corsi.js';
// app.use('/api/auth', authRoutes);
// app.use('/api/corsi', corsiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/progetti', progettiRoutes);

// Gestione errori 404
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint non trovato'
  });
});

// Gestione errori globale
app.use((err, req, res, next) => {
  console.error('Errore:', err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Errore interno del server'
  });
});

// Avvio del server
app.listen(PORT, () => {
  console.log(`🚀 Server avviato sulla porta ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

// Gestione chiusura graceful
process.on('SIGTERM', () => {
  console.log('SIGTERM ricevuto, chiusura del server...');
  pool.end(() => {
    console.log('Pool del database chiuso');
    process.exit(0);
  });
});

export default app;