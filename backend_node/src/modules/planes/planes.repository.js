import { pool } from '../../config/db.js';

// facultades con carreras y planes
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

    // Para cada facultad, buscamos sus carreras y planes vigentes
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

// detalle del plan con sus materias
export const obtenerPlanConMateriasBD = async (codigoCarrera, planStr) => {
    // Buscar la carrera y el plan
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

    // Buscar las materias de ese plan
    const { rows: materias } = await pool.query(
        `SELECT id, anio, orden, codigo, nombre, periodo
         FROM materia
         WHERE id_plan = $1 AND fecha_baja IS NULL
         ORDER BY anio ASC, orden ASC`,
        [plan.id]
    );

    // Agrupar materias por año
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
