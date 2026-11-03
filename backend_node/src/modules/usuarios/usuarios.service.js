import bcrypt from 'bcryptjs';
import {
    obtenerTodos,
    buscarPorEmailCompleto,
    buscarPorId,
    buscarDependenciasActivas,
    reactivarUsuarioBD,
    crear,
    actualizarUsuarioBD,
    actualizarPermisosBD
} from './usuarios.repository.js';

const SALT_ROUNDS = 10;
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MODULOS = ['documentos', 'concursos'];
const MAXIMO_ENTERO = 2147483647;

const crearError = (mensaje, status = 400) => {
    const error = new Error(mensaje);
    error.status = status;
    return error;
};

const esEnteroPositivo = (valor) => Number.isInteger(valor) && valor > 0 && valor <= MAXIMO_ENTERO;

const validarIdCuenta = (id) => {
    if (!/^\d+$/.test(String(id)) || !esEnteroPositivo(Number(id))) {
        throw crearError('El id de la cuenta tiene que ser un número entero positivo.');
    }
};

const validarCuenta = (datos, esAlta) => {
    const { nombre, email, password, es_admin, baja } = datos;

    if (nombre !== undefined && (typeof nombre !== 'string' || !nombre.trim() || nombre.length > 100)) {
        throw crearError('El nombre tiene que ser un texto no vacío de hasta 100 caracteres.');
    }
    if (email !== undefined && (typeof email !== 'string' || !FORMATO_EMAIL.test(email) || email.length > 150)) {
        throw crearError('El correo tiene que tener un formato válido y hasta 150 caracteres.');
    }
    if (password !== undefined && (typeof password !== 'string' || password.length < 8)) {
        throw crearError('La contraseña tiene que ser un texto de al menos 8 caracteres.');
    }
    if (es_admin !== undefined && typeof es_admin !== 'boolean') {
        throw crearError('es_admin tiene que ser true o false.');
    }
    if (!esAlta && baja !== undefined && typeof baja !== 'boolean') {
        throw crearError('baja tiene que ser true o false.');
    }
};

export const listarUsuarios = async () => {
    return await obtenerTodos();
};

export const crearUsuario = async (nombre, email, password, es_admin = false) => {
    validarCuenta({ nombre, email, password, es_admin }, true);

    const usuarioExistente = await buscarPorEmailCompleto(email);
    if (usuarioExistente && !usuarioExistente.fecha_baja) {
        const error = new Error('Ya existe un usuario con ese email');
        error.code = '23505';
        throw error;
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    if (usuarioExistente) {
        return await reactivarUsuarioBD(usuarioExistente.id, nombre, hash, es_admin);
    }
    return await crear(nombre, email, hash, es_admin);
};

export const actualizarUsuario = async (id, datos, usuarioActualId) => {
    validarIdCuenta(id);
    validarCuenta(datos, false);

    if (datos.baja === true && Number(id) === Number(usuarioActualId)) {
        throw crearError('Un administrador no puede darse de baja a sí mismo', 409);
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
        throw crearError('No se enviaron campos para actualizar');
    }

    const setQuery = sets.join(', ');
    return await actualizarUsuarioBD(id, { setQuery, values });
};

export const actualizarPermisos = async (idUsuario, permisos) => {
    validarIdCuenta(idUsuario);

    const usuario = await buscarPorId(idUsuario);
    if (!usuario) {
        throw crearError('Usuario no encontrado', 404);
    }

    if (!Array.isArray(permisos)) {
        throw crearError('El formato de permisos debe ser un arreglo.');
    }

    for (const perm of permisos) {
        if (!perm || typeof perm !== 'object' || !perm.id_dependencia || !perm.modulo) {
            throw crearError(
                'Cada elemento de permisos debe ser un objeto con id_dependencia (número) y modulo ("documentos" o "concursos"). Ejemplo: [{ "id_dependencia": 4, "modulo": "documentos" }]'
            );
        }
        if (!esEnteroPositivo(perm.id_dependencia)) {
            throw crearError('id_dependencia tiene que ser un número entero.');
        }
        if (!MODULOS.includes(perm.modulo)) {
            throw crearError(`Módulo inválido: "${perm.modulo}". Los valores permitidos son "documentos" o "concursos".`);
        }
    }

    const ids = [...new Set(permisos.map((perm) => perm.id_dependencia))];
    if (ids.length > 0) {
        const activas = (await buscarDependenciasActivas(ids)).map((dependencia) => dependencia.id);
        const faltante = ids.find((idDependencia) => !activas.includes(idDependencia));
        if (faltante !== undefined) {
            throw crearError(`La dependencia ${faltante} no existe o está dada de baja.`);
        }
    }

    return await actualizarPermisosBD(idUsuario, permisos);
};
