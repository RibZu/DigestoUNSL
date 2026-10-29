import { Router } from 'express';
import { listar, obtenerPorId, actualizar } from './documentos.controller.js';
import { verificarToken, verificarPermiso } from '../../middlewares/auth.middleware.js';

const router = Router();

// Consultas públicas de normativas
router.get('/', listar);
router.get('/:id', obtenerPorId);

// Modificar o dar de baja un documento
router.patch('/:id', verificarToken, verificarPermiso('documentos'), actualizar);

export default router;