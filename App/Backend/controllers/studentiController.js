import pool from '../config/database.js';
import { parse } from 'csv-parse/sync';

// GET tutti gli studenti
export const getAllStudenti = async (req, res) => {
  try {
    const result = await pool.query(`
            SELECT 
              u.cf,
              u.nome || ' ' || u.cognome AS "nomeCompleto",
              u.nome,
              u.cognome,
              TO_CHAR(u.datanascita, 'DD/MM/YYYY') AS "FromattedDataNascita",
              u.datanascita AS "dataNascita",
              u.email,
              p.descrizione || ' ' || s.annoaccademico AS "corso",
              s.codiceprogetto,
              s.annoaccademico
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

export const getAllStudentiSearch = async (req, res) => {
  const { search } = req.params;
  try {
    const result = await pool.query(`
            SELECT 
              u.cf,
              u.nome || ' ' || u.cognome AS "nomeCompleto",
              TO_CHAR(u.datanascita, 'DD/MM/YYYY') AS "FromattedDataNascita",
              u.datanascita AS "dataNascita",
              u.email,
              p.descrizione || ' ' || s.annoaccademico AS "corso",
              s.codiceprogetto,
              s.annoaccademico
            FROM utente u
            JOIN studente s ON u.cf = s.cf
            LEFT JOIN progetto p ON s.codiceprogetto = p.codice
            WHERE (u.nome ILIKE $1 OR u.cognome ILIKE $1 OR u.nome || ' ' || u.cognome ILIKE $1)
            ORDER BY u.cognome, u.nome;
        `, [`${search}%`]);
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

export const getStudentiByProgetto = async (req, res) => {
  const { codice } = req.params;
  try {
    const result = await pool.query(`
            SELECT 
              u.cf,
              u.nome || ' ' || u.cognome AS "nomeCompleto",
              TO_CHAR(u.datanascita, 'DD/MM/YYYY') AS "dataNascita",
              u.email,
              p.descrizione || ' ' || s.annoaccademico AS "corso",
              s.codiceprogetto,
              s.annoaccademico
            FROM utente u
            JOIN studente s ON u.cf = s.cf
            LEFT JOIN progetto p ON s.codiceprogetto = p.codice
            WHERE s.codiceprogetto = $1
            ORDER BY u.cognome, u.nome;
        `, [codice]);
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

export const getStudentiByAnno = async (req, res) => {
  const { anno } = req.params;
  try {
    const result = await pool.query(`
          SELECT 
              u.cf,
              u.nome || ' ' || u.cognome AS "nomeCompleto",
              TO_CHAR(u.datanascita, 'DD/MM/YYYY') AS "dataNascita",
              u.email,
              p.descrizione || ' ' || s.annoaccademico AS "corso",
              s.codiceprogetto,
              s.annoaccademico
          FROM utente u
          JOIN studente s ON u.cf = s.cf
          LEFT JOIN progetto p ON s.codiceprogetto = p.codice
          WHERE s.annoaccademico = $1
          ORDER BY u.cognome, u.nome;
      `, [anno]);
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

// GET numero studenti iscritti in più rispetto anno scorso
export const getIncrementStudenti = async (req, res) => {
  try {
    // Query 1: studenti anno corrente
    const annoCorrente = await pool.query(`
      SELECT COUNT(*) as totale
      FROM STUDENTE
      WHERE EXTRACT(YEAR FROM datainserimento) = EXTRACT(YEAR FROM CURRENT_DATE) - 1
    `);

    // Query 2: studenti anno precedente
    const annoPrecedente = await pool.query(`
      SELECT COUNT(*) as totale
      FROM STUDENTE
      WHERE EXTRACT(YEAR FROM datainserimento) = EXTRACT(YEAR FROM CURRENT_DATE) - 2
    `);

    const incremento = (parseInt(annoCorrente.rows[0].totale) - parseInt(annoPrecedente.rows[0].totale)) / (parseInt(annoPrecedente.rows[0].totale) || 1) * 100;
    res.json({
      status: 'success',
      data: incremento.toFixed(1) // Restituisce l'incremento percentuale con 1 decimali
    });
  } catch (error) {
    console.error('Errore get studenti:', error);
    res.status(500).json({
      status: 'error',
      message: 'Errore nel recupero del numero degli studenti'
    });
  }
};

export const getTrendStudenti = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT EXTRACT(YEAR FROM datainserimento) AS anno, EXTRACT(MONTH FROM datainserimento) AS mese, COUNT(*) AS totale
      FROM STUDENTE
      GROUP BY EXTRACT(YEAR FROM datainserimento), EXTRACT(MONTH FROM datainserimento)
      ORDER BY anno, mese;
    `);

    res.json({
      status: 'success',
      data: result.rows
    });
  } catch (error) {
    console.error('Errore get studenti:', error);
    res.status(500).json({
      status: 'error',
      message: 'Errore nel recupero del andamento degli studenti'
    });
  }
};

