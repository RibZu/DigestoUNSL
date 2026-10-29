import * as planesService from './planes.service.js';

export const listar = async (req, res, next) => {
    try {
        const facultad = req.query.facultad;
        const resultado = await planesService.listarPlanes(facultad);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};

export const obtenerPorCarreraYPlan = async (req, res, next) => {
    try {
        const { carrera, plan } = req.params;
        const resultado = await planesService.obtenerPlan(carrera, plan);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};
