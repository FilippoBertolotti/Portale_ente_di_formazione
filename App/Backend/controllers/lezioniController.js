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

export const getAllNote = async (req, res) => {
    const cfUtente = req.user.cf; // Ottieni il CF dell'utente autenticato
    try {
        const result = await pool.query(`
            SELECT n.id, n.data, n.titolo, n.descrizione
            FROM nota n
            JOIN utente u ON n.cfUtente = u.cf
            WHERE n.cfUtente = $1
            ORDER BY n.data;
            `, [cfUtente]);
        res.json({
            status: 'success',
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        console.error('Errore get note:', error);
        res.status(500).json({
            status: 'error',
            message: 'Errore nel recupero delle note'
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

export const createNota = async (req, res) => {
    const cfUtente = req.user.cf; // Ottieni il CF dell'utente autenticato
    const { titolo, data, descrizione} = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO NOTA (Titolo, Data, Descrizione, CFUtente)
            VALUES ($1, $2, $3, $4)`,
        [titolo, data, descrizione, cfUtente]);

        res.status(201).json({
            status: 'success',
            message: 'Nota creata con successo',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Errore creazione nota:', error);

        res.status(500).json({
            status: 'error',
            message: 'Errore nella creazione della nota'
        });
    }
};

export const updateNota = async (req, res) => {
    const { id } = req.params;
    const { titolo, data, descrizione } = req.body;

    try {
        const result = await pool.query(
            `UPDATE NOTA
       SET Titolo = $1, Data = $2, Descrizione = $3
       WHERE Id = $4`,
            [titolo, data, descrizione, id]
        );

        res.json({
            status: 'success',
            message: 'Nota aggiornata con successo',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Errore aggiornamento nota:', error);

        res.status(500).json({
            status: 'error',
            message: 'Errore nell\'aggiornamento della nota'
        });
    }
};

// DELETE elimina nota
export const deleteNota = async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query(`DELETE FROM NOTA WHERE Id = $1`, [id]);

        res.json({
            status: 'success',
            message: 'Nota eliminata con successo'
        });
    } catch (error) {
        console.error('Errore eliminazione nota:', error);

        res.status(500).json({
            status: 'error',
            message: 'Errore nell\'eliminazione della nota'
        });
    }
};