import {realizarBusqueda} from './busqueda.service.js';

export const buscar = async (req, res, next) => {
    try {
        const filtros = req.query;
        const resultados = await realizarBusqueda(filtros);
        res.status(200).json(resultados);
    } catch (error) {
        next(error);
    }
};