export function esRequerido(valor) {
    return String(valor ?? '').trim() !== ''
}

export function esEmailValido(correo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())
}
