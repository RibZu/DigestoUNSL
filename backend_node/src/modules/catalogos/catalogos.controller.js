import * as catService from './catalogos.service.js';

// chequeo de permisos para bajas
const validarPermisoBajas = (req) => {
    if (req.query.incluir_bajas === 'true') {
        if (!req.usuario) {
            const err = new Error('No identificado. Se requiere token para ver registros dados de baja.');
            err.status = 401;
            throw err;
        }
        if (!req.usuario.es_admin) {
            const err = new Error('Sin permiso. Solo administradores pueden ver registros dados de baja.');
            err.status = 403;
            throw err;
        }
        return true;
    }
    return false;
};

// 1. TIPOS DE DOCUMENTO
export const listarTipos = async (req, res, next) => {
    try {
        const incluirBajas = validarPermisoBajas(req);
        const tipos = await catService.listarTipos(incluirBajas);
        res.status(200).json(tipos);
    } catch (error) {
        next(error);
    }
};

export const crearTipo = async (req, res, next) => {
    try {
        const { nombre } = req.body;
        const nuevo = await catService.crearTipo(nombre);
        res.status(201).json(nuevo);
    } catch (error) {
        next(error);
    }
};

export const actualizarTipo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const actualizado = await catService.actualizarTipo(id, req.body);
        res.status(200).json(actualizado);
    } catch (error) {
        next(error);
    }
};

// 2. ÓRGANOS EMISORES
export const listarOrganos = async (req, res, next) => {
    try {
        const incluirBajas = validarPermisoBajas(req);
        const organos = await catService.listarOrganos(incluirBajas);
        res.status(200).json(organos);
    } catch (error) {
        next(error);
    }
};

export const crearOrgano = async (req, res, next) => {
    try {
        const { nombre } = req.body;
        const nuevo = await catService.crearOrgano(nombre);
        res.status(201).json(nuevo);
    } catch (error) {
        next(error);
    }
};

export const actualizarOrgano = async (req, res, next) => {
    try {
        const { id } = req.params;
        const actualizado = await catService.actualizarOrgano(id, req.body);
        res.status(200).json(actualizado);
    } catch (error) {
        next(error);
    }
};

// 3. PREFIJOS
export const listarPrefijos = async (req, res, next) => {
    try {
        const incluirBajas = validarPermisoBajas(req);
        const prefijos = await catService.listarPrefijos(incluirBajas);
        res.status(200).json(prefijos);
    } catch (error) {
        next(error);
    }
};

export const crearPrefijo = async (req, res, next) => {
    try {
        const nuevo = await catService.crearPrefijo(req.body);
        res.status(201).json(nuevo);
    } catch (error) {
        next(error);
    }
};

export const actualizarPrefijo = async (req, res, next) => {
    try {
        const { prefijo } = req.params;
        const actualizado = await catService.actualizarPrefijo(prefijo, req.body);
        res.status(200).json(actualizado);
    } catch (error) {
        next(error);
    }
};

// 4. DEPENDENCIAS
export const listarDependencias = async (req, res, next) => {
    try {
        const incluirBajas = validarPermisoBajas(req);
        const dependencias = await catService.listarDependencias(incluirBajas);
        res.status(200).json(dependencias);
    } catch (error) {
        next(error);
    }
};

export const crearDependencia = async (req, res, next) => {
    try {
        const nueva = await catService.crearDependencia(req.body);
        res.status(201).json(nueva);
    } catch (error) {
        next(error);
    }
};

export const actualizarDependencia = async (req, res, next) => {
    try {
        const { id } = req.params;
        const actualizada = await catService.actualizarDependencia(id, req.body);
        res.status(200).json(actualizada);
    } catch (error) {
        next(error);
    }
};

// 5. DEPARTAMENTOS
export const listarDepartamentos = async (req, res, next) => {
    try {
        const incluirBajas = validarPermisoBajas(req);
        const departamentos = await catService.listarDepartamentos(req.query.dependencia, incluirBajas);
        res.status(200).json(departamentos);
    } catch (error) {
        next(error);
    }
};

export const crearDepartamento = async (req, res, next) => {
    try {
        const { id_dependencia, nombre } = req.body;
        const nuevo = await catService.crearDepartamento(id_dependencia, nombre);
        res.status(201).json(nuevo);
    } catch (error) {
        next(error);
    }
};

export const actualizarDepartamento = async (req, res, next) => {
    try {
        const { id } = req.params;
        const actualizado = await catService.actualizarDepartamento(id, req.body);
        res.status(200).json(actualizado);
    } catch (error) {
        next(error);
    }
};

// 6. ÁREAS
export const listarAreas = async (req, res, next) => {
    try {
        const incluirBajas = validarPermisoBajas(req);
        const areas = await catService.listarAreas(req.query.departamento, incluirBajas);
        res.status(200).json(areas);
    } catch (error) {
        next(error);
    }
};

export const crearArea = async (req, res, next) => {
    try {
        const { id_departamento, nombre } = req.body;
        const nueva = await catService.crearArea(id_departamento, nombre);
        res.status(201).json(nueva);
    } catch (error) {
        next(error);
    }
};

export const actualizarArea = async (req, res, next) => {
    try {
        const { id } = req.params;
        const actualizada = await catService.actualizarArea(id, req.body);
        res.status(200).json(actualizada);
    } catch (error) {
        next(error);
    }
};
