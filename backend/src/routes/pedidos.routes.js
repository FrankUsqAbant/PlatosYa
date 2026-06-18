import { Router } from 'express';
import {
  createPedido,
  getPedidos,
  getPedidoById,
  updateEstado,
} from '../controllers/pedidos.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import requireRole from '../middleware/role.middleware.js';

const router = Router();

// Todas las rutas de pedidos requieren autenticación
router.post('/', authMiddleware, createPedido);
router.get('/', authMiddleware, getPedidos);
router.get('/:id', authMiddleware, getPedidoById);

// Solo cocineros pueden cambiar el estado de un pedido
router.patch('/:id/estado', authMiddleware, requireRole('cocinero'), updateEstado);

export default router;
