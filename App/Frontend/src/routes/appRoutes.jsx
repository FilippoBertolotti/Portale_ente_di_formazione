import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Se hai questo hook

const TestPage = () => <h1>Test funziona!</h1>;

const AppRoutes = () => {
  console.log('AppRoutes rendering');
  
  return (
    <Routes>
      <Route path="/" element={<TestPage />} />
      <Route path="*" element={<TestPage />} />
    </Routes>
  );
};

export default AppRoutes;