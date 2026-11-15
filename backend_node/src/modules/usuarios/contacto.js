export const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const esTelefonoValido = (valor) => {
    const texto = String(valor ?? '').trim();
    return /^[0-9+()\s-]{6,30}$/.test(texto) && texto.replace(/\D/g, '').length >= 6;
};

export const esDniValido = (valor) => /^\d{7,8}$/.test(String(valor ?? '').trim());

export const textoOpcional = (valor) => {
    if (valor === undefined || valor === null) return null;
    const texto = String(valor).trim();
    return texto === '' ? null : texto;
};
