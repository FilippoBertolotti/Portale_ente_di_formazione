import pool from '../config/database.js';

// GET tutti i progetti
export const getAllProgetti = async (req, res) => {
  try {
    const result = await pool.query(`
      WITH progetto_aggregato AS (
        SELECT 
            p.Codice,
            p.RER,
            p.Descrizione,
            p.AnnoInizio,
            p.AnnoFine,
            p.Colore,
            p.CFCoordinatore,
            -- Subquery per le somme
            (SELECT SUM(oreaula + oreproject + orestage + oreelearn) FROM MODULO WHERE CodiceProgetto = p.Codice) as ore_totali,
            (SELECT SUM(oreaula) FROM MODULO WHERE CodiceProgetto = p.Codice) as ore_aula,
            (SELECT SUM(oreproject) FROM MODULO WHERE CodiceProgetto = p.Codice) as ore_project,
            (SELECT SUM(orestage) FROM MODULO WHERE CodiceProgetto = p.Codice) as ore_stage,
            (SELECT SUM(oreelearn) FROM MODULO WHERE CodiceProgetto = p.Codice) as ore_elarn
        FROM PROGETTO p
        WHERE p.annofine >= EXTRACT(YEAR FROM CURRENT_DATE) 
          AND p.annoinizio <= EXTRACT(YEAR FROM CURRENT_DATE)
    ),
    count_studenti AS (
        SELECT CodiceProgetto, COUNT(DISTINCT CF) as numero_studenti
        FROM STUDENTE
        GROUP BY CodiceProgetto
    ),
    count_docenti AS (
        SELECT m.CodiceProgetto, COUNT(DISTINCT c.CFDocente) as numero_docenti
        FROM MODULO m
        JOIN CATTEDRA c ON c.IDModulo = m.ID
        GROUP BY m.CodiceProgetto
    ),
    count_moduli AS (
        SELECT CodiceProgetto, COUNT(*) as numero_moduli
        FROM MODULO
        GROUP BY CodiceProgetto
    ),
    count_lezioni AS (
        SELECT m.CodiceProgetto, COUNT(l.ID) as numero_lezioni
        FROM MODULO m
        JOIN LEZIONE l ON l.IDModulo = m.ID
        GROUP BY m.CodiceProgetto
    )
    SELECT 
        pa.*,
        d.Telefono as coordinatore_telefono,
        u.Nome || ' ' || u.Cognome as "coordinatoreNomeCompleto",
        COALESCE(cs.numero_studenti, 0) as numero_studenti,
        COALESCE(cd.numero_docenti, 0) as numero_docenti,
        COALESCE(cm.numero_moduli, 0) as numero_moduli,
        COALESCE(cl.numero_lezioni, 0) as numero_lezioni
    FROM progetto_aggregato pa
    LEFT JOIN DOCENTE d ON pa.CFCoordinatore = d.CF
    LEFT JOIN UTENTE u ON d.CF = u.CF
    LEFT JOIN count_studenti cs ON cs.CodiceProgetto = pa.Codice
    LEFT JOIN count_docenti cd ON cd.CodiceProgetto = pa.Codice
    LEFT JOIN count_moduli cm ON cm.CodiceProgetto = pa.Codice
    LEFT JOIN count_lezioni cl ON cl.CodiceProgetto = pa.Codice
    ORDER BY pa.AnnoInizio DESC, pa.Codice;
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

export const getProgettiByCodice = async (req, res) => {
  const { codice} = req.params;
  try {
    const result = await pool.query(`
      WITH progetto_aggregato AS (
          SELECT 
              p.Codice,
              p.RER,
              p.Descrizione,
              p.AnnoInizio,
              p.AnnoFine,
              p.Colore,
              p.CFCoordinatore,
              -- Subquery per le somme (potrebbero essere calcolate qui dentro)
              (SELECT SUM(oreaula + oreproject + orestage + oreelearn) FROM MODULO WHERE CodiceProgetto = p.Codice) as ore_totali,
              (SELECT SUM(oreaula) FROM MODULO WHERE CodiceProgetto = p.Codice) as ore_aula,
              (SELECT SUM(oreproject) FROM MODULO WHERE CodiceProgetto = p.Codice) as ore_project,
              (SELECT SUM(orestage) FROM MODULO WHERE CodiceProgetto = p.Codice) as ore_stage,
              (SELECT SUM(oreelearn) FROM MODULO WHERE CodiceProgetto = p.Codice) as ore_elarn
          FROM PROGETTO p
          WHERE p.annofine >= EXTRACT(YEAR FROM CURRENT_DATE) 
            AND p.annoinizio <= EXTRACT(YEAR FROM CURRENT_DATE) AND p.Codice = $1
      ),
      count_studenti AS (
          SELECT CodiceProgetto, COUNT(DISTINCT CF) as numero_studenti
          FROM STUDENTE
          GROUP BY CodiceProgetto
      ),
      count_docenti AS (
          SELECT m.CodiceProgetto, COUNT(DISTINCT c.CFDocente) as numero_docenti
          FROM MODULO m
          JOIN CATTEDRA c ON c.IDModulo = m.ID
          GROUP BY m.CodiceProgetto
      ),
      count_moduli AS (
          SELECT CodiceProgetto, COUNT(*) as numero_moduli
          FROM MODULO
          GROUP BY CodiceProgetto
      ),
      count_lezioni AS (
          SELECT m.CodiceProgetto, COUNT(l.ID) as numero_lezioni
          FROM MODULO m
          JOIN LEZIONE l ON l.IDModulo = m.ID
          GROUP BY m.CodiceProgetto
      )
      SELECT 
          pa.*,
          d.Telefono as coordinatore_telefono,
          u.Nome || ' ' || u.Cognome as "coordinatoreNomeCompleto",
          COALESCE(cs.numero_studenti, 0) as numero_studenti,
          COALESCE(cd.numero_docenti, 0) as numero_docenti,
          COALESCE(cm.numero_moduli, 0) as numero_moduli,
          COALESCE(cl.numero_lezioni, 0) as numero_lezioni
      FROM progetto_aggregato pa
      LEFT JOIN DOCENTE d ON pa.CFCoordinatore = d.CF
      LEFT JOIN UTENTE u ON d.CF = u.CF
      LEFT JOIN count_studenti cs ON cs.CodiceProgetto = pa.Codice
      LEFT JOIN count_docenti cd ON cd.CodiceProgetto = pa.Codice
      LEFT JOIN count_moduli cm ON cm.CodiceProgetto = pa.Codice
      LEFT JOIN count_lezioni cl ON cl.CodiceProgetto = pa.Codice
      ORDER BY pa.AnnoInizio DESC, pa.Codice;
    `, [codice]);

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

export const getProgettiByAnno = async (req, res) => {
  const { anno } = req.params;
  try {
    const result = await pool.query(`
      WITH progetto_aggregato AS (
          SELECT 
              p.Codice,
              p.RER,
              p.Descrizione,
              p.AnnoInizio,
              p.AnnoFine,
              p.Colore,
              p.CFCoordinatore,
              -- Somme filtrate per anno
              (SELECT SUM(oreaula + oreproject + orestage + oreelearn) FROM MODULO WHERE CodiceProgetto = p.Codice AND anno = $1) as ore_totali,
              (SELECT SUM(oreaula)    FROM MODULO WHERE CodiceProgetto = p.Codice AND anno = $1) as ore_aula,
              (SELECT SUM(oreproject) FROM MODULO WHERE CodiceProgetto = p.Codice AND anno = $1) as ore_project,
              (SELECT SUM(orestage)   FROM MODULO WHERE CodiceProgetto = p.Codice AND anno = $1) as ore_stage,
              (SELECT SUM(oreelearn)  FROM MODULO WHERE CodiceProgetto = p.Codice AND anno = $1) as ore_elarn
          FROM PROGETTO p
          WHERE p.annofine >= EXTRACT(YEAR FROM CURRENT_DATE) 
            AND p.annoinizio <= EXTRACT(YEAR FROM CURRENT_DATE)
      ),
      count_studenti AS (
          SELECT CodiceProgetto, COUNT(DISTINCT CF) as numero_studenti
          FROM STUDENTE
          GROUP BY CodiceProgetto
      ),
      count_docenti AS (
          SELECT m.CodiceProgetto, COUNT(DISTINCT c.CFDocente) as numero_docenti
          FROM MODULO m
          JOIN CATTEDRA c ON c.IDModulo = m.ID
          WHERE m.anno = $1
          GROUP BY m.CodiceProgetto
      ),
      count_moduli AS (
          SELECT CodiceProgetto, COUNT(*) as numero_moduli
          FROM MODULO
          WHERE anno = $1
          GROUP BY CodiceProgetto
      ),
      count_lezioni AS (
          SELECT m.CodiceProgetto, COUNT(l.ID) as numero_lezioni
          FROM MODULO m
          JOIN LEZIONE l ON l.IDModulo = m.ID
          WHERE m.anno = $1
          GROUP BY m.CodiceProgetto
      )
      SELECT 
          pa.*,
          d.Telefono as coordinatore_telefono,
          u.Nome || ' ' || u.Cognome as "coordinatoreNomeCompleto",
          COALESCE(cs.numero_studenti, 0) as numero_studenti,
          COALESCE(cd.numero_docenti, 0) as numero_docenti,
          COALESCE(cm.numero_moduli, 0) as numero_moduli,
          COALESCE(cl.numero_lezioni, 0) as numero_lezioni
      FROM progetto_aggregato pa
      LEFT JOIN DOCENTE d ON pa.CFCoordinatore = d.CF
      LEFT JOIN UTENTE u ON d.CF = u.CF
      LEFT JOIN count_studenti cs ON cs.CodiceProgetto = pa.Codice
      LEFT JOIN count_docenti cd ON cd.CodiceProgetto = pa.Codice
      LEFT JOIN count_moduli cm ON cm.CodiceProgetto = pa.Codice
      LEFT JOIN count_lezioni cl ON cl.CodiceProgetto = pa.Codice
      ORDER BY pa.AnnoInizio DESC, pa.Codice;
    `, [anno]);

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
  const { codice, rer, descrizione, annoInizio, annoFine, cfCoordinatore, colore } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO PROGETTO (Codice, RER, Descrizione, AnnoInizio, AnnoFine, CFCoordinatore, Colore)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       `,
      [codice, rer, descrizione, annoInizio, annoFine, cfCoordinatore, colore]
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
  const { rer, descrizione, annoInizio, annoFine, cfCoordinatore, colore } = req.body;

  try {
    const result = await pool.query(
      `UPDATE PROGETTO 
       SET RER = $1, Descrizione = $2, AnnoInizio = $3, AnnoFine = $4, CFCoordinatore = $5, Colore = $6
       WHERE Codice = $7
       `,
      [rer, descrizione, annoInizio, annoFine, cfCoordinatore, colore, codice]
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