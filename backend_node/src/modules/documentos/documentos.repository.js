import { pool } from '../../config/db.js';

export const obtenerTodos = async () => {
    const { rows } = await pool.query(
        `SELECT d.*, 
                dep_orig.nombre AS dependencia_origen_nombre, 
                dep_emis.nombre AS dependencia_emisora_nombre 
         FROM documento d
         LEFT JOIN dependencia dep_orig ON d.id_dependencia_origen = dep_orig.id
         LEFT JOIN dependencia dep_emis ON d.id_dependencia_emisora = dep_emis.id
         WHERE d.fecha_baja IS NULL
         ORDER BY d.anio DESC, d.numero DESC`
    );
    return rows;
};

export const obtenerPorId = async (id) => {
    const { rows } = await pool.query(
        `SELECT d.*, 
                dep_orig.nombre AS dependencia_origen_nombre, 
                dep_emis.nombre AS dependencia_emisora_nombre 
         FROM documento d
         LEFT JOIN dependencia dep_orig ON d.id_dependencia_origen = dep_orig.id
         LEFT JOIN dependencia dep_emis ON d.id_dependencia_emisora = dep_emis.id
         WHERE d.id = $1 AND d.fecha_baja IS NULL`,
        [id]
    );
    return rows[0];
};

export const crearDocumento = async (data, userId) => {
    const { 
        codigo, prefijo, id_dependencia_origen, numero, anio, 
        id_dependencia_emisora, fecha_emision, descripcion, 
        archivo_ruta, url_externa 
    } = data;

    const { rows } = await pool.query(
        `INSERT INTO documento (
            codigo, prefijo, id_dependencia_origen, numero, anio, 
            id_dependencia_emisora, fecha_emision, descripcion, 
            archivo_ruta, url_externa, id_usuario_alta
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [
            codigo, prefijo, id_dependencia_origen, numero, anio, 
            id_dependencia_emisora, fecha_emision, descripcion, 
            archivo_ruta, url_externa, userId
        ]
    );
    return rows[0];
};

export const actualizarDocumento = async (id, camposDinamicos, valores) => {
    const { rows } = await pool.query(
        `UPDATE documento SET ${camposDinamicos} WHERE id = $${valores.length} RETURNING *`,
        valores
    );
    return rows[0];
};

export const darDeBajaDocumento = async (id, userId) => {
    const { rows } = await pool.query(
        `UPDATE documento 
         SET fecha_baja = NOW(), id_usuario_baja = $2 
         WHERE id = $1 
         RETURNING *`,
        [id, userId]
    );
    return rows[0];
};