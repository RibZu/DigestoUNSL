function normalizar(texto) {
    return texto.toLocaleLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

export function contieneTexto(campos, texto) {
    const buscado = normalizar(texto.trim())
    return buscado === '' || campos.some((campo) => normalizar(campo ?? '').includes(buscado))
}

export function tieneValores(objeto) {
    return Object.values(objeto).some((valor) => valor !== '')
}

export function alternar(lista, valor) {
    return lista.includes(valor) ? lista.filter((otro) => otro !== valor) : [...lista, valor]
}

export function comoOpciones(valores) {
    return valores.map((valor) => ({ valor, texto: valor }))
}
