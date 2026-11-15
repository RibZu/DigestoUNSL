import { Router } from 'express';
import { listar, obtenerPorCarreraYPlan } from './planes.controller.js';

const router = Router();

router.get('/', listar);
router.get('/:carrera/:plan', obtenerPorCarreraYPlan);

export default router;
