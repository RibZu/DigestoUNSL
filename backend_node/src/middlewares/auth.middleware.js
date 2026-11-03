import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { buscarPorId, obtenerPermisosUsuario } from '../modules/usuarios/usuarios.repository.js';

export const verificarToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Falta el token o el formato es incorrecto' });
    }

    const token = authHeader.split(' ')[1];

    let payload;
    try {
        payload = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
        const mensaje = err.name === 'TokenExpiredError' ? 'Token vencido' : 'Token inválido';
        return res.status(401).json({ error: mensaje });
    }

    let usuario;
    let permisos = [];
    try {
        usuario = await buscarPorId(payload.id);
        if (usuario && !usuario.fecha_baja && !usuario.es_admin) {
            permisos = await obtenerPermisosUsuario(usuario.id);
        }
    } catch (err) {
        return next(err);
    }

    if (!usuario || usuario.fecha_baja) {
        return res.status(401).json({ error: 'Token inválido o cuenta dada de baja' });
    }

    req.usuario = {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        es_admin: usuario.es_admin,
        permisos
    };

    next();
};

export const verificarAdmin = (req, res, next) => {
    if (!req.usuario || !req.usuario.es_admin) {
        return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador.' });
    }
    next();
};

export const verificarPermiso = (modulo) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ error: 'No autenticado' });
        }
        if (req.usuario.es_admin) {
            return next();
        }
        const tienePermisoModulo = req.usuario.permisos?.some(p => p.modulo === modulo);
        if (!tienePermisoModulo) {
            return res.status(403).json({ error: `Acceso denegado. No posee permisos para el módulo ${modulo}.` });
        }
        next();
    };
};
