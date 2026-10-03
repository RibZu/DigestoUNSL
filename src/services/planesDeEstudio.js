import mock from '../features/planes-de-estudio/planes-de-estudio.mock.json'

function simularRespuesta(datos) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(datos), 100)
    })
}

export function obtenerPlanesDeEstudio() {
    return simularRespuesta(mock.facultades)
}

export async function obtenerPlanDeEstudio(carrera, plan) {
    const { default: detalle } = await import(
        '../features/planes-de-estudio/planes-de-estudio.detalle.mock.json'
    )
    const encontrado = detalle.planes.find(
        (p) => p.carrera === carrera && p.plan.replaceAll('/', '-') === plan
    )
    return simularRespuesta(encontrado ?? null)
}
