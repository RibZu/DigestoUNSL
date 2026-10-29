import * as estService from './estadisticas.service.js';

export const obtenerTotalesDocumentos = async (req, res, next) => {
    try {
        const resultado = await estService.obtenerTotalesDocumentos();
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};

export const obtenerRankingTerminos = async (req, res, next) => {
    try {
        const limite = req.query.limite;
        const resultado = await estService.obtenerRankingTerminos(limite);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};

export const obtenerEstadisticasConcursos = async (req, res, next) => {
    try {
        const { por, desde, hasta } = req.query;
        const resultado = await estService.obtenerEstadisticasConcursos(por, desde, hasta);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};
