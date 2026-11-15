import { Router } from 'express';
import { listar, obtenerPorId, crear, actualizar, obtenerArchivo } from './documentos.controller.js';
import { verificarToken, verificarPermiso } from '../../middlewares/auth.middleware.js';
import { subirPdf } from '../../middlewares/subirPdf.middleware.js';
import { validarId } from '../../middlewares/idEntero.middleware.js';

const router = Router();

router.param('id', validarId('Documento no encontrado o dado de baja'));

router.get('/', listar);
router.get('/:id/archivo', obtenerArchivo);
router.get('/:id', obtenerPorId);

router.post('/', verificarToken, verificarPermiso('documentos'), subirPdf, crear);
router.patch('/:id', verificarToken, verificarPermiso('documentos'), subirPdf, actualizar);

export default router;
