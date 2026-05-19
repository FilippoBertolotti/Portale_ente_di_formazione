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

// Componente per proteggere le route
const ProtectedRoute = ({ children, allowedLevels = [] }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedLevels.length > 0 && !allowedLevels.includes(user.livello)) {
    return <Navigate to="/calendario" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <Loader />;
  }

  return (
    <Routes>
      {/* Route pubbliche */}
      <Route path="/login" element={<Login />} />
      
      {/* Route protette */}
      <Route 
        path="/calendario" 
        element={
          <ProtectedRoute>
            <Calendario />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/progetti" 
        element={
          <ProtectedRoute>
            <Progetti />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/aule" 
        element={
          <ProtectedRoute>
            <Aule />
          </ProtectedRoute>
        } 
      />
      
      {/* Route solo admin */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedLevels={[0]}>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/studenti" 
        element={
          <ProtectedRoute allowedLevels={[0]}>
            <Studenti />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/docenti" 
        element={
          <ProtectedRoute allowedLevels={[0]}>
            <Docenti />
          </ProtectedRoute>
        } 
      />
      
      {/* Redirect basati sul ruolo */}
      <Route 
        path="/" 
        element={
          <Navigate 
            to={user ? (user.livello === 0 ? "/dashboard" : "/calendario") : "/login"} 
            replace 
          />
        } 
      />
      
      {/* Catch-all */}
      <Route 
        path="*" 
        element={
          <Navigate 
            to={user ? (user.livello === 0 ? "/dashboard" : "/calendario") : "/login"} 
            replace 
          />
        } 
      />
    </Routes>
  );
};

export default AppRoutes;