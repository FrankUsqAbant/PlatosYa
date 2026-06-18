import { Router } from 'express';
import { verificarPago } from '../controllers/pagos.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

// Ruta para verificar pago de PayPal y crear pedido
router.post('/verificar', authMiddleware, verificarPago);

export default router;
