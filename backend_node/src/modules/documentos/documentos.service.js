import * as docRepo from './documentos.repository.js';
import { registrarTerminoBuscado } from '../busqueda/busqueda.repository.js';

export const listarDocumentos = async (filtros) => {
    // Si viene texto en ?q=, registramos el término para las estadísticas
    if (filtros.q && filtros.q.trim()) {
        await registrarTerminoBuscado(filtros.q.trim());
    }
    return await docRepo.buscarConFiltros(filtros);
};

export const obtenerDocumentoPorId = async (id) => {
    const documento = await docRepo.obtenerPorId(id);
    if (!documento || documento.fecha_baja) {
        const error = new Error('Documento no encontrado o dado de baja');
        error.status = 404;
        throw error;
    }
    return documento;
};

export const actualizarDocumento = async (id, data, userId, usuario) => {
    const docActual = await docRepo.obtenerPorId(id);
    if (!docActual) {
        const error = new Error('Documento no encontrado');
        error.status = 404;
        throw error;
    }

    // los concursos se editan en su propio modulo
    if (docActual.llamados && docActual.llamados.length > 0 && data.baja === undefined) {
        const error = new Error('El documento corresponde a un concurso y debe modificarse desde /api/v1/concursos');
        error.status = 409;
        throw error;
    }

    // Validar permisos si no es admin
    if (!usuario.es_admin) {
        const tienePermiso = usuario.permisos?.some(
            p => p.modulo === 'documentos' && Number(p.id_dependencia) === Number(docActual.id_dependencia_emisora)
        );
        if (!tienePermiso) {
            const error = new Error('No tiene permiso para modificar normativas de esta dependencia.');
            error.status = 403;
            throw error;
        }
    }

    const campos = [];
    const valores = [];
    let contador = 1;

    // Manejo de baja lógica: { "baja": true / false }
    if (data.baja !== undefined) {
        if (data.baja === true || data.baja === 'true') {
            campos.push(`fecha_baja = NOW()`);
            campos.push(`id_usuario_baja = $${contador}`);
            valores.push(userId);
            contador++;
        } else if (data.baja === false || data.baja === 'false') {
            campos.push(`fecha_baja = NULL`);
            campos.push(`id_usuario_baja = NULL`);
        }
    }

    // Campos modificables permitidos
    const camposPermitidos = ['fecha_emision', 'descripcion', 'archivo_ruta'];
    for (const campo of camposPermitidos) {
        if (data[campo] !== undefined) {
            campos.push(`${campo} = $${contador}`);
            valores.push(data[campo]);
            contador++;
        }
    }

    // auditoria
    campos.push(`fecha_modificacion = NOW()`);
    campos.push(`id_usuario_modificacion = $${contador}`);
    valores.push(userId);
    contador++;

    valores.push(id);
    const camposDinamicos = campos.join(', ');

    return await docRepo.actualizarDocumento(id, camposDinamicos, valores);
};