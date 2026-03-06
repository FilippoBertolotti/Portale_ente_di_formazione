import pool from '../config/database.js';

// GET tutti i moduli
export const getAllModuli = async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT 
            m.*,
            STRING_AGG(DISTINCT 'Prof. ' || u.Cognome, ', ') as lista_docenti
        FROM MODULO m
        JOIN CATTEDRA c ON c.IDModulo = m.ID
        JOIN DOCENTE d ON c.CFDocente = d.CF
        JOIN UTENTE u ON d.CF = u.CF
        GROUP BY m.ID
        ORDER BY m.Anno, m.ID
    `);

    res.json({
      status: 'success',
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Errore get moduli:', error);
    res.status(500).json({
      status: 'error',
      message: 'Errore nel recupero dei moduli'
    });
  }
};


export const getByCodiceProgetto = async (req, res) => {
  const { codice } = req.params;

  try {
    const result = await pool.query(`
        SELECT 
            m.*,
            STRING_AGG(DISTINCT 'Prof. ' || u.Cognome, ', ') as lista_docenti
        FROM MODULO m
        JOIN CATTEDRA c ON c.IDModulo = m.ID
        JOIN DOCENTE d ON c.CFDocente = d.CF
        JOIN UTENTE u ON d.CF = u.CF
        WHERE m.CodiceProgetto = $1
        GROUP BY m.ID
        ORDER BY m.Anno, m.ID
    `, [codice]);

    res.json({
      status: 'success',
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Errore get moduli:', error);
    res.status(500).json({
      status: 'error',
      message: 'Errore nel recupero dei moduli'
    });
  }
};

export const getByAnno = async (req, res) => {
  const { anno } = req.params;

  try {
    const result = await pool.query(`
        SELECT 
            m.*,
            STRING_AGG(DISTINCT 'Prof. ' || u.Cognome, ', ') as lista_docenti
        FROM MODULO m
        JOIN CATTEDRA c ON c.IDModulo = m.ID
        JOIN DOCENTE d ON c.CFDocente = d.CF
        JOIN UTENTE u ON d.CF = u.CF
        WHERE m.anno = $1
        GROUP BY m.ID
        ORDER BY m.Anno, m.ID
    `, [anno]);

    res.json({
      status: 'success',
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Errore get moduli:', error);
    res.status(500).json({
      status: 'error',
      message: 'Errore nel recupero dei moduli'
    });
  }
};


export const getAnni = async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT 
            DISTINCT m.anno
        FROM MODULO m
    `);

    res.json({
      status: 'success',
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Errore get moduli:', error);
    res.status(500).json({
      status: 'error',
      message: 'Errore nel recupero dei moduli'
    });
  }
};


// POST crea nuovo modulo
export const createModulo = async (req, res) => {
  const { codice, rer, descrizione, annoInizio, annoFine, cfCoordinatore } = req.body;

  try {
    //SISTEMARE QUERY PER CREARE MODULO
    const result = await pool.query(
      `INSERT INTO MODULO (Codice, RER, Descrizione, AnnoInizio, AnnoFine, CFCoordinatore)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [codice, rer, descrizione, annoInizio, annoFine, cfCoordinatore]
    );

    res.status(201).json({
      status: 'success',
      message: 'Modulo creato con successo',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Errore creazione modulo:', error);

    if (error.code === '23505') {
      return res.status(400).json({
        status: 'error',
        message: 'Codice modulo già esistente'
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
      message: 'Errore nella creazione del modulo'
    });
  }
};

// PUT aggiorna modulo
export const updateModulo = async (req, res) => {
  const { codice } = req.params;
  const { rer, descrizione, annoInizio, annoFine, cfCoordinatore } = req.body;

  try {
    //SISTEMARE QUERY PER AGGIORNARE MODULO
    const result = await pool.query(
      `UPDATE MODULO 
       SET RER = $1, Descrizione = $2, AnnoInizio = $3, AnnoFine = $4, CFCoordinatore = $5
       WHERE Codice = $6
       RETURNING *`,
      [rer, descrizione, annoInizio, annoFine, cfCoordinatore, codice]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Modulo non trovato'
      });
    }

    res.json({
      status: 'success',
      message: 'Modulo aggiornato con successo',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Errore aggiornamento modulo:', error);
    res.status(500).json({
      status: 'error',
      message: 'Errore nell\'aggiornamento del modulo'
    });
  }
};

// DELETE elimina modulo
export const deleteModulo = async (req, res) => {
  const { codice } = req.params;

  try {
    //SISTEMARE QUERY PER ELIMINARE MODULO
    const result = await pool.query(
      'DELETE FROM MODULO WHERE Codice = $1 RETURNING *',
      [codice]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Modulo non trovato'
      });
    }

    res.json({
      status: 'success',
      message: 'Modulo eliminato con successo'
    });
  } catch (error) {
    console.error('Errore eliminazione modulo:', error);
    res.status(500).json({
      status: 'error',
      message: 'Errore nell\'eliminazione del modulo'
    });
  }
};