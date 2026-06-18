// ==========================================================================
// PlatoYa - Contexto de Notificaciones Toast
// Sistema de toasts con animaciones de entrada/salida
// ==========================================================================

'use client';

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

// Iconos para cada tipo de toast
const TOAST_ICONS = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Eliminar toast con animación de salida
  const removeToast = useCallback((id) => {
    // Primero marca como saliendo para la animación
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isExiting: true } : t))
    );
    // Después de la animación, eliminar del estado
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  // Agregar un nuevo toast
  const addToast = useCallback(
    (message, type = 'info') => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type, isExiting: false }]);

      // Auto-eliminar después de 4 segundos
      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  const value = useMemo(
    () => ({ addToast, removeToast }),
    [addToast, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Contenedor de toasts */}
      <div className="toast-container">
        {toasts.map((toast) => {
          const Icon = TOAST_ICONS[toast.type] || Info;
          return (
            <div
              key={toast.id}
              className={`toast toast-${toast.type} ${
                toast.isExiting ? 'toast-exit' : ''
              }`}
              onClick={() => removeToast(toast.id)}
              style={{ cursor: 'pointer' }}
            >
              <Icon size={18} />
              <span>{toast.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

// Hook personalizado para usar toasts
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  return context;
}
