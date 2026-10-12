export const SIN_DATO = '—'

export function formatearFecha(fechaIso) {
    if (!fechaIso) return SIN_DATO
    return new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date(`${fechaIso}T00:00:00`))
}
