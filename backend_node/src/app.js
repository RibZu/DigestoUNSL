import express from 'express';
import cors from 'cors';
import { corsOptions } from './config/cors.js';
import { notFound } from './middlewares/notFound.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';

import authRoutes from './modules/auth/auth.routes.js';
import usuariosRoutes from './modules/usuarios/usuarios.routes.js';
import documentosRoutes from './modules/documentos/documentos.routes.js';

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

//rutas de autenticación
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/usuarios', usuariosRoutes);
app.use('/api/v1/documentos', documentosRoutes);

// Manejo de errores y 404
app.use(notFound);
app.use(errorHandler);

export default app;