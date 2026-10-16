import express from 'express';
import cors from 'cors';
import { corsOptions } from './config/cors.js';
import { notFound } from './middlewares/notFound.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

// Ruta de prueba inicial
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Digesto UNSL API funcionando' });
});

// Primero la ruta 404 (Pagina no encontrada), después el manejo de errores
app.use(notFound);
app.use(errorHandler);

export default app;
