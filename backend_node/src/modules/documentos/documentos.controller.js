import * as documentoService from './documentos.service.js';

export const listar = async (req, res, next) => {
    try {
        const resultado = await documentoService.listarDocumentos(req.query);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};

export const obtenerPorId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const documento = await documentoService.obtenerDocumentoPorId(id);
        res.status(200).json(documento);
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        next(error);
    }
};

export const actualizar = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.usuario.id;
        const documentoActualizado = await documentoService.actualizarDocumento(id, req.body, userId, req.usuario);
        res.status(200).json(documentoActualizado);
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        next(error);
    }
};