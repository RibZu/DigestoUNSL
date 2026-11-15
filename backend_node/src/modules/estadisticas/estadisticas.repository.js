import { pool } from '../../config/db.js';

export const obtenerTotalesDocumentosBD = async () => {
    const totalRes = await pool.query(`SELECT COUNT(*)::INT AS total FROM documento WHERE fecha_baja IS NULL`);
    const total = totalRes.rows[0].total;

    const anioActual = new Date().getFullYear();
    const anioActualRes = await pool.query(
        `SELECT COUNT(*)::INT AS total FROM documento WHERE fecha_baja IS NULL AND anio = $1`,
        [anioActual]
    );
    const del_anio = anioActualRes.rows[0].total;

    const porOrganoRes = await pool.query(`
        SELECT COALESCE(o.nombre, 'Sin órgano') AS organo, COUNT(d.id)::INT AS cantidad
        FROM documento d
        JOIN codificacion c ON d.prefijo = c.prefijo
        LEFT JOIN organo_emisor o ON c.id_organo = o.id
        WHERE d.fecha_baja IS NULL
        GROUP BY o.nombre
        ORDER BY cantidad DESC
    `);

    const porTipoRes = await pool.query(`
        SELECT COALESCE(t.nombre, 'Sin tipo') AS tipo, COUNT(d.id)::INT AS cantidad
        FROM documento d
        JOIN codificacion c ON d.prefijo = c.prefijo
        LEFT JOIN tipo_documento t ON c.id_tipo = t.id
        WHERE d.fecha_baja IS NULL
        GROUP BY t.nombre
        ORDER BY cantidad DESC
    `);

    const porAnioRes = await pool.query(`
        SELECT anio, COUNT(*)::INT AS cantidad
        FROM documento
        WHERE fecha_baja IS NULL
        GROUP BY anio
        ORDER BY anio DESC
    `);

    return {
        total,
        del_anio,
        por_organo: porOrganoRes.rows,
        por_tipo: porTipoRes.rows,
        por_anio: porAnioRes.rows
    };
};

export const obtenerRankingTerminosBD = async (limite = 10) => {
    const { rows } = await pool.query(
        `SELECT termino, busquedas 
         FROM termino_buscado 
         ORDER BY busquedas DESC 
         LIMIT $1`,
        [limite]
    );
    return rows;
};

export const obtenerEstadisticasConcursosBD = async (criterio = 'facultad', desde, hasta) => {
    let columnaGrupo = 'f.sigla';
    switch (criterio) {
        case 'cargo':
            columnaGrupo = 'lc.cargo';
            break;
        case 'dedicacion':
            columnaGrupo = 'lc.dedicacion';
            break;
        case 'caracter':
            columnaGrupo = 'lc.caracter';
            break;
        case 'area':
            columnaGrupo = 'a.nombre';
            break;
        case 'facultad':
        default:
            columnaGrupo = 'f.sigla';
            break;
    }

    const conditions = ['lc.fecha_baja IS NULL'];
    const values = [];

    if (desde) {
        values.push(desde);
        conditions.push(`EXTRACT(YEAR FROM lc.inscripcion_desde) >= $${values.length}`);
    }
    if (hasta) {
        values.push(hasta);
        conditions.push(`EXTRACT(YEAR FROM lc.inscripcion_desde) <= $${values.length}`);
    }

    const where = `WHERE ${conditions.join(' AND ')}`;

    const query = `
        SELECT EXTRACT(YEAR FROM lc.inscripcion_desde)::INT AS anio,
               COALESCE(${columnaGrupo}::TEXT, 'No especificado') AS categoria,
               COUNT(*)::INT AS llamados
        FROM llamado_concurso lc
        JOIN area a ON lc.id_area = a.id
        JOIN departamento dep ON a.id_departamento = dep.id
        JOIN dependencia f ON dep.id_dependencia = f.id
        ${where}
        GROUP BY anio, categoria
        ORDER BY anio DESC, llamados DESC
    `;

    const { rows } = await pool.query(query, values);
    return rows;
};
