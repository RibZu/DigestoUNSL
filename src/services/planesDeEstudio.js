import listado from '../features/planes-de-estudio/planes-de-estudio.mock.json'
import detalle from '../features/planes-de-estudio/planes-de-estudio.detalle.mock.json'

export const SITIO_PLANES_DE_ESTUDIO = 'http://planesestudio.unsl.edu.ar/'

export function obtenerPlanesDeEstudio() {
    return listado.facultades
}

export function obtenerPlanDeEstudio(carrera, plan) {
    return detalle.planes.find((p) => p.carrera === carrera && p.plan.replaceAll('/', '-') === plan) ?? null
}
