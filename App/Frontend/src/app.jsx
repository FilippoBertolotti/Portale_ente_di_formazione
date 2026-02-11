import { useState } from 'react';
import './app.css';

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const testBackend = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/health');
      const data = await response.json();
      setMessage(`✅ Backend connesso! ${data.message}`);
    } catch (error) {
      setMessage(`❌ Errore: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>🎓 Portale Ente di Formazione</h1>
      <p>Test connessione Backend</p>
      
      <button onClick={testBackend} disabled={loading}>
        {loading ? 'Connessione...' : 'Test Backend'}
      </button>
      
      {message && (
        <div className="message">
          {message}
        </div>
      )}
    </div>
  );
}

export default App;