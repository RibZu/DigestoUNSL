import { pool } from '../../config/db.js';
export const listarTiposDocumentoBD = async (incluirBajas) => {
    const condicion = incluirBajas ? '' : 'WHERE fecha_baja IS NULL';
    const { rows } = await pool.query(
        `SELECT id, nombre, fecha_baja FROM tipo_documento ${condicion} ORDER BY nombre ASC`
    );
    return rows;
};

export const buscarTipoPorNombre = async (nombre) => {
    const { rows } = await pool.query(
        `SELECT * FROM tipo_documento WHERE LOWER(nombre) = LOWER($1)`,
        [nombre]
    );
    return rows[0];
};

export const crearTipoDocumentoBD = async (nombre) => {
    const { rows } = await pool.query(
        `INSERT INTO tipo_documento (nombre) VALUES ($1) RETURNING *`,
        [nombre]
    );
    return rows[0];
};

export const reactivarTipoDocumentoBD = async (id, nombre) => {
    const { rows } = await pool.query(
        `UPDATE tipo_documento SET nombre = COALESCE($1, nombre), fecha_baja = NULL WHERE id = $2 RETURNING *`,
        [nombre, id]
    );
    return rows[0];
};

export const actualizarTipoDocumentoBD = async (id, nombre, baja) => {
    const sets = [];
    const values = [];
    if (nombre !== undefined) {
        sets.push(`nombre = $${values.length + 1}`);
        values.push(nombre);
    }
    if (baja !== undefined) {
        sets.push(`fecha_baja = $${values.length + 1}`);
        values.push(baja ? new Date() : null);
    }
    if (sets.length === 0) return null;
    values.push(id);
    const { rows } = await pool.query(
        `UPDATE tipo_documento SET ${sets.join(', ')} WHERE id = $${values.length} RETURNING *`,
        values
    );
    return rows[0];
};
export const listarOrganosBD = async (incluirBajas) => {
    const condicion = incluirBajas ? '' : 'WHERE fecha_baja IS NULL';
    const { rows } = await pool.query(
        `SELECT id, nombre, fecha_baja FROM organo_emisor ${condicion} ORDER BY nombre ASC`
    );
    return rows;
};

export const buscarOrganoPorNombre = async (nombre) => {
    const { rows } = await pool.query(
        `SELECT * FROM organo_emisor WHERE LOWER(nombre) = LOWER($1)`,
        [nombre]
    );
    return rows[0];
};

export const crearOrganoBD = async (nombre) => {
    const { rows } = await pool.query(
        `INSERT INTO organo_emisor (nombre) VALUES ($1) RETURNING *`,
        [nombre]
    );
    return rows[0];
};

export const reactivarOrganoBD = async (id, nombre) => {
    const { rows } = await pool.query(
        `UPDATE organo_emisor SET nombre = COALESCE($1, nombre), fecha_baja = NULL WHERE id = $2 RETURNING *`,
        [nombre, id]
    );
    return rows[0];
};

export const actualizarOrganoBD = async (id, nombre, baja) => {
    const sets = [];
    const values = [];
    if (nombre !== undefined) {
        sets.push(`nombre = $${values.length + 1}`);
        values.push(nombre);
    }
    if (baja !== undefined) {
        sets.push(`fecha_baja = $${values.length + 1}`);
        values.push(baja ? new Date() : null);
    }
    if (sets.length === 0) return null;
    values.push(id);
    const { rows } = await pool.query(
        `UPDATE organo_emisor SET ${sets.join(', ')} WHERE id = $${values.length} RETURNING *`,
        values
    );
    return rows[0];
};
export const listarPrefijosBD = async (incluirBajas) => {
    const condicion = incluirBajas ? '' : 'WHERE c.fecha_baja IS NULL';
    const { rows } = await pool.query(
        `SELECT c.prefijo, c.id_tipo, t.nombre AS tipo_nombre, c.id_organo, o.nombre AS organo_nombre, c.ambito, c.fecha_baja
         FROM codificacion c
         LEFT JOIN tipo_documento t ON c.id_tipo = t.id
         LEFT JOIN organo_emisor o ON c.id_organo = o.id
         ${condicion}
         ORDER BY c.prefijo ASC`
    );
    return rows;
};

export const buscarPrefijo = async (prefijo) => {
    const { rows } = await pool.query(
        `SELECT * FROM codificacion WHERE prefijo = $1`,
        [prefijo]
    );
    return rows[0];
};

export const crearPrefijoBD = async (prefijo, idTipo, idOrgano, ambito) => {
    const { rows } = await pool.query(
        `INSERT INTO codificacion (prefijo, id_tipo, id_organo, ambito) VALUES ($1, $2, $3, $4) RETURNING *`,
        [prefijo, idTipo, idOrgano || null, ambito || null]
    );
    return rows[0];
};

