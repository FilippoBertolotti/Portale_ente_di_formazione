import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database.js';
import authRoutes from "./routes/auth.js";
import progettiRoutes from "./routes/progetti.js";
import moduliRoutes from "./routes/moduli.js";
import studentiRoutes from "./routes/studenti.js";
import docentiRoutes from "./routes/docenti.js";
import auleRoutes from "./routes/aule.js";
import lezioniRoutes from "./routes/lezioni.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware

app.use(cors({
  origin: (origin, callback) => {
    // Permetti localhost, LAN e richieste senza origin (es. Postman)
    const allowed = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://192.168.1.86:5173',
    ];
    // Permetti qualsiasi IP della LAN 192.168.x.x
    if (!origin || allowed.includes(origin) || /^http:\/\/192\.168\.\d+\.\d+:5173$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS non permesso'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware per logging delle richieste
app.use((req, res, next) => {
  console.log('-' +  req.method + ' ' + req.path);
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

// Importa le routes (da creare)
// import authRoutes from './routes/auth.js';
// import corsiRoutes from './routes/corsi.js';
// app.use('/api/auth', authRoutes);
// app.use('/api/corsi', corsiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/progetti', progettiRoutes);
app.use('/api/moduli', moduliRoutes);
app.use('/api/studenti', studentiRoutes);
app.use('/api/docenti', docentiRoutes);
app.use('/api/aule', auleRoutes);
app.use('/api/lezioni', lezioniRoutes);
app.use('/api/chat', chatRoutes);
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
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server avviato sulla porta ${PORT}`);
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