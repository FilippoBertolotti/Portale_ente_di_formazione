import pool from '../config/database.js';

// GET tutti i aule
export const getAllAule = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT a.descrizione, a.capienza, a.numeroPc, a.piano, a.attiva, s.nome as nome_sede
            FROM aula a
            JOIN sede s ON a.id_sede = s.id;
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

// GET tutti i sedi
// export const getAllSedi = async (req, res) => {
//     try {
//         const result = await pool.query(`
//             SELECT u.*, p.descrizione
//             FROM utente u
//             JOIN docente d ON u.cf = d.cf
//             LEFT JOIN progetto p ON d.codiceprogetto = p.codice
//             ORDER BY u.cognome, u.nome;
//         `);
//         res.json({
//             status: 'success',
//             count: result.rows.length,
//             data: result.rows
//         });
//     } catch (error) {
//         console.error('Errore get docenti:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Errore nel recupero dei docenti'
//         });
//     }
// };

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
    console.error('Errore get docenti:', error);
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
    console.error('Errore get docenti:', error);
    res.status(500).json({
      status: 'error',
      message: 'Errore nel recupero del numero delle sedi'
    });
  }
};