import pool from '../config/database.js';

const controlloDocente = async (params, id) => {
    let result;
    if(id) {
        result = await pool.query(`
        SELECT COUNT(*) AS count
        FROM lezione l
        JOIN modulo m ON l.idmodulo = m.id
        JOIN cattedra c ON m.id = c.idmodulo
        JOIN docente d ON c.cfdocente = d.cf
        WHERE l.id <> $5
        AND l.data = $2 
        AND (l.orainizio < $4 AND l.orafine > $3)
        AND c.cfdocente IN (
            -- Recupera la lista di TUTTI i CF dei docenti associati a questo modulo
            SELECT c2.cfdocente 
            FROM cattedra c2
            WHERE c2.idmodulo = $1
        );
    `, [params.idmodulo, params.data, params.orainizio, params.orafine, id]);
    } else {
        result = await pool.query(`
            SELECT COUNT(*) AS count
            FROM lezione l
            JOIN modulo m ON l.idmodulo = m.id
            JOIN cattedra c ON m.id = c.idmodulo
            JOIN docente d ON c.cfdocente = d.cf
            WHERE l.data = $2 
            AND (l.orainizio < $4 AND l.orafine > $3)
            AND c.cfdocente IN (
                -- Recupera la lista di TUTTI i CF dei docenti associati a questo modulo
                SELECT c2.cfdocente 
                FROM cattedra c2
                WHERE c2.idmodulo = $1
            );
        `, [params.idmodulo, params.data, params.orainizio, params.orafine]);
    }
    return result.rows[0].count > 0;
};

const controlloAula = async (params, id) => {
    let result;
    if(id) {
        result = await pool.query(`
            SELECT COUNT(*) AS count
            FROM lezione l
            WHERE l.idaula = $1 AND l.data = $2 AND (l.orainizio < $4 AND l.orafine > $3) AND l.id <> $5;
        `, [params.idaula, params.data, params.orainizio, params.orafine, id]);
    } else {
        result = await pool.query(`
            SELECT COUNT(*) AS count
            FROM lezione l
            WHERE l.idaula = $1 AND l.data = $2 AND (l.orainizio < $4 AND l.orafine > $3);
        `, [params.idaula, params.data, params.orainizio, params.orafine]);
    }
    return result.rows[0].count > 0;
};

export const getComingLezioni = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                l.id, 
                l.data, 
                l.orainizio, 
                l.orafine, 
                m.descrizione AS modulo, 
                p.codice, 
                p.colore AS colore_progetto,
                a.id as idaula, 
                a.descrizione AS aula, 
                STRING_AGG(DISTINCT u.cognome, ', ') AS docente,
                STRING_AGG(DISTINCT u.cf, ', ') AS cfdocente
            FROM lezione l
            JOIN modulo m ON l.idmodulo = m.id
            JOIN progetto p ON l.codiceprogetto = p.codice
            JOIN aula a ON l.idaula = a.id
            JOIN cattedra c ON m.id = c.idmodulo
            JOIN docente d ON c.cfdocente = d.cf
            JOIN utente u ON d.cf = u.cf
            WHERE 
                (l.data > CURRENT_DATE AND l.data <= CURRENT_DATE + INTERVAL '7 days')
                OR
                (l.data = CURRENT_DATE AND l.orafine >= CURRENT_TIME)
            GROUP BY l.id, m.descrizione, p.codice, p.colore, a.id, a.descrizione
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
            SELECT 
                l.id, 
                l.data, 
                l.orainizio, 
                l.orafine, 
                m.descrizione AS modulo, 
                p.codice, 
                p.colore AS colore_progetto,
                a.id as idaula, 
                a.descrizione AS aula, 
                STRING_AGG(DISTINCT u.cognome, ', ') AS docente,
                STRING_AGG(DISTINCT u.cf, ', ') AS cfdocente
            FROM lezione l
            JOIN modulo m ON l.idmodulo = m.id
            JOIN progetto p ON l.codiceprogetto = p.codice
            JOIN aula a ON l.idaula = a.id
            JOIN cattedra c ON m.id = c.idmodulo
            JOIN docente d ON c.cfdocente = d.cf
            JOIN utente u ON d.cf = u.cf
            GROUP BY l.id, m.descrizione, p.codice, p.colore, a.id, a.descrizione
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

export const getByProgetto = async (req, res) => {
    const { codiceProgetto } = req.params;
    try {
        const result = await pool.query(`
            SELECT
                l.id, 
                l.data, 
                l.orainizio, 
                l.orafine, 
                m.descrizione AS modulo, 
                p.codice, 
                p.colore AS colore_progetto,
                a.id as idaula, 
                a.descrizione AS aula, 
                STRING_AGG(DISTINCT u.cognome, ', ') AS docente,
                STRING_AGG(DISTINCT u.cf, ', ') AS cfdocente
            FROM lezione l
            JOIN modulo m ON l.idmodulo = m.id
            JOIN progetto p ON l.codiceprogetto = p.codice
            JOIN aula a ON l.idaula = a.id
            JOIN cattedra c ON m.id = c.idmodulo
            JOIN docente d ON c.cfdocente = d.cf
            JOIN utente u ON d.cf = u.cf
            WHERE p.codice = $1
            GROUP BY l.id, m.descrizione, p.codice, p.colore, a.id, a.descrizione
            ORDER BY l.data, l.orainizio;
            `, [codiceProgetto]);
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

export const getComingNote = async (req, res) => {
    const cfUtente = req.user.cf; // Ottieni il CF dell'utente autenticato
    try {
        const result = await pool.query(`
            SELECT n.id, n.data, n.titolo, n.descrizione
            FROM nota n
            JOIN utente u ON n.cfUtente = u.cf
            WHERE n.cfUtente = $1 AND n.data >= CURRENT_DATE AND n.data <= CURRENT_DATE + INTERVAL '7 days'
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
    const { data, orainizio, orafine, idmodulo, idaula, codiceprogetto } = req.body;

    try {
        if (await controlloDocente(req.body)) {
            return res.status(400).json({
                status: 'error',
                message: 'Il docente ha già una lezione in questo orario'
            });
        } else if (await controlloAula(req.body)) {
            return res.status(400).json({
                status: 'error',
                message: 'L\'aula è già occupata in questo orario'
            });
        } else {
            const result = await pool.query(
                `INSERT INTO LEZIONE (Data, OraInizio, OraFine, IdModulo, IdAula, codiceprogetto)
                VALUES ($1, $2, $3, $4, $5, $6)
            `,[data, orainizio, orafine, idmodulo, idaula, codiceprogetto] );

            res.status(201).json({
                status: 'success',
                message: 'Lezione creata con successo',
                data: result.rows[0]
            });
        }
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
        const { data, orainizio, orafine, idmodulo, idaula, codiceprogetto } = req.body;
        if (await controlloDocente(req.body, id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Il docente ha già una lezione in questo orario'
            });
        } else if (await controlloAula(req.body, id)) {
            return res.status(400).json({
                status: 'error',
                message: 'L\'aula è già occupata in questo orario'
            });
        } else {
            try {
                const result = await pool.query(
                    `UPDATE LEZIONE
                    SET Data = $1, OraInizio = $2, OraFine = $3, IdModulo = $4, IdAula = $5, codiceprogetto = $6
                    WHERE Id = $7
                `,[data, orainizio, orafine, idmodulo, idaula, codiceprogetto, id]);

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
        const { titolo, data, descrizione } = req.body;

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