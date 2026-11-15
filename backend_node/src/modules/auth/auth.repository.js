import {pool} from '../../config/db.js';

export const obtenerPermisosUsuario = async (idUsuario) => {
    const { rows } = await pool.query(
        `SELECT p.id_dependencia, d.sigla, p.modulo 
         FROM permiso p
         JOIN dependencia d ON p.id_dependencia = d.id
         WHERE p.id_usuario = $1 AND p.fecha_baja IS NULL`,
        [idUsuario]
    );
    return rows;
};

export const buscarPorEmail = async (email) => {
    const { rows } = await pool.query(
        `SELECT id, nombre, email, password_hash, es_admin, fecha_baja 
         FROM usuario 
         WHERE email = $1`,
        [email]
    );
    return rows[0];
};