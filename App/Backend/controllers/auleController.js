import pool from '../config/database.js';

// GET tutte le aule
export const getAllAule = async (req, res) => {
  try {
    const result = await pool.query(`
            SELECT 
              a.id,
              a.descrizione, 
              a.capienza, 
              a.numeropc, 
              a.piano, 
              a.attiva, 
              a.idsede,
              COALESCE(s.nome, 'Non Specificata') as nome_sede, 
              c.nome_citta, 
              COUNT(l.id) || ' Prenotazioni Oggi' as prenotazioni
            FROM aula a
            LEFT JOIN sede s ON a.idsede = s.id
            LEFT JOIN citta c ON s.capcitta = c.cap
            LEFT JOIN lezione l ON a.id = l.idaula AND l.data = CURRENT_DATE
            GROUP BY a.descrizione,a.capienza,a.numeropc,a.piano,a.attiva,s.nome,c.nome_citta,a.idsede,a.id
            ORDER BY a.descrizione; 
        `);
    res.json({
      status: 'success',
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Errore get aule:', error);
    res.status(500).json({
      status: 'error',
      message: 'Errore nel recupero delle aule'
    });
  }
};

// GET tutte le sedi
export const getAllSedi = async (req, res) => {
  try {
    const result = await pool.query(`
            SELECT id, nome, indirizzo, telefono, descrizione, capcitta, nome_citta
            FROM sede
            JOIN citta ON sede.capcitta = citta.cap
            ORDER BY nome;
        `);
    res.json({
      status: 'success',
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Errore get sedi:', error);
    res.status(500).json({
      status: 'error',
      message: 'Errore nel recupero delle sedi'
    });
  }
};

// GET numero aule
export const getCountAule = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT COUNT(*) as total_aule
      FROM AULA
      WHERE attiva = true;
    `);

    res.json({
      status: 'success',
      data: parseInt(result.rows[0].total_aule)
    });
  } catch (error) {
    console.error('Errore get aule:', error);
    res.status(500).json({
      status: 'error',
      message: 'Errore nel recupero del numero delle aule'
    });
  }
};

// GET numero sedi
export const getCountSedi = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT COUNT(*) as total_sedi
      FROM SEDE;
    `);

    res.json({
      status: 'success',
      data: parseInt(result.rows[0].total_sedi)
    });
  } catch (error) {
    console.error('Errore get sedi:', error);
    res.status(500).json({
      status: 'error',
      message: 'Errore nel recupero del numero delle sedi'
    });
  }
};

// GET piani aule
export const getPiani = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT piano
      FROM AULA
      ORDER BY piano;
    `);

    res.json({
      status: 'success',
      data: result.rows
    });
  } catch (error) {
    console.error('Errore get piani:', error);
    res.status(500).json({
      status: 'error',
      message: 'Errore nel recupero dei piani'
    });
  }
};

// GET statistiche aule con filtri opzionali
export const getAuleStats = async (req, res) => {
  const { sede, piano } = req.params;

  try {
    let query = `
      SELECT
        COUNT(a.id) as aule_totali,
        COALESCE(SUM(a.capienza), 0) as posti_totali,
        COUNT(CASE WHEN numeropc > 0 THEN 1 END) as aule_pc,
        COUNT(CASE WHEN attiva = false THEN 1 END) as non_disponibili
      FROM aula a
      WHERE 1=1
    `;

    const values = [];
    let paramIndex = 1;

    if (sede) {
      query += ` AND a.idsede = $${paramIndex}`;
      values.push(sede);
      paramIndex++;
    }

    if (piano) {
      query += ` AND a.piano = $${paramIndex}`;
      values.push(piano);
      paramIndex++;
    }

    const result = await pool.query(query, values);

    res.json({ status: 'success', data: result.rows[0] });
  } catch (error) {
    console.error('Errore get stats aule:', error);
    res.status(500).json({ status: 'error', message: 'Errore nel recupero delle statistiche delle aule' });
  }
};

export const getSedeById = async (req, res) => {
  const { sede } = req.params;
  try {
    const result = await pool.query(`
            SELECT  
              s.nome as nome_sede,
              s.indirizzo,
              s.telefono,
              s.descrizione,
              c.nome_citta
            FROM sede s
            JOIN citta c on s.capcitta = c.cap
            WHERE s.id = $1;
         `, [sede]);
    res.json({
      status: 'success',
      count: result.rows.length,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Errore get aule:', error);
    res.status(500).json({
      status: 'error',
      message: 'Errore nel recupero delle aule'
    });
  }
};

export const createAula = async (req, res) => {
  const { descrizione, capienza, numeropc, piano, attiva, idsede } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      `INSERT INTO AULA (descrizione, capienza, numeropc, piano, attiva, idsede)
     VALUES ($1, $2, $3, $4, $5, $6)`,
      [descrizione, capienza, numeropc, piano, attiva, idsede]
    );

    await client.query('COMMIT');

    res.status(201).json({
      status: 'success',
      message: 'Aula creata con successo',
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Errore creazione aula:', error);

    res.status(500).json({
      status: 'error',
      message: 'Errore nella creazione dell\'aula'
    });
  } finally {
    client.release();
  }
};

export const updateAula = async (req, res) => {
  const { id } = req.params;
  const { descrizione, capienza, numeropc, piano, attiva, idsede } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      `UPDATE AULA SET descrizione = $1, capienza = $2, numeropc = $3, piano = $4, attiva = $5, idsede = $6 WHERE id = $7`,
      [descrizione, capienza, numeropc, piano, attiva, idsede, id]
    );

    await client.query('COMMIT');

    res.status(201).json({
      status: 'success',
      message: 'Aula aggiornata con successo',
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Errore aggiornamento aula:', error);

    res.status(500).json({
      status: 'error',
      message: 'Errore nell\'aggiornamento dell\'aula'
    });
  } finally {
    client.release();
  }
};

export const deleteAula = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM AULA WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Aula non trovata'
      });
    }

    res.json({
      status: 'success',
      message: 'Aula eliminata con successo'
    });
  } catch (error) {
    console.error('Errore eliminazione aula:', error);
    res.status(500).json({
      status: 'error',
      message: 'Errore nell\'eliminazione dell\'aula'
    });
  }
};

export const createSede = async (req, res) => {
  const { nome, indirizzo, telefono, descrizione, cap, nome_citta } = req.body;

  const client = await pool.connect();
  try {
    let citta = await client.query('SELECT nome_citta FROM citta WHERE cap = $1', [cap]);

    if (citta.rows.length === 0) {
      await client.query(
        `INSERT INTO citta (cap, nome_citta) VALUES ($1, $2)`,
        [cap, nome_citta]
      );
    }

    await client.query('BEGIN');

    await client.query(
      `INSERT INTO SEDE (nome, indirizzo, telefono, descrizione, capcitta)
     VALUES ($1, $2, $3, $4, $5)`,
      [nome, indirizzo, telefono, descrizione, cap]
    );

    await client.query('COMMIT');

    res.status(201).json({
      status: 'success',
      message: 'Sede creata con successo',
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Errore creazione sede:', error);

    res.status(500).json({
      status: 'error',
      message: 'Errore nella creazione della sede'
    });
  } finally {
    client.release();
  }
};

export const updateSede = async (req, res) => {
  const { id } = req.params;
  const { nome, indirizzo, telefono, descrizione, cap, nome_citta } = req.body;

  const client = await pool.connect();
  try {
    let citta = await client.query('SELECT nome_citta FROM citta WHERE cap = $1', [cap]);

    if (citta.rows.length === 0) {
      await client.query(
        `INSERT INTO citta (cap, nome_citta) VALUES ($1, $2)`,
        [cap, nome_citta]
      );
    }

    await client.query('BEGIN');

    await client.query(
      `UPDATE SEDE SET nome = $1, indirizzo = $2, telefono = $3, descrizione = $4, capcitta = $5 WHERE id = $6`,
      [nome, indirizzo, telefono, descrizione, cap, id]
    );

    await client.query('COMMIT');

    res.status(201).json({
      status: 'success',
      message: 'Sede aggiornata con successo',
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Errore aggiornamento sede:', error);

    res.status(500).json({
      status: 'error',
      message: 'Errore nell\'aggiornamento della sede'
    });
  } finally {
    client.release();
  }
};

export const deleteSede = async (req, res) => {
  const { id } = req.params;

  const client = await pool.connect();
  try {
    await client.query(
      `UPDATE aula SET attiva = false WHERE idsede = $1;`,
      [id]
    );
    
    await client.query(
      `DELETE FROM sede WHERE id = $1;`,
      [id]
    );

    res.status(201).json({
      status: 'success',
      message: 'Sede eliminata con successo',
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Errore eliminazione sede:', error);

    res.status(500).json({
      status: 'error',
      message: 'Errore nella eliminazione della sede'
    });
  } finally {
    client.release();
  }
};

