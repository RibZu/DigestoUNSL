import mock from '../features/concursos/concursos.mock.json'

const CIUDADES = {
    fapsi: 'San Luis',
    fcejs: 'Villa Mercedes',
    fcfmn: 'San Luis',
    fch: 'San Luis',
    fcs: 'San Luis',
    fica: 'Villa Mercedes',
    fqbf: 'San Luis',
    ftu: 'Merlo',
}

const FECHA_DE_LA_API = /^(\d{2})\/(\d{2})\/(\d{2}|\d{4})$/

function fechaDeHoy() {
    const ahora = new Date()
    const mes = String(ahora.getMonth() + 1).padStart(2, '0')
    const dia = String(ahora.getDate()).padStart(2, '0')
    return `${ahora.getFullYear()}-${mes}-${dia}`
}

function convertirFecha(texto) {
    const partes = FECHA_DE_LA_API.exec(texto)
    if (partes === null) return null
    const [, dia, mes, anio] = partes
    return `${anio.length === 2 ? `20${anio}` : anio}-${mes}-${dia}`
}

function inicioDelConcurso(concurso) {
    return concurso.llamados.reduce(
        (inicio, llamado) => (llamado.inscripcionDesde > inicio ? llamado.inscripcionDesde : inicio),
        ''
    )
}

export function estaVigente(llamado) {
    return Boolean(llamado.inscripcionHasta) && llamado.inscripcionHasta >= fechaDeHoy()
}

export function obtenerFacultades() {
    return Object.entries(mock.facultades)
        .filter(([codigo]) => codigo in CIUDADES)
        .map(([codigo, nombre]) => ({ codigo, nombre, ubicacion: CIUDADES[codigo] }))
        .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
}

export function obtenerLlamados() {
    return mock.concursos
        .map((fila, posicion) => ({
            id: `${fila.resolucion}#${posicion}`,
            facultad: fila.facultad,
            departamento: fila.departamento,
            area: fila.area,
            cargo: fila.cargo,
            dedicacion: fila.dedicacion,
            caracter: fila.caracter,
            resolucion: fila.resolucion,
            inscripcionDesde: convertirFecha(fila.inscripcion_desde),
            inscripcionHasta: convertirFecha(fila.inscripcion_hasta),
        }))
        .filter((llamado) => llamado.cargo !== '' && llamado.resolucion !== '' && llamado.facultad in CIUDADES)
}

export function obtenerConcursosVigentes() {
    return obtenerLlamados()
        .filter(estaVigente)
        .sort((a, b) => a.inscripcionHasta.localeCompare(b.inscripcionHasta))
}

export function obtenerConcursosCargados() {
    const porResolucion = new Map()

    for (const llamado of obtenerLlamados()) {
        const concurso = porResolucion.get(llamado.resolucion) ?? {
            id: llamado.resolucion,
            codigo: llamado.resolucion,
            dependencia: llamado.facultad,
            llamados: [],
        }
        concurso.llamados.push(llamado)
        porResolucion.set(llamado.resolucion, concurso)
    }

    return [...porResolucion.values()].sort(
        (a, b) => inicioDelConcurso(b).localeCompare(inicioDelConcurso(a)) || a.codigo.localeCompare(b.codigo, 'es')
    )
}
