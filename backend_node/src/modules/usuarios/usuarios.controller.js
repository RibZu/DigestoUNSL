import {
    listarUsuarios,
    crearUsuario,
    actualizarUsuario,
    actualizarPermisos,
    obtenerMiUsuario,
    actualizarMiUsuario
} from './usuarios.service.js';

const MENSAJE_EMAIL_REPETIDO = 'Ya existe un usuario con ese email';

export const listar = async (req, res, next) => {
    try {
        const usuarios = await listarUsuarios();
        res.status(200).json(usuarios);
    } catch (err) {
        next(err);
    }
};

export const crear = async (req, res, next) => {
    try {
        const { nombre, email, password, es_admin, telefono, dni } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({
                error: 'Hay datos inválidos.',
                campos: {
                    general: 'Nombre, email y contraseña son obligatorios.'
                }
            });
        }

        const usuarioCreado = await crearUsuario(nombre, email, password, es_admin, telefono, dni);

        res.status(201).json(usuarioCreado);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: MENSAJE_EMAIL_REPETIDO });
        }
        next(err);
    }
};

export const actualizar = async (req, res, next) => {
    try {
        const { id } = req.params;
        const usuarioActualId = req.usuario.id;

        const usuarioActualizado = await actualizarUsuario(id, req.body, usuarioActualId);

        if (!usuarioActualizado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json(usuarioActualizado);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: MENSAJE_EMAIL_REPETIDO });
        }
        next(err);
    }
};

export const modificarPermisos = async (req, res, next) => {
    try {
        const { id } = req.params;
        const permisos = Array.isArray(req.body) ? req.body : req.body.permisos;

        const permisosActualizados = await actualizarPermisos(id, permisos);

        res.status(200).json(permisosActualizados);
    } catch (err) {
        next(err);
    }
};

export const obtenerYo = async (req, res, next) => {
    try {
        const usuario = await obtenerMiUsuario(req.usuario.id);
        res.status(200).json(usuario);
    } catch (err) {
        next(err);
    }
};

export const actualizarYo = async (req, res, next) => {
    try {
        const usuario = await actualizarMiUsuario(req.usuario.id, req.body);
        res.status(200).json(usuario);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: MENSAJE_EMAIL_REPETIDO });
        }
        next(err);
    }
};
