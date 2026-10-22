import { Router } from 'express';
import { listar, crear, actualizar, modificarPermisos } from './usuarios.controller.js';
import { verificarToken,  verificarAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

// Aplica los middlewares de seguridad a todas las rutas de este router
router.use(verificarToken, verificarAdmin);

// Definición de los endpoints de usuarios según el contrato de la API
router.get('/', listar);                  // GET /api/v1/usuarios[cite: 202]
router.post('/', crear);                // POST /api/v1/usuarios[cite: 202]
router.patch('/:id', actualizar);       // PATCH /api/v1/usuarios/:id[cite: 202]
router.put('/:id/permisos', modificarPermisos); // PUT /api/v1/usuarios/:id/permisos[cite: 202]

export default router;