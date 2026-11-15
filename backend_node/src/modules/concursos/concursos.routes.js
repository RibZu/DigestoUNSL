import { Router } from 'express';
import { listar, obtenerPorId, crear, actualizar } from './concursos.controller.js';
import { verificarToken, verificarPermiso } from '../../middlewares/auth.middleware.js';
import { subirPdf } from '../../middlewares/subirPdf.middleware.js';
import { validarId } from '../../middlewares/idEntero.middleware.js';

const router = Router();

router.param('id', validarId('Concurso no encontrado o dado de baja'));

router.get('/', listar);
router.get('/:id', obtenerPorId);

router.post('/', verificarToken, verificarPermiso('concursos'), subirPdf, crear);
router.patch('/:id', verificarToken, verificarPermiso('concursos'), subirPdf, actualizar);

export default router;
