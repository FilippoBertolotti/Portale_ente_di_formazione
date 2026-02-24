import pool from '../config/database.js';

export const getComingLezioni = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT l.data, l.orainizio, l.orafine, m.descrizione AS modulo, p.colore AS colore_progetto, a.descrizione AS aula, u.cognome AS docente
            FROM lezione l
            JOIN modulo m ON l.idmodulo = m.id
            JOIN progetto p ON m.codiceprogetto = p.codice
            JOIN aula a ON l.idaula = a.id
            JOIN docente d ON m.cfdocente = d.cf
            JOIN utente u ON d.cf = u.cf
            WHERE 
                (l.data > CURRENT_DATE AND l.data <= CURRENT_DATE + INTERVAL '7 days')
                OR
                (l.data = CURRENT_DATE AND l.orafine >= CURRENT_TIME)
            ORDER BY l.data, l.orainizio;
            `);
        res.json({
            status: 'success',
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        console.error('Errore get lezioni:', error);
        res.status(500).json({
            status: 'error',
            message: 'Errore nel recupero delle prossime lezioni'
        });
    }
};
