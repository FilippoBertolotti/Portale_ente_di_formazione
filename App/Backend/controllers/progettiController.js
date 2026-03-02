import pool from '../config/database.js';

// GET tutti i progetti
export const getAllProgetti = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        d.Telefono as coordinatore_telefono,
        u.Nome as coordinatore_nome,
        u.Cognome as coordinatore_cognome,
        m.descrizione as modulo,
        COUNT(DISTINCT s.CF) as numero_studenti,
        COUNT(DISTINCT d2.CF) as numero_docenti,
        COUNT(DISTINCT m.ID) as numero_moduli,
        SUM(m.oreaula + m.oreproject + m.orestage) as ore_totali,
        SUM(m.oreaula) as ore_aula,
        SUM(m.oreproject) as ore_project,
        SUM(m.orestage) as ore_stage,
        SUM(m.oreelearn) as ore_elarn,
        COUNT(DISTINCT l.ID) as numero_lezioni,
        STRING_AGG(DISTINCT 'Prof. ' || u2.Cognome, ', ' ORDER BY 'Prof. ' || u2.Cognome) as lista_docenti
      FROM PROGETTO p
      LEFT JOIN DOCENTE d ON p.CFCoordinatore = d.CF
      LEFT JOIN UTENTE u ON d.CF = u.CF
      LEFT JOIN STUDENTE s ON s.CodiceProgetto = p.Codice
      LEFT JOIN MODULO m ON m.CodiceProgetto = p.Codice
      JOIN CATTEDRA c ON c.IDModulo = m.ID
      JOIN DOCENTE d2 ON C.CFDocente = d2.CF
      JOIN UTENTE u2 ON d2.CF = u2.CF
      LEFT JOIN LEZIONE l ON l.IDModulo = m.ID
      WHERE p.annofine >= EXTRACT(YEAR FROM CURRENT_DATE) AND p.annoinizio <= EXTRACT(YEAR FROM CURRENT_DATE)
      GROUP BY p.Codice, d.Telefono, u.Nome, u.Cognome, m.descrizione
      ORDER BY p.AnnoInizio DESC, p.Codice
    `);

    res.json({
      status: 'success',
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Errore get progetti:', error);
    res.status(500).json({
      status: 'error',
      message: 'Errore nel recupero dei progetti'
    });
  }
};

// GET numero progetti attivi
export const getCountProgetti = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT COUNT(*) as total_progetti
      FROM PROGETTO
      WHERE annoInizio >= EXTRACT(YEAR FROM CURRENT_DATE) 
        OR annoFine = EXTRACT(YEAR FROM CURRENT_DATE)
        OR EXTRACT(YEAR FROM CURRENT_DATE) BETWEEN annoInizio AND annoFine;
    `);

    res.json({
      status: 'success',
      data: parseInt(result.rows[0].total_progetti)
    });
  } catch (error) {
    console.error('Errore get progetti:', error);
    res.status(500).json({
      status: 'error',
      message: 'Errore nel recupero del numero dei progetti'
    });
  }
};

// GET progetto per codice
export const getProgettoById = async (req, res) => {
  const { codice } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        p.*,
        u.Nome as coordinatore_nome,
        u.Cognome as coordinatore_cognome,
        u.Email as coordinatore_email,
        d.Telefono as coordinatore_telefono
      FROM PROGETTO p
      LEFT JOIN DOCENTE d ON p.CFCoordinatore = d.CF
      LEFT JOIN UTENTE u ON d.CF = u.CF
      WHERE p.Codice = $1`,
      [codice]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Progetto non trovato'
      });
    }

    // Prendi anche i moduli del progetto
    const moduliResult = await pool.query(
      `SELECT 
        m.*,
        u.Nome as docente_nome,
        u.Cognome as docente_cognome
      FROM MODULO m
      LEFT JOIN DOCENTE d ON m.CFDocente = d.CF
      LEFT JOIN UTENTE u ON d.CF = u.CF
      WHERE m.CodiceProgetto = $1
      ORDER BY m.Anno, m.ID`,
      [codice]
    );

    res.json({
      status: 'success',
      data: {
        ...result.rows[0],
        moduli: moduliResult.rows
      }
    });
  } catch (error) {
    console.error('Errore get progetto:', error);
    res.status(500).json({
      status: 'error',
      message: 'Errore nel recupero del progetto'
    });
  }
};

export const getCompletionProgetti = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.descrizione, 
        SUM(m.oreaula + m.oreproject + m.orestage) AS ore_totali,
        COALESCE(SUM(EXTRACT(EPOCH FROM (l.orafine - l.orainizio)) / 3600), 0) AS ore_svolte,
        p.colore
      FROM progetto p
      LEFT JOIN modulo m ON m.codiceprogetto = p.codice
      LEFT JOIN lezione l ON l.idmodulo = m.id
      WHERE p.annofine >= EXTRACT(YEAR FROM CURRENT_DATE) AND p.annoinizio <= EXTRACT(YEAR FROM CURRENT_DATE)
      GROUP BY p.codice, p.descrizione;`);
    res.json({
      status: 'success',
      data: result.rows
    });
  } catch (error) {
    console.error('Errore get progetti:', error);
    res.status(500).json({
      status: 'error',
      message: 'Errore nel recupero del completamento dei progetti'
    });
  }
};


// POST crea nuovo progetto
export const createProgetto = async (req, res) => {
  const { codice, rer, descrizione, annoInizio, annoFine, cfCoordinatore } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO PROGETTO (Codice, RER, Descrizione, AnnoInizio, AnnoFine, CFCoordinatore)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [codice, rer, descrizione, annoInizio, annoFine, cfCoordinatore]
    );

    res.status(201).json({
      status: 'success',
      message: 'Progetto creato con successo',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Errore creazione progetto:', error);

    if (error.code === '23505') {
      return res.status(400).json({
        status: 'error',
        message: 'Codice progetto già esistente'
      });
    }

    if (error.code === '23514') {
      return res.status(400).json({
        status: 'error',
        message: 'Anno inizio deve essere minore di anno fine'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Errore nella creazione del progetto'
    });
  }
};

// PUT aggiorna progetto
export const updateProgetto = async (req, res) => {
  const { codice } = req.params;
  const { rer, descrizione, annoInizio, annoFine, cfCoordinatore } = req.body;

  try {
    const result = await pool.query(
      `UPDATE PROGETTO 
       SET RER = $1, Descrizione = $2, AnnoInizio = $3, AnnoFine = $4, CFCoordinatore = $5
       WHERE Codice = $6
       RETURNING *`,
      [rer, descrizione, annoInizio, annoFine, cfCoordinatore, codice]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Progetto non trovato'
      });
    }

    res.json({
      status: 'success',
      message: 'Progetto aggiornato con successo',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Errore aggiornamento progetto:', error);
    res.status(500).json({
      status: 'error',
      message: 'Errore nell\'aggiornamento del progetto'
    });
  }
};

// DELETE elimina progetto
export const deleteProgetto = async (req, res) => {
  const { codice } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM PROGETTO WHERE Codice = $1 RETURNING *',
      [codice]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Progetto non trovato'
      });
    }

    res.json({
      status: 'success',
      message: 'Progetto eliminato con successo'
    });
  } catch (error) {
    console.error('Errore eliminazione progetto:', error);
    res.status(500).json({
      status: 'error',
      message: 'Errore nell\'eliminazione del progetto'
    });
  }
};