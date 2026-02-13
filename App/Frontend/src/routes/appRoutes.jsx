import { useAuth } from '../hooks/useAuth';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/login';
import Progetti from '../pages/progetti';
import Dashboard from '../pages/dashboard';
import Loader from '../components/common/Loader';

const AppRoutes = () => {
  const { user, loading } = useAuth();
  
  // Aspetta che il controllo auth sia completato
  if (loading) {
    return <Loader />;
  }

  return (
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} /> {/*user ? <Navigate to="/progetti" /> : */}
          <Route path="/progetti" element={user ? <Progetti /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} /> {/*user ? <Navigate to="/progetti" /> : <Login /> */}
        </Routes>
  );
};

export default AppRoutes;
