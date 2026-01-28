-- \c PortaleEnteDiFormazione;

-- INSERIMENTO DATI MOCK

-- 1. UTENTE (10 tuple)
INSERT INTO UTENTE (CF, Nome, Cognome, DataNascita, Email, Password, Livello) VALUES
('RSSMRA85M01H501Z', 'Mario', 'Rossi', '1985-08-01', 'mario.rossi@email.it', 'pass123', 1),
('BNCGVN90D15F205X', 'Giovanni', 'Bianchi', '1990-04-15', 'giovanni.bianchi@email.it', 'pass456', 2),
('VRDLRA88H50D612Y', 'Laura', 'Verdi', '1988-06-10', 'laura.verdi@email.it', 'pass789', 1),
('FRNPLA92L20H501W', 'Paola', 'Ferrari', '1992-07-20', 'paola.ferrari@email.it', 'pass321', 3),
('MRNLCA95T10A944V', 'Luca', 'Morini', '1995-12-10', 'luca.morini@email.it', 'pass654', 3),
('CSTVNC87A45L219U', 'Vincenzo', 'Costa', '1987-01-05', 'vincenzo.costa@email.it', 'pass987', 2),
('RMNSLV93E60H501T', 'Silvia', 'Romani', '1993-05-20', 'silvia.romani@email.it', 'pass147', 3),
('GLLMRC89B12F839S', 'Marco', 'Galli', '1989-02-12', 'marco.galli@email.it', 'pass258', 1),
('PZZFNC91C25D969R', 'Francesca', 'Pozzi', '1991-03-25', 'francesca.pozzi@email.it', 'pass369', 3),
('NTNCRL96D30G273Q', 'Carla', 'Fontana', '1996-04-30', 'carla.fontana@email.it', 'pass741', 3);

-- 2. DOCENTE (5 tuple - subset di UTENTE)
INSERT INTO DOCENTE (CF, Telefono) VALUES
('RSSMRA85M01H501Z', '3331234567'),
('BNCGVN90D15F205X', '3349876543'),
('VRDLRA88H50D612Y', '3356789012'),
('CSTVNC87A45L219U', '3362345678'),
('GLLMRC89B12F839S', '3378901234');

-- 3. PROGETTO (10 tuple)
INSERT INTO PROGETTO (Codice, RER, Descrizione, AnnoInizio, AnnoFine, CFCoordinatore) VALUES
('PROJ001', 'RER-2023-001', 'Corso Sviluppo Web Full Stack', 2023, 2024, 'RSSMRA85M01H501Z'),
('PROJ002', 'RER-2023-002', 'Corso Data Science e Machine Learning', 2023, 2025, 'BNCGVN90D15F205X'),
('PROJ003', 'RER-2024-001', 'Corso Cybersecurity Avanzata', 2024, 2025, 'VRDLRA88H50D612Y'),
('PROJ004', 'RER-2024-002', 'Corso Digital Marketing', 2024, 2026, 'CSTVNC87A45L219U'),
('PROJ005', 'RER-2024-003', 'Corso Cloud Computing e DevOps', 2024, 2025, 'GLLMRC89B12F839S'),
('PROJ006', 'RER-2025-001', 'Corso Mobile App Development', 2025, 2026, 'RSSMRA85M01H501Z'),
('PROJ007', 'RER-2023-003', 'Corso UI/UX Design', 2023, 2024, 'BNCGVN90D15F205X'),
('PROJ008', 'RER-2024-004', 'Corso Database Management', 2024, 2025, NULL),
('PROJ009', 'RER-2025-002', 'Corso AI e Deep Learning', 2025, 2027, 'VRDLRA88H50D612Y'),
('PROJ010', 'RER-2024-005', 'Corso Blockchain Development', 2024, 2026, 'CSTVNC87A45L219U');

-- 4. STUDENTE (5 tuple - subset di UTENTE)
INSERT INTO STUDENTE (CF, CodiceProgetto) VALUES
('FRNPLA92L20H501W', 'PROJ001'),
('MRNLCA95T10A944V', 'PROJ002'),
('RMNSLV93E60H501T', 'PROJ003'),
('PZZFNC91C25D969R', 'PROJ004'),
('NTNCRL96D30G273Q', 'PROJ005');

-- 5. CITTA (10 tuple)
INSERT INTO CITTA (CAP, Nome_Citta, Regione_Citta) VALUES
('40121', 'Bologna', 'Emilia-Romagna'),
('20121', 'Milano', 'Lombardia'),
('00118', 'Roma', 'Lazio'),
('50121', 'Firenze', 'Toscana'),
('10121', 'Torino', 'Piemonte'),
('80121', 'Napoli', 'Campania'),
('16121', 'Genova', 'Liguria'),
('90121', 'Palermo', 'Sicilia'),
('70121', 'Bari', 'Puglia'),
('41121', 'Modena', 'Emilia-Romagna');

