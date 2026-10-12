import mock from '../features/novedades/novedades.mock.json'

function simularRespuesta(datos) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(datos), 100)
    })
}

/**
 * Retorna todos los tipos de normativas distintos presentes en el mock.
 */
export function listarTipos() {
    const tipos = [...new Set(mock.map((item) => item.tipo))]
    return tipos.sort()
}

/**
 * Filtra las novedades por tipo y/o texto de búsqueda.
 * @param {string} tipo   - Tipo de normativa (vacío = todos)
 * @param {string} query  - Texto a buscar en título, código o descripción
 */
export function filtrarNovedades(tipo = '', query = '') {
    return mock.filter((item) => {
        const matchesTipo = tipo === '' || item.tipo.toLowerCase() === tipo.toLowerCase()
        const q = query.toLowerCase()
        const matchesQuery =
            q === '' ||
            item.title.toLowerCase().includes(q) ||
            item.descripcion.toLowerCase().includes(q) ||
            item.codigo.toLowerCase().includes(q)
        return matchesTipo && matchesQuery
    })
}

/**
 * Versión asíncrona (simula llamada a API).
 */
export function obtenerNovedades(tipo = '', query = '') {
    return simularRespuesta(filtrarNovedades(tipo, query))
}
