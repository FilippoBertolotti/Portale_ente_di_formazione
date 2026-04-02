import pool from '../config/database.js';

// GET tutte le aule
export const getAllAule = async (req, res) => {
  try {
    const result = await pool.query(`
            SELECT 
              a.descrizione, 
              a.capienza, 
              a.numeropc, 
              a.piano, 
              a.attiva, 
              s.nome as nome_sede, 
              c.nome_citta, 
              COUNT(l.id) || ' Prenotazioni Oggi' as prenotazioni
            FROM aula a
            JOIN sede s ON a.idsede = s.id
            JOIN citta c on s.capcitta = c.cap
            LEFT JOIN lezione l ON a.id = l.idaula AND l.data = CURRENT_DATE
            GROUP BY a.descrizione,a.capienza,a.numeropc,a.piano,a.attiva,s.nome,c.nome_citta
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
            SELECT nome
            FROM sede
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
            LEFT JOIN sede s ON a.idsede = s.id
            WHERE 1=1
        `;

    const values = [];
    let paramIndex = 1;

    if (sede) {
      query += ` AND s.nome = $${paramIndex}`;
      values.push(sede);
      paramIndex++;
    }

    if (piano) {
      query += ` AND a.piano = $${paramIndex}`;
      values.push(piano);
      paramIndex++;
    }

    const result = await pool.query(query, values);

    res.json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Errore get stats aule:', error);
    res.status(500).json({
      status: 'error',
      message: 'Errore nel recupero delle statistiche delle aule'
    });
  }
};

export const getSedeByNome = async (req, res) => {
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
            WHERE s.nome = $1;
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