import { normativas } from '../data/normativas.mock.json'

function simularRespuesta(datos) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(datos), 200)
    })
}

//Normaliza una normativa al shape esperado por Busqueda.jsx
function toResultado(n) {
    // Formatea fecha de "YYYY-MM-DD" a "DD-MM-YYYY"
    const [y, m, d] = n.fecha.split('-')
    return {
        id: n.id,
        title: n.titulo,
        codigo: n.codigo,
        organo: n.origen,   // "Origen" es el campo más descriptivo para la búsqueda
        tipo: n.tipo,
        fecha: `${d}-${m}-${y}`,
        snippet: n.snippet,
    }
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
    return normativas
        .filter((n) => {
            // Texto libre — título, snippet o código
            if (searchTerm) {
                const q = searchTerm.toLowerCase()
                if (
                    !n.titulo.toLowerCase().includes(q) &&
                    !n.snippet.toLowerCase().includes(q) &&
                    !n.codigo.toLowerCase().includes(q)
                ) return false
            }

            // Tipo de documento
            if (tipoDocumento) {
                if (!n.tipo.toLowerCase().includes(tipoDocumento.toLowerCase())) return false
            }

            // Organismo emisor — busca en origen y organo
            if (organismoEmisor) {
                const keyword = organismoEmisor.toLowerCase()
                const enOrigen = n.origen.toLowerCase().includes(keyword)
                const enOrgano = n.organo.toLowerCase().includes(keyword)
                if (!enOrigen && !enOrgano) return false
            }

            // Número de norma (busca en el código)
            if (numeroNorma) {
                if (!n.codigo.includes(numeroNorma)) return false
            }

            // Año (los 2 últimos dígitos del código, ej: "26" en "RR-1-145/26")
            if (anioNorma) {
                const anioCorto = String(anioNorma).slice(-2)
                if (!n.codigo.endsWith(`/${anioCorto}`)) return false
            }

            // Rango de fechas — n.fecha ya está en YYYY-MM-DD
            if (fechaDesde && n.fecha < fechaDesde) return false
            if (fechaHasta && n.fecha > fechaHasta) return false

            return true
        })
        .sort((a, b) => b.fecha.localeCompare(a.fecha))
        .map(toResultado)
}

//Versión asíncrona (simula llamada a API).
export function buscarNormativas(params) {
    return simularRespuesta(filtrarResultados(params))
}