export const reactivarPrefijoBD = async (prefijo, idTipo, idOrgano, ambito) => {
    const { rows } = await pool.query(
        `UPDATE codificacion
         SET id_tipo = COALESCE($1, id_tipo),
             id_organo = COALESCE($2, id_organo),
             ambito = COALESCE($3, ambito),
             fecha_baja = NULL
         WHERE prefijo = $4
         RETURNING *`,
        [idTipo, idOrgano, ambito, prefijo]
    );
    return rows[0];
};

export const actualizarPrefijoBD = async (prefijo, datos) => {
    const sets = [];
    const values = [];
    if (datos.id_tipo !== undefined) {
        sets.push(`id_tipo = $${values.length + 1}`);
        values.push(datos.id_tipo);
    }
    if (datos.id_organo !== undefined) {
        sets.push(`id_organo = $${values.length + 1}`);
        values.push(datos.id_organo);
    }
    if (datos.ambito !== undefined) {
        sets.push(`ambito = $${values.length + 1}`);
        values.push(datos.ambito);
    }
    if (datos.baja !== undefined) {
        sets.push(`fecha_baja = $${values.length + 1}`);
        values.push(datos.baja ? new Date() : null);
    }
    if (sets.length === 0) return null;
    values.push(prefijo);
    const { rows } = await pool.query(
        `UPDATE codificacion SET ${sets.join(', ')} WHERE prefijo = $${values.length} RETURNING *`,
        values
    );
    return rows[0];
};
export const listarDependenciasBD = async (incluirBajas) => {
    const condicion = incluirBajas ? '' : 'WHERE fecha_baja IS NULL';
    const { rows } = await pool.query(
        `SELECT id, numero, codigo, sigla, nombre, ubicacion, es_facultad, historica, fecha_baja 
         FROM dependencia ${condicion} 
         ORDER BY id ASC`
    );
    return rows;
};

export const buscarDependenciaPorId = async (id) => {
    const { rows } = await pool.query(`SELECT * FROM dependencia WHERE id = $1`, [id]);
    return rows[0];
};

export const buscarDependenciaDuplicada = async (numero, codigo, sigla, idExcluir = null) => {
    let query = `SELECT * FROM dependencia WHERE (numero = $1 OR codigo = $2 OR LOWER(sigla) = LOWER($3))`;
    const params = [numero, codigo, sigla];
    if (idExcluir) {
        query += ` AND id != $4`;
        params.push(idExcluir);
    }
    const { rows } = await pool.query(query, params);
    return rows[0];
};

