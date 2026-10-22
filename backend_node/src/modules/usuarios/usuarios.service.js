import bcrypt from 'bcryptjs';
import { 
    obtenerTodos, 
    buscarPorEmailCompleto, 
    buscarPorEmail, 
    reactivarUsuarioBD, 
    crear, 
    actualizarUsuarioBD, 
    actualizarPermisosBD 
} from './usuarios.repository.js';

const SALT_ROUNDS = 10;

//Listar todos los usuarios
export const listarUsuarios = async () => {
    return await obtenerTodos();
};

//Crear un usuario
export const crearUsuario = async (nombre, email, password, es_admin = false) => {
    // Buscamos si el email ya existe en la base (incluso dados de baja)
    const usuarioExistente = buscarPorEmailCompleto 
        ? await buscarPorEmailCompleto(email)
        : await buscarPorEmail(email);

    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    if (usuarioExistente) {
        if (usuarioExistente.fecha_baja) {
            // Regla del proyecto: Si el correo era de una cuenta dada de baja, la reactiva
            return await reactivarUsuarioBD(
                usuarioExistente.id, 
                nombre, 
                hash, 
                es_admin
            );
        } else {
            // Si ya existe y está activo, lanzamos un error con código de duplicado (409)
            const error = new Error('Ya existe un usuario con ese email');
            error.code = '23505';
            throw error;
        }
    }

    // Si no existe, creamos la cuenta nueva
    return await crear(nombre, email, hash, es_admin);
};

//Modificar o dar de baja/reactivar un usuario 
export const actualizarUsuario = async (id, datos, usuarioActualId) => {
    if (datos.baja === true && Number(id) === Number(usuarioActualId)) {
        const error = new Error('Un administrador no puede darse de baja a sí mismo');
        error.status = 409;
        throw error;
    }

    const camposPermitidos = ['nombre', 'email', 'password', 'es_admin', 'baja'];
    const sets = [];
    const values = [];

    for (const campo of camposPermitidos) {
        if (datos[campo] !== undefined) {
            if (campo === 'password') {
                const hash = await bcrypt.hash(datos.password, SALT_ROUNDS);
                sets.push(`password_hash = $${values.length + 1}`);
                values.push(hash);
            } else if (campo === 'baja') {
                sets.push(`fecha_baja = $${values.length + 1}`);
                values.push(datos.baja ? new Date() : null);
            } else {
                sets.push(`${campo} = $${values.length + 1}`);
                values.push(datos[campo]);
            }
        }
    }

    if (sets.length === 0) {
        const error = new Error('No se enviaron campos para actualizar');
        error.status = 400;
        throw error;
    }

    const setQuery = sets.join(', ');
    return await actualizarUsuarioBD(id, { setQuery, values });
};

//modifica la lista completa de permisos de un usuario
export const actualizarPermisos = async (idUsuario, permisos) => {
    if (!Array.isArray(permisos)) {
        const error = new Error('El formato de permisos debe ser un arreglo.');
        error.status = 400;
        throw error;
    }
    return await actualizarPermisosBD(idUsuario, permisos);
};