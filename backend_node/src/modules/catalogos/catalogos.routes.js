import { Router } from 'express';
import * as ctrl from './catalogos.controller.js';
import { verificarToken, verificarAdmin } from '../../middlewares/auth.middleware.js';
import { validarId } from '../../middlewares/idEntero.middleware.js';

const router = Router();

router.param('id', validarId('Registro no encontrado.'));

const tokenOpcional = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return verificarToken(req, res, next);
    }
    next();
};
router.get('/tipos-documento', tokenOpcional, ctrl.listarTipos);
router.post('/tipos-documento', verificarToken, verificarAdmin, ctrl.crearTipo);
router.patch('/tipos-documento/:id', verificarToken, verificarAdmin, ctrl.actualizarTipo);
router.get('/organos', tokenOpcional, ctrl.listarOrganos);
router.post('/organos', verificarToken, verificarAdmin, ctrl.crearOrgano);
router.patch('/organos/:id', verificarToken, verificarAdmin, ctrl.actualizarOrgano);
router.get('/prefijos', tokenOpcional, ctrl.listarPrefijos);
router.post('/prefijos', verificarToken, verificarAdmin, ctrl.crearPrefijo);
router.patch('/prefijos/:prefijo', verificarToken, verificarAdmin, ctrl.actualizarPrefijo);
router.get('/dependencias', tokenOpcional, ctrl.listarDependencias);
router.post('/dependencias', verificarToken, verificarAdmin, ctrl.crearDependencia);
router.patch('/dependencias/:id', verificarToken, verificarAdmin, ctrl.actualizarDependencia);
router.get('/departamentos', tokenOpcional, ctrl.listarDepartamentos);
router.post('/departamentos', verificarToken, verificarAdmin, ctrl.crearDepartamento);
router.patch('/departamentos/:id', verificarToken, verificarAdmin, ctrl.actualizarDepartamento);
router.get('/areas', tokenOpcional, ctrl.listarAreas);
router.post('/areas', verificarToken, verificarAdmin, ctrl.crearArea);
router.patch('/areas/:id', verificarToken, verificarAdmin, ctrl.actualizarArea);

export default router;
