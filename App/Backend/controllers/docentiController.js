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
              STRING_AGG(DISTINCT p.descrizione || ' ' || m.anno || '\n' || m.descrizione, '\n')  AS "corsoModulo",
              STRING_AGG(DISTINCT p.codice || ':' || m.anno, '\n') AS "codiciProgettiAnni"
            FROM utente u
            JOIN docente d ON u.cf = d.cf
            JOIN posseduto po ON po.cfdocente = d.cf
            JOIN qualifica q ON po.idqualifica = q.id
            LEFT JOIN modulo m ON m.cfdocente = d.cf
            LEFT JOIN progetto p ON m.codiceprogetto = p.codice
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

export const createDocente = async (req, res) => {
  const { cf, nome, cognome, email, dataNascita, telefono, qualifica } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Inserisce i dati anagrafici in UTENTE
    await client.query(
      `INSERT INTO UTENTE (CF, Nome, Cognome, DataNascita, Email, Password, Livello)
     VALUES ($1, $2, $3, TO_DATE($4, 'YYYY-MM-DD'), $5, $6, 2)`,
      [cf, nome, cognome, dataNascita, email, cf]
    );

    // Inserisce i dati di DOCENTE
    await client.query(
      `INSERT INTO DOCENTE (CF, Telefono)
             VALUES ($1, $2)`,
      [cf, telefono.replaceAll(' ', '')]
    );

    // Inserisce i dati di qualifica
    await client.query(
      `INSERT INTO QUALIFICA (materia)
             VALUES ($1)`,
      [qualifica]
    );

    await client.query(
      `INSERT INTO POSSEDUTO (CFDocente, IDQualifica)
             VALUES ($1, (SELECT id FROM QUALIFICA ORDER BY id DESC LIMIT 1))`,
      [cf]
    );

    await client.query('COMMIT');

    res.status(201).json({
      status: 'success',
      message: 'Docente creato con successo',
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Errore creazione docente:', error);

    if (error.code === '23505') {
      return res.status(400).json({
        status: 'error',
        message: 'Codice fiscale o email già esistente'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Errore nella creazione del docente'
    });
  } finally {
    client.release();
  }
};