import { Router } from 'express';
import { login, sesion } from './auth.controller.js';
import { verificarToken } from '../../middlewares/auth.middleware.js';





const router = Router();

// Rutas públicas
router.post('/login', login);

// Ruta protegida (requiere Autenticado / Token Bearer)
router.get('/sesion', verificarToken, sesion);

export default router;