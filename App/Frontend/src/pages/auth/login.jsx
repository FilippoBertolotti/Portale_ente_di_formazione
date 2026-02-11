import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import LoginForm from '../../components/forms/LoginForm';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError('');
    
    try {
      const userData = await authService.login(credentials);
      login(userData);
      navigate('/progetti'); // Reindirizza alla pagina dei progetti
    } catch (error) {
      setError('Credenziali non valide');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Portale Ente di Formazione</h1>
      <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
    </div>
  );
};

export default Login;