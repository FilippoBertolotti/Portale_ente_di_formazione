import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const sslConfig = {
  rejectUnauthorized: true,
};

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: sslConfig,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('connect', () => {
  console.log('✅ Database Azure connesso con successo');
});

pool.on('error', (err) => {
  console.error('❌ Errore inaspettato nel pool del database:', err);
  process.exit(-1);
});

export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Query eseguita', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Errore nella query:', error);
    throw error;
  }
};

export const getClient = async () => {
  const client = await pool.connect();
  const originalRelease = client.release;
  
  const timeout = setTimeout(() => {
    console.error('⚠️ Client checkout da più di 5 secondi!');
  }, 5000);
  
  client.release = () => {
    clearTimeout(timeout);
    originalRelease.call(client);
  };
  
  return client;
};

export default pool;