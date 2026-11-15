import { crearSolicitud, listar as listarPedidos, resolver as resolverPedido } from './restablecimientos.service.js';

export const crear = async (req, res, next) => {
    try {
        const respuesta = await crearSolicitud(req.body);
        res.status(201).json(respuesta);
    } catch (err) {
        next(err);
    }
};

export const listar = async (req, res, next) => {
    try {
        const solicitudes = await listarPedidos(req.query.estado);
        res.status(200).json(solicitudes);
    } catch (err) {
        next(err);
    }
};

export const resolver = async (req, res, next) => {
    try {
        const solicitud = await resolverPedido(req.params.id, req.body, req.usuario.id);
        res.status(200).json(solicitud);
    } catch (err) {
        next(err);
    }
};
