import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

// Rutas públicas de autenticación
router.post('/register', register);
router.post('/login', login);

// Ruta protegida: obtener usuario actual
router.get('/me', authMiddleware, getMe);

export default router;
