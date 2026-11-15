import { pool } from '../../config/db.js';

export const obtenerFacultadesConPlanesBD = async (codigoFacultad) => {
    let depQuery = `
        SELECT id, codigo, sigla, nombre
        FROM dependencia
        WHERE es_facultad = true AND fecha_baja IS NULL
    `;
    const depParams = [];
    if (codigoFacultad) {
        depQuery += ` AND LOWER(codigo) = LOWER($1)`;
        depParams.push(codigoFacultad);
    }
    depQuery += ` ORDER BY id ASC`;

    const { rows: facultades } = await pool.query(depQuery, depParams);

    for (const fac of facultades) {
        const { rows: carreras } = await pool.query(
            `SELECT c.id, c.codigo, c.nombre
             FROM carrera c
             JOIN carrera_dependencia cd ON c.id = cd.id_carrera
             WHERE cd.id_dependencia = $1 AND c.fecha_baja IS NULL AND cd.fecha_baja IS NULL
             ORDER BY c.nombre ASC`,
            [fac.id]
        );

        for (const car of carreras) {
            const { rows: planes } = await pool.query(
                `SELECT id, plan, ordenanza, anios, url_oficial, version_id, sincronizado_en
                 FROM plan_estudio
                 WHERE id_carrera = $1 AND fecha_baja IS NULL
                 ORDER BY plan ASC`,
                [car.id]
            );
            car.planes = planes;
        }

        fac.carreras = carreras;
    }

    return facultades;
};

export const obtenerPlanConMateriasBD = async (codigoCarrera, planStr) => {
    const { rows: planRows } = await pool.query(
        `SELECT p.id, p.plan, p.ordenanza, p.anios, p.url_oficial, p.version_id, p.sincronizado_en,
                c.codigo AS carrera_codigo, c.nombre AS carrera_nombre
         FROM plan_estudio p
         JOIN carrera c ON p.id_carrera = c.id
         WHERE c.codigo = $1 AND p.plan = $2 AND p.fecha_baja IS NULL`,
        [codigoCarrera, planStr]
    );

    if (planRows.length === 0) return null;
    const plan = planRows[0];

    const { rows: materias } = await pool.query(
        `SELECT id, anio, orden, codigo, nombre, periodo
         FROM materia
         WHERE id_plan = $1 AND fecha_baja IS NULL
         ORDER BY anio ASC, orden ASC`,
        [plan.id]
    );

    const materiasPorAnio = {};
    for (const m of materias) {
        if (!materiasPorAnio[m.anio]) {
            materiasPorAnio[m.anio] = [];
        }
        materiasPorAnio[m.anio].push(m);
    }

    plan.materias = materiasPorAnio;
    return plan;
};

export const listarDependenciasConCodigo = async () => {
    const { rows } = await pool.query(
        `SELECT id, codigo FROM dependencia WHERE codigo IS NOT NULL AND fecha_baja IS NULL ORDER BY numero`
    );
    return rows;
};

export const guardarCarrera = async (client, codigo, nombre) => {
    const { rows } = await client.query(
        `INSERT INTO carrera (codigo, nombre) VALUES ($1, $2)
         ON CONFLICT (codigo) DO UPDATE SET nombre = EXCLUDED.nombre, fecha_baja = NULL
         RETURNING id, (xmax = 0) AS nueva`,
        [codigo, nombre]
    );
    return rows[0];
};

export const vincularCarrera = async (client, idCarrera, idDependencia) => {
    await client.query(
        `INSERT INTO carrera_dependencia (id_carrera, id_dependencia) VALUES ($1, $2)
         ON CONFLICT (id_carrera, id_dependencia) DO UPDATE SET fecha_baja = NULL`,
        [idCarrera, idDependencia]
    );
};

export const buscarPlan = async (client, idCarrera, plan) => {
    const { rows } = await client.query(
        `SELECT id, version_id FROM plan_estudio WHERE id_carrera = $1 AND plan = $2`,
        [idCarrera, plan]
    );
    return rows[0];
};

export const insertarPlan = async (client, idCarrera, p) => {
    const { rows } = await client.query(
        `INSERT INTO plan_estudio (id_carrera, plan, ordenanza, anios, url_oficial, version_id, sincronizado_en)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         RETURNING id`,
        [idCarrera, p.plan, p.ordenanza, p.anios, p.url_oficial, p.version_id]
    );
    return rows[0].id;
};

