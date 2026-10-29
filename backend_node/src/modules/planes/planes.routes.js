import { Router } from 'express';
import { listar, obtenerPorCarreraYPlan } from './planes.controller.js';

const router = Router();

// Endpoints públicos de planes de estudio
router.get('/', listar);
router.get('/:carrera/:plan', obtenerPorCarreraYPlan);

export default router;
