import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Funzione per mostrare il toast, memorizzata con useCallback per ottimizzare le performance
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now(); // ID univoco per il ciclo map e la rimozione
    
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    // Rimuove automaticamente il toast dopo 4 secondi
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Container dei Toast posizionato fisso nello schermo */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem 
            key={toast.id} 
            toast={toast} 
            onClose={() => removeToast(toast.id)} 
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Custom hook per usare i toast nei componenti figli
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve essere usato all\'interno di un ToastProvider');
  }
  return context;
};

// --- COMPONENTE VISIVO DEL SINGOLO TOAST ---
const ToastItem = ({ toast, onClose }) => {
  const { message, type } = toast;

  // Configurazione degli stili in base al tipo di operazione CRUD
  const styles = {
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: (
        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    error: {
      bg: 'bg-rose-50 border-rose-200 text-rose-800',
      icon: (
        <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    },
    info: {
      bg: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: (
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  };

  const currentStyle = styles[type] || styles.success;

  return (
    <div className={`pointer-events-auto flex items-center p-4 rounded-xl border shadow-lg animate-fade-in-up transition-all duration-300 ${currentStyle.bg}`}>
      <div className="flex-shrink-0">{currentStyle.icon}</div>
      <div className="ml-3 text-sm font-medium pr-4">{message}</div>
      <button
        onClick={onClose}
        className="ml-auto bg-transparent text-gray-400 hover:text-gray-900 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};