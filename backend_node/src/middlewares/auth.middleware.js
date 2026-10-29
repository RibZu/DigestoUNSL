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
        //Verificamos el token
        const payload = jwt.verify(token, env.JWT_SECRET);

        //Delegamos la consulta de la base de datos al REPOSITORIO 
        const usuario = await buscarPorId(payload.id); 

        if (!usuario || usuario.fecha_baja) {
            return res.status(401).json({ error: 'Token inválido o cuenta dada de baja' });
        }

        // Obtenemos los permisos
        let permisos = [];
        if (!usuario.es_admin) {
            permisos = await obtenerPermisosUsuario(usuario.id);
        }

        // Asignamos a req.usuario
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

export const verificarPermiso = (modulo) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ error: 'No autenticado' });
        }
        // Administrador tiene acceso total a todos los módulos y dependencias
        if (req.usuario.es_admin) {
            return next();
        }
        // Moderador con permiso en el módulo solicitado
        const tienePermisoModulo = req.usuario.permisos?.some(p => p.modulo === modulo);
        if (!tienePermisoModulo) {
            return res.status(403).json({ error: `Acceso denegado. No posee permisos para el módulo ${modulo}.` });
        }
        next();
    };
};