import { pool } from '../../config/db.js';

export const buscarConFiltros = async (filtros) => {
    let baseQuery = `
        FROM documento d
        LEFT JOIN dependencia dep_orig ON d.id_dependencia_origen = dep_orig.id
        LEFT JOIN dependencia dep_emis ON d.id_dependencia_emisora = dep_emis.id
        LEFT JOIN codificacion c ON d.prefijo = c.prefijo
        LEFT JOIN tipo_documento t ON c.id_tipo = t.id
        LEFT JOIN organo_emisor o ON c.id_organo = o.id
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

    const countQuery = `SELECT COUNT(*) ${baseQuery}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count, 10);

    const limite = Math.min(parseInt(filtros.limite, 10) || 20, 100);
    const pagina = Math.max(parseInt(filtros.pagina, 10) || 1, 1);
    const offset = (pagina - 1) * limite;

    let ordenSql = 'ORDER BY d.anio DESC, length(d.numero) DESC, d.numero DESC, d.id DESC';
    if (filtros.orden === 'registro') {
        ordenSql = 'ORDER BY d.fecha_registro DESC, d.id DESC';
    } else if (filtros.orden === 'emision') {
        ordenSql = 'ORDER BY d.fecha_emision DESC NULLS LAST, d.id DESC';
    }

    const dataQuery = `
        SELECT d.*, 
               dep_orig.nombre AS dependencia_origen_nombre, 
               dep_orig.sigla AS dependencia_origen_sigla,
               dep_emis.nombre AS dependencia_emisora_nombre,
               dep_emis.sigla AS dependencia_emisora_sigla,
               c.id_tipo,
               t.nombre AS tipo_nombre,
               c.id_organo,
               o.nombre AS organo_nombre
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

export const obtenerPorId = async (id) => {
    const { rows } = await pool.query(
        `SELECT d.*, 
                dep_orig.nombre AS dependencia_origen_nombre, 
                dep_orig.sigla AS dependencia_origen_sigla,
                dep_emis.nombre AS dependencia_emisora_nombre,
                dep_emis.sigla AS dependencia_emisora_sigla,
                c.id_tipo,
                t.nombre AS tipo_nombre,
                c.id_organo,
                o.nombre AS organo_nombre
         FROM documento d
         LEFT JOIN dependencia dep_orig ON d.id_dependencia_origen = dep_orig.id
         LEFT JOIN dependencia dep_emis ON d.id_dependencia_emisora = dep_emis.id
         LEFT JOIN codificacion c ON d.prefijo = c.prefijo
         LEFT JOIN tipo_documento t ON c.id_tipo = t.id
         LEFT JOIN organo_emisor o ON c.id_organo = o.id
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

export const buscarPrefijoConTipo = async (prefijo) => {
    const { rows } = await pool.query(
        `SELECT c.prefijo, c.id_tipo, c.id_organo, c.ambito, c.fecha_baja, t.nombre AS tipo_nombre
         FROM codificacion c
         LEFT JOIN tipo_documento t ON c.id_tipo = t.id
         WHERE c.prefijo = $1`,
        [prefijo]
    );
    return rows[0];
};

export const buscarDependenciaPorId = async (id) => {
    const { rows } = await pool.query(`SELECT * FROM dependencia WHERE id = $1`, [id]);
    return rows[0];
};

export const buscarDependenciaPorSigla = async (sigla) => {
    const { rows } = await pool.query(
        `SELECT * FROM dependencia WHERE sigla = $1 AND fecha_baja IS NULL`,
        [sigla]
    );
    return rows[0];
};

export const buscarPorCodigo = async (client, codigo) => {
    const { rows } = await client.query(`SELECT * FROM documento WHERE codigo = $1`, [codigo]);
    return rows[0];
};

export const insertarDocumento = async (client, d, idUsuario) => {
    const { rows } = await client.query(
        `INSERT INTO documento
            (codigo, prefijo, id_dependencia_origen, numero, anio, id_dependencia_emisora,
             fecha_emision, descripcion, id_usuario_alta)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id`,
        [d.codigo, d.prefijo, d.id_dependencia_origen, d.numero, d.anio, d.id_dependencia_emisora,
         d.fecha_emision, d.descripcion, idUsuario]
    );
    return rows[0].id;
};

export const reactivarDocumento = async (client, id, d, idUsuario) => {
    await client.query(
        `UPDATE documento SET
            prefijo = $2, id_dependencia_origen = $3, numero = $4, anio = $5,
            id_dependencia_emisora = $6, fecha_emision = $7, descripcion = $8,
            fecha_baja = NULL, id_usuario_baja = NULL,
            fecha_modificacion = NOW(), id_usuario_modificacion = $9
         WHERE id = $1`,
        [id, d.prefijo, d.id_dependencia_origen, d.numero, d.anio, d.id_dependencia_emisora,
         d.fecha_emision, d.descripcion, idUsuario]
    );
};

export const completarDocumento = async (client, id, d, idUsuario) => {
    await client.query(
        `UPDATE documento SET
            prefijo = $2, id_dependencia_origen = $3, numero = $4, anio = $5,
            id_dependencia_emisora = $6, fecha_emision = $7, descripcion = $8,
            fecha_modificacion = NOW(), id_usuario_modificacion = $9
         WHERE id = $1`,
        [id, d.prefijo, d.id_dependencia_origen, d.numero, d.anio, d.id_dependencia_emisora,
         d.fecha_emision, d.descripcion, idUsuario]
    );
};

export const guardarRutaArchivo = async (client, id, ruta) => {
    await client.query(`UPDATE documento SET archivo_ruta = $2 WHERE id = $1`, [id, ruta]);
};

export const actualizarDocumentoTx = async (client, id, sets, valores) => {
    await client.query(
        `UPDATE documento SET ${sets.join(', ')} WHERE id = $${valores.length + 1}`,
        [...valores, id]
    );
};

export const contarLlamados = async (id) => {
    const { rows } = await pool.query(
        `SELECT COUNT(*)::INT AS total FROM llamado_concurso WHERE id_documento = $1`,
        [id]
    );
    return rows[0].total;
};

export const obtenerRutaArchivo = async (id) => {
    const { rows } = await pool.query(
        `SELECT archivo_ruta, fecha_baja FROM documento WHERE id = $1`,
        [id]
    );
    return rows[0];
};