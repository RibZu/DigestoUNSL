import {realizarBusqueda} from './busqueda.service.js';

export const buscar = async (req, res, next) => {
    try {
        const filtros = req.query; // Lee los query params de la URL
        const resultados = await realizarBusqueda(filtros);
        res.status(200).json(resultados);
    } catch (error) {
        next(error);
    }
};