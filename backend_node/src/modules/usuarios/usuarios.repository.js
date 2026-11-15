import { pool } from '../../config/db.js';

export const crear = async (nombre, email, hash, es_admin = false, telefono = null, dni = null) => {
    const { rows } = await pool.query(
        `INSERT INTO usuario (nombre, email, password_hash, es_admin, telefono, dni)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, nombre, email, telefono, dni, es_admin, fecha_alta`,
        [nombre, email, hash, es_admin, telefono, dni]
    );
    return rows[0];
};

export const buscarPorEmailCompleto = async (email) => {
    const { rows } = await pool.query(
        `SELECT id, nombre, email, password_hash, es_admin, fecha_baja FROM usuario WHERE email = $1`,
        [email]
    );
    return rows[0];
};

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

export const buscarPorId = async (id) => {
    const { rows } = await pool.query(
        `SELECT id, nombre, email, telefono, dni, es_admin, fecha_baja
         FROM usuario
         WHERE id = $1`,
        [id]
    );
    return rows[0];
};

export const buscarClavePorId = async (id) => {
    const { rows } = await pool.query(
        `SELECT password_hash FROM usuario WHERE id = $1`,
        [id]
    );
    return rows[0]?.password_hash;
};

export const obtenerTodos = async () => {
    const { rows } = await pool.query(
        `SELECT id, nombre, email, telefono, dni, es_admin, fecha_baja
         FROM usuario
         ORDER BY (fecha_baja IS NOT NULL), nombre`
    );
    return rows;
};

export const buscarDependenciasActivas = async (ids) => {
    const { rows } = await pool.query(
        `SELECT id FROM dependencia WHERE id = ANY($1) AND fecha_baja IS NULL`,
        [ids]
    );
    return rows;
};

export const reactivarUsuarioBD = async (id, nombre, passwordHash, esAdmin, telefono = null, dni = null) => {
    const { rows } = await pool.query(
        `UPDATE usuario
         SET nombre = $1, password_hash = $2, es_admin = $3, telefono = $4, dni = $5, fecha_baja = NULL
         WHERE id = $6
         RETURNING id, nombre, email, telefono, dni, es_admin, fecha_alta, fecha_baja`,
        [nombre, passwordHash, esAdmin, telefono, dni, id]
    );
    return rows[0];
};

export const actualizarUsuarioBD = async (id, camposDinamicos) => {
    const { setQuery, values } = camposDinamicos;
    const query = `UPDATE usuario SET ${setQuery} WHERE id = $${values.length + 1} RETURNING id, nombre, email, telefono, dni, es_admin, fecha_baja`;
    values.push(id);

    const { rows } = await pool.query(query, values);
    return rows[0];
};

export const actualizarPermisosBD = async (idUsuario, nuevosPermisos) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        await client.query(
            `UPDATE permiso SET fecha_baja = NOW() WHERE id_usuario = $1 AND fecha_baja IS NULL`,
            [idUsuario]
        );

        for (const perm of nuevosPermisos) {
            const { rows: existente } = await client.query(
                `SELECT 1 FROM permiso WHERE id_usuario = $1 AND id_dependencia = $2 AND modulo = $3`,
                [idUsuario, perm.id_dependencia, perm.modulo]
            );

            if (existente.length > 0) {
                await client.query(
                    `UPDATE permiso SET fecha_baja = NULL WHERE id_usuario = $1 AND id_dependencia = $2 AND modulo = $3`,
                    [idUsuario, perm.id_dependencia, perm.modulo]
                );
            } else {
                await client.query(
                    `INSERT INTO permiso (id_usuario, id_dependencia, modulo) VALUES ($1, $2, $3)`,
                    [idUsuario, perm.id_dependencia, perm.modulo]
                );
            }
        }

        await client.query('COMMIT');

        const { rows: actualizados } = await client.query(
            `SELECT p.id_dependencia, d.sigla, p.modulo
             FROM permiso p
             JOIN dependencia d ON p.id_dependencia = d.id
             WHERE p.id_usuario = $1 AND p.fecha_baja IS NULL`,
            [idUsuario]
        );
        return actualizados;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};
