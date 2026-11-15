import { pool } from '../../config/db.js';

const SELECT_SOLICITUD = `
    SELECT s.id, s.nombre, s.email, s.telefono, s.dni, s.fecha_solicitud, s.resultado, s.fecha_baja,
        u.id AS id_usuario,
        u.nombre AS nombre_cuenta,
        (u.id IS NOT NULL AND u.fecha_baja IS NULL) AS cuenta_activa,
        COALESCE(u.dni = s.dni, false) AS coincide_dni,
        COALESCE(regexp_replace(u.telefono, '\\D', '', 'g') = regexp_replace(s.telefono, '\\D', '', 'g'), false) AS coincide_telefono
    FROM solicitud_restablecimiento s
    LEFT JOIN usuario u ON lower(u.email) = lower(s.email)
`;

const FILTROS_LISTADO = {
    pendientes: `WHERE s.fecha_baja IS NULL ORDER BY s.fecha_solicitud, s.id`,
    resueltas: `WHERE s.fecha_baja IS NOT NULL ORDER BY s.fecha_baja DESC, s.id DESC`,
    todas: `ORDER BY (s.fecha_baja IS NOT NULL),
        CASE WHEN s.fecha_baja IS NULL THEN s.fecha_solicitud END,
        CASE WHEN s.fecha_baja IS NULL THEN s.id END,
        s.fecha_baja DESC, s.id DESC`
};

export const guardarPendiente = async ({ nombre, email, telefono, dni }) => {
    await pool.query(
        `INSERT INTO solicitud_restablecimiento (nombre, email, telefono, dni)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT ((lower(email))) WHERE fecha_baja IS NULL DO UPDATE SET
            nombre = EXCLUDED.nombre,
            email = EXCLUDED.email,
            telefono = EXCLUDED.telefono,
            dni = EXCLUDED.dni,
            fecha_solicitud = CURRENT_TIMESTAMP`,
        [nombre, email, telefono, dni]
    );
};

export const listarSolicitudes = async (estado) => {
    const { rows } = await pool.query(`${SELECT_SOLICITUD} ${FILTROS_LISTADO[estado]}`);
    return rows;
};

export const obtenerSolicitud = async (client, id, bloquear = false) => {
    const { rows } = await client.query(
        `${SELECT_SOLICITUD} WHERE s.id = $1${bloquear ? ' FOR UPDATE OF s' : ''}`,
        [id]
    );
    return rows[0] || null;
};

export const cambiarClaveCuenta = async (client, idUsuario, hash) => {
    await client.query(`UPDATE usuario SET password_hash = $1 WHERE id = $2`, [hash, idUsuario]);
};

export const cerrarSolicitud = async (client, id, resultado, idAdmin) => {
    await client.query(
        `UPDATE solicitud_restablecimiento
         SET resultado = $1, fecha_baja = NOW(), id_usuario_baja = $2
         WHERE id = $3`,
        [resultado, idAdmin, id]
    );
};
