import * as planesRepo from './planes.repository.js';

export const listarPlanes = async (facultadCodigo) => {
    return await planesRepo.obtenerFacultadesConPlanesBD(facultadCodigo);
};

export const obtenerPlan = async (carreraCodigo, planParam) => {
    // La URL recibe el plan con guión (ej: 12-21) para evitar conflicto de rutas, lo convertimos a barra (12/21)
    const planNormalizado = planParam.replace('-', '/');
    const plan = await planesRepo.obtenerPlanConMateriasBD(carreraCodigo, planNormalizado);
    if (!plan) {
        const error = new Error(`El plan '${planParam}' de la carrera '${carreraCodigo}' no existe.`);
        error.status = 404;
        throw error;
    }
    return plan;
};
