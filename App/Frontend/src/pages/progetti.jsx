import { useState, useEffect } from 'react'; 
import { progettiService } from '../services/progettiService';

const Progetti = () => {
  const [progetti, setProgetti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProgetti = async () => {
      try {
        setLoading(true);
        const response = await progettiService.getAll();
        
        console.log('📦 Risposta API:', response);

        let progettiData = [];

        if (Array.isArray(response)) {
          progettiData = response;
        } else if (response?.data && Array.isArray(response.data)) {
          progettiData = response.data;
        } else if (response?.progetti && Array.isArray(response.progetti)) {
          progettiData = response.progetti;
        } else if (response?.results && Array.isArray(response.results)) {
          progettiData = response.results;
        } else {
          console.warn('Formato dati non riconosciuto:', response);
          progettiData = [];
        }

        setProgetti(progettiData);
        setError('');

      } catch (err) {
        setError('Errore nel caricamento dei progetti');
        console.error('❌ Errore fetch:', err);
        setProgetti([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProgetti();
  }, []);

  // LOADING
  if (loading) {
    return (
      <div className="w-full h-full bg-gray-50 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">📋 Elenco Progetti</h1>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Caricamento progetti in corso...</p>
        </div>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="w-full h-full bg-gray-50 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">📋 Elenco Progetti</h1>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <span className="text-2xl mr-3">⚠️</span>
            <div className="text-red-700 font-medium">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN RENDER
  return (
    <div className="w-full h-full bg-gray-50 p-8 overflow-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">📋 Elenco Progetti</h1>

      {!Array.isArray(progetti) || progetti.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">📭 Nessun progetto trovato</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {progetti.map((progetto) => {
            const keyId = progetto?.codice || `fallback-${Math.random()}-${Date.now()}`;
            
            return (
              <div 
                key={keyId}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {progetto?.descrizione || 'Nessuna descrizione'}
                </h3>

                <div className="space-y-2 mb-4 text-sm text-gray-500 flex-grow">
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>Inizio: {progetto?.annoinizio || 'N/D'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🏁</span>
                    <span>Fine: {progetto?.annofine || 'N/D'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {progetto?.stato || 'Attivo'}
                  </span>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    Visualizza
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Progetti;