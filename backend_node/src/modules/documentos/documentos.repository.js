import { pool } from '../../config/db.js';

// Busca documentos activos con paginación, filtros y ordenamiento
export const buscarConFiltros = async (filtros) => {
    let baseQuery = `
        FROM documento d
        LEFT JOIN dependencia dep_orig ON d.id_dependencia_origen = dep_orig.id
        LEFT JOIN dependencia dep_emis ON d.id_dependencia_emisora = dep_emis.id
        LEFT JOIN codificacion c ON d.prefijo = c.prefijo
        WHERE d.fecha_baja IS NULL
    `;
    const values = [];
    let index = 1;

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

    // Contar total de resultados coincidentes
    const countQuery = `SELECT COUNT(*) ${baseQuery}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count, 10);

    // Paginación (por defecto 20, máximo 100)
    const limite = Math.min(parseInt(filtros.limite, 10) || 20, 100);
    const pagina = Math.max(parseInt(filtros.pagina, 10) || 1, 1);
    const offset = (pagina - 1) * limite;

    // Ordenamiento
    let ordenSql = 'ORDER BY d.anio DESC, d.numero DESC';
    if (filtros.orden === 'registro') {
        ordenSql = 'ORDER BY d.fecha_registro DESC';
    } else if (filtros.orden === 'emision') {
        ordenSql = 'ORDER BY d.fecha_emision DESC';
    }

    const dataQuery = `
        SELECT d.*, 
               dep_orig.nombre AS dependencia_origen_nombre, 
               dep_orig.sigla AS dependencia_origen_sigla,
               dep_emis.nombre AS dependencia_emisora_nombre,
               dep_emis.sigla AS dependencia_emisora_sigla,
               c.id_tipo,
               c.id_organo
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

// Obtiene un documento por id incluyendo sus llamados a concurso (si tiene).
export const obtenerPorId = async (id) => {
    const { rows } = await pool.query(
        `SELECT d.*, 
                dep_orig.nombre AS dependencia_origen_nombre, 
                dep_orig.sigla AS dependencia_origen_sigla,
                dep_emis.nombre AS dependencia_emisora_nombre,
                dep_emis.sigla AS dependencia_emisora_sigla,
                c.id_tipo,
                c.id_organo
         FROM documento d
         LEFT JOIN dependencia dep_orig ON d.id_dependencia_origen = dep_orig.id
         LEFT JOIN dependencia dep_emis ON d.id_dependencia_emisora = dep_emis.id
         LEFT JOIN codificacion c ON d.prefijo = c.prefijo
         WHERE d.id = $1`,
        [id]
    );

    if (rows.length === 0) return null;
    const documento = rows[0];

    const { rows: llamados } = await pool.query(
        `SELECT lc.*, a.nombre AS area_nombre, d.nombre AS departamento_nombre
         FROM llamado_concurso lc
         JOIN area a ON lc.id_area = a.id
         JOIN departamento d ON a.id_departamento = d.id
         WHERE lc.id_documento = $1 AND lc.fecha_baja IS NULL
         ORDER BY lc.id ASC`,
        [id]
    );

    if (llamados.length > 0) {
        documento.llamados = llamados;
    }

    return documento;
};

// Actualiza parcialmente un documento (PATCH).
export const actualizarDocumento = async (id, camposDinamicos, valores) => {
    const { rows } = await pool.query(
        `UPDATE documento SET ${camposDinamicos} WHERE id = $${valores.length} RETURNING *`,
        valores
    );
    return rows[0];
};