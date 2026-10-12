import terminosMock from '../features/estadisticas-privadas/terminos.mock.json'
import { obtenerFacultades, obtenerLlamados } from './concursos.js'

export function obtenerTerminosMasBuscados() {
    return [...terminosMock.terminos].sort(
        (a, b) => b.busquedas - a.busquedas || a.termino.localeCompare(b.termino, 'es')
    )
}

export function obtenerConcursosPorAnio() {
    const facultades = obtenerFacultades()
    const porAnio = new Map()

    for (const llamado of obtenerLlamados()) {
        if (!llamado.inscripcionDesde) continue
        const anio = Number(llamado.inscripcionDesde.slice(0, 4))
        const conteo = porAnio.get(anio) ?? new Map()
        conteo.set(llamado.facultad, (conteo.get(llamado.facultad) ?? 0) + 1)
        porAnio.set(anio, conteo)
    }

    return [...porAnio.entries()]
        .map(([anio, conteo]) => {
            const porFacultad = facultades
                .map(({ codigo, nombre }) => ({ codigo, nombre, cantidad: conteo.get(codigo) ?? 0 }))
                .sort((a, b) => b.cantidad - a.cantidad || a.nombre.localeCompare(b.nombre, 'es'))
            const total = porFacultad.reduce((suma, facultad) => suma + facultad.cantidad, 0)
            return { anio, total, facultades: porFacultad }
        })
        .sort((a, b) => b.anio - a.anio)
}
