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
      FROM AULA;
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