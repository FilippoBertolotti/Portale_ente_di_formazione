import Groq from 'groq-sdk';
import pool from '../config/database.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const AVAILABLE_ENDPOINTS = `
Endpoint disponibili:
- GET /api/studenti → tutti gli studenti
- GET /api/studenti/:search → cerca studenti per nome
- GET /api/studenti/anno/:anno → studenti per anno accademico
- GET /api/studenti/codice/:codice → studenti per codice progetto
- GET /api/studenti/conta → numero totale studenti
- GET /api/docenti → tutti i docenti
- GET /api/docenti/conta → numero totale docenti
- GET /api/progetti → tutti i corsi attivi
- GET /api/progetti/anno/:anno → corsi per anno
- GET /api/progetti/codice/:codice → corso specifico
- GET /api/moduli → tutti i moduli
- GET /api/moduli/anno/:anno → moduli per anno
- GET /api/moduli/codice/:codice → moduli per corso
- GET /api/aule → tutte le aule
- GET /api/aule/sedi → tutte le sedi
- GET /api/lezioni → prossime lezioni
- GET /api/lezioni/note → tutte le note
- POST /api/lezioni → crea una lezione (admin/coordinatore)
POST (creazione):
- POST /api/lezioni → crea una nuova lezione
  Richiede nel body: { data, orainizio, orafine, idmodulo, idaula, cfdocente }

POST (note):
- POST /api/lezioni/nota → aggiunge una nota
  Richiede nel body: { data, titolo, descrizione }
`;

const callGroq = async (systemPrompt, userMessage) => {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile', // oppure 'mixtral-8x7b-32768'
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
    temperature: 0.1 // bassa per risposte più deterministiche
  });
  return response.choices[0].message.content.trim();
};

export const chat = async (req, res) => {
  const { message } = req.body;

  try {
    // 1. Groq sceglie l'endpoint
    const routingSystem = `
      Sei un assistente che mappa domande in linguaggio naturale a endpoint REST.
      ${AVAILABLE_ENDPOINTS}
      Rispondi SOLO con un JSON nel formato: { "endpoint": "/api/..." }
      Senza markdown, senza spiegazioni, solo JSON valido.
    `;

    const routingText = await callGroq(routingSystem, message);
    
    let endpoint;
    try {
      ({ endpoint } = JSON.parse(routingText));
    } catch {
      return res.status(400).json({ status: 'error', message: 'Impossibile interpretare la domanda' });
    }

    // 2. Chiama l'endpoint esistente
    const apiResult = await fetch(`http://localhost:5000${endpoint}`, {
      headers: { Authorization: req.headers.authorization }
    });

    if (!apiResult.ok) {
      return res.status(500).json({ status: 'error', message: 'Errore nel recupero dei dati' });
    }

    const data = await apiResult.json();

    // 3. Groq formula la risposta in italiano
    const answerSystem = `
      Sei un assistente scolastico che risponde in italiano in modo chiaro e conciso.
      Non mostrare dati tecnici o JSON, formula una risposta naturale.
    `;

    const answerPrompt = `
      L'utente ha chiesto: "${message}"
      I dati disponibili sono: ${JSON.stringify(data.data?.slice(0, 20))}
      Rispondi in italiano.
    `;

    const answer = await callGroq(answerSystem, answerPrompt);

    res.json({
      status: 'success',
      data: {
        answer,
        rows: data.data
      }
    });

  } catch (error) {
    console.error('Errore chat:', error);
    res.status(500).json({ status: 'error', message: 'Errore nella risposta' });
  }
};