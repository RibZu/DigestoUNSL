import * as estRepo from './estadisticas.repository.js';

export const obtenerTotalesDocumentos = async () => {
    return await estRepo.obtenerTotalesDocumentosBD();
};

export const obtenerRankingTerminos = async (limiteParam) => {
    const limite = Math.min(Math.max(parseInt(limiteParam, 10) || 10, 1), 100);
    return await estRepo.obtenerRankingTerminosBD(limite);
};

export const obtenerEstadisticasConcursos = async (por, desde, hasta) => {
    const criteriosValidos = ['facultad', 'cargo', 'dedicacion', 'caracter', 'area'];
    const criterio = criteriosValidos.includes(por) ? por : 'facultad';
    const anioDesde = desde ? parseInt(desde, 10) : null;
    const anioHasta = hasta ? parseInt(hasta, 10) : null;

    return await estRepo.obtenerEstadisticasConcursosBD(criterio, anioDesde, anioHasta);
};
