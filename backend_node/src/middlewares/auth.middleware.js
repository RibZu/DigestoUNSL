import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { buscarPorId, obtenerPermisosUsuario } from '../modules/usuarios/usuarios.repository.js';

export const verificarToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Falta el token o el formato es incorrecto' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 1. Verificamos el token
        const payload = jwt.verify(token, env.JWT_SECRET);

        // 2. Delegamos la consulta de la base de datos al REPOSITORIO (respetando la arquitectura)
        const usuario = await buscarPorId(payload.id); // (Necesitamos crear esta función en el repositorio si no está)

        if (!usuario || usuario.fecha_baja) {
            return res.status(401).json({ error: 'Token inválido o cuenta dada de baja' });
        }

        // 3. Obtenemos los permisos usando también el repositorio
        let permisos = [];
        if (!usuario.es_admin) {
            permisos = await obtenerPermisosUsuario(usuario.id);
        }

        // 4. Asignamos a req.usuario
        req.usuario = {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            es_admin: usuario.es_admin,
            permisos
        };

        next();
    } catch (err) {
        const mensaje = err.name === 'TokenExpiredError' ? 'Token vencido' : 'Token inválido';
        return res.status(401).json({ error: mensaje });
    }
};

export const verificarAdmin = (req, res, next) => {
    // req.usuario fue cargado previamente por el middleware verificarToken
    if (!req.usuario || !req.usuario.es_admin) {
        return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador.' });
    }
    next();
};