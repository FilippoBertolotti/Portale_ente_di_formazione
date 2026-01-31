import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cerca l'utente per email
    const result = await pool.query(
      'SELECT * FROM UTENTE WHERE Email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Email o password non validi'
      });
    }

    const user = result.rows[0];

    // Verifica la password
    //const isPasswordValid = await bcrypt.compare(password, user.password);

    if (/*!isPasswordValid*/password !== user.password) {
      return res.status(401).json({
        status: 'error',
        message: 'Email o password non validi'
      });
    }

    // Crea il token JWT
    const token = jwt.sign(
      {
        cf: user.cf,
        nome: user.nome,
        cognome: user.cognome,
        email: user.email,
        livello: user.livello
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      status: 'success',
      message: 'Login effettuato con successo',
      token,
      user: {
        cf: user.cf,
        nome: user.nome,
        cognome: user.cognome,
        email: user.email,
        livello: user.livello,
        dataNascita: user.datanascita
      }
    });

  } catch (error) {
    console.error('Errore login:', error);
    res.status(500).json({
      status: 'error',
      message: 'Errore durante il login'
    });
  }
};

// Registrazione nuovo utente
export const register = async (req, res) => {
  const { cf, nome, cognome, dataNascita, email, password, livello, telefono } = req.body;

  try {
    // Hash della password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inizia transazione
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Inserisci utente
      const userResult = await client.query(
        `INSERT INTO UTENTE (CF, Nome, Cognome, DataNascita, Email, Password, Livello)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [cf, nome, cognome, dataNascita, email, hashedPassword, livello]
      );

      // Se è docente, inserisci anche in DOCENTE
      if (livello >= 1 && telefono) {
        await client.query(
          'INSERT INTO DOCENTE (CF, Telefono) VALUES ($1, $2)',
          [cf, telefono]
        );
      }

      // Se è studente, inserisci in STUDENTE
      if (livello === 0) {
        await client.query(
          'INSERT INTO STUDENTE (CF) VALUES ($1)',
          [cf]
        );
      }

      await client.query('COMMIT');

      res.status(201).json({
        status: 'success',
        message: 'Utente registrato con successo',
        user: {
          cf: userResult.rows[0].cf,
          nome: userResult.rows[0].nome,
          cognome: userResult.rows[0].cognome,
          email: userResult.rows[0].email,
          livello: userResult.rows[0].livello
        }
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Errore registrazione:', error);
    
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({
        status: 'error',
        message: 'Codice fiscale o email già esistente'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Errore durante la registrazione'
    });
  }
};

// Logout
export const logout = async (req, res) => {
  res.json({
    status: 'success',
    message: 'Logout effettuato con successo'
  });
};

// Verifica token
export const verifyToken = async (req, res) => {
  res.json({
    status: 'success',
    user: req.user
  });
};