export const actualizarPlan = async (client, id, p) => {
    await client.query(
        `UPDATE plan_estudio SET ordenanza = $2, anios = $3, url_oficial = $4, version_id = $5,
                sincronizado_en = NOW(), fecha_baja = NULL
         WHERE id = $1`,
        [id, p.ordenanza, p.anios, p.url_oficial, p.version_id]
    );
};

export const tocarPlan = async (client, id) => {
    await client.query(`UPDATE plan_estudio SET sincronizado_en = NOW(), fecha_baja = NULL WHERE id = $1`, [id]);
};

export const guardarMateria = async (client, idPlan, m) => {
    const { rows } = await client.query(
        `INSERT INTO materia (id_plan, anio, orden, codigo, nombre, periodo)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT ON CONSTRAINT uq_materia DO UPDATE SET
            orden = EXCLUDED.orden, nombre = EXCLUDED.nombre, periodo = EXCLUDED.periodo, fecha_baja = NULL
         RETURNING (xmax = 0) AS nueva`,
        [idPlan, m.anio, m.orden, m.codigo, m.nombre, m.periodo ?? null]
    );
    return rows[0].nueva;
};

export const darDeBajaMateriasExcepto = async (client, idPlan, anios, codigos) => {
    const { rowCount } = await client.query(
        `UPDATE materia SET fecha_baja = NOW()
         WHERE id_plan = $1 AND fecha_baja IS NULL
           AND NOT EXISTS (
               SELECT 1 FROM unnest($2::int[], $3::text[]) AS v(anio, codigo)
               WHERE v.anio = materia.anio AND v.codigo = materia.codigo
           )`,
        [idPlan, anios, codigos]
    );
    return rowCount;
};

export const darDeBajaVinculosExcepto = async (client, idDependencia, idsCarrera) => {
    const { rowCount } = await client.query(
        `UPDATE carrera_dependencia SET fecha_baja = NOW()
         WHERE id_dependencia = $1 AND fecha_baja IS NULL AND id_carrera <> ALL($2::int[])`,
        [idDependencia, idsCarrera]
    );
    return rowCount;
};

export const darDeBajaPlanesNoVueltos = async (client, idsDependenciaLeidas, idsCarrera, planes) => {
    const { rowCount } = await client.query(
        `UPDATE plan_estudio p SET fecha_baja = NOW()
         WHERE p.fecha_baja IS NULL
           AND EXISTS (
               SELECT 1 FROM carrera_dependencia cd
               WHERE cd.id_carrera = p.id_carrera AND cd.fecha_baja IS NULL
           )
           AND NOT EXISTS (
               SELECT 1 FROM carrera_dependencia cd
               WHERE cd.id_carrera = p.id_carrera AND cd.fecha_baja IS NULL
                 AND cd.id_dependencia <> ALL($1::int[])
           )
           AND NOT EXISTS (
               SELECT 1 FROM unnest($2::int[], $3::text[]) AS v(id_carrera, plan)
               WHERE v.id_carrera = p.id_carrera AND v.plan = p.plan
           )`,
        [idsDependenciaLeidas, idsCarrera, planes]
    );
    return rowCount;
};

export const darDeBajaCarrerasSinDependencia = async (client) => {
    const { rowCount: planes } = await client.query(
        `UPDATE plan_estudio SET fecha_baja = NOW()
         WHERE fecha_baja IS NULL
           AND id_carrera IN (
               SELECT c.id FROM carrera c
               WHERE c.fecha_baja IS NULL
                 AND EXISTS (SELECT 1 FROM carrera_dependencia cd WHERE cd.id_carrera = c.id)
                 AND NOT EXISTS (
                     SELECT 1 FROM carrera_dependencia cd WHERE cd.id_carrera = c.id AND cd.fecha_baja IS NULL
                 )
           )`
    );
    const { rowCount: carreras } = await client.query(
        `UPDATE carrera c SET fecha_baja = NOW()
         WHERE c.fecha_baja IS NULL
           AND EXISTS (SELECT 1 FROM carrera_dependencia cd WHERE cd.id_carrera = c.id)
           AND NOT EXISTS (
               SELECT 1 FROM carrera_dependencia cd WHERE cd.id_carrera = c.id AND cd.fecha_baja IS NULL
           )`
    );
    return { planes, carreras };
};
