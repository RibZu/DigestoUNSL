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
        next(error);
    }
};

export const crear = async (req, res, next) => {
    try {
        const { completado, concurso } = await concursosService.crearConcurso(req.body ?? {}, req.file, req.usuario);
        res.status(completado ? 200 : 201).json(concurso);
    } catch (error) {
        next(error);
    }
};

export const actualizar = async (req, res, next) => {
    try {
        const concurso = await concursosService.actualizarConcurso(req.params.id, req.body ?? {}, req.file, req.usuario);
        res.status(200).json(concurso);
    } catch (error) {
        next(error);
    }
};
