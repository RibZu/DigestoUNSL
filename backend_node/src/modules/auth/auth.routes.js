import { Router } from 'express';
import { login, sesion } from './auth.controller.js';
import { verificarToken } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/', login);

// ruta protegida con jwt
router.get('/sesion', verificarToken, sesion);

export default router;