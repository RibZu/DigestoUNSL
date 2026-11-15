import { Router } from 'express';
import { buscar } from './busqueda.controller.js';

const router = Router();

router.get('/', buscar);

export default router;