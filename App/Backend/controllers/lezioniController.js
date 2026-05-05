import pool from '../config/database.js';

export const getComingLezioni = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT l.id, l.data, l.orainizio, l.orafine, m.descrizione AS modulo, p.colore AS colore_progetto,a.id as idaula, a.descrizione AS aula, u.cognome AS docente, u.cf as cfdocente
            FROM lezione l
            JOIN modulo m ON l.idmodulo = m.id
            JOIN progetto p ON m.codiceprogetto = p.codice
            JOIN aula a ON l.idaula = a.id
            JOIN docente d ON l.cfdocente = d.cf
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

export const getAllLezioni = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT l.id, l.data, l.orainizio, l.orafine, m.descrizione AS modulo, p.colore AS colore_progetto,a.id as idaula, a.descrizione AS aula, u.cognome AS docente, u.cf as cfdocente
            FROM lezione l
            JOIN modulo m ON l.idmodulo = m.id
            JOIN progetto p ON m.codiceprogetto = p.codice
            JOIN aula a ON l.idaula = a.id
            JOIN docente d ON l.cfdocente = d.cf
            JOIN utente u ON d.cf = u.cf
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

// POST crea nuova lezione
export const createLezione = async (req, res) => {
    const { data, orainizio, orafine, idmodulo, idaula, cfdocente } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO LEZIONE (Data, OraInizio, OraFine, IdModulo, IdAula, CFDocente)
       VALUES ($1, $2, $3, $4, $5, $6)
       `,
            [data, orainizio, orafine, idmodulo, idaula, cfdocente]
        );

        res.status(201).json({
            status: 'success',
            message: 'Lezione creata con successo',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Errore creazione lezione:', error);

        res.status(500).json({
            status: 'error',
            message: 'Errore nella creazione della lezione'
        });
    }
};

// PUT aggiorna lezione
export const updateLezione = async (req, res) => {
    const { id } = req.params;
    const { data, orainizio, orafine, idmodulo, idaula, cfdocente } = req.body;

    try {
        const result = await pool.query(
            `UPDATE LEZIONE
       SET Data = $1, OraInizio = $2, OraFine = $3, IdModulo = $4, IdAula = $5, CFDocente = $6
       WHERE Id = $7`,
            [data, orainizio, orafine, idmodulo, idaula, cfdocente, id]
        );

        res.json({
            status: 'success',
            message: 'Lezione aggiornata con successo',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Errore aggiornamento lezione:', error);

        res.status(500).json({
            status: 'error',
            message: 'Errore nell\'aggiornamento della lezione'
        });
    }
};

// DELETE elimina lezione
export const deleteLezione = async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query(`DELETE FROM LEZIONE WHERE Id = $1`, [id]);

        res.json({
            status: 'success',
            message: 'Lezione eliminata con successo'
        });
    } catch (error) {
        console.error('Errore eliminazione lezione:', error);

        res.status(500).json({
            status: 'error',
            message: 'Errore nell\'eliminazione della lezione'
        });
    }
};