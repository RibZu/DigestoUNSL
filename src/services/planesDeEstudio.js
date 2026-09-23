import mock from '../features/planes-de-estudio/planes-de-estudio.mock.json'

function simularRespuesta(datos) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(datos), 100)
    })
}

export function obtenerPlanesDeEstudio() {
    return simularRespuesta(mock.facultades)
}
