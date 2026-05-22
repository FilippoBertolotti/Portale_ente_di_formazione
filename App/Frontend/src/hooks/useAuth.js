import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Errore: useAuth deve essere usato all'interno di un AuthProvider");
  }
  return context;
};