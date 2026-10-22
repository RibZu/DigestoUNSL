import { 
    listarUsuarios, 
    crearUsuario, 
    actualizarUsuario, 
    actualizarPermisos 
} from './usuarios.service.js';

// 1. Listar todas las cuentas con sus permisos (GET /api/v1/usuarios)
export const listar = async (req, res, next) => {
    try {
        const usuarios = await listarUsuarios();
        res.status(200).json(usuarios);
    } catch (err) {
        next(err);
    }
};

// 2. Crear una nueva cuenta (POST /api/v1/usuarios)
export const crear = async (req, res, next) => {
    try {
        const { nombre, email, password, es_admin } = req.body;

        // Validación básica de campos obligatorios
        if (!nombre || !email || !password) {
            return res.status(400).json({ 
                error: 'Hay datos inválidos.',
                campos: {
                    general: 'Nombre, email y contraseña son obligatorios.'
                }
            });
        }

        const usuarioCreado = await crearUsuario(nombre, email, password, es_admin);
        
        // 201 Created
        res.status(201).json(usuarioCreado);
    } catch (err) {
        // Manejo de conflicto por email duplicado (409)
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Ya existe un usuario con ese email' });
        }
        next(err);
    }
};

// 3. Modificar, dar de baja o reactivar una cuenta (PATCH /api/v1/usuarios/:id)
export const actualizar = async (req, res, next) => {
    try {
        const { id } = req.params;
        const usuarioActualId = req.usuario.id; // Obtenido del middleware de autenticación

        const usuarioActualizado = await actualizarUsuario(id, req.body, usuarioActualId);

        if (!usuarioActualizado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json(usuarioActualizado);
    } catch (err) {
        // Manejo de errores controlados desde el servicio (ej. admin dándose de baja a sí mismo)
        if (err.status) {
            return res.status(err.status).json({ error: err.message });
        }
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Ya existe un usuario con ese email' });
        }
        next(err);
    }
};

// 4. Reemplazar la lista completa de permisos (PUT /api/v1/usuarios/:id/permisos)
export const modificarPermisos = async (req, res, next) => {
    try {
        const { id } = req.params;
        // El body puede mandar directamente el arreglo de permisos o venir en una propiedad
        const permisos = Array.isArray(req.body) ? req.body : req.body.permisos;

        const permisosActualizados = await actualizarPermisos(id, permisos);
        
        res.status(200).json(permisosActualizados);
    } catch (err) {
        if (err.status) {
            return res.status(err.status).json({ error: err.message });
        }
        next(err);
    }
};