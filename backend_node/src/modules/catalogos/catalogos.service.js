import * as catRepo from './catalogos.repository.js';
// 1. TIPOS DE DOCUMENTO
export const listarTipos = async (incluirBajas) => {
    return await catRepo.listarTiposDocumentoBD(incluirBajas);
};

export const crearTipo = async (nombre) => {
    if (!nombre || !nombre.trim()) {
        const error = new Error('El nombre del tipo es obligatorio.');
        error.status = 400;
        throw error;
    }
    const existente = await catRepo.buscarTipoPorNombre(nombre.trim());
    if (existente) {
        if (existente.fecha_baja) {
            return await catRepo.reactivarTipoDocumentoBD(existente.id, nombre.trim());
        }
        const error = new Error('Ya existe un tipo de documento con ese nombre.');
        error.status = 409;
        throw error;
    }
    return await catRepo.crearTipoDocumentoBD(nombre.trim());
};

export const actualizarTipo = async (id, datos) => {
    const { nombre, baja } = datos;
    if (nombre !== undefined && !nombre.trim()) {
        const error = new Error('El nombre no puede estar vacío.');
        error.status = 400;
        throw error;
    }
    const actualizado = await catRepo.actualizarTipoDocumentoBD(id, nombre ? nombre.trim() : undefined, baja);
    if (!actualizado) {
        const error = new Error('Tipo de documento no encontrado.');
        error.status = 404;
        throw error;
    }
    return actualizado;
};
// 2. ÓRGANOS EMISORES
export const listarOrganos = async (incluirBajas) => {
    return await catRepo.listarOrganosBD(incluirBajas);
};

export const crearOrgano = async (nombre) => {
    if (!nombre || !nombre.trim()) {
        const error = new Error('El nombre del órgano es obligatorio.');
        error.status = 400;
        throw error;
    }
    const existente = await catRepo.buscarOrganoPorNombre(nombre.trim());
    if (existente) {
        if (existente.fecha_baja) {
            return await catRepo.reactivarOrganoBD(existente.id, nombre.trim());
        }
        const error = new Error('Ya existe un órgano emisor con ese nombre.');
        error.status = 409;
        throw error;
    }
    return await catRepo.crearOrganoBD(nombre.trim());
};

export const actualizarOrgano = async (id, datos) => {
    const { nombre, baja } = datos;
    if (nombre !== undefined && !nombre.trim()) {
        const error = new Error('El nombre no puede estar vacío.');
        error.status = 400;
        throw error;
    }
    const actualizado = await catRepo.actualizarOrganoBD(id, nombre ? nombre.trim() : undefined, baja);
    if (!actualizado) {
        const error = new Error('Órgano emisor no encontrado.');
        error.status = 404;
        throw error;
    }
    return actualizado;
};
// 3. PREFIJOS
export const listarPrefijos = async (incluirBajas) => {
    return await catRepo.listarPrefijosBD(incluirBajas);
};

export const crearPrefijo = async (datos) => {
    const { prefijo, id_tipo, id_organo, ambito } = datos;
    if (!prefijo || !prefijo.trim() || !id_tipo) {
        const error = new Error('prefijo e id_tipo son obligatorios.');
        error.status = 400;
        throw error;
    }
    const cod = prefijo.trim().toUpperCase();
    const existente = await catRepo.buscarPrefijo(cod);
    if (existente) {
        if (existente.fecha_baja) {
            return await catRepo.reactivarPrefijoBD(cod, id_tipo, id_organo, ambito);
        }
        const error = new Error(`El prefijo '${cod}' ya se encuentra registrado.`);
        error.status = 409;
        throw error;
    }
    return await catRepo.crearPrefijoBD(cod, id_tipo, id_organo, ambito);
};

export const actualizarPrefijo = async (prefijo, datos) => {
    const cod = prefijo.trim().toUpperCase();
    const actualizado = await catRepo.actualizarPrefijoBD(cod, datos);
    if (!actualizado) {
        const error = new Error('Prefijo no encontrado.');
        error.status = 404;
        throw error;
    }
    return actualizado;
};
// 4. DEPENDENCIAS
export const listarDependencias = async (incluirBajas) => {
    return await catRepo.listarDependenciasBD(incluirBajas);
};

