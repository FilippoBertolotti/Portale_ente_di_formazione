import { GoogleGenerativeAI } from '@google/generative-ai';
import pool from '../config/database.js';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

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
POST (creazione):
- POST /api/lezioni → crea una nuova lezione
  Richiede nel body: { data, orainizio, orafine, idmodulo, idaula, cfdocente }
- POST /api/lezioni/nota → aggiunge una nota
  Richiede nel body: { data, titolo, descrizione }
`;

const callGoogleAI = async (systemPrompt, userMessage) => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-3-flash-preview',
    systemInstruction: systemPrompt,
  });

  const result = await model.generateContent(userMessage);
  return result.response.text().trim();
};

export const chat = async (req, res) => {
  const { message } = req.body;

  try {
    // 1. Google AI sceglie l'endpoint
    const routingSystem = `
      Sei un assistente che mappa domande in linguaggio naturale a endpoint REST.
      ${AVAILABLE_ENDPOINTS}
      Rispondi SOLO con un JSON nel formato:
      { "endpoint": "/api/...", "method": "GET", "body": null }
      Per le POST includi il body con i dati estratti dal messaggio dell'utente risolvendo i dati mancanti per il corretto completamento con altre richieste sugli endpoint necessari, matchando le nformazioni date 
      con quelle presenti sul db non inventando niente, senza violare i vincoli chiedendo informazioni aggiuntive quando tu le ritenga necessarie o non sia sicuro dei dati trovanti con il matchin (chiedendo per esempio nome o cognome di un docente per una ricerca più accurata) evitando il più possibile stati di errore dovuti ad inserimnti errati.
      In caso di presenza di moduli, docenti, docenti, aule o qualsiasi altro dato richiedemte informazioni specifiche per essere identificati e inseriti correttamente nel body di una POST, fai tutte le richieste necessarie agli endpoint GET per recuperare i dati necessari e fai un matching con le informazioni date dall'utente per identificare l'ID corretto da inserire nel body della POST. 
      Per la creazione si utilizzano le chiamate in post con body popolato come negli esempi qui sotto:
      Esempio POST lezione: { "endpoint": "/api/lezioni", "method": "POST", "body": { "data": "2026-05-16", "orainizio": "09:00", "orafine": "11:00", "idmodulo": 1, "idaula": 2, "cfdocente": "RSSMRA80A01H501Z" } }
      Esempio POST nota: { "endpoint": "/api/lezioni/nota", "method": "POST", "body": { "data": "2026-05-16", "titolo": "Riunione", "descrizione": "Riunione di staff" } }
      Senza markdown, senza spiegazioni, solo JSON valido.
    `;

    const answerSystem = `
      Sei un assistente scolastico che risponde in italiano in modo chiaro.
      Regole di formattazione:
      - Non usare virgole per separare nomi in una lista andnado a capo dopo ogni elelento con tag <br> e dopo l'intestazione con tag <br>
      - Racchiudi tutto in tag html per il grassetto per indicare titiolo o nomi importanti e non utilizzare mai gli **
      - Sii conciso ma completo
      - Non mostrare mai dati tecnici, ID o JSON
      Esempio di risposta corretta per una lista utilizzando sempre tag html per il grassetto e per la creazione di liste:
      "I docenti presenti sono:
      • Mario Rossi – Matematica
      • Anna Bianchi – Italiano"
    `;

    const routingText = await callGoogleAI(routingSystem, message);

    let endpoint, method, body;
    try {
      ({ endpoint, method = 'GET', body = null } = JSON.parse(routingText));
    } catch {
      return res.status(400).json({ status: 'error', message: 'Impossibile interpretare la domanda' });
    }

    // Chiama l'endpoint con metodo e body corretti
    const fetchOptions = {
      method: method,
      headers: {
        Authorization: req.headers.authorization,
        'Content-Type': 'application/json'
      }
    };

    if (method === 'POST' && body) {
      fetchOptions.body = JSON.stringify(body);
    }

    const apiResult = await fetch(`http://localhost:5000${endpoint}`, fetchOptions);

    if (!apiResult.ok) {
      return res.status(500).json({ status: 'error', message: 'Errore nel recupero dei dati' });
    }

    const data = await apiResult.json();

    // Per le POST dai una conferma senza dati da analizzare
    const answerPrompt = method === 'POST'
      ? `
      L'utente ha chiesto: "${message}"
      L'operazione è andata a buon fine. Conferma in italiano in modo naturale.
    `: `
      L'utente ha chiesto: "${message}"
      I dati disponibili sono: ${JSON.stringify(data.data?.slice(0, 20))}
      Rispondi in italiano usando elenchi puntati con "•" per liste di elementi.
      Raggruppa i dati in modo leggibile. Evita virgole per separare persone o elementi.
    `;

    const answer = await callGoogleAI(answerSystem, answerPrompt);

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