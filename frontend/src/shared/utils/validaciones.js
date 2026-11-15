export function esRequerido(valor) {
  return String(valor ?? '').trim() !== ''
}

export function esEmailValido(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())
}

export function esTelefonoValido(valor) {
  const texto = String(valor ?? '').trim()
  return /^[0-9+()\s-]{6,30}$/.test(texto) && texto.replace(/\D/g, '').length >= 6
}

export function esDniValido(valor) {
  return /^\d{7,8}$/.test(String(valor ?? '').trim())
}
