import * as concursosService from './concursos.service.js';

export const listar = async (req, res, next) => {
    try {
        const resultado = await concursosService.listarConcursos(req.query);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};

export const obtenerPorId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const concurso = await concursosService.obtenerConcursoPorId(id);
        res.status(200).json(concurso);
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        next(error);
    }
};
