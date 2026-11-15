import { env } from '../../config/env.js';

export const pedirPlanesDeGo = async (codigo) => {
    let respuesta;
    try {
        respuesta = await fetch(`${env.GO_API_URL}/api/v1/dependencias/${codigo}/planes`, {
            signal: AbortSignal.timeout(env.ESPERA_GO),
        });
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
