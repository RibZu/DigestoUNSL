import * as documentoService from './documentos.service.js';

export const listar = async (req, res, next) => {
    try {
        const documentos = await documentoService.listarDocumentos();
        res.status(200).json(documentos);
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
        const userId = req.usuario.id; // Proveído por el middleware de autenticación
        const nuevoDocumento = await documentoService.crearDocumento(req.body, userId);
        res.status(201).json(nuevoDocumento);
    } catch (error) {
        next(error);
    }
};

export const actualizar = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.usuario.id;
        const documentoActualizado = await documentoService.actualizarDocumento(id, req.body, userId);
        res.status(200).json(documentoActualizado);
    } catch (error) {
        next(error);
    }
};

export const eliminar = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.usuario.id;
        const documentoEliminado = await documentoService.eliminarDocumento(id, userId);
        res.status(200).json({ message: 'Documento dado de baja correctamente', documento: documentoEliminado });
    } catch (error) {
        next(error);
    }
};