-- 6. SEDE (10 tuple)
INSERT INTO SEDE (Nome, Indirizzo, Telefono, Descrizione, CAPCitta) VALUES
('Sede Centrale Bologna', 'Via Marconi 15', '0512345678', 'Sede principale con 5 aule', '40121'),
('Sede Milano Nord', 'Viale Monza 120', '0223456789', 'Sede moderna con laboratori informatici', '20121'),
('Sede Roma EUR', 'Via Cristoforo Colombo 90', '0634567890', 'Centro formazione aziendale', '00118'),
('Sede Firenze Centro', 'Piazza Santa Croce 8', '0554567890', 'Sede storica restaurata', '50121'),
('Sede Torino Lingotto', 'Via Nizza 280', '0115678901', 'Sede con auditorium', '10121'),
('Sede Napoli Vomero', 'Via Scarlatti 45', '0816789012', 'Sede con vista panoramica', '80121'),
('Sede Genova Porto', 'Via Gramsci 60', '0107890123', 'Sede vicino al porto', '16121'),
('Sede Palermo Centro', 'Via Roma 250', '0918901234', 'Sede nel centro storico', '90121'),
('Sede Bari Poggiofranco', 'Via Dante 75', '0809012345', 'Sede in zona residenziale', '70121'),
('Sede Modena Centro', 'Corso Canalgrande 88', '0590123456', 'Sede recentemente rinnovata', '41121');

-- 7. AULA (10 tuple)
INSERT INTO AULA (Descrizione, Capienza, NumeroPC, Piano, Attiva, IDSede) VALUES
('Aula Magna', 50, 25, 'Piano Terra', TRUE, 1),
('Lab Informatico A', 30, 30, 'Primo Piano', TRUE, 1),
('Aula Multimediale', 40, 20, 'Secondo Piano', TRUE, 2),
('Lab Coding', 25, 25, 'Primo Piano', TRUE, 2),
('Aula Conferenze', 60, 15, 'Piano Terra', TRUE, 3),
('Lab Design', 20, 20, 'Terzo Piano', TRUE, 4),
('Aula Workshop', 35, 10, 'Secondo Piano', TRUE, 5),
('Lab Testing', 30, 30, 'Primo Piano', FALSE, 6),
('Aula Studio', 45, 22, 'Piano Terra', TRUE, 7),
('Lab DevOps', 28, 28, 'Secondo Piano', TRUE, 8);

-- 8. MODULO (10 tuple)
INSERT INTO MODULO (Anno, OreAula, OreProject, OreStage, Descrizione, CodiceProgetto, CFDocente) VALUES
(2023, 80, 20, 0, 'HTML, CSS e JavaScript Base', 'PROJ001', 'RSSMRA85M01H501Z'),
(2024, 100, 30, 20, 'React e Node.js', 'PROJ001', 'BNCGVN90D15F205X'),
(2023, 120, 40, 0, 'Python per Data Science', 'PROJ002', 'VRDLRA88H50D612Y'),
(2024, 90, 25, 15, 'Machine Learning Fondamenti', 'PROJ002', 'CSTVNC87A45L219U'),
(2024, 110, 35, 0, 'Network Security', 'PROJ003', 'GLLMRC89B12F839S'),
(2024, 70, 15, 10, 'SEO e Social Media', 'PROJ004', 'RSSMRA85M01H501Z'),
(2024, 95, 28, 0, 'Docker e Kubernetes', 'PROJ005', 'BNCGVN90D15F205X'),
(2025, 85, 22, 12, 'iOS Development', 'PROJ006', 'VRDLRA88H50D612Y'),
(2023, 75, 18, 0, 'User Experience Design', 'PROJ007', 'CSTVNC87A45L219U'),
(2024, 105, 32, 0, 'SQL e Database Design', 'PROJ008', 'GLLMRC89B12F839S');

-- 9. LEZIONE (10 tuple)
INSERT INTO LEZIONE (Data, OraInizio, OraFine, IDAula, IDModulo) VALUES
('2024-01-15', '09:00', '13:00', 1, 1),
('2024-01-16', '14:00', '18:00', 2, 1),
('2024-01-17', '09:00', '12:00', 3, 2),
('2024-01-18', '15:00', '19:00', 4, 2),
('2024-01-19', '10:00', '14:00', 5, 3),
('2024-01-22', '09:30', '13:30', 6, 4),
('2024-01-23', '14:30', '17:30', 7, 5),
('2024-01-24', '08:00', '12:00', 9, 6),
('2024-01-25', '13:00', '17:00', 10, 7),
('2024-01-26', '09:00', '13:00', 1, 8);

-- 10. PRESENZA (10 tuple)
INSERT INTO PRESENZA (CFStudente, IDLezione) VALUES
('FRNPLA92L20H501W', 1),
('FRNPLA92L20H501W', 2),
('MRNLCA95T10A944V', 3),
('MRNLCA95T10A944V', 4),
('RMNSLV93E60H501T', 5),
('RMNSLV93E60H501T', 6),
('PZZFNC91C25D969R', 7),
('PZZFNC91C25D969R', 8),
('NTNCRL96D30G273Q', 9),
('NTNCRL96D30G273Q', 10);

-- 11. QUALIFICA (10 tuple)
INSERT INTO QUALIFICA (Materia) VALUES
('Programmazione Web'),
('Data Science'),
('Cybersecurity'),
('Digital Marketing'),
('Cloud Computing'),
('Mobile Development'),
('UI/UX Design'),
('Database Management'),
('Artificial Intelligence'),
('Blockchain');

-- 12. POSSEDUTO (10 tuple - relazione docenti-qualifiche)
INSERT INTO POSSEDUTO (CFDocente, IDQualifica) VALUES
('RSSMRA85M01H501Z', 1),
('RSSMRA85M01H501Z', 4),
('BNCGVN90D15F205X', 2),
('BNCGVN90D15F205X', 5),
('VRDLRA88H50D612Y', 3),
('VRDLRA88H50D612Y', 9),
('CSTVNC87A45L219U', 4),
('CSTVNC87A45L219U', 7),
('GLLMRC89B12F839S', 5),
('GLLMRC89B12F839S', 8);