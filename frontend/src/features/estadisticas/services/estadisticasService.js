import { pedirApi } from '../../auth'
import { obtenerFacultades } from '../../concursos'

export async function obtenerEstadisticas() {
  return pedirApi('/estadisticas/documentos')
}

export async function obtenerTerminosMasBuscados() {
  return pedirApi('/estadisticas/terminos?limite=15')
}

export async function obtenerConcursosPorAnio() {
  const [filas, facultades] = await Promise.all([
    pedirApi('/estadisticas/concursos'),
    obtenerFacultades(),
  ])
  const porAnio = new Map()

  for (const fila of filas) {
    const conteo = porAnio.get(fila.anio) ?? new Map()
    conteo.set(fila.categoria, (conteo.get(fila.categoria) ?? 0) + fila.llamados)
    porAnio.set(fila.anio, conteo)
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
