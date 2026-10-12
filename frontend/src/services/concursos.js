import mock from '../features/concursos/concursos.mock.json'

const URL_RESOLUCION = 'http://digesto.unsl.edu.ar/busca_codigo.php3?var='

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

export function esVigente(llamado, hoy = fechaLocalIso()) {
    return llamado.inscripcionHasta >= hoy
}

export function listarFacultades() {
    return mock.dependencias
        .filter((dependencia) => dependencia.esFacultad && !dependencia.historica)
        .sort((a, b) => a.numero - b.numero)
        .map(({ numero, sigla, nombre, ubicacion }) => ({ numero, sigla, nombre, ubicacion }))
}

export function unirConcursos() {
    const documentos = new Map(
        mock.documentos.filter((documento) => documento.baja === null).map((documento) => [documento.codigo, documento])
    )
    const departamentos = new Map(mock.departamentos.map((departamento) => [departamento.id, departamento]))
    const areas = new Map(mock.areas.map((area) => [area.id, area]))

    return mock.llamados
        .filter((llamado) => documentos.has(llamado.documento))
        .map((llamado) => {
            const documento = documentos.get(llamado.documento)
            return {
                id: llamado.id,
                facultad: documento.dependenciaEmisora,
                departamento: departamentos.get(llamado.departamento).nombre,
                area: areas.get(llamado.area).nombre,
                cargo: llamado.cargo,
                dedicacion: llamado.dedicacion,
                caracter: llamado.caracter,
                inscripcionDesde: llamado.inscripcionDesde,
                inscripcionHasta: llamado.inscripcionHasta,
                resolucion: documento.codigo,
                resolucionUrl: `${URL_RESOLUCION}${documento.codigo}`,
            }
        })
}

export function obtenerFacultades() {
    return simularRespuesta(listarFacultades())
}

export function obtenerConcursos() {
    const vigentes = unirConcursos()
        .filter((concurso) => esVigente(concurso))
        .sort((a, b) => a.inscripcionHasta.localeCompare(b.inscripcionHasta))
    return simularRespuesta(vigentes)
}
