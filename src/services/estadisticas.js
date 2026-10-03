import terminosMock from '../features/estadisticas-privadas/terminos.mock.json'
import { anioDeInscripcion, listarFacultades, listarLlamados } from './concursos.js'

function simularRespuesta(datos) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(datos), 100)
    })
}

export function obtenerTerminosMasBuscados() {
    const ordenados = [...terminosMock.terminos].sort(
        (a, b) => b.busquedas - a.busquedas || a.termino.localeCompare(b.termino, 'es')
    )
    return simularRespuesta(ordenados)
}

export function obtenerConcursosPorAnio() {
    const facultades = listarFacultades()
    const porAnio = new Map()

    for (const llamado of listarLlamados()) {
        const anio = anioDeInscripcion(llamado)
        if (anio === null) continue
        const conteo = porAnio.get(anio) ?? new Map()
        conteo.set(llamado.facultad, (conteo.get(llamado.facultad) ?? 0) + 1)
        porAnio.set(anio, conteo)
    }

    const anios = [...porAnio.entries()]
        .map(([anio, conteo]) => {
            const porFacultad = facultades
                .map(({ codigo, nombre }) => ({ codigo, nombre, cantidad: conteo.get(codigo) ?? 0 }))
                .sort((a, b) => b.cantidad - a.cantidad || a.nombre.localeCompare(b.nombre, 'es'))
            const total = porFacultad.reduce((suma, facultad) => suma + facultad.cantidad, 0)
            return { anio, total, facultades: porFacultad }
        })
        .sort((a, b) => b.anio - a.anio)

    return simularRespuesta(anios)
}