export const crearDependencia = async (datos) => {
    const { sigla, nombre, numero, codigo } = datos;
    if (!sigla || !nombre) {
        const error = new Error('sigla y nombre son obligatorios.');
        error.status = 400;
        throw error;
    }
    const duplicado = await catRepo.buscarDependenciaDuplicada(numero, codigo, sigla);
    if (duplicado) {
        if (duplicado.fecha_baja) {
            return await catRepo.reactivarDependenciaBD(duplicado.id, datos);
        }
        const error = new Error('Ya existe una dependencia con el mismo número, código o sigla.');
        error.status = 409;
        throw error;
    }
    return await catRepo.crearDependenciaBD(datos);
};

export const actualizarDependencia = async (id, datos) => {
    const actual = await catRepo.buscarDependenciaPorId(id);
    if (!actual) {
        const error = new Error('Dependencia no encontrada.');
        error.status = 404;
        throw error;
    }
    if (datos.numero || datos.codigo || datos.sigla) {
        const dup = await catRepo.buscarDependenciaDuplicada(datos.numero, datos.codigo, datos.sigla, id);
        if (dup) {
            const error = new Error('Conflicto: ya existe otra dependencia con esos datos.');
            error.status = 409;
            throw error;
        }
    }
    return await catRepo.actualizarDependenciaBD(id, datos);
};
// 5. DEPARTAMENTOS
export const listarDepartamentos = async (idDependencia, incluirBajas) => {
    return await catRepo.listarDepartamentosBD(idDependencia, incluirBajas);
};

export const crearDepartamento = async (idDependencia, nombre) => {
    if (!idDependencia || !nombre || !nombre.trim()) {
        const error = new Error('id_dependencia y nombre son obligatorios.');
        error.status = 400;
        throw error;
    }
    const existente = await catRepo.buscarDepartamentoEnDependencia(idDependencia, nombre.trim());
    if (existente) {
        if (existente.fecha_baja) {
            return await catRepo.reactivarDepartamentoBD(existente.id, nombre.trim());
        }
        const error = new Error('Ya existe un departamento con ese nombre en la facultad seleccionada.');
        error.status = 409;
        throw error;
    }
    return await catRepo.crearDepartamentoBD(idDependencia, nombre.trim());
};

export const actualizarDepartamento = async (id, datos) => {
    const { id_dependencia, nombre, baja } = datos;
    const actualizado = await catRepo.actualizarDepartamentoBD(id, id_dependencia, nombre, baja);
    if (!actualizado) {
        const error = new Error('Departamento no encontrado.');
        error.status = 404;
        throw error;
    }
    return actualizado;
};
// 6. ÁREAS
export const listarAreas = async (idDepartamento, incluirBajas) => {
    return await catRepo.listarAreasBD(idDepartamento, incluirBajas);
};

export const crearArea = async (idDepartamento, nombre) => {
    if (!idDepartamento || !nombre || !nombre.trim()) {
        const error = new Error('id_departamento y nombre son obligatorios.');
        error.status = 400;
        throw error;
    }
    const existente = await catRepo.buscarAreaEnDepartamento(idDepartamento, nombre.trim());
    if (existente) {
        if (existente.fecha_baja) {
            return await catRepo.reactivarAreaBD(existente.id, nombre.trim());
        }
        const error = new Error('Ya existe un área con ese nombre en el departamento seleccionado.');
        error.status = 409;
        throw error;
    }
    return await catRepo.crearAreaBD(idDepartamento, nombre.trim());
};

export const actualizarArea = async (id, datos) => {
    const { id_departamento, nombre, baja } = datos;
    const actualizado = await catRepo.actualizarAreaBD(id, id_departamento, nombre, baja);
    if (!actualizado) {
        const error = new Error('Área no encontrada.');
        error.status = 404;
        throw error;
    }
    return actualizado;
};
