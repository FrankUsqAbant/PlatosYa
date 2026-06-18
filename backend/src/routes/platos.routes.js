import { Router } from 'express';
import {
  getPlatos,
  getPlatoById,
  createPlato,
  updatePlato,
  deletePlato,
} from '../controllers/platos.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import requireRole from '../middleware/role.middleware.js';

const router = Router();

// Rutas públicas: listar y ver platos
router.get('/', getPlatos);
router.get('/:id', getPlatoById);

// Rutas protegidas: solo cocinero puede crear, editar y eliminar
router.post('/', authMiddleware, requireRole('cocinero'), createPlato);
router.put('/:id', authMiddleware, requireRole('cocinero'), updatePlato);
router.delete('/:id', authMiddleware, requireRole('cocinero'), deletePlato);

export default router;
