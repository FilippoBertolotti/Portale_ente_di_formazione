import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoginForm from '../../components/forms/loginForm';
import Image  from '../../components/common/image';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (formData) => {
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      alert('✅ Login riuscito!');
      console.log('Token salvato:', localStorage.getItem('token'));
      navigate('/progetti');
    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante il login');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center p-5 bg-[#2B7BB4]">
      <div className="w-full max-w-[30%]">
        <div className="bg-[#F5F7F9] rounded-[30px] p-10 md:p-10 sm:p-6">
          <div className="text-center mb-8">
            <div className="mb-5">
              <Image className="w-[40%] mx-auto" src="../../assets/images/logo.png" />
            </div>
            <h1 className="text-gray-900 text-xl font-semibold">
              Tutta la scuola, in un solo portale
            </h1>
          </div>
          <LoginForm
            onSubmit={handleLogin}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;