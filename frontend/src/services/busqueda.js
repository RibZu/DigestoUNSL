import mock from '../features/busqueda/busqueda.mock.json'

function simularRespuesta(datos) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(datos), 200)
    })
}

/** Mapeo de valores del select de organismo a fragmentos del campo `organo` en el JSON */
const ORGANISMO_MAP = {
    rectorado: 'rectorado',
    fcfmyn: 'fcfmyn',
    fcejs: 'fcejs',
    fch: 'fch',
    fqbyf: 'fqbyf',
    fcs: 'fcs',
    fapyp: 'psicología',
    secretarias: 'secretarías',
}

/**
 * Filtra el catálogo de normativas según los parámetros de búsqueda.
 *
 * @param {Object} params
 * @param {string} params.searchTerm           - Texto libre (título / snippet)
 * @param {string} params.tipoDocumento        - Valor del select de tipo
 * @param {string} params.organismoEmisor      - Valor del select de organismo
 * @param {string} params.numeroNorma          - Número de la norma
 * @param {string} params.anioNorma            - Año de la norma
 * @param {string} params.fechaDesde           - Fecha ISO mínima (YYYY-MM-DD)
 * @param {string} params.fechaHasta           - Fecha ISO máxima (YYYY-MM-DD)
 */
export function filtrarResultados({
    searchTerm = '',
    tipoDocumento = '',
    organismoEmisor = '',
    numeroNorma = '',
    anioNorma = '',
    fechaDesde = '',
    fechaHasta = '',
} = {}) {
    return mock.filter((item) => {
        // Texto libre — título o snippet
        if (searchTerm) {
            const q = searchTerm.toLowerCase()
            const enTitulo = item.title.toLowerCase().includes(q)
            const enSnippet = item.snippet.toLowerCase().includes(q)
            const enCodigo = item.codigo.toLowerCase().includes(q)
            if (!enTitulo && !enSnippet && !enCodigo) return false
        }

        // Tipo de documento
        if (tipoDocumento) {
            if (!item.tipo.toLowerCase().includes(tipoDocumento.toLowerCase())) return false
        }

        // Organismo emisor
        if (organismoEmisor) {
            const keyword = ORGANISMO_MAP[organismoEmisor] ?? organismoEmisor
            if (!item.organo.toLowerCase().includes(keyword)) return false
        }

        // Número de norma (busca en el código)
        if (numeroNorma) {
            if (!item.codigo.includes(numeroNorma)) return false
        }

        // Año (busca en el código, ej: "26" en "RR-1-145/26")
        if (anioNorma) {
            const anioCorto = String(anioNorma).slice(-2)
            if (!item.codigo.endsWith(`/${anioCorto}`)) return false
        }

        // Rango de fechas — el campo `fecha` en el mock está en formato DD-MM-YYYY
        if (fechaDesde || fechaHasta) {
            const [d, m, y] = item.fecha.split('-')
            const fechaItem = `${y}-${m}-${d}` // convertir a YYYY-MM-DD para comparar
            if (fechaDesde && fechaItem < fechaDesde) return false
            if (fechaHasta && fechaItem > fechaHasta) return false
        }

        return true
    })
}

/**
 * Versión asíncrona (simula llamada a API).
 */
export function buscarNormativas(params) {
    return simularRespuesta(filtrarResultados(params))
}
