import { useAuth } from '../hooks/useAuth';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/login';
import Progetti from '../pages/progetti';

const AppRoutes = () => {
  const { user } = useAuth();
  return (
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} /> {/*user ? <Navigate to="/progetti" /> : */}
          <Route path="/progetti" element={user ? <Progetti /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} /> {/*user ? <Navigate to="/progetti" /> : <Login /> */}
        </Routes>
  );
};

export default AppRoutes;
