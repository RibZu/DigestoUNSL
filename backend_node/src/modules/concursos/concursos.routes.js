import { Router } from 'express';
import { listar, obtenerPorId } from './concursos.controller.js';

const router = Router();

// Consultas públicas de concursos docentes
router.get('/', listar);
router.get('/:id', obtenerPorId);

export default router;
