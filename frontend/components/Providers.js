'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { CartProvider } from '@/context/CartContext';
import { SocketProvider } from '@/context/SocketContext';
import { ToastProvider } from '@/context/ToastContext';
import { useEffect } from 'react';

// Limpia el carrito automáticamente si no hay sesión activa
function CartSessionSync() {
  const { data: session, status } = useSession();

  useEffect(() => {
    // Si la sesión está resuelta y no hay usuario logueado, limpiar carrito
    if (status === 'unauthenticated') {
      localStorage.removeItem('platoya_cart');
    }
  }, [status, session]);

  return null;
}

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <CartProvider>
        <CartSessionSync />
        <SocketProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </SocketProvider>
      </CartProvider>
    </SessionProvider>
  );
}
