import pool from '../config/database.js';

// GET tutti i docenti
export const getAllDocenti = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.*, p.descrizione
            FROM utente u
            JOIN docente d ON u.cf = d.cf
            LEFT JOIN progetto p ON d.codiceprogetto = p.codice
            ORDER BY u.cognome, u.nome;
        `);
        res.json({
            status: 'success',
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        console.error('Errore get docenti:', error);
        res.status(500).json({
            status: 'error',
            message: 'Errore nel recupero dei docenti'
        });
    }
};

// GET numero docenti
export const getCountDocenti = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT COUNT(*) as total_docenti
      FROM DOCENTE;
    `);

    res.json({
      status: 'success',
      data: parseInt(result.rows[0].total_docenti)
    });
  } catch (error) {
    console.error('Errore get docenti:', error);
    res.status(500).json({
      status: 'error',
      message: 'Errore nel recupero del numero dei docenti'
    });
  }
};