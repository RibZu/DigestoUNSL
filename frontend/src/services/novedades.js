import { normativas } from '../data/normativas.mock.json'

function simularRespuesta(datos) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(datos), 100)
    })
}

//Convierte fecha ISO "YYYY-MM-DD" a texto legible en español
function fechaLegible(isoDate) {
    const [year, month, day] = isoDate.split('-')
    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    ]
    return `${parseInt(day)} de ${meses[parseInt(month) - 1]} de ${year}`
}

//Normaliza una normativa al shape esperado por Novedades.jsx
function toNovedad(n) {
    return {
        id: n.id,
        codigo: n.codigo,
        title: n.titulo,
        organo: n.organo,
        tipo: n.tipo,
        fecha: fechaLegible(n.fecha),
        descripcion: n.descripcion,
        pdfUrl: '#',
    }
}

//Retorna todos los tipos de normativas distintos presentes en el mock.
export function listarTipos() {
    return [...new Set(normativas.map((n) => n.tipo))].sort()
}

//Filtra las novedades por tipo y/o texto de búsqueda.
export function filtrarNovedades(tipo = '', query = '') {
    return normativas
        .filter((n) => {
            const matchesTipo = tipo === '' || n.tipo.toLowerCase() === tipo.toLowerCase()
            const q = query.toLowerCase()
            const matchesQuery =
                q === '' ||
                n.titulo.toLowerCase().includes(q) ||
                n.descripcion.toLowerCase().includes(q) ||
                n.codigo.toLowerCase().includes(q)
            return matchesTipo && matchesQuery
        })
        .sort((a, b) => b.fecha.localeCompare(a.fecha))
        .map(toNovedad)
}

//Versión asíncrona (simula llamada a API).
export function obtenerNovedades(tipo = '', query = '') {
    return simularRespuesta(filtrarNovedades(tipo, query))
}
