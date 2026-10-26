import { Router } from 'express';
import { listar, obtenerPorId, crear, actualizar, eliminar } from './documentos.controller.js';
import { verificarToken, verificarAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

// Consultas públicas de normativas/documentos
router.get('/', listar);
router.get('/:id', obtenerPorId);

// Operaciones de gestión protegidas por token y permisos de admin
router.post('/', verificarToken, verificarAdmin, crear);
router.patch('/:id', verificarToken, verificarAdmin, actualizar);
router.delete('/:id', verificarToken, verificarAdmin, eliminar);

export default router;