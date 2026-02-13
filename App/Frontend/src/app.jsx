import AppRoutes from './routes/appRoutes';
import { AuthProvider } from './context/authContext';
import { BrowserRouter } from 'react-router-dom';
import Layout from './components/layout/layout';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <AppRoutes />
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
