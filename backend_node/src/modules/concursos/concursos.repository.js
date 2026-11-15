import { pool } from '../../config/db.js';

export const buscarConcursosBD = async (filtros) => {
    let whereDoc = 'WHERE d.fecha_baja IS NULL';
    const values = [];
    let index = 1;

    let condicionLlamado = 'lc.fecha_baja IS NULL';
    if (filtros.estado === 'vigentes' || !filtros.estado) {
        condicionLlamado += ' AND lc.inscripcion_hasta >= CURRENT_DATE';
    } else if (filtros.estado === 'vencidos') {
        condicionLlamado += ' AND lc.inscripcion_hasta < CURRENT_DATE';
    }

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

    const countQuery = `SELECT COUNT(DISTINCT d.id)::INT AS total ${baseFrom}`;
    const countRes = await pool.query(countQuery, values);
    const total = countRes.rows[0].total;

    const limite = Math.min(parseInt(filtros.limite, 10) || 20, 100);
    const pagina = Math.max(parseInt(filtros.pagina, 10) || 1, 1);
    const offset = (pagina - 1) * limite;

    const porRegistro = filtros.orden === 'registro';
    const ordenIds = porRegistro
        ? 'ORDER BY d.fecha_registro DESC, d.id DESC'
        : 'ORDER BY d.anio DESC, largo DESC, d.numero DESC, d.id DESC';
    const ordenDocs = porRegistro
        ? 'ORDER BY d.fecha_registro DESC, d.id DESC'
        : 'ORDER BY d.anio DESC, length(d.numero) DESC, d.numero DESC, d.id DESC';

    const idsQuery = `
        SELECT DISTINCT d.id, d.anio, d.numero, length(d.numero) AS largo, d.fecha_registro
        ${baseFrom}
        ${ordenIds}
        LIMIT $${index} OFFSET $${index + 1}
    `;
    values.push(limite, offset);

    const idsRes = await pool.query(idsQuery, values);
    const docIds = idsRes.rows.map(r => r.id);

    if (docIds.length === 0) {
        return { total, pagina, limite, resultados: [] };
    }

    const { rows: docs } = await pool.query(
        `SELECT d.id, d.codigo, d.prefijo, d.numero, d.anio, d.fecha_emision, d.descripcion, d.url_externa, d.id_dependencia_emisora, d.archivo_ruta,
                f.sigla AS facultad_sigla, f.nombre AS facultad_nombre
         FROM documento d
         LEFT JOIN dependencia f ON d.id_dependencia_emisora = f.id
         WHERE d.id = ANY($1::INT[])
         ${ordenDocs}`,
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

export const obtenerConcursoPorIdBD = async (id, incluirBaja = false) => {
    const { rows } = await pool.query(
        `SELECT d.id, d.codigo, d.prefijo, d.numero, d.anio, d.fecha_emision, d.descripcion, d.url_externa, d.id_dependencia_emisora, d.archivo_ruta, d.fecha_baja,
                f.sigla AS facultad_sigla, f.nombre AS facultad_nombre
         FROM documento d
         LEFT JOIN dependencia f ON d.id_dependencia_emisora = f.id
         WHERE d.id = $1 ${incluirBaja ? '' : 'AND d.fecha_baja IS NULL'}`,
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

export const areaActiva = async (id) => {
    const { rows } = await pool.query(
        `SELECT id FROM area WHERE id = $1 AND fecha_baja IS NULL`,
        [id]
    );
    return rows.length > 0;
};

export const idsDeLlamados = async (idDocumento) => {
    const { rows } = await pool.query(
        `SELECT id FROM llamado_concurso WHERE id_documento = $1`,
        [idDocumento]
    );
    return rows.map((fila) => Number(fila.id));
};

export const insertarOReactivarLlamado = async (client, idDocumento, l) => {
    const { rows } = await client.query(
        `INSERT INTO llamado_concurso
            (id_documento, id_area, cargo, dedicacion, caracter, inscripcion_desde, inscripcion_hasta)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT ON CONSTRAINT uq_llamado DO UPDATE SET
            inscripcion_hasta = EXCLUDED.inscripcion_hasta, fecha_baja = NULL, id_usuario_baja = NULL
         RETURNING id`,
        [idDocumento, l.id_area, l.cargo, l.dedicacion, l.caracter, l.inscripcion_desde, l.inscripcion_hasta]
    );
    return Number(rows[0].id);
};

export const actualizarLlamado = async (client, idDocumento, l) => {
    await client.query(
        `UPDATE llamado_concurso SET
            id_area = $3, cargo = $4, dedicacion = $5, caracter = $6,
            inscripcion_desde = $7, inscripcion_hasta = $8,
            fecha_baja = NULL, id_usuario_baja = NULL
         WHERE id = $1 AND id_documento = $2`,
        [l.id, idDocumento, l.id_area, l.cargo, l.dedicacion, l.caracter, l.inscripcion_desde, l.inscripcion_hasta]
    );
};

export const darDeBajaLlamadosExcepto = async (client, idDocumento, idsVigentes, idUsuario) => {
    await client.query(
        `UPDATE llamado_concurso SET fecha_baja = NOW(), id_usuario_baja = $3
         WHERE id_documento = $1 AND fecha_baja IS NULL AND id <> ALL($2::INT[])`,
        [idDocumento, idsVigentes, idUsuario]
    );
};

export const listarFacultadesConFeed = async () => {
    const { rows } = await pool.query(
        `SELECT id, codigo FROM dependencia
         WHERE codigo IS NOT NULL AND es_facultad AND fecha_baja IS NULL
         ORDER BY numero`
    );
    return rows;
};

export const buscarDependenciaPorNumero = async (numero) => {
    const { rows } = await pool.query(
        `SELECT id, numero FROM dependencia WHERE numero = $1 AND fecha_baja IS NULL`,
        [numero]
    );
    return rows[0];
};

export const valoresDeEnums = async () => {
    const { rows } = await pool.query(
        `SELECT 'cargo' AS enum, unnest(enum_range(NULL::cargo))::text AS valor
         UNION ALL SELECT 'dedicacion', unnest(enum_range(NULL::dedicacion))::text
         UNION ALL SELECT 'caracter', unnest(enum_range(NULL::caracter))::text`
    );
    const valores = { cargo: new Set(), dedicacion: new Set(), caracter: new Set() };
    for (const fila of rows) valores[fila.enum].add(fila.valor);
    return valores;
};

export const insertarDocumentoSincronizado = async (client, d) => {
    const { rows } = await client.query(
        `INSERT INTO documento
            (codigo, prefijo, id_dependencia_origen, numero, anio, id_dependencia_emisora,
             url_externa, archivo_ruta, fecha_registro)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9::timestamp, CURRENT_TIMESTAMP))
         RETURNING id`,
        [d.codigo, d.prefijo, d.id_dependencia_origen, d.numero, d.anio, d.id_dependencia_emisora,
         d.url_externa, d.archivo_ruta, d.fecha_registro]
    );
    return rows[0].id;
};

export const completarDocumentoSincronizado = async (client, id, urlExterna, archivoRuta) => {
    const { rowCount } = await client.query(
        `UPDATE documento SET
            url_externa = COALESCE(url_externa, $2),
            archivo_ruta = COALESCE(archivo_ruta, $3)
         WHERE id = $1
           AND ((url_externa IS NULL AND $2::text IS NOT NULL)
             OR (archivo_ruta IS NULL AND $3::text IS NOT NULL))`,
        [id, urlExterna, archivoRuta]
    );
    return rowCount;
};

export const estructuraDeFacultad = async (client, idDependencia) => {
    const { rows: departamentos } = await client.query(
        `SELECT id, nombre FROM departamento WHERE id_dependencia = $1`,
        [idDependencia]
    );
    const { rows: areas } = await client.query(
        `SELECT a.id, a.id_departamento, a.nombre
         FROM area a JOIN departamento d ON d.id = a.id_departamento
         WHERE d.id_dependencia = $1`,
        [idDependencia]
    );
    return { departamentos, areas };
};

export const insertarDepartamento = async (client, idDependencia, nombre) => {
    const { rows } = await client.query(
        `INSERT INTO departamento (id_dependencia, nombre) VALUES ($1, $2)
         ON CONFLICT ON CONSTRAINT uq_departamento DO UPDATE SET nombre = EXCLUDED.nombre
         RETURNING id`,
        [idDependencia, nombre]
    );
    return rows[0].id;
};

export const insertarArea = async (client, idDepartamento, nombre) => {
    const { rows } = await client.query(
        `INSERT INTO area (id_departamento, nombre) VALUES ($1, $2)
         ON CONFLICT ON CONSTRAINT uq_area DO UPDATE SET nombre = EXCLUDED.nombre
         RETURNING id`,
        [idDepartamento, nombre]
    );
    return rows[0].id;
};

export const insertarLlamadoSiFalta = async (client, idDocumento, l) => {
    const { rowCount } = await client.query(
        `INSERT INTO llamado_concurso
            (id_documento, id_area, cargo, dedicacion, caracter, inscripcion_desde, inscripcion_hasta)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT ON CONSTRAINT uq_llamado DO NOTHING`,
        [idDocumento, l.id_area, l.cargo, l.dedicacion ?? null, l.caracter, l.inscripcion_desde, l.inscripcion_hasta]
    );
    return rowCount;
};
