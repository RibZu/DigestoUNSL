import * as planesRepo from './planes.repository.js';
import { pedirPlanesDeGo } from './planes.client.js';
import { conTransaccion } from '../../config/transaccion.js';

const PREFIJO = '[actualización de planes]';

let corriendo = false;

export const listarPlanes = async (facultadCodigo) => {
    return await planesRepo.obtenerFacultadesConPlanesBD(facultadCodigo);
};

export const obtenerPlan = async (carreraCodigo, planParam) => {
    const planNormalizado = planParam.replace('-', '/');
    const plan = await planesRepo.obtenerPlanConMateriasBD(carreraCodigo, planNormalizado);
    if (!plan) {
        const error = new Error(`El plan '${planParam}' de la carrera '${carreraCodigo}' no existe.`);
        error.status = 404;
        throw error;
    }
    return plan;
};

const guardarDependencia = async (dependencia, carreras, resumen) => {
    const local = { carrerasNuevas: 0, planesNuevos: 0, planesActualizados: 0, planesSinCambios: 0, materiasNuevas: 0, materiasActualizadas: 0, materiasBaja: 0 };
    const idsCarrera = [];
    const planesVueltos = [];

    await conTransaccion(async (client) => {
        for (const carrera of carreras) {
            const guardada = await planesRepo.guardarCarrera(client, carrera.codigo, carrera.nombre);
            if (guardada.nueva) local.carrerasNuevas += 1;
            await planesRepo.vincularCarrera(client, guardada.id, dependencia.id);
            idsCarrera.push(guardada.id);

            for (const plan of carrera.planes) {
                planesVueltos.push({ idCarrera: guardada.id, plan: plan.plan });
                const existente = await planesRepo.buscarPlan(client, guardada.id, plan.plan);

                if (existente && existente.version_id === plan.version_id) {
                    await planesRepo.tocarPlan(client, existente.id);
                    local.planesSinCambios += 1;
                    continue;
                }

                let idPlan;
                if (existente) {
                    idPlan = existente.id;
                    await planesRepo.actualizarPlan(client, idPlan, plan);
                    local.planesActualizados += 1;
                } else {
                    idPlan = await planesRepo.insertarPlan(client, guardada.id, plan);
                    local.planesNuevos += 1;
                }

                for (const materia of plan.materias) {
                    const nueva = await planesRepo.guardarMateria(client, idPlan, materia);
                    if (nueva) local.materiasNuevas += 1;
                    else local.materiasActualizadas += 1;
                }
                local.materiasBaja += await planesRepo.darDeBajaMateriasExcepto(
                    client,
                    idPlan,
                    plan.materias.map((materia) => materia.anio),
                    plan.materias.map((materia) => materia.codigo)
                );
            }
        }
        await planesRepo.darDeBajaVinculosExcepto(client, dependencia.id, idsCarrera);
    });

    for (const [clave, valor] of Object.entries(local)) resumen[clave] += valor;
    return planesVueltos;
};

export const sincronizarPlanes = async () => {
    if (corriendo) {
        console.log(`${PREFIJO} ya hay una corrida en curso, se saltea`);
        return;
    }
    corriendo = true;
    const inicio = Date.now();
    console.log(`${PREFIJO} inicio ${new Date().toLocaleString('es-AR')}`);

    const resumen = {
        leidas: 0, conError: 0, sinPlanes: 0,
        carrerasNuevas: 0, carrerasBaja: 0,
        planesNuevos: 0, planesActualizados: 0, planesSinCambios: 0, planesBaja: 0,
        materiasNuevas: 0, materiasActualizadas: 0, materiasBaja: 0,
    };
    const idsLeidas = [];
    const vueltos = [];

    try {
        const dependencias = await planesRepo.listarDependenciasConCodigo();
        for (const dependencia of dependencias) {
            try {
                const carreras = await pedirPlanesDeGo(dependencia.codigo);
                if (carreras === null) {
                    resumen.sinPlanes += 1;
                    console.log(`${PREFIJO} ${dependencia.codigo}: sin planes`);
                    continue;
                }
                const planesVueltos = await guardarDependencia(dependencia, carreras, resumen);
                idsLeidas.push(dependencia.id);
                vueltos.push(...planesVueltos);
                resumen.leidas += 1;
                console.log(`${PREFIJO} ${dependencia.codigo}: leída (${carreras.length} carreras)`);
            } catch (error) {
                resumen.conError += 1;
                console.error(`${PREFIJO} ${dependencia.codigo}: error (${error.message})`);
            }
        }

        if (idsLeidas.length > 0) {
            await conTransaccion(async (client) => {
                resumen.planesBaja += await planesRepo.darDeBajaPlanesNoVueltos(
                    client,
                    idsLeidas,
                    vueltos.map((vuelto) => vuelto.idCarrera),
                    vueltos.map((vuelto) => vuelto.plan)
                );
                const bajas = await planesRepo.darDeBajaCarrerasSinDependencia(client);
                resumen.planesBaja += bajas.planes;
                resumen.carrerasBaja += bajas.carreras;
            });
        }
    } catch (error) {
        console.error(`${PREFIJO} error: ${error.message}`);
    } finally {
        corriendo = false;
    }

    const segundos = Math.round((Date.now() - inicio) / 1000);
    console.log(
        `${PREFIJO} fin en ${segundos} s: ${resumen.leidas} dependencias leídas, ${resumen.conError} con error, ${resumen.sinPlanes} sin planes; ` +
            `carreras ${resumen.carrerasNuevas} nuevas y ${resumen.carrerasBaja} dadas de baja; ` +
            `planes ${resumen.planesNuevos} nuevos, ${resumen.planesActualizados} actualizados, ${resumen.planesSinCambios} sin cambios y ${resumen.planesBaja} dados de baja; ` +
            `materias ${resumen.materiasNuevas} nuevas, ${resumen.materiasActualizadas} actualizadas y ${resumen.materiasBaja} dadas de baja`
    );
};
