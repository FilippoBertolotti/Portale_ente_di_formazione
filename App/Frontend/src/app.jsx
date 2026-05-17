import AppRoutes from './routes/appRoutes';
import { AuthProvider } from './context/authContext';
import { BrowserRouter } from 'react-router-dom';
import Layout from './components/layout/layout';
import { ToastProvider } from './components/common/toastProvider';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastProvider>
          <Layout>
            <AppRoutes />
          </Layout>
        </ToastProvider>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
