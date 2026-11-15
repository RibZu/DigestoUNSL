import { Router } from 'express';
import { listar, crear, actualizar, modificarPermisos, obtenerYo, actualizarYo } from './usuarios.controller.js';
import { verificarToken, verificarAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(verificarToken);

router.get('/yo', obtenerYo);
router.patch('/yo', actualizarYo);

router.get('/', verificarAdmin, listar);
router.post('/', verificarAdmin, crear);
router.patch('/:id', verificarAdmin, actualizar);
router.put('/:id/permisos', verificarAdmin, modificarPermisos);

export default router;
