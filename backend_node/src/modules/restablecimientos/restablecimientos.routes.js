import { Router } from 'express';
import { crear, listar, resolver } from './restablecimientos.controller.js';
import { verificarToken, verificarAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/', crear);
router.get('/', verificarToken, verificarAdmin, listar);
router.patch('/:id', verificarToken, verificarAdmin, resolver);

export default router;
