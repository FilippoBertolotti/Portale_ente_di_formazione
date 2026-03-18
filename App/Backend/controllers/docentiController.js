import pool from '../config/database.js';

// GET tutti i docenti
export const getAllDocenti = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
              u.cf,
              u.nome || ' ' || u.cognome || '\n' || STRING_AGG(DISTINCT q.materia, ', ') AS "nomeCompletoQualifica",
              TO_CHAR(u.datanascita, 'DD/MM/YYYY') AS "dataNascita",
              u.email || '\n' || d.telefono AS "contatti",
              STRING_AGG(DISTINCT p.descrizione || ' ' || m.anno || '\n' || m.descrizione, '\n') AS "corsoModulo",
              STRING_AGG(DISTINCT p.codice || ':' || m.anno, '\n') AS "codiciProgettiAnni"
            FROM utente u
            JOIN docente d ON u.cf = d.cf
            JOIN posseduto po ON po.cfdocente = d.cf
            JOIN qualifica q ON po.idqualifica = q.id
            JOIN modulo m ON m.cfdocente = d.cf
            JOIN progetto p ON m.codiceprogetto = p.codice
            GROUP BY u.cf, u.nome, u.cognome, u.datanascita, u.email, d.telefono
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