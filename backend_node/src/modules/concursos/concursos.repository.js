import { pool } from '../../config/db.js';

export const buscarConcursosBD = async (filtros) => {
    let whereDoc = 'WHERE d.fecha_baja IS NULL';
    const values = [];
    let index = 1;

    // filtro segun fecha de inscripcion
    let condicionLlamado = 'lc.fecha_baja IS NULL';
    if (filtros.estado === 'vigentes' || !filtros.estado) {
        condicionLlamado += ' AND lc.inscripcion_hasta >= CURRENT_DATE';
    } else if (filtros.estado === 'vencidos') {
        condicionLlamado += ' AND lc.inscripcion_hasta < CURRENT_DATE';
    } // si es 'todos', no agregamos filtro de fecha

    if (filtros.facultad) {
        whereDoc += ` AND LOWER(f.codigo) = LOWER($${index})`;
        values.push(filtros.facultad);
        index++;
    }
    if (filtros.q) {
        whereDoc += ` AND (d.descripcion ILIKE $${index} OR d.codigo ILIKE $${index} OR a.nombre ILIKE $${index})`;
        values.push(`%${filtros.q}%`);
        index++;
    }
    if (filtros.cargo) {
        whereDoc += ` AND lc.cargo::TEXT ILIKE $${index}`;
        values.push(`%${filtros.cargo}%`);
        index++;
    }
    if (filtros.dedicacion) {
        whereDoc += ` AND lc.dedicacion::TEXT ILIKE $${index}`;
        values.push(`%${filtros.dedicacion}%`);
        index++;
    }
    if (filtros.caracter) {
        whereDoc += ` AND lc.caracter::TEXT ILIKE $${index}`;
        values.push(`%${filtros.caracter}%`);
        index++;
    }
    if (filtros.anio) {
        whereDoc += ` AND EXTRACT(YEAR FROM lc.inscripcion_desde) = $${index}`;
        values.push(filtros.anio);
        index++;
    }

    const baseFrom = `
        FROM documento d
        JOIN llamado_concurso lc ON d.id = lc.id_documento AND ${condicionLlamado}
        JOIN area a ON lc.id_area = a.id
        JOIN departamento dep ON a.id_departamento = dep.id
        JOIN dependencia f ON dep.id_dependencia = f.id
        ${whereDoc}
    `;

    // Contar total de documentos únicos con llamados coincidentes
    const countQuery = `SELECT COUNT(DISTINCT d.id)::INT AS total ${baseFrom}`;
    const countRes = await pool.query(countQuery, values);
    const total = countRes.rows[0].total;

    // Paginación
    const limite = Math.min(parseInt(filtros.limite, 10) || 20, 100);
    const pagina = Math.max(parseInt(filtros.pagina, 10) || 1, 1);
    const offset = (pagina - 1) * limite;

    // Obtener los IDs de los documentos para la página actual
    const idsQuery = `
        SELECT DISTINCT d.id, d.anio, d.numero
        ${baseFrom}
        ORDER BY d.anio DESC, d.numero DESC
        LIMIT $${index} OFFSET $${index + 1}
    `;
    values.push(limite, offset);

    const idsRes = await pool.query(idsQuery, values);
    const docIds = idsRes.rows.map(r => r.id);

    if (docIds.length === 0) {
        return { total, pagina, limite, resultados: [] };
    }

    // Traer los documentos con sus llamados completos
    const { rows: docs } = await pool.query(
        `SELECT d.id, d.codigo, d.prefijo, d.numero, d.anio, d.fecha_emision, d.descripcion, d.url_externa,
                f.sigla AS facultad_sigla, f.nombre AS facultad_nombre
         FROM documento d
         LEFT JOIN dependencia f ON d.id_dependencia_emisora = f.id
         WHERE d.id = ANY($1::INT[])
         ORDER BY d.anio DESC, d.numero DESC`,
        [docIds]
    );

    for (const doc of docs) {
        const { rows: llamados } = await pool.query(
            `SELECT lc.id, lc.cargo, lc.dedicacion, lc.caracter, lc.inscripcion_desde, lc.inscripcion_hasta,
                    a.id AS area_id, a.nombre AS area_nombre,
                    dep.id AS departamento_id, dep.nombre AS departamento_nombre
             FROM llamado_concurso lc
             JOIN area a ON lc.id_area = a.id
             JOIN departamento dep ON a.id_departamento = dep.id
             WHERE lc.id_documento = $1 AND ${condicionLlamado}
             ORDER BY lc.id ASC`,
            [doc.id]
        );
        doc.llamados = llamados;
    }

    return {
        total,
        pagina,
        limite,
        resultados: docs
    };
};

export const obtenerConcursoPorIdBD = async (id) => {
    const { rows } = await pool.query(
        `SELECT d.id, d.codigo, d.prefijo, d.numero, d.anio, d.fecha_emision, d.descripcion, d.url_externa,
                f.sigla AS facultad_sigla, f.nombre AS facultad_nombre
         FROM documento d
         LEFT JOIN dependencia f ON d.id_dependencia_emisora = f.id
         WHERE d.id = $1 AND d.fecha_baja IS NULL`,
        [id]
    );

    if (rows.length === 0) return null;
    const concurso = rows[0];

    const { rows: llamados } = await pool.query(
        `SELECT lc.id, lc.cargo, lc.dedicacion, lc.caracter, lc.inscripcion_desde, lc.inscripcion_hasta,
                a.id AS area_id, a.nombre AS area_nombre,
                dep.id AS departamento_id, dep.nombre AS departamento_nombre
         FROM llamado_concurso lc
         JOIN area a ON lc.id_area = a.id
         JOIN departamento dep ON a.id_departamento = dep.id
         WHERE lc.id_documento = $1 AND lc.fecha_baja IS NULL
         ORDER BY lc.id ASC`,
        [id]
    );

    concurso.llamados = llamados;
    return concurso;
};
