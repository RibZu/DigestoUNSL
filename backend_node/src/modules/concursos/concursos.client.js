import { env } from '../../config/env.js';

const pedirJson = async (direccion) => {
    let respuesta;
    try {
        respuesta = await fetch(direccion, { signal: AbortSignal.timeout(env.ESPERA_GO) });
    } catch (error) {
        throw new Error(`sin conexión con backend-go: ${error.message}`);
    }
    if (respuesta.status === 404) return null;
    if (!respuesta.ok) {
        const cuerpo = await respuesta.json().catch(() => ({}));
        throw new Error(`Go respondió ${respuesta.status}: ${cuerpo.error ?? 'sin detalle'}`);
    }
    return await respuesta.json();
};

export const pedirConcursosDeGo = (codigo) =>
    pedirJson(`${env.GO_API_URL}/api/v1/dependencias/${codigo}/concursos`);

export const descargarPdf = async (ruta) => {
    const respuesta = await fetch(env.DIGESTO_DOCS_URL + ruta, { signal: AbortSignal.timeout(60000) });
    if (!respuesta.ok) throw new Error(`el Digesto respondió ${respuesta.status} para ${ruta}`);
    return Buffer.from(await respuesta.arrayBuffer());
};
