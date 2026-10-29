import { Router } from 'express';
import { buscar } from './busqueda.controller.js';

const router = Router();

// Endpoint público de búsqueda avanzada
router.get('/', buscar);

export default router;