export const crearDependenciaBD = async (datos) => {
    const { sigla, nombre, numero, codigo, ubicacion, es_facultad, historica } = datos;
    const { rows } = await pool.query(
        `INSERT INTO dependencia (sigla, nombre, numero, codigo, ubicacion, es_facultad, historica)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [sigla, nombre, numero || null, codigo || null, ubicacion || null, es_facultad || false, historica || false]
    );
    return rows[0];
};

export const reactivarDependenciaBD = async (id, datos) => {
    const { sigla, nombre, numero, codigo, ubicacion, es_facultad, historica } = datos;
    const { rows } = await pool.query(
        `UPDATE dependencia
         SET sigla = COALESCE($1, sigla),
             nombre = COALESCE($2, nombre),
             numero = COALESCE($3, numero),
             codigo = COALESCE($4, codigo),
             ubicacion = COALESCE($5, ubicacion),
             es_facultad = COALESCE($6, es_facultad),
             historica = COALESCE($7, historica),
             fecha_baja = NULL
         WHERE id = $8
         RETURNING *`,
        [sigla, nombre, numero, codigo, ubicacion, es_facultad, historica, id]
    );
    return rows[0];
};

export const actualizarDependenciaBD = async (id, datos) => {
    const sets = [];
    const values = [];
    const campos = ['sigla', 'nombre', 'numero', 'codigo', 'ubicacion', 'es_facultad', 'historica'];
    for (const c of campos) {
        if (datos[c] !== undefined) {
            sets.push(`${c} = $${values.length + 1}`);
            values.push(datos[c]);
        }
    }
    if (datos.baja !== undefined) {
        sets.push(`fecha_baja = $${values.length + 1}`);
        values.push(datos.baja ? new Date() : null);
    }
    if (sets.length === 0) return null;
    values.push(id);
    const { rows } = await pool.query(
        `UPDATE dependencia SET ${sets.join(', ')} WHERE id = $${values.length} RETURNING *`,
        values
    );
    return rows[0];
};
export const listarDepartamentosBD = async (idDependencia, incluirBajas) => {
    const condiciones = [];
    const values = [];

    if (!incluirBajas) {
        condiciones.push('dep.fecha_baja IS NULL');
    }
    if (idDependencia) {
        values.push(idDependencia);
        condiciones.push(`dep.id_dependencia = $${values.length}`);
    }

    const where = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';
    const { rows } = await pool.query(
        `SELECT dep.id, dep.id_dependencia, f.sigla AS dependencia_sigla, dep.nombre, dep.fecha_baja
         FROM departamento dep
         JOIN dependencia f ON dep.id_dependencia = f.id
         ${where}
         ORDER BY dep.nombre ASC`,
        values
    );
    return rows;
};

export const buscarDepartamentoEnDependencia = async (idDependencia, nombre) => {
    const { rows } = await pool.query(
        `SELECT * FROM departamento WHERE id_dependencia = $1 AND LOWER(nombre) = LOWER($2)`,
        [idDependencia, nombre]
    );
    return rows[0];
};

export const crearDepartamentoBD = async (idDependencia, nombre) => {
    const { rows } = await pool.query(
        `INSERT INTO departamento (id_dependencia, nombre) VALUES ($1, $2) RETURNING *`,
        [idDependencia, nombre]
    );
    return rows[0];
};

export const reactivarDepartamentoBD = async (id, nombre) => {
    const { rows } = await pool.query(
        `UPDATE departamento SET nombre = COALESCE($1, nombre), fecha_baja = NULL WHERE id = $2 RETURNING *`,
        [nombre, id]
    );
    return rows[0];
};

export const actualizarDepartamentoBD = async (id, idDependencia, nombre, baja) => {
    const sets = [];
    const values = [];
    if (idDependencia !== undefined) {
        sets.push(`id_dependencia = $${values.length + 1}`);
        values.push(idDependencia);
    }
    if (nombre !== undefined) {
        sets.push(`nombre = $${values.length + 1}`);
        values.push(nombre);
    }
    if (baja !== undefined) {
        sets.push(`fecha_baja = $${values.length + 1}`);
        values.push(baja ? new Date() : null);
    }
    if (sets.length === 0) return null;
    values.push(id);
    const { rows } = await pool.query(
        `UPDATE departamento SET ${sets.join(', ')} WHERE id = $${values.length} RETURNING *`,
        values
    );
    return rows[0];
};
export const listarAreasBD = async (idDepartamento, incluirBajas) => {
    const condiciones = [];
    const values = [];

    if (!incluirBajas) {
        condiciones.push('a.fecha_baja IS NULL');
    }
    if (idDepartamento) {
        values.push(idDepartamento);
        condiciones.push(`a.id_departamento = $${values.length}`);
    }

    const where = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';
    const { rows } = await pool.query(
        `SELECT a.id, a.id_departamento, d.nombre AS departamento_nombre, a.nombre, a.fecha_baja
         FROM area a
         JOIN departamento d ON a.id_departamento = d.id
         ${where}
         ORDER BY a.nombre ASC`,
        values
    );
    return rows;
};

export const buscarAreaEnDepartamento = async (idDepartamento, nombre) => {
    const { rows } = await pool.query(
        `SELECT * FROM area WHERE id_departamento = $1 AND LOWER(nombre) = LOWER($2)`,
        [idDepartamento, nombre]
    );
    return rows[0];
};

export const crearAreaBD = async (idDepartamento, nombre) => {
    const { rows } = await pool.query(
        `INSERT INTO area (id_departamento, nombre) VALUES ($1, $2) RETURNING *`,
        [idDepartamento, nombre]
    );
    return rows[0];
};

export const reactivarAreaBD = async (id, nombre) => {
    const { rows } = await pool.query(
        `UPDATE area SET nombre = COALESCE($1, nombre), fecha_baja = NULL WHERE id = $2 RETURNING *`,
        [nombre, id]
    );
    return rows[0];
};

export const actualizarAreaBD = async (id, idDepartamento, nombre, baja) => {
    const sets = [];
    const values = [];
    if (idDepartamento !== undefined) {
        sets.push(`id_departamento = $${values.length + 1}`);
        values.push(idDepartamento);
    }
    if (nombre !== undefined) {
        sets.push(`nombre = $${values.length + 1}`);
        values.push(nombre);
    }
    if (baja !== undefined) {
        sets.push(`fecha_baja = $${values.length + 1}`);
        values.push(baja ? new Date() : null);
    }
    if (sets.length === 0) return null;
    values.push(id);
    const { rows } = await pool.query(
        `UPDATE area SET ${sets.join(', ')} WHERE id = $${values.length} RETURNING *`,
        values
    );
    return rows[0];
};
