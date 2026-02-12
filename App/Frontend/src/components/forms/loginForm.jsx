import { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import Input from '../common/Input';
import Button from '../common/button';

const LoginForm = ({ onSubmit, loading, error }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email obbligatoria';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email non valida';
    }

    if (!formData.password) {
      newErrors.password = 'Password obbligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password deve essere almeno 6 caratteri';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      
      {/* Campo Email */}
      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="mario.rossi@example.com"
        icon={<FaEnvelope />}
        error={errors.email}
        required
        disabled={loading}
      />

      {/* Campo Password */}
      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="••••••••"
        icon={<FaLock />}
        error={errors.password}
        required
        disabled={loading}
      />

      {/* Errore generale dal server */}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md 
                      border-l-4 border-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Bottone Submit */}
      <Button
        type="submit"
        variant="primary"
        size="small"
        className="w-[40%] self-center mt-[60px]"
        loading={loading}
      >
        {loading ? 'Accesso in corso...' : 'Accedi'}
      </Button>
    </form>
  );
};

export default LoginForm;