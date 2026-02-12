import AppRoutes from './routes/appRoutes';
import { AuthProvider } from './context/authContext';
import { BrowserRouter } from 'react-router-dom';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
