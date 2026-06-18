import jwt from 'jsonwebtoken';

// Variable a nivel de módulo para almacenar la instancia de Socket.IO
let io = null;

// Establecer la instancia de IO (llamado desde server.js)
export const setIO = (ioInstance) => {
  io = ioInstance;
};

// Obtener la instancia de IO (usado por los controladores)
export const getIO = () => {
  if (!io) {
    console.warn('⚠️ Socket.IO no ha sido inicializado todavía');
  }
  return io;
};

// Configurar los eventos de Socket.IO
export const setupSockets = (ioInstance) => {
  ioInstance.on('connection', (socket) => {
    console.log(`🔌 Cliente conectado: ${socket.id}`);

    // Intentar verificar JWT del handshake para identificar al usuario
    const token = socket.handshake.auth?.token;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        socket.userRole = decoded.role;

        console.log(`👤 Usuario autenticado via socket: ${decoded.id} (${decoded.role})`);

        // Unir al usuario a su sala personal (para notificaciones individuales)
        socket.join(`user:${decoded.id}`);

        // Si es cocinero, unirlo a la sala de cocineros
        if (decoded.role === 'cocinero') {
          socket.join('cocineros');
          console.log(`👨‍🍳 Cocinero unido a sala 'cocineros': ${socket.id}`);
        }
      } catch (error) {
        console.log(`⚠️ Token inválido en socket: ${socket.id}`);
      }
    }

    // Manejar desconexión
    socket.on('disconnect', (reason) => {
      console.log(`🔌 Cliente desconectado: ${socket.id} - Razón: ${reason}`);
    });
  });
};
