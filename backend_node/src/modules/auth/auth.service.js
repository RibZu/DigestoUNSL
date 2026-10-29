import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { buscarPorEmail, obtenerPermisosUsuario } from './auth.repository.js';
import { env } from '../../config/env.js';

export const autenticarUsuario = async (email, password) => {
    // buscar usuario
    const usuario = await buscarPorEmail(email);

    // validar que exista y este activo
    if (!usuario || usuario.fecha_baja) {
        const error = new Error('Correo o contraseña incorrectos');
        error.status = 401;
        throw error;
    }

    // verificar password
    const passwordOk = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordOk) {
        const error = new Error('Correo o contraseña incorrectos');
        error.status = 401;
        throw error;
    }

    // generar token
    const token = jwt.sign(
        { id: usuario.id },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN ?? '1h' }
    );

    // permisos si no es admin
    let permisos = [];
    if (!usuario.es_admin) {
        permisos = await obtenerPermisosUsuario(usuario.id);
    }

    
    return {
        token,
        usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            es_admin: usuario.es_admin,
            permisos
        }
    };
};