import pool from '../config/database.js';

// GET tutti i moduli
export const getAllModuli = async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT 
            m.*,
            STRING_AGG(DISTINCT 'Prof. ' || u.Cognome, ', ') as lista_docenti,
            STRING_AGG(DISTINCT c.CFDocente, ', ') as cfdocente
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
            STRING_AGG(DISTINCT 'Prof. ' || u.Cognome, ', ') as lista_docenti,
            STRING_AGG(DISTINCT c.CFDocente, ', ') as cfdocente
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
            STRING_AGG(DISTINCT 'Prof. ' || u.Cognome, ', ') as lista_docenti,
            STRING_AGG(DISTINCT c.CFDocente, ', ') as cfdocente
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
  const { anno, oreAula, oreProject, oreStage, oreElearn, descrizione, codiceProgetto, cfDocente } = req.body;

  try {
    await pool.query('BEGIN');

    // Inserisce il modulo e recupera l'ID generato
    const moduloResult = await pool.query(
      `INSERT INTO MODULO (Anno, OreAula, OreProject, OreStage, OreElearn, Descrizione, CodiceProgetto)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [anno, oreAula, oreProject, oreStage, oreElearn, descrizione, codiceProgetto]
    );

    const idModulo = moduloResult.rows[0].id;

    // Inserisce il docente in CATTEDRA
    await pool.query(
      `INSERT INTO CATTEDRA (IDModulo, CFDocente) VALUES ($1, $2)`,
      [idModulo, cfDocente]
    );

    await pool.query('COMMIT');

    res.status(201).json({
      status: 'success',
      message: 'Modulo creato con successo'
    });
  } catch (error) {
    console.error('Errore creazione modulo:', error);

    if (error.code === '23505') {
      return res.status(400).json({
        status: 'error',
        message: 'Codice modulo già esistente'
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
  const { id } = req.params;
  const { anno, oreAula, oreProject, oreStage, oreElearn, descrizione, codiceProgetto, cfDocente } = req.body;

  try {
    //SISTEMARE QUERY PER AGGIORNARE MODULO
    const result = await pool.query(
      `UPDATE MODULO 
       SET Anno = $1, OreAula = $2, OreProject = $3, OreStage = $4, OreElearn = $5, Descrizione = $6, CodiceProgetto = $7
       WHERE id = $8`,
      [anno, oreAula, oreProject, oreStage, oreElearn, descrizione, codiceProgetto, id]
    );
    const result2 = await pool.query(
      `UPDATE CATTEDRA
         SET CFDocente = $1
         WHERE IDModulo = $2`,
      [cfDocente.split(',')[0], id]
    );

    res.json({
      status: 'success',
      message: 'Modulo aggiornato con successo'
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
  const { id } = req.params;

  try {
    //SISTEMARE QUERY PER ELIMINARE MODULO
    const result = await pool.query(
      'DELETE FROM MODULO WHERE id = $1',
      [id]
    );

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