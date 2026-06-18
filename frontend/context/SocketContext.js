// ==========================================================================
// PlatoYa - Contexto de Socket.IO
// Conexión en tiempo real con el backend para pedidos
// ==========================================================================

'use client';

import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { io } from 'socket.io-client';
import { useSession } from 'next-auth/react';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { data: session } = useSession();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Solo conectar si hay sesión activa con token
    if (!session?.user?.accessToken) return;

    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      auth: {
        token: session.user.accessToken,
      },
      transports: ['websocket', 'polling'],
    });

    // Eventos de conexión
    socketInstance.on('connect', () => {
      console.log('🔌 Socket conectado:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('🔌 Socket desconectado');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (err) => {
      console.error('❌ Error de conexión socket:', err.message);
      setIsConnected(false);
    });

    setSocket(socketInstance);

    // Limpieza al desmontar o cambiar sesión
    return () => {
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [session?.user?.accessToken]);

  const value = useMemo(
    () => ({ socket, isConnected }),
    [socket, isConnected]
  );

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

// Hook personalizado para acceder al socket
export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket debe usarse dentro de SocketProvider');
  }
  return context;
}
