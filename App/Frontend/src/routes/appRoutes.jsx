import { useAuth } from '../hooks/useAuth';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/login';
import Progetti from '../pages/progetti';
import Dashboard from '../pages/dashboard';
import Studenti from '../pages/studenti';
import Docenti from '../pages/docenti';
import Aule from '../pages/aule';
import Loader from '../components/common/loader';
import Calendario from '../pages/calendario';

const AppRoutes = () => {
  const { user, loading } = useAuth();
  
  // Aspetta che il controllo auth sia completato
  if (loading) {
    return <Loader />;
  }

  return (
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} /> {/*user ? <Navigate to="/progetti" /> : */}
          <Route path="/progetti" element={user ? <Progetti /> : <Navigate to="/login" />} />
          <Route path="/studenti" element={user ? <Studenti /> : <Navigate to="/login" />} />
          <Route path="/docenti" element={user ? <Docenti /> : <Navigate to="/login" />} />
          <Route path="/aule" element={user ? <Aule /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/calendario" element={user ? <Calendario /> : <Navigate to="/login" />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} /> {/*user ? <Navigate to="/progetti" /> : <Login /> */}
        </Routes>
  );
};

export default AppRoutes;
