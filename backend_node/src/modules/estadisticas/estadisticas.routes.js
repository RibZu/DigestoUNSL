import { Router } from 'express';
import { 
    obtenerTotalesDocumentos, 
    obtenerRankingTerminos, 
    obtenerEstadisticasConcursos 
} from './estadisticas.controller.js';
import { verificarToken, verificarAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

// Endpoint público para la página de Estadísticas
router.get('/documentos', obtenerTotalesDocumentos);

// Endpoints protegidos para Administradores
router.get('/terminos', verificarToken, verificarAdmin, obtenerRankingTerminos);
router.get('/concursos', verificarToken, verificarAdmin, obtenerEstadisticasConcursos);

export default router;