export const getCompositionStudenti = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.descrizione AS progetto, p.colore, COUNT(*) AS studenti_corso
      FROM STUDENTE s
      JOIN PROGETTO p ON s.codiceprogetto = p.codice
      WHERE p.annoInizio >= EXTRACT(YEAR FROM CURRENT_DATE) 
        OR p.annoFine = EXTRACT(YEAR FROM CURRENT_DATE)
        OR EXTRACT(YEAR FROM CURRENT_DATE) BETWEEN p.annoInizio AND p.annoFine
      GROUP BY p.codice;
    `);
    res.json({
      status: 'success',
      data: result.rows
    });
  } catch (error) {
    console.error('Errore get studenti:', error);
    res.status(500).json({
      status: 'error',
      message: 'Errore nel recupero della composizione degli studenti'
    });
  }
};

export const getAnni = async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT 
            DISTINCT annoaccademico
        FROM STUDENTE
    `);

    res.json({
      status: 'success',
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Errore get anni:', error);
    res.status(500).json({
      status: 'error',
      message: 'Errore nel recupero degli anni'
    });
  }
};

export const createStudente = async (req, res) => {
  const { cf, nome, cognome, email, dataNascita, codiceCorso, annoAccademico } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Inserisce i dati anagrafici in UTENTE
    await client.query(
      `INSERT INTO UTENTE (CF, Nome, Cognome, DataNascita, Email, Password, Livello)
     VALUES ($1, $2, $3, TO_DATE($4, 'YYYY-MM-DD'), $5, $6, 1)`,
      [cf, nome, cognome, dataNascita, email, cf]
    );

    // Inserisce i dati di iscrizione in STUDENTE
    await client.query(
      `INSERT INTO STUDENTE (CF, CodiceProgetto, AnnoAccademico, DataInserimento)
             VALUES ($1, $2, $3, CURRENT_DATE)`,
      [cf, codiceCorso, annoAccademico]
    );

    await client.query('COMMIT');

    res.status(201).json({
      status: 'success',
      message: 'Studente creato con successo',
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Errore creazione studente:', error);

    if (error.code === '23505') {
      return res.status(400).json({
        status: 'error',
        message: 'Codice fiscale o email già esistente'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Errore nella creazione dello studente'
    });
  } finally {
    client.release();
  }
};

export const updateStudente = async (req, res) => {
  const { cf } = req.params;
  const { nome, cognome, email, dataNascita, codiceCorso, annoAccademico } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Inserisce i dati anagrafici in UTENTE
    await client.query(
      `UPDATE UTENTE
       SET Nome = $2, Cognome = $3, DataNascita = TO_DATE($4, 'YYYY-MM-DD'), Email = $5, Password = $6, Livello = 1
       WHERE CF = $1`,
      [cf, nome, cognome, dataNascita, email, cf]
    );

    // Inserisce i dati di iscrizione in STUDENTE
    await client.query(
      `UPDATE STUDENTE
       SET CodiceProgetto = $2, AnnoAccademico = $3
       WHERE CF = $1`,
      [cf, codiceCorso, annoAccademico]
    );

    await client.query('COMMIT');

    res.status(201).json({
      status: 'success',
      message: 'Studente aggiornato con successo',
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Errore aggiornamento studente:', error);

    if (error.code === '23505') {
      return res.status(400).json({
        status: 'error',
        message: 'Codice fiscale o email già esistente'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Errore nell\'aggiornamento dello studente'
    });
  } finally {
    client.release();
  }
};

export const deleteStudente = async (req, res) => {
  const { cf } = req.params;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Elimina lo studente da STUDENTE
    await client.query(
      `DELETE FROM STUDENTE WHERE CF = $1;`,
      [cf]
    );

    // Elimina lo studente da UTENTE
    await client.query(
      `DELETE FROM UTENTE WHERE CF = $1;`,
      [cf]
    );

    await client.query('COMMIT');

    res.json({
      status: 'success',
      message: 'Studente eliminato con successo'
    });
  } catch (error) {
    console.error('Errore eliminazione studente:', error);
    res.status(500).json({
      status: 'error',
      message: 'Errore nell\'eliminazione dello studente'
    });
  }
};

export const createStudentiFromCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: 'error', message: 'Nessun file caricato' });
  }

  const records = parse(req.file.buffer, {
    columns: true,          // prima riga = intestazioni
    skip_empty_lines: true,
    trim: true,
    delimiter: ','          // cambia in ',' se il tuo CSV usa la virgola
  });

  const client = await pool.connect();
  const risultati = { successo: 0, errori: [] };

  try {
    for (const row of records) {
      try {
        await client.query('BEGIN');

        await client.query(
          `INSERT INTO UTENTE (CF, Nome, Cognome, DataNascita, Email, Password, Livello)
           VALUES ($1, $2, $3, TO_DATE($4, 'YYYY-MM-DD'), $5, $6, 1)`,
          [row.cf, row.nome, row.cognome, row.dataNascita, row.email, row.cf]
        );

        await client.query(
          `INSERT INTO STUDENTE (CF, CodiceProgetto, AnnoAccademico, DataInserimento)
           VALUES ($1, $2, $3, CURRENT_DATE)`,
          [row.cf, row.codiceCorso, row.annoAccademico]
        );

        await client.query('COMMIT');
        risultati.successo++;

      } catch (err) {
        await client.query('ROLLBACK');
        risultati.errori.push({
          riga: `${row.nome} ${row.cognome}`,
          errore: err.code === '23505' ? `CF o email già esistente (${row.nome} ${row.cognome})` : err.message
        });
      }
    }

    res.json({
      status: 'success',
      message: `${risultati.successo} studenti inseriti, ${risultati.errori.length} errori`,
      data: risultati
    });

  } finally {
    client.release();
  }
};
