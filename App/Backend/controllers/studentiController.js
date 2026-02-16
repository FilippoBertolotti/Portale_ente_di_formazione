import pool from '../config/database.js';

// GET tutti gli studenti
export const getAllStudenti = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.*, p.descrizione
            FROM utente u
            JOIN studente s ON u.cf = s.cf
            LEFT JOIN progetto p ON s.codiceprogetto = p.codice
            ORDER BY u.cognome, u.nome;
        `);
        res.json({
            status: 'success',
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        console.error('Errore get studenti:', error);
        res.status(500).json({
            status: 'error',
            message: 'Errore nel recupero degli studenti'
        });
    }
};

// GET numero studenti iscritti
export const getCountStudenti = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT COUNT(*) as total_studenti
      FROM STUDENTE;
    `);

    res.json({
      status: 'success',
      data: parseInt(result.rows[0].total_studenti)
    });
  } catch (error) {
    console.error('Errore get studenti:', error);
    res.status(500).json({
      status: 'error',
      message: 'Errore nel recupero del numero degli studenti'
    });
  }
};