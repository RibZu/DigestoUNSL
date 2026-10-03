import mock from '../features/concursos/concursos.mock.json'

const DATOS_FIJOS = {
    fapsi: { ubicacion: 'San Luis', historica: false },
    fcejs: { ubicacion: 'Villa Mercedes', historica: false },
    fcfmn: { ubicacion: 'San Luis', historica: false },
    fch: { ubicacion: 'San Luis', historica: false },
    fcs: { ubicacion: 'San Luis', historica: false },
    fica: { ubicacion: 'Villa Mercedes', historica: false },
    fices: { ubicacion: 'Villa Mercedes', historica: true },
    fqbf: { ubicacion: 'San Luis', historica: false },
    ftu: { ubicacion: 'Merlo', historica: false },
}

const FECHA_DE_LA_API = /^(\d{2})\/(\d{2})\/(\d{2}|\d{4})$/

function simularRespuesta(datos) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(datos), 100)
    })
}

function fechaLocalIso() {
    const ahora = new Date()
    const mes = String(ahora.getMonth() + 1).padStart(2, '0')
    const dia = String(ahora.getDate()).padStart(2, '0')
    return `${ahora.getFullYear()}-${mes}-${dia}`
}

function esLlamado(concurso) {
    return concurso.cargo !== '' && concurso.resolucion !== ''
}

function convertirFecha(texto) {
    const partes = FECHA_DE_LA_API.exec(texto)
    if (partes === null) return null
    const [, dia, mes, anio] = partes
    return `${anio.length === 2 ? `20${anio}` : anio}-${mes}-${dia}`
}

function fechaDeCierre(concurso) {
    return convertirFecha(concurso.inscripcion_hasta)
}

export function anioDeInscripcion(concurso) {
    const fecha = convertirFecha(concurso.inscripcion_desde)
    return fecha === null ? null : Number(fecha.slice(0, 4))
}

function esVigente(concurso, hoy = fechaLocalIso()) {
    const cierre = fechaDeCierre(concurso)
    return cierre !== null && cierre >= hoy
}

export function listarFacultades() {
    return Object.entries(mock.facultades)
        .filter(([codigo]) => !DATOS_FIJOS[codigo]?.historica)
        .map(([codigo, nombre]) => ({
            codigo,
            nombre,
            ubicacion: DATOS_FIJOS[codigo]?.ubicacion ?? null,
        }))
        .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
}

export function listarLlamados() {
    const codigos = new Set(listarFacultades().map((facultad) => facultad.codigo))
    return mock.concursos.filter((concurso) => esLlamado(concurso) && codigos.has(concurso.facultad))
}

export function obtenerFacultades() {
    return simularRespuesta(listarFacultades())
}

export function obtenerConcursos() {
    const vigentes = listarLlamados()
        .filter((concurso) => esVigente(concurso))
        .sort((a, b) => fechaDeCierre(a).localeCompare(fechaDeCierre(b)))
    return simularRespuesta(vigentes)
}
