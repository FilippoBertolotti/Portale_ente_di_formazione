import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── Configurazione ───────────────────────────────────────────────────────────

const BASE_URL = 'http://localhost:5000';

const ENDPOINTS_INFO = `
GET  /api/studenti                    → tutti gli studenti
GET  /api/studenti/:search            → cerca studenti per nome/cognome
GET  /api/studenti/anno/:anno         → studenti per anno accademico
GET  /api/studenti/codice/:codice     → studenti per codice corso
GET  /api/studenti/conta              → numero totale studenti
GET  /api/docenti                     → tutti i docenti
GET  /api/docenti/conta               → numero totale docenti
GET  /api/progetti                    → tutti i corsi attivi
GET  /api/progetti/anno/:anno         → corsi per anno
GET  /api/progetti/codice/:codice     → corso specifico
GET  /api/moduli                      → tutti i moduli
GET  /api/moduli/anno/:anno           → moduli per anno
GET  /api/moduli/codice/:codice       → moduli per corso
GET  /api/aule                        → tutte le aule
GET  /api/aule/sedi                   → tutte le sedi
GET  /api/lezioni                     → prossime lezioni
GET  /api/lezioni/note                → tutte le note
POST /api/lezioni                     → crea lezione   body: { data, orainizio, orafine, idmodulo, idaula, cfdocente }
POST /api/lezioni/nota                → crea nota       body: { data, titolo, descrizione }
POST /api/studenti                    → crea studente   body: { cf, nome, cognome, email, dataNascita, codiceCorso, annoAccademico }
`;

// ─── Helper ───────────────────────────────────────────────────────────────────

const llm = async (system, user, json = false) => {
  const res = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    temperature: 0.1,
    messages: [
      { role: 'system', content: system },
      { role: 'user',   content: user   }
    ]
  });
  const text = res.choices[0].message.content.trim();
  if (!json) return text;
  // Estrae il primo blocco JSON dalla risposta
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error(`Nessun JSON trovato: ${text}`);
  return JSON.parse(match[0]);
};

const apiFetch = async (endpoint, auth, method = 'GET', body = null) => {
  const opts = {
    method,
    headers: { Authorization: auth, 'Content-Type': 'application/json' }
  };
  if (body) opts.body = JSON.stringify(body);
  const res  = await fetch(`${BASE_URL}${endpoint}`, opts);
  return res.json();
};

// Matching fuzzy locale: cerca la voce più simile senza chiamate AI aggiuntive
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

// ─── Fase 1: capisce l'intenzione ─────────────────────────────────────────────

const analyzeIntent = async (message) => {
  const system = `
Sei un analizzatore di intenzioni per un sistema scolastico.
Dati gli endpoint disponibili:
${ENDPOINTS_INFO}

Rispondi SOLO con JSON valido, nessun markdown.
Formato per lettura dati:
{ "type": "get", "endpoint": "/api/...", "params": {} }

Formato per creazione lezione:
{ "type": "post_lezione", "data": "YYYY-MM-DD", "orainizio": "HH:MM", "orafine": "HH:MM", "modulo_hint": "nome modulo", "aula_hint": "nome aula", "docente_hint": "nome docente" }

Formato per creazione nota:
{ "type": "post_nota", "data": "YYYY-MM-DD", "titolo": "...", "descrizione": "..." }

Formato per creazione studente:
{ "type": "post_studente", "cf": "RSSMRA85M01H501Z", "nome": "Mario", "cognome": "Rossi", "email": "mario.rossi@example.com", "dataNascita": "YYYY-MM-DD", "codiceCorso": "PROJ001", "annoAccademico": 1 }

Formato se non capisci:
{ "type": "unknown" }

Per le date relative: oggi è ${new Date().toISOString().split('T')[0]}, domani è ${new Date(Date.now() + 86400000).toISOString().split('T')[0]}.
Converti sempre le date in formato YYYY-MM-DD.
  `;

  return llm(system, message, true);
};

// ─── Fase 2: risolve gli ID per le lezioni ────────────────────────────────────

