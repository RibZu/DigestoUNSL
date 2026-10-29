import { Router } from 'express';
import { listar, crear, actualizar, modificarPermisos } from './usuarios.controller.js';
import { verificarToken,  verificarAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

// Aplica los middlewares de seguridad a todas las rutas de este router
router.use(verificarToken, verificarAdmin);

// endpoints de usuarios
router.get('/', listar);                  // GET /api/v1/usuarios
router.post('/', crear);                // POST /api/v1/usuarios
router.patch('/:id', actualizar);       // PATCH /api/v1/usuarios/:id
router.put('/:id/permisos', modificarPermisos); // PUT /api/v1/usuarios/:id/permisos

export default router;