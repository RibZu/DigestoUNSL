import * as concursosRepo from './concursos.repository.js';

export const listarConcursos = async (filtros) => {
    return await concursosRepo.buscarConcursosBD(filtros);
};

export const obtenerConcursoPorId = async (id) => {
    const concurso = await concursosRepo.obtenerConcursoPorIdBD(id);
    if (!concurso) {
        const error = new Error('Concurso no encontrado o dado de baja');
        error.status = 404;
        throw error;
    }
    return concurso;
};