const resolveLezioneBody = async (intent, auth) => {
  // Recupera in parallelo tutti i dati necessari
  const [moduliRes, auleRes, docentiRes] = await Promise.all([
    apiFetch('/api/moduli',  auth),
    apiFetch('/api/aule',    auth),
    apiFetch('/api/docenti', auth)
  ]);

  const moduli  = moduliRes.data  ?? [];
  const aule    = auleRes.data    ?? [];
  const docenti = docentiRes.data ?? [];

  // Matching locale senza ulteriori chiamate AI
  const modulo  = fuzzyMatch(intent.modulo_hint,  moduli,  ['descrizione']);
  const aula    = fuzzyMatch(intent.aula_hint,    aule,    ['descrizione', 'nome_sede']);
  const docente = fuzzyMatch(intent.docente_hint, docenti, ['nomecompletoqualifica', 'nomeCompleto', 'cognome']);

  const missing = [
    !modulo  && `modulo "${intent.modulo_hint}"`,
    !aula    && `aula "${intent.aula_hint}"`,
    !docente && `docente "${intent.docente_hint}"`
  ].filter(Boolean);

  if (missing.length > 0) {
    return { error: `Non riesco a trovare: ${missing.join(', ')}. Puoi essere più preciso?` };
  }

  return {
    data:       intent.data,
    orainizio:  intent.orainizio,
    orafine:    intent.orafine,
    idmodulo:   modulo.id,
    idaula:     aula.id,
    cfdocente:  docente.cf
  };
};

// ─── Fase 3: formatta la risposta finale ──────────────────────────────────────

const formatAnswer = async (rawAnswer) => {
  const system = `
Sei un assistente scolastico. Trasforma la risposta grezza in testo HTML leggibile in italiano.
Regole:
- Usa <b> per nomi importanti e titoli
- Per liste usa • su righe separate (una per riga, con <br> alla fine di ogni voce)
- Non mostrare mai ID numerici, codici fiscali o strutture JSON
- Sii conciso e naturale
- Se è una conferma di operazione, sii positivo e diretto
  `;
  return llm(system, rawAnswer);
};

// ─── Controller principale ────────────────────────────────────────────────────

export const chat = async (req, res) => {
  const { message } = req.body;
  const auth = req.headers.authorization;

  try {
    // 1. Analisi intenzione
    const intent = await analyzeIntent(message);
    console.log('[AGENT] Intent:', JSON.stringify(intent));

    let rawAnswer;

    // 2. Esegui l'azione in base al tipo
    switch (intent.type) {

      case 'get': {
        // Lettura semplice
        const data = await apiFetch(intent.endpoint, auth);
        const system = `
Sei un assistente scolastico. Rispondi in italiano in modo chiaro e naturale.
Non mostrare ID, codici fiscali o JSON.
Per liste usa elenchi con "•".
        `;
        const prompt = `
Domanda: "${message}"
Dati: ${JSON.stringify(data.data?.slice(0, 25) ?? data)}
Rispondi in modo naturale.
        `;
        rawAnswer = await llm(system, prompt);
        break;
      }

      case 'post_lezione': {
        // Risoluzione ID + creazione lezione
        const body = await resolveLezioneBody(intent, auth);

        if (body.error) {
          rawAnswer = body.error;
          break;
        }

        console.log('[AGENT] POST /api/lezioni body:', body);
        const result = await apiFetch('/api/lezioni', auth, 'POST', body);
        console.log('[AGENT] Risultato POST:', result);

        rawAnswer = result.status === 'success'
          ? `Lezione creata con successo per il ${intent.data} dalle ${intent.orainizio} alle ${intent.orafine}.`
          : `Errore nella creazione: ${result.message}`;
        break;
      }

      case 'post_nota': {
        const body = {
          data:        intent.data,
          titolo:      intent.titolo,
          descrizione: intent.descrizione
        };
        console.log('[AGENT] POST /api/lezioni/nota body:', body);
        const result = await apiFetch('/api/lezioni/nota', auth, 'POST', body);

        rawAnswer = result.status === 'success'
          ? `Nota "${intent.titolo}" aggiunta per il ${intent.data}.`
          : `Errore nella creazione della nota: ${result.message}`;
        break;
      }

      default:
        rawAnswer = 'Non ho capito la richiesta. Puoi riformularla?';
    }

    // 3. Formattazione HTML della risposta
    const answer = await formatAnswer(rawAnswer);

    res.json({ status: 'success', data: { answer } });

  } catch (error) {
    console.error('[AGENT] Errore:', error.message);
    res.status(500).json({ status: 'error', message: 'Errore nella risposta del assistente.' });
  }
};