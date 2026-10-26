import * as documentoRepository from './documentos.repository.js';

export const listarDocumentos = async () => {
    return await documentoRepository.obtenerTodos();
};

export const obtenerDocumentoPorId = async (id) => {
    const documento = await documentoRepository.obtenerPorId(id);
    if (!documento) {
        throw { status: 404, message: 'Documento no encontrado' };
    }
    return documento;
};

export const crearDocumento = async (data, userId) => {
    return await documentoRepository.crearDocumento(data, userId);
};

export const actualizarDocumento = async (id, data, userId) => {
    await obtenerDocumentoPorId(id); // Lanza 404 si no existe

    const campos = [];
    const valores = [];
    let contador = 1;

    for (const [key, value] of Object.entries(data)) {
        if (value !== undefined) {
            campos.push(`${key} = $${contador}`);
            valores.push(value);
            contador++;
        }
    }

    // Agregar trazabilidad de modificación
    campos.push(`fecha_modificacion = CURRENT_TIMESTAMP`);
    campos.push(`id_usuario_modificacion = $${contador}`);
    valores.push(userId);
    contador++;

    if (campos.length === 2) {
        throw { status: 400, message: 'No hay campos para actualizar' };
    }

    valores.push(id); // Último parámetro para el WHERE id = $X
    const camposDinamicos = campos.join(', ');

    return await documentoRepository.actualizarDocumento(id, camposDinamicos, valores);
};

export const eliminarDocumento = async (id, userId) => {
    await obtenerDocumentoPorId(id);
    return await documentoRepository.darDeBajaDocumento(id, userId);
};