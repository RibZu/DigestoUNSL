import mock from '../features/estadisticas/estadisticas.mock.json'
import { esVigente, listarFacultades, unirConcursos } from './concursos.js'

function simularRespuesta(datos) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(datos), 100)
    })
}

function sumar(cantidades) {
    return cantidades.reduce((suma, cantidad) => suma + cantidad, 0)
}

function anioDe(fechaIso) {
    return Number(fechaIso.slice(0, 4))
}

export function obtenerEstadisticasDocumentos() {
    const totalTipos = sumar(mock.documentosPorTipo.map((tipo) => tipo.cantidad))
    const totalDependencias = sumar(mock.documentosPorDependencia.map((dependencia) => dependencia.cantidad ?? 0))

    const porTipo = mock.documentosPorTipo.map((tipo) => ({
        ...tipo,
        porcentaje: (tipo.cantidad / totalTipos) * 100,
    }))

    const porDependencia = mock.documentosPorDependencia.map((dependencia) => ({
        ...dependencia,
        porcentaje: dependencia.cantidad === null ? null : (dependencia.cantidad / totalDependencias) * 100,
    }))

    const porOficina = mock.documentosPorOficina.map(({ dependencia, oficinas }) => ({
        dependencia,
        total: sumar(oficinas.map((oficina) => oficina.cantidad)),
        oficinas: [...oficinas].sort((a, b) => b.cantidad - a.cantidad),
    }))

    return simularRespuesta({ porTipo, porDependencia, porOficina })
}

export function obtenerTerminosMasBuscados() {
    const ordenados = [...mock.terminosMasBuscados].sort(
        (a, b) => b.busquedas - a.busquedas || a.termino.localeCompare(b.termino, 'es')
    )
    return simularRespuesta(ordenados)
}

export function obtenerConcursosPorFacultad() {
    const llamados = unirConcursos()
    const anios = [...new Set(llamados.map((llamado) => anioDe(llamado.inscripcionDesde)))].sort((a, b) => a - b)

    const facultades = listarFacultades().map((facultad) => {
        const propios = llamados.filter((llamado) => llamado.facultad === facultad.numero)

        const cargos = new Map()
        for (const llamado of propios) {
            const anio = anioDe(llamado.inscripcionDesde)
            const actual = cargos.get(llamado.cargo) ?? { cargo: llamado.cargo, porAnio: {}, total: 0 }
            actual.porAnio[anio] = (actual.porAnio[anio] ?? 0) + 1
            actual.total += 1
            cargos.set(llamado.cargo, actual)
        }
        const porCargo = [...cargos.values()].sort(
            (a, b) => b.total - a.total || a.cargo.localeCompare(b.cargo, 'es')
        )

        const grupos = new Map()
        for (const llamado of propios) {
            const anio = anioDe(llamado.inscripcionDesde)
            const detalle = {
                id: llamado.id,
                cargo: llamado.cargo,
                dedicacion: llamado.dedicacion,
                caracter: llamado.caracter,
                inscripcionDesde: llamado.inscripcionDesde,
                inscripcionHasta: llamado.inscripcionHasta,
                resolucion: llamado.resolucion,
                vigente: esVigente(llamado),
            }
            grupos.set(anio, [...(grupos.get(anio) ?? []), detalle])
        }
        const llamadosPorAnio = [...grupos.entries()]
            .sort((a, b) => b[0] - a[0])
            .map(([anio, detalles]) => ({
                anio,
                llamados: detalles.sort((a, b) => b.inscripcionDesde.localeCompare(a.inscripcionDesde)),
            }))

        return { ...facultad, total: propios.length, porCargo, llamadosPorAnio }
    })

    return simularRespuesta({ anios, facultades })
}
