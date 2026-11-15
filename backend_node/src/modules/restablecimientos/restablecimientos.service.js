import bcrypt from 'bcryptjs';
import { conTransaccion } from '../../config/transaccion.js';
import { crearError } from '../documentos/errores.js';
import { FORMATO_EMAIL, esTelefonoValido, esDniValido } from '../usuarios/contacto.js';
import {
    guardarPendiente,
    listarSolicitudes,
    obtenerSolicitud,
    cambiarClaveCuenta,
    cerrarSolicitud
} from './restablecimientos.repository.js';

const ESTADOS = ['pendientes', 'resueltas', 'todas'];
const RESULTADOS = ['restablecida', 'rechazada'];

const recortar = (valor) => (typeof valor === 'string' ? valor.trim() : '');

export const crearSolicitud = async (datos) => {
    const origen = datos ?? {};
    const nombre = recortar(origen.nombre);
    const email = recortar(origen.email);
    const telefono = recortar(origen.telefono);
    const dni = recortar(origen.dni);

    const campos = {};
    if (!nombre || nombre.length > 100) campos.nombre = 'Ingresá tu nombre.';
    if (!FORMATO_EMAIL.test(email) || email.length > 150) {
        campos.email = 'Ingresá un correo válido, por ejemplo nombre@unsl.edu.ar.';
    }
    if (!esTelefonoValido(telefono)) campos.telefono = 'Ingresá un teléfono válido, por ejemplo 2664 123456.';
    if (!esDniValido(dni)) campos.dni = 'Ingresá tu DNI sin puntos (7 u 8 dígitos).';

    if (Object.keys(campos).length > 0) {
        throw crearError('Hay datos inválidos.', 400, campos);
    }

    await guardarPendiente({ nombre, email, telefono, dni });
    return { mensaje: 'Recibimos tu pedido. La administración del Digesto se va a contactar con vos.' };
};

export const listar = async (estado = 'pendientes') => {
    if (!ESTADOS.includes(estado)) {
        throw crearError('El estado tiene que ser pendientes, resueltas o todas.', 400);
    }
    return listarSolicitudes(estado);
};

export const resolver = async (id, cuerpo, idAdmin) => {
    const { resultado, password } = cuerpo ?? {};

    if (!/^\d+$/.test(String(id)) || Number(id) <= 0) {
        throw crearError('El identificador del pedido no es válido.', 400);
    }
    const idSolicitud = Number(id);

    if (!RESULTADOS.includes(resultado)) {
        throw crearError('Hay datos inválidos.', 400, {
            resultado: 'El resultado tiene que ser restablecida o rechazada.'
        });
    }
    if (resultado === 'restablecida' && (typeof password !== 'string' || password.length < 8)) {
        throw crearError('Hay datos inválidos.', 400, {
            password: 'La contraseña tiene que tener al menos 8 caracteres.'
        });
    }

    return conTransaccion(async (client) => {
        const solicitud = await obtenerSolicitud(client, idSolicitud, true);
        if (!solicitud) throw crearError('Pedido no encontrado', 404);
        if (solicitud.fecha_baja) throw crearError('El pedido ya está resuelto.', 409);

        if (resultado === 'restablecida') {
            if (!solicitud.cuenta_activa) throw crearError('No hay una cuenta activa con ese correo.', 409);
            const hash = await bcrypt.hash(password, 10);
            await cambiarClaveCuenta(client, solicitud.id_usuario, hash);
        }

        await cerrarSolicitud(client, idSolicitud, resultado, idAdmin);
        return obtenerSolicitud(client, idSolicitud);
    });
};
