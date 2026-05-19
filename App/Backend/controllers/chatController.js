import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const BASE_URL = 'http://localhost:5000';

// ─── LLM + API helpers ────────────────────────────────────────────────────────

const llm = async (system, user, json = false) => {
  const res = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    temperature: 0.1,
    messages: [{ role: 'system', content: system }, { role: 'user', content: user }]
  });
  const text = res.choices[0].message.content.trim();
  if (!json) return text;
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error(`Nessun JSON: ${text}`);
  return JSON.parse(match[0]);
};

const apiFetch = async (endpoint, auth, method = 'GET', body = null) => {
  const opts = { method, headers: { Authorization: auth, 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE_URL}${endpoint}`, opts);
  return res.json();
};

const fuzzyMatch = (query, items, fields) => {
  if (!query || !items?.length) return null;
  const q = query.toLowerCase().trim();
  return items.find(item =>
    fields.some(f => {
      const val = String(item[f] ?? '').toLowerCase();
      return val.includes(q) || q.includes(val) || q.split(' ').some(w => w.length > 2 && val.includes(w));
    })
  ) ?? null;
};

// ─── Analisi intenzione ───────────────────────────────────────────────────────

const analyzeIntent = async (message) => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const system = `
Sei un analizzatore di intenzioni per un sistema scolastico.
Oggi è ${today}, domani è ${tomorrow}. Converti sempre le date in YYYY-MM-DD.

Rispondi SOLO con JSON valido, nessun markdown, nessuna spiegazione.

Formati disponibili:

LETTURA:
{ "type": "get", "endpoint": "/api/studenti" }
{ "type": "get", "endpoint": "/api/studenti/Mario" }
{ "type": "get", "endpoint": "/api/studenti/anno/1" }
{ "type": "get", "endpoint": "/api/studenti/conta" }
{ "type": "get", "endpoint": "/api/docenti" }
{ "type": "get", "endpoint": "/api/docenti/conta" }
{ "type": "get", "endpoint": "/api/progetti" }
{ "type": "get", "endpoint": "/api/progetti/anno/2026" }
{ "type": "get", "endpoint": "/api/moduli" }
{ "type": "get", "endpoint": "/api/aule" }
{ "type": "get", "endpoint": "/api/aule/sedi" }
{ "type": "get", "endpoint": "/api/lezioni" }
{ "type": "get", "endpoint": "/api/lezioni/note" }

CREA LEZIONE:
{ "type": "post_lezione", "data": "YYYY-MM-DD", "orainizio": "HH:MM", "orafine": "HH:MM", "modulo_hint": "...", "aula_hint": "...", "docente_hint": "..." }

MODIFICA LEZIONE:
{ "type": "put_lezione", "lezione_hint": "descrizione per trovare la lezione", "data": "YYYY-MM-DD", "orainizio": "HH:MM", "orafine": "HH:MM", "modulo_hint": "...", "aula_hint": "...", "docente_hint": "..." }

ELIMINA LEZIONE:
{ "type": "delete_lezione", "lezione_hint": "descrizione per trovare la lezione" }

CREA NOTA:
{ "type": "post_nota", "data": "YYYY-MM-DD", "titolo": "...", "descrizione": "..." }

MODIFICA NOTA:
{ "type": "put_nota", "nota_hint": "titolo o descrizione nota", "data": "YYYY-MM-DD", "titolo": "...", "descrizione": "..." }

ELIMINA NOTA:
{ "type": "delete_nota", "nota_hint": "titolo o descrizione nota" }

CREA STUDENTE:
{ "type": "post_studente", "cf": "...", "nome": "...", "cognome": "...", "email": "...", "dataNascita": "YYYY-MM-DD", "corso_hint": "...", "annoAccademico": 1 }

MODIFICA STUDENTE:
{ "type": "put_studente", "studente_hint": "nome o cognome", "cf": "...", "nome": "...", "cognome": "...", "email": "...", "dataNascita": "YYYY-MM-DD", "corso_hint": "...", "annoAccademico": 1 }

ELIMINA STUDENTE:
{ "type": "delete_studente", "studente_hint": "nome o cognome" }

CREA DOCENTE:
{ "type": "post_docente", "cf": "...", "nome": "...", "cognome": "...", "email": "...", "dataNascita": "YYYY-MM-DD", "telefono": "...", "qualifica": "..." }

CREA CORSO:
{ "type": "post_progetto", "codice": "...", "rer": "...", "descrizione": "...", "annoInizio": 2026, "annoFine": 2027, "coordinatore_hint": "...", "colore": "#2B7BB4" }

ELIMINA CORSO:
{ "type": "delete_progetto", "progetto_hint": "nome corso" }

CREA AULA:
{ "type": "post_aula", "descrizione": "...", "capienza": 30, "numeropc": 0, "sede_hint": "...", "piano": "Piano Terra", "attiva": true }

ELIMINA AULA:
{ "type": "delete_aula", "aula_hint": "nome aula" }

CREA SEDE:
{ "type": "post_sede", "nome": "...", "telefono": "...", "indirizzo": "...", "nome_citta": "...", "cap": "...", "descrizione": "..." }

ELIMINA SEDE:
{ "type": "delete_sede", "sede_hint": "nome sede" }

NON CAPITO:
{ "type": "unknown" }
  `;

  return llm(system, message, true);
};

// ─── Resolver: da hint → ID reali ────────────────────────────────────────────

const resolveLezione = async (intent, auth) => {
  const [moduliRes, auleRes, docentiRes] = await Promise.all([
    apiFetch('/api/moduli', auth),
    apiFetch('/api/aule', auth),
    apiFetch('/api/docenti', auth)
  ]);

  const modulo  = intent.modulo_hint  ? fuzzyMatch(intent.modulo_hint,  moduliRes.data  ?? [], ['descrizione']) : null;
  const aula    = intent.aula_hint    ? fuzzyMatch(intent.aula_hint,    auleRes.data    ?? [], ['descrizione', 'nome_sede']) : null;
  const docente = intent.docente_hint ? fuzzyMatch(intent.docente_hint, docentiRes.data ?? [], ['nomecompletoqualifica', 'nomeCompleto']) : null;

  const missing = [
    intent.modulo_hint  && !modulo  && `modulo "${intent.modulo_hint}"`,
    intent.aula_hint    && !aula    && `aula "${intent.aula_hint}"`,
    intent.docente_hint && !docente && `docente "${intent.docente_hint}"`
  ].filter(Boolean);

  if (missing.length > 0) return { error: `Non trovo: ${missing.join(', ')}. Puoi essere più preciso?` };

  return {
    data:      intent.data,
    orainizio: intent.orainizio,
    orafine:   intent.orafine,
    ...(modulo  && { idmodulo:  modulo.id }),
    ...(aula    && { idaula:    aula.id }),
    ...(docente && { cfdocente: docente.cf })
  };
};

const resolveLezioneId = async (hint, auth) => {
  const lezioniRes = await apiFetch('/api/lezioni', auth);
  const lezioni = lezioniRes.data ?? [];
  return fuzzyMatch(hint, lezioni, ['modulo', 'aula', 'docente']);
};

const resolveStudente = async (hint, auth) => {
  const res = await apiFetch(`/api/studenti/${hint}`, auth);
  return res.data?.[0] ?? null;
};

const resolveProgetto = async (hint, auth) => {
  const res = await apiFetch('/api/progetti', auth);
  return fuzzyMatch(hint, res.data ?? [], ['descrizione', 'codice']);
};

const resolveAula = async (hint, auth) => {
  const res = await apiFetch('/api/aule', auth);
  return fuzzyMatch(hint, res.data ?? [], ['descrizione']);
};

const resolveSede = async (hint, auth) => {
  const res = await apiFetch('/api/aule/sedi', auth);
  return fuzzyMatch(hint, res.data ?? [], ['nome']);
};

const resolveDocente = async (hint, auth) => {
  const res = await apiFetch('/api/docenti', auth);
  return fuzzyMatch(hint, res.data ?? [], ['nomecompletoqualifica', 'nomeCompleto']);
};

const resolveNota = async (hint, auth) => {
  const res = await apiFetch('/api/lezioni/note', auth);
  return fuzzyMatch(hint, res.data ?? [], ['titolo', 'descrizione']);
};

// ─── Formattazione risposta ───────────────────────────────────────────────────

const formatAnswer = async (raw) => {
  const system = `
Sei un assistente scolastico. Trasforma il testo in HTML leggibile in italiano.
- Usa <b> per nomi e titoli importanti
- Per liste usa • su righe separate con <br> alla fine
- Non mostrare ID, codici fiscali o JSON
- Sii conciso e naturale
  `;
  return llm(system, raw);
};

// ─── Controller principale ────────────────────────────────────────────────────

export const chat = async (req, res) => {
  const { message } = req.body;
  const auth = req.headers.authorization;

  try {
    const intent = await analyzeIntent(message);
    console.log('[AGENT] Intent:', JSON.stringify(intent));

    let rawAnswer;
    let result;

    switch (intent.type) {

      // ── GET generico ──────────────────────────────────────────────────────
      case 'get': {
        const data = await apiFetch(intent.endpoint, auth);
        const prompt = `Domanda: "${message}"\nDati: ${JSON.stringify(data.data?.slice(0, 25) ?? data)}\nRispondi in modo naturale in italiano senza mostrare ID o JSON.`;
        rawAnswer = await llm('Sei un assistente scolastico. Rispondi in italiano chiaramente. Per liste usa "•".', prompt);
        break;
      }

      // ── LEZIONI ───────────────────────────────────────────────────────────
      case 'post_lezione': {
        const body = await resolveLezione(intent, auth);
        if (body.error) { rawAnswer = body.error; break; }
        result = await apiFetch('/api/lezioni', auth, 'POST', body);
        rawAnswer = result.status === 'success'
          ? `Lezione creata per il ${intent.data} dalle ${intent.orainizio} alle ${intent.orafine}.`
          : `Errore: ${result.message}`;
        break;
      }

      case 'put_lezione': {
        const lezione = await resolveLezioneId(intent.lezione_hint, auth);
        if (!lezione) { rawAnswer = `Non trovo la lezione "${intent.lezione_hint}".`; break; }
        const body = await resolveLezione(intent, auth);
        if (body.error) { rawAnswer = body.error; break; }
        result = await apiFetch(`/api/lezioni/${lezione.id}`, auth, 'PUT', body);
        rawAnswer = result.status === 'success' ? 'Lezione aggiornata.' : `Errore: ${result.message}`;
        break;
      }

      case 'delete_lezione': {
        const lezione = await resolveLezioneId(intent.lezione_hint, auth);
        if (!lezione) { rawAnswer = `Non trovo la lezione "${intent.lezione_hint}".`; break; }
        result = await apiFetch(`/api/lezioni/${lezione.id}`, auth, 'DELETE');
        rawAnswer = result.status === 'success' ? 'Lezione eliminata.' : `Errore: ${result.message}`;
        break;
      }

      // ── NOTE ──────────────────────────────────────────────────────────────
      case 'post_nota': {
        result = await apiFetch('/api/lezioni/nota', auth, 'POST', {
          data: intent.data, titolo: intent.titolo, descrizione: intent.descrizione
        });
        rawAnswer = result.status === 'success'
          ? `Nota "${intent.titolo}" aggiunta per il ${intent.data}.`
          : `Errore: ${result.message}`;
        break;
      }

      case 'put_nota': {
        const nota = await resolveNota(intent.nota_hint, auth);
        if (!nota) { rawAnswer = `Non trovo la nota "${intent.nota_hint}".`; break; }
        result = await apiFetch(`/api/lezioni/nota/${nota.id}`, auth, 'PUT', {
          data: intent.data, titolo: intent.titolo, descrizione: intent.descrizione
        });
        rawAnswer = result.status === 'success' ? 'Nota aggiornata.' : `Errore: ${result.message}`;
        break;
      }

      case 'delete_nota': {
        const nota = await resolveNota(intent.nota_hint, auth);
        if (!nota) { rawAnswer = `Non trovo la nota "${intent.nota_hint}".`; break; }
        result = await apiFetch(`/api/lezioni/nota/${nota.id}`, auth, 'DELETE');
        rawAnswer = result.status === 'success' ? 'Nota eliminata.' : `Errore: ${result.message}`;
        break;
      }

      // ── STUDENTI ──────────────────────────────────────────────────────────
      case 'post_studente': {
        const progetto = intent.corso_hint ? await resolveProgetto(intent.corso_hint, auth) : null;
        if (intent.corso_hint && !progetto) { rawAnswer = `Non trovo il corso "${intent.corso_hint}".`; break; }
        result = await apiFetch('/api/studenti', auth, 'POST', {
          cf: intent.cf, nome: intent.nome, cognome: intent.cognome,
          email: intent.email, dataNascita: intent.dataNascita,
          corso: progetto?.codice ?? intent.corso_hint,
          annoAccademico: intent.annoAccademico
        });
        rawAnswer = result.status === 'success'
          ? `Studente ${intent.nome} ${intent.cognome} aggiunto.`
          : `Errore: ${result.message}`;
        break;
      }

      case 'put_studente': {
        const studente = await resolveStudente(intent.studente_hint, auth);
        if (!studente) { rawAnswer = `Non trovo lo studente "${intent.studente_hint}".`; break; }
        const progetto = intent.corso_hint ? await resolveProgetto(intent.corso_hint, auth) : null;
        result = await apiFetch(`/api/studenti/${studente.cf}`, auth, 'PUT', {
          nome: intent.nome ?? studente.nome,
          cognome: intent.cognome ?? studente.cognome,
          email: intent.email ?? studente.email,
          dataNascita: intent.dataNascita ?? studente.dataNascita,
          corso: progetto?.codice ?? studente.codiceprogetto,
          annoAccademico: intent.annoAccademico ?? studente.annoaccademico
        });
        rawAnswer = result.status === 'success' ? 'Studente aggiornato.' : `Errore: ${result.message}`;
        break;
      }

      case 'delete_studente': {
        const studente = await resolveStudente(intent.studente_hint, auth);
        if (!studente) { rawAnswer = `Non trovo lo studente "${intent.studente_hint}".`; break; }
        result = await apiFetch(`/api/studenti/${studente.cf}`, auth, 'DELETE');
        rawAnswer = result.status === 'success' ? 'Studente eliminato.' : `Errore: ${result.message}`;
        break;
      }

      // ── DOCENTI ───────────────────────────────────────────────────────────
      case 'post_docente': {
        result = await apiFetch('/api/docenti', auth, 'POST', {
          cf: intent.cf, nome: intent.nome, cognome: intent.cognome,
          email: intent.email, dataNascita: intent.dataNascita,
          telefono: intent.telefono, qualifica: intent.qualifica
        });
        rawAnswer = result.status === 'success'
          ? `Docente ${intent.nome} ${intent.cognome} aggiunto.`
          : `Errore: ${result.message}`;
        break;
      }

      // ── PROGETTI ──────────────────────────────────────────────────────────
      case 'post_progetto': {
        const coordinatore = intent.coordinatore_hint ? await resolveDocente(intent.coordinatore_hint, auth) : null;
        result = await apiFetch('/api/progetti', auth, 'POST', {
          codice: intent.codice, rer: intent.rer, descrizione: intent.descrizione,
          annoInizio: intent.annoInizio, annoFine: intent.annoFine,
          cfCoordinatore: coordinatore?.cf ?? null,
          colore: intent.colore ?? '#2B7BB4'
        });
        rawAnswer = result.status === 'success'
          ? `Corso "${intent.descrizione}" creato.`
          : `Errore: ${result.message}`;
        break;
      }

      case 'delete_progetto': {
        const progetto = await resolveProgetto(intent.progetto_hint, auth);
        if (!progetto) { rawAnswer = `Non trovo il corso "${intent.progetto_hint}".`; break; }
        result = await apiFetch(`/api/progetti/${progetto.codice}`, auth, 'DELETE');
        rawAnswer = result.status === 'success' ? 'Corso eliminato.' : `Errore: ${result.message}`;
        break;
      }

      // ── AULE ──────────────────────────────────────────────────────────────
      case 'post_aula': {
        const sede = intent.sede_hint ? await resolveSede(intent.sede_hint, auth) : null;
        if (intent.sede_hint && !sede) { rawAnswer = `Non trovo la sede "${intent.sede_hint}".`; break; }
        result = await apiFetch('/api/aule', auth, 'POST', {
          descrizione: intent.descrizione, capienza: intent.capienza,
          numeropc: intent.numeropc ?? 0, piano: intent.piano,
          attiva: intent.attiva ?? true, idsede: sede?.id ?? null
        });
        rawAnswer = result.status === 'success'
          ? `Aula "${intent.descrizione}" creata.`
          : `Errore: ${result.message}`;
        break;
      }

      case 'delete_aula': {
        const aula = await resolveAula(intent.aula_hint, auth);
        if (!aula) { rawAnswer = `Non trovo l'aula "${intent.aula_hint}".`; break; }
        result = await apiFetch(`/api/aule/aula/${aula.id}`, auth, 'DELETE');
        rawAnswer = result.status === 'success' ? 'Aula eliminata.' : `Errore: ${result.message}`;
        break;
      }

      // ── SEDI ──────────────────────────────────────────────────────────────
      case 'post_sede': {
        result = await apiFetch('/api/aule/sede', auth, 'POST', {
          nome: intent.nome, telefono: intent.telefono, indirizzo: intent.indirizzo,
          nome_citta: intent.nome_citta, cap: intent.cap, descrizione: intent.descrizione
        });
        rawAnswer = result.status === 'success'
          ? `Sede "${intent.nome}" creata.`
          : `Errore: ${result.message}`;
        break;
      }

      case 'delete_sede': {
        const sede = await resolveSede(intent.sede_hint, auth);
        if (!sede) { rawAnswer = `Non trovo la sede "${intent.sede_hint}".`; break; }
        result = await apiFetch(`/api/aule/sede/${sede.id}`, auth, 'DELETE');
        rawAnswer = result.status === 'success' ? 'Sede eliminata.' : `Errore: ${result.message}`;
        break;
      }

      default:
        rawAnswer = 'Non ho capito la richiesta. Puoi riformularla?';
    }

    const answer = await formatAnswer(rawAnswer);
    res.json({ status: 'success', data: { answer } });

  } catch (error) {
    console.error('[AGENT] Errore:', error.message);
    res.status(500).json({ status: 'error', message: "Errore nell'assistente." });
  }
};