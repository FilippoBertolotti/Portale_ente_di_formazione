import { useAuth } from '../hooks/useAuth';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/login';
import Progetti from '../pages/progetti';

const AppRoutes = () => {
  const { user } = useAuth();
  return (
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/progetti" /> : <Navigate to="/login" />} />
          <Route path="/progetti" element={<Progetti />} />
          <Route path="/" element={user ? <Navigate to="/progetti" /> : <Navigate to="/login" />} />
        </Routes>
  );
};

export default AppRoutes;
