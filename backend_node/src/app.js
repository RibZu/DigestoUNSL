import express from 'express';
import cors from 'cors';
import { corsOptions } from './config/cors.js';
import { notFound } from './middlewares/notFound.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';

import authRoutes from './modules/auth/auth.routes.js';
import usuariosRoutes from './modules/usuarios/usuarios.routes.js';
import documentosRoutes from './modules/documentos/documentos.routes.js';
import busquedaRoutes from './modules/busqueda/busqueda.routes.js';
import catalogosRoutes from './modules/catalogos/catalogos.routes.js';
import planesRoutes from './modules/planes/planes.routes.js';
import estadisticasRoutes from './modules/estadisticas/estadisticas.routes.js';
import concursosRoutes from './modules/concursos/concursos.routes.js';
import restablecimientosRoutes from './modules/restablecimientos/restablecimientos.routes.js';

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/usuarios', usuariosRoutes);
app.use('/api/v1/documentos', documentosRoutes);
app.use('/api/v1/busqueda', busquedaRoutes);
app.use('/api/v1/planes', planesRoutes);
app.use('/api/v1/estadisticas', estadisticasRoutes);
app.use('/api/v1/concursos', concursosRoutes);
app.use('/api/v1/restablecimientos', restablecimientosRoutes);
app.use('/api/v1/catalogos', catalogosRoutes);
app.use('/api/v1', catalogosRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
