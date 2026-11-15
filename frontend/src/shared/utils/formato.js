export const SIN_DATO = '—'

export function formatearFecha(fechaIso) {
  if (!fechaIso) return SIN_DATO
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(`${fechaIso.slice(0, 10)}T00:00:00`))
}

export function contar(cantidad, singular, plural) {
  return `${cantidad.toLocaleString('es-AR')} ${cantidad === 1 ? singular : plural}`
}

export function anchoRelativo(cantidad, maximo) {
  return maximo === 0 ? 0 : (cantidad / maximo) * 100
}
