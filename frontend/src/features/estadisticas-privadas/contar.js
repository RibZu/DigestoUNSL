export function contar(cantidad, singular, plural) {
    return `${cantidad.toLocaleString('es-AR')} ${cantidad === 1 ? singular : plural}`
}
