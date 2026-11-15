import bcrypt from 'bcryptjs';
import {
    obtenerTodos,
    obtenerPermisosUsuario,
    buscarPorEmailCompleto,
    buscarPorId,
    buscarClavePorId,
    buscarDependenciasActivas,
    reactivarUsuarioBD,
    crear,
    actualizarUsuarioBD,
    actualizarPermisosBD
} from './usuarios.repository.js';
import { crearError } from '../documentos/errores.js';
import { FORMATO_EMAIL, esTelefonoValido, esDniValido, textoOpcional } from './contacto.js';

const SALT_ROUNDS = 10;
const MODULOS = ['documentos', 'concursos'];
const MAXIMO_ENTERO = 2147483647;
const CAMPOS_ADMIN = ['nombre', 'email', 'telefono', 'dni', 'password', 'es_admin', 'baja'];
const CAMPOS_PROPIOS = ['nombre', 'email', 'telefono', 'dni', 'password'];
const NO_EDITABLES_PROPIOS = ['es_admin', 'permisos', 'baja'];

const esEnteroPositivo = (valor) => Number.isInteger(valor) && valor > 0 && valor <= MAXIMO_ENTERO;

const validarIdCuenta = (id) => {
    if (!/^\d+$/.test(String(id)) || !esEnteroPositivo(Number(id))) {
        throw crearError('El id de la cuenta tiene que ser un número entero positivo.');
    }
};

const lanzarSiHay = (campos) => {
    if (Object.keys(campos).length > 0) throw crearError('Hay datos inválidos.', 400, campos);
};

const erroresDeCuenta = (datos, esAlta) => {
    const { nombre, email, password, es_admin, baja, telefono, dni } = datos;
    const campos = {};

    if (nombre !== undefined && (typeof nombre !== 'string' || !nombre.trim() || nombre.length > 100)) {
        campos.nombre = 'El nombre tiene que ser un texto no vacío de hasta 100 caracteres.';
    }
    if (email !== undefined && (typeof email !== 'string' || !FORMATO_EMAIL.test(email) || email.length > 150)) {
        campos.email = 'El correo tiene que tener un formato válido y hasta 150 caracteres.';
    }
    if (password !== undefined && (typeof password !== 'string' || password.length < 8)) {
        campos.password = 'La contraseña tiene que ser un texto de al menos 8 caracteres.';
    }
    if (es_admin !== undefined && typeof es_admin !== 'boolean') {
        campos.es_admin = 'es_admin tiene que ser true o false.';
    }
    if (!esAlta && baja !== undefined && typeof baja !== 'boolean') {
        campos.baja = 'baja tiene que ser true o false.';
    }
    if (textoOpcional(telefono) !== null && !esTelefonoValido(telefono)) {
        campos.telefono = 'El teléfono tiene dígitos, espacios, +, - y paréntesis, entre 6 y 30 caracteres.';
    }
    if (textoOpcional(dni) !== null && !esDniValido(dni)) {
        campos.dni = 'El DNI tiene 7 u 8 dígitos, sin puntos.';
    }

    return campos;
};

const armarCambios = async (datos, permitidos) => {
    const sets = [];
    const values = [];

    for (const campo of permitidos) {
        if (datos[campo] === undefined) continue;
        if (campo === 'password') {
            sets.push(`password_hash = $${values.length + 1}`);
            values.push(await bcrypt.hash(datos.password, SALT_ROUNDS));
        } else if (campo === 'baja') {
            sets.push(`fecha_baja = $${values.length + 1}`);
            values.push(datos.baja ? new Date() : null);
        } else if (campo === 'telefono' || campo === 'dni') {
            sets.push(`${campo} = $${values.length + 1}`);
            values.push(textoOpcional(datos[campo]));
        } else if (campo === 'nombre' || campo === 'email') {
            sets.push(`${campo} = $${values.length + 1}`);
            values.push(datos[campo].trim());
        } else {
            sets.push(`${campo} = $${values.length + 1}`);
            values.push(datos[campo]);
        }
    }

    return { setQuery: sets.join(', '), values };
};

export const listarUsuarios = async () => {
    const usuarios = await obtenerTodos();
    return await Promise.all(
        usuarios.map(async (usuario) => ({
            ...usuario,
            permisos: usuario.es_admin ? [] : await obtenerPermisosUsuario(usuario.id)
        }))
    );
};

export const crearUsuario = async (nombre, email, password, es_admin = false, telefono, dni) => {
    lanzarSiHay(erroresDeCuenta({ nombre, email, password, es_admin, telefono, dni }, true));

    const usuarioExistente = await buscarPorEmailCompleto(email);
    if (usuarioExistente && !usuarioExistente.fecha_baja) {
        const error = new Error('Ya existe un usuario con ese email');
        error.code = '23505';
        throw error;
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const telefonoGuardado = textoOpcional(telefono);
    const dniGuardado = textoOpcional(dni);

    if (usuarioExistente) {
        return await reactivarUsuarioBD(usuarioExistente.id, nombre, hash, es_admin, telefonoGuardado, dniGuardado);
    }
    return await crear(nombre, email, hash, es_admin, telefonoGuardado, dniGuardado);
};

export const actualizarUsuario = async (id, datos, usuarioActualId) => {
    validarIdCuenta(id);
    lanzarSiHay(erroresDeCuenta(datos, false));

    if (datos.baja === true && Number(id) === Number(usuarioActualId)) {
        throw crearError('Un administrador no puede darse de baja a sí mismo', 409);
    }

    const cambios = await armarCambios(datos, CAMPOS_ADMIN);

    if (cambios.values.length === 0) {
        throw crearError('No se enviaron campos para actualizar');
    }

    return await actualizarUsuarioBD(id, cambios);
};

export const obtenerMiUsuario = async (id) => {
    const usuario = await buscarPorId(id);
    if (!usuario) throw crearError('Usuario no encontrado', 404);

    return {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono,
        dni: usuario.dni,
        es_admin: usuario.es_admin,
        permisos: usuario.es_admin ? [] : await obtenerPermisosUsuario(usuario.id)
    };
};

export const actualizarMiUsuario = async (id, datos = {}) => {
    const campos = erroresDeCuenta(datos, false);

    for (const campo of NO_EDITABLES_PROPIOS) {
        if (datos[campo] !== undefined) campos[campo] = 'Este dato no se puede cambiar desde Mi usuario.';
    }

    if (datos.password !== undefined && !campos.password) {
        if (typeof datos.password_actual !== 'string' || datos.password_actual === '') {
            campos.password_actual = 'Ingresá tu contraseña actual.';
        } else {
            const hash = await buscarClavePorId(id);
            const coincide = hash ? await bcrypt.compare(datos.password_actual, hash) : false;
            if (!coincide) campos.password_actual = 'La contraseña actual no es correcta.';
        }
    }

    lanzarSiHay(campos);

    if (datos.email !== undefined) {
        const otra = await buscarPorEmailCompleto(datos.email.trim());
        if (otra && Number(otra.id) !== Number(id)) {
            throw crearError('Ya existe un usuario con ese email', 409);
        }
    }

    const cambios = await armarCambios(datos, CAMPOS_PROPIOS);

    if (cambios.values.length === 0) {
        throw crearError('No se enviaron campos para actualizar');
    }

    await actualizarUsuarioBD(id, cambios);
    return await obtenerMiUsuario(id);
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
