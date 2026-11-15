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
        next(error);
    }
};

export const crear = async (req, res, next) => {
    try {
        const documento = await documentoService.crearDocumento(req.body ?? {}, req.file, req.usuario);
        res.status(201).json(documento);
    } catch (error) {
        next(error);
    }
};

export const actualizar = async (req, res, next) => {
    try {
        const { id } = req.params;
        const documento = await documentoService.actualizarDocumento(id, req.body ?? {}, req.file, req.usuario);
        res.status(200).json(documento);
    } catch (error) {
        next(error);
    }
};

export const obtenerArchivo = async (req, res, next) => {
    try {
        const ruta = await documentoService.obtenerArchivo(req.params.id);
        res.sendFile(ruta);
    } catch (error) {
        next(error);
    }
};
