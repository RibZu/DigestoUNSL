const API_URL = 'http://localhost:3000/api/v1/planes'

export const SITIO_PLANES_DE_ESTUDIO = 'http://planesestudio.unsl.edu.ar/'

// Obtiene todas las facultades con sus carreras y planes desde el backend
export async function obtenerPlanesDeEstudio(codigoFacultad) {
    const url = codigoFacultad ? `${API_URL}?facultad=${codigoFacultad}` : API_URL
    const res = await fetch(url)
    if (!res.ok) {
        throw new Error('Error al obtener planes de estudio')
    }
    return await res.json()
}

// Obtiene el detalle de un plan específico con sus materias
export async function obtenerPlanDeEstudio(carrera, plan) {
    const res = await fetch(`${API_URL}/${carrera}/${plan}`)
    if (!res.ok) return null
    const data = await res.json()

    // Formatear a la estructura que espera la vista
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
