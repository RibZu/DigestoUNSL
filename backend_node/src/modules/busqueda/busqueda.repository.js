import { pool } from '../../config/db.js';

export const buscarDocumentos = async (filtros) => {
    let baseQuery = `
        FROM documento d
        LEFT JOIN dependencia dep_orig ON d.id_dependencia_origen = dep_orig.id
        LEFT JOIN dependencia dep_emis ON d.id_dependencia_emisora = dep_emis.id
        LEFT JOIN codificacion c ON d.prefijo = c.prefijo
        WHERE d.fecha_baja IS NULL
    `;
    const values = [];
    let index = 1;

    // filtros dinamicos
    if (filtros.q) {
        baseQuery += ` AND (d.descripcion ILIKE $${index} OR d.codigo ILIKE $${index})`;
        values.push(`%${filtros.q}%`);
        index++;
    }
    if (filtros.tipo) {
        baseQuery += ` AND c.id_tipo = $${index}`;
        values.push(filtros.tipo);
        index++;
    }
    if (filtros.organo) {
        baseQuery += ` AND c.id_organo = $${index}`;
        values.push(filtros.organo);
        index++;
    }
    if (filtros.dependencia) {
        baseQuery += ` AND (d.id_dependencia_origen = $${index} OR d.id_dependencia_emisora = $${index})`;
        values.push(filtros.dependencia);
        index++;
    }
    if (filtros.numero) {
        baseQuery += ` AND d.numero = $${index}`;
        values.push(filtros.numero);
        index++;
    }
    if (filtros.anio) {
        baseQuery += ` AND d.anio = $${index}`;
        values.push(filtros.anio);
        index++;
    }
    if (filtros.desde) {
        baseQuery += ` AND d.fecha_emision >= $${index}`;
        values.push(filtros.desde);
        index++;
    }
    if (filtros.hasta) {
        baseQuery += ` AND d.fecha_emision <= $${index}`;
        values.push(filtros.hasta);
        index++;
    }

    // 1. Obtener el total de registros que coinciden (para la paginación del frontend)
    const countQuery = `SELECT COUNT(*) ${baseQuery}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count, 10);

    // paginacion
    const limite = Math.min(parseInt(filtros.limite, 10) || 20, 100);
    const pagina = Math.max(parseInt(filtros.pagina, 10) || 1, 1);
    const offset = (pagina - 1) * limite;

    // orden
    let ordenSql = 'ORDER BY d.anio DESC, d.numero DESC';
    if (filtros.orden === 'registro') {
        ordenSql = 'ORDER BY d.fecha_registro DESC';
    } else if (filtros.orden === 'emision') {
        ordenSql = 'ORDER BY d.fecha_emision DESC';
    }

    // 4. Obtener solo los resultados de la página actual
    const dataQuery = `
        SELECT d.*, 
               dep_orig.nombre AS dependencia_origen_nombre, 
               dep_emis.nombre AS dependencia_emisora_nombre 
        ${baseQuery}
        ${ordenSql}
        LIMIT $${index} OFFSET $${index + 1}
    `;
    values.push(limite, offset);

    const { rows: resultados } = await pool.query(dataQuery, values);

    return {
        total,
        pagina,
        limite,
        resultados
    };
};

// Registrar término buscado para estadísticas
export const registrarTerminoBuscado = async (termino) => {
    if (!termino || termino.trim() === '') return;
    const terminoLimpio = termino.trim().toLowerCase();
    
    await pool.query(
        `INSERT INTO termino_buscado (termino, busquedas) 
         VALUES ($1, 1) 
         ON CONFLICT (termino) 
         DO UPDATE SET busquedas = termino_buscado.busquedas + 1`,
        [terminoLimpio]
    );
};

