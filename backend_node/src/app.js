// backend-node/src/app.js
const express = require('express');
const cors = require('cors');

// Aquí importaremos después los routers de tus módulos
// const usuariosRoutes = require('./modules/usuarios/usuarios.routes');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Ruta de prueba inicial
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Digesto UNSL API funcionando' });
});

// Montaje de rutas por módulos (ejemplo futuro)
// app.use('/api/usuarios', usuariosRoutes);

// Manejador centralizado de errores (al final de todo)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;