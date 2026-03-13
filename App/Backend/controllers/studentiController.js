import pool from '../config/database.js';

// GET tutti gli studenti
export const getAllStudenti = async (req, res) => {
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
              TO_CHAR(u.datanascita, 'DD/MM/YYYY') AS "dataNascita",
              u.email,
              p.descrizione || ' ' || s.annoaccademico AS "corso",
              s.codiceprogetto,
              s.annoaccademico
            FROM utente u
            JOIN studente s ON u.cf = s.cf
            LEFT JOIN progetto p ON s.codiceprogetto = p.codice
            WHERE (u.nome ILIKE $1 OR u.cognome ILIKE $1)
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
      SELECT p.descrizione AS progetto, COUNT(*) AS studenti_corso
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