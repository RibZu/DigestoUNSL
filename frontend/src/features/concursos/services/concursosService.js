import { pedirApi } from '../../auth'

function fechaCorta(fecha) {
  return fecha ? fecha.slice(0, 10) : null
}

function fechaDeHoy() {
  const ahora = new Date()
  const mes = String(ahora.getMonth() + 1).padStart(2, '0')
  const dia = String(ahora.getDate()).padStart(2, '0')
  return `${ahora.getFullYear()}-${mes}-${dia}`
}

function aLlamado(concurso, llamado) {
  return {
    id: llamado.id,
    id_documento: concurso.id,
    id_area: llamado.area_id,
    resolucion: concurso.codigo,
    facultad: concurso.facultad_sigla,
    departamento_id: llamado.departamento_id,
    departamento: llamado.departamento_nombre,
    area: llamado.area_nombre,
    cargo: llamado.cargo,
    dedicacion: llamado.dedicacion,
    caracter: llamado.caracter,
    inscripcionDesde: fechaCorta(llamado.inscripcion_desde),
    inscripcionHasta: fechaCorta(llamado.inscripcion_hasta),
    archivo_ruta: concurso.archivo_ruta,
    url_externa: concurso.url_externa,
  }
}

export function estaVigente(llamado) {
  return Boolean(llamado.inscripcionHasta) && llamado.inscripcionHasta >= fechaDeHoy()
}

export async function obtenerFacultades() {
  const dependencias = await pedirApi('/dependencias')

  return dependencias
    .filter((dependencia) => dependencia.es_facultad)
    .map((dependencia) => ({
      codigo: dependencia.sigla,
      nombre: dependencia.nombre,
      ubicacion: dependencia.ubicacion,
    }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
}

export async function obtenerConcursosVigentes() {
  const concursos = []
  let pagina = 1
  let completo = false

  while (!completo) {
    const respuesta = await pedirApi(`/concursos?estado=vigentes&limite=100&pagina=${pagina}`)
    concursos.push(...respuesta.resultados)
    completo = respuesta.resultados.length === 0 || concursos.length >= respuesta.total
    pagina += 1
  }

  return concursos
    .flatMap((concurso) => concurso.llamados.map((llamado) => aLlamado(concurso, llamado)))
    .sort((a, b) => a.inscripcionHasta.localeCompare(b.inscripcionHasta))
}

export async function obtenerConcursosCargados(consulta) {
  const { total, pagina, limite, resultados } = await pedirApi(`/concursos?${consulta}`)

  return {
    total,
    pagina,
    limite,
    resultados: resultados.map((concurso) => ({
      id: concurso.id,
      codigo: concurso.codigo,
      prefijo: concurso.prefijo,
      numero: concurso.numero,
      anio: concurso.anio,
      fecha_emision: fechaCorta(concurso.fecha_emision),
      descripcion: concurso.descripcion,
      dependencia: concurso.facultad_sigla,
      id_dependencia_emisora: concurso.id_dependencia_emisora,
      archivo_ruta: concurso.archivo_ruta,
      url_externa: concurso.url_externa,
      tiene_archivo: concurso.tiene_archivo,
      llamados: concurso.llamados.map((llamado) => aLlamado(concurso, llamado)),
    })),
  }
}
