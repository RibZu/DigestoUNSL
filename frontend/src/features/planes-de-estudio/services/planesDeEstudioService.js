import { pedirApi } from '../../auth'

export const SITIO_PLANES_DE_ESTUDIO = 'http://planesestudio.unsl.edu.ar/'

export async function obtenerPlanesDeEstudio(codigoFacultad) {
  return pedirApi(codigoFacultad ? `/planes?facultad=${codigoFacultad}` : '/planes')
}

export async function obtenerPlanDeEstudio(clave) {
  const [carrera, plan] = clave.split('/')
  let data

  try {
    data = await pedirApi(`/planes/${carrera}/${plan}`)
  } catch (error) {
    if (error.estado === 404) return null
    throw error
  }

  return {
    carrera: data.carrera_codigo || carrera,
    nombreCarrera: data.carrera_nombre || '',
    plan: data.plan,
    ordenanza: data.ordenanza,
    anios: data.anios,
    url: data.url_oficial,
    materiasPorAnio: Object.entries(data.materias || {}).map(([anio, materias]) => ({
      anio: Number(anio),
      materias: (materias || []).map((m) => ({
        codigo: m.codigo,
        nombre: m.nombre,
        periodo: m.periodo,
      })),
    })),
  }
}
