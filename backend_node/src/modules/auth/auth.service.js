import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { buscarPorEmail, obtenerPermisosUsuario } from '../usuarios/usuarios.repository.js';
import { env } from '../../config/env.js';

export const autenticarUsuario = async (email, password) => {
    // 1. Buscar al usuario en la base de datos
    const usuario = await buscarPorEmail(email);

    // 2. Validar si el usuario existe o si fue dado de baja (fecha_baja no es nula)[cite: 205]
    if (!usuario || usuario.fecha_baja) {
        const error = new Error('Correo o contraseña incorrectos');
        error.status = 401;
        throw error;
    }

    // 3. Comparar la contraseña ingresada con el hash guardado usando bcrypt[cite: 21]
    const passwordOk = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordOk) {
        const error = new Error('Correo o contraseña incorrectos');
        error.status = 401;
        throw error;
    }

    // 4. Firmar el token JWT (el contrato especifica que lleva solo el id)[cite: 194]
    const token = jwt.sign(
        { id: usuario.id },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN ?? '8h' }
    );

    // 5. Buscar los permisos activos de la cuenta (si no es admin)
    let permisos = [];
    if (!usuario.es_admin) {
        permisos = await obtenerPermisosUsuario(usuario.id);
    }

    // 6. Retornar el formato exacto que exige la API de tu grupo[cite: 210]
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