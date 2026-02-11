import { useState, useEffect } from 'react';
import { progettiService } from '../../services/progettiService';
import './Progetti.css';

const Progetti = () => {
  const [progetti, setProgetti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProgetti = async () => {
      try {
        setLoading(true);
        const data = await progettiService.getAll();
        setProgetti(data);
        setError('');
      } catch (err) {
        setError('Errore nel caricamento dei progetti');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgetti();
  }, []);

  if (loading) {
    return (
      <div className="progetti-container">
        <h1>📋 Elenco Progetti</h1>
        <div className="loading">Caricamento progetti in corso...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="progetti-container">
        <h1>📋 Elenco Progetti</h1>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="progetti-container">
      <h1>📋 Elenco Progetti</h1>
      
      {progetti.length === 0 ? (
        <div className="no-progetti">
          <p>Nessun progetto trovato</p>
        </div>
      ) : (
        <div className="progetti-grid">
          {progetti.map((progetto) => (
            <div key={progetto.id} className="progetto-card">
              <h3>{progetto.nome}</h3>
              <p className="descrizione">{progetto.descrizione}</p>
              <div className="info">
                <span>📅 Inizio: {new Date(progetto.data_inizio).toLocaleDateString('it-IT')}</span>
                <span>🏁 Fine: {new Date(progetto.data_fine).toLocaleDateString('it-IT')}</span>
              </div>
              <div className="footer">
                <span className="stato">{progetto.stato || 'Attivo'}</span>
                <button className="dettagli-btn">Visualizza</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Progetti;