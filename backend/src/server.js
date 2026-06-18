import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { setupSockets, setIO } from './sockets/index.js';
import authRoutes from './routes/auth.routes.js';
import platosRoutes from './routes/platos.routes.js';
import pedidosRoutes from './routes/pedidos.routes.js';
import pagosRoutes from './routes/pagos.routes.js';

// Crear aplicación Express y servidor HTTP
const app = express();
const httpServer = createServer(app);

// Configurar Socket.IO con CORS
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
});

// Establecer instancia de IO para que los controladores puedan emitir eventos
setIO(io);

// ─── Middlewares ─────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// ─── Rutas de la API ────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/platos', platosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/pagos', pagosRoutes);

// ─── Health check ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// ─── Configurar Socket.IO ───────────────────────────────────
setupSockets(io);

// ─── Conectar DB e iniciar servidor ─────────────────────────
const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`🚀 Servidor PlatoYa corriendo en puerto ${PORT}`);
    console.log(`📡 WebSocket listo`);
  });
});
