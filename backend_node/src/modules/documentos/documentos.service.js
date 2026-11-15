import * as docRepo from './documentos.repository.js';
import { registrarTerminoBuscado } from '../busqueda/busqueda.repository.js';
import { conTransaccion } from '../../config/transaccion.js';
import { crearError, exigirPermiso } from './errores.js';
import { esPdf, existeArchivo, guardarArchivo, rutaAbsoluta, rutaParaDocumento } from './archivos.js';

const ANIO_MINIMO = 1973;
const TIPO_ORDEN_DEL_DIA = 'Órdenes del día';
const MENSAJE_PERMISO_ALTA = 'No tiene permiso para cargar documentos de esta dependencia.';
const MENSAJE_PERMISO_MODIFICACION = 'No tiene permiso para modificar normativas de esta dependencia.';

const esEnteroPositivo = (valor) => /^\d+$/.test(String(valor).trim()) && Number(valor) >= 1;

const esSesion = (valor) => {
    const partes = /^(\d{1,2})\/(\d{1,2})$/.exec(String(valor).trim());
    return Boolean(partes) && Number(partes[1]) >= 1 && Number(partes[1]) <= 31 && Number(partes[2]) >= 1 && Number(partes[2]) <= 12;
};

const esFechaValida = (valor) => {
    const texto = String(valor).trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
    const fecha = new Date(`${texto}T00:00:00Z`);
    return !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === texto;
};

const vacio = (valor) => valor === undefined || valor === null || String(valor).trim() === '';

export const validarCamposDocumento = (datos, archivo, { esAlta }) => {
    const errores = {};
    const anioActual = new Date().getFullYear();
    const aplica = (campo) => esAlta || datos[campo] !== undefined;

    if (aplica('prefijo') && vacio(datos.prefijo)) errores.prefijo = 'Elegí el prefijo del documento.';

    if (aplica('id_dependencia_origen') && !esEnteroPositivo(datos.id_dependencia_origen ?? ''))
        errores.id_dependencia_origen = 'Elegí la dependencia de origen.';

    if (aplica('numero')) {
        if (vacio(datos.numero)) errores.numero = 'Ingresá el número del documento.';
        else if (!esEnteroPositivo(datos.numero) && !esSesion(datos.numero))
            errores.numero = 'El número tiene que ser un entero mayor que 0 (en Órdenes del día, la fecha de la sesión, por ejemplo 17/03).';
    }

    if (aplica('anio')) {
        const anio = Number(datos.anio);
        if (vacio(datos.anio)) errores.anio = 'Ingresá el año.';
        else if (!/^\d{4}$/.test(String(datos.anio).trim()) || anio < ANIO_MINIMO || anio > anioActual)
            errores.anio = `El año tiene que tener 4 cifras, entre ${ANIO_MINIMO} y ${anioActual}.`;
    }

    if (aplica('fecha_emision')) {
        if (vacio(datos.fecha_emision)) errores.fecha_emision = 'Ingresá la fecha de emisión.';
        else if (!esFechaValida(datos.fecha_emision))
            errores.fecha_emision = 'La fecha tiene que tener el formato AAAA-MM-DD.';
    }

    if (aplica('descripcion') && vacio(datos.descripcion)) errores.descripcion = 'Ingresá la descripción.';

    if (archivo) {
        if (!esPdf(archivo.buffer)) errores.archivo = 'El archivo tiene que ser un PDF.';
    } else if (esAlta) {
        errores.archivo = 'Adjuntá el PDF del documento.';
    }

    if (datos.baja !== undefined && !['true', 'false'].includes(String(datos.baja)))
        errores.baja = 'baja tiene que ser true o false.';

    return errores;
};

export const armarDatosDelCodigo = async (prefijo, idDependenciaOrigen, numero, anio) => {
    const errores = {};
    const codificacion = await docRepo.buscarPrefijoConTipo(String(prefijo).trim());
    if (!codificacion || codificacion.fecha_baja) errores.prefijo = 'El prefijo no existe o está dado de baja.';

    const origen = await docRepo.buscarDependenciaPorId(Number(idDependenciaOrigen));
    if (!origen || origen.fecha_baja || origen.numero === null || origen.numero === undefined)
        errores.id_dependencia_origen = 'La dependencia no existe, está dada de baja o no tiene número.';

    const numeroTexto = String(numero).trim();
    if (codificacion && !codificacion.fecha_baja) {
        const esOrden = codificacion.tipo_nombre === TIPO_ORDEN_DEL_DIA;
        if (esOrden && !esSesion(numeroTexto)) errores.numero = 'En Órdenes del día el número es la fecha de la sesión, por ejemplo 17/03.';
        if (!esOrden && !esEnteroPositivo(numeroTexto)) errores.numero = 'El número tiene que ser un entero mayor que 0.';
    }

    if (Object.keys(errores).length > 0) throw crearError('Hay datos inválidos.', 400, errores);

    let emisora = origen;
    if (codificacion.ambito === 'universidad' || codificacion.ambito === 'escuela') {
        const sigla = codificacion.ambito === 'universidad' ? 'Rectorado' : 'ENJPP';
        emisora = await docRepo.buscarDependenciaPorSigla(sigla);
        if (!emisora) throw crearError(`No se encontró la dependencia emisora ${sigla}.`, 400);
    }

    const numeroNormalizado = esEnteroPositivo(numeroTexto) ? String(Number(numeroTexto)) : numeroTexto;
    const anioNumero = Number(anio);

    return {
        codigo: `${codificacion.prefijo}-${origen.numero}-${numeroNormalizado}/${String(anioNumero).slice(-2)}`,
        prefijo: codificacion.prefijo,
        id_dependencia_origen: origen.id,
        numero: numeroNormalizado,
        anio: anioNumero,
        id_dependencia_emisora: emisora.id,
    };
};

export const listarDocumentos = async (filtros) => {
    const primeraPagina = (parseInt(filtros.pagina, 10) || 1) === 1;
    if (filtros.q && filtros.q.trim() && primeraPagina) {
        await registrarTerminoBuscado(filtros.q.trim());
    }
    const pagina = await docRepo.buscarConFiltros(filtros);
    const resultados = await Promise.all(
        pagina.resultados.map(async (fila) => ({
            ...fila,
            tiene_archivo: Boolean(fila.archivo_ruta) && (await existeArchivo(fila.archivo_ruta)),
        }))
    );
    return { ...pagina, resultados };
};

export const obtenerDocumentoPorId = async (id) => {
    const documento = await docRepo.obtenerPorId(id);
    if (!documento || documento.fecha_baja) {
        throw crearError('Documento no encontrado o dado de baja', 404);
    }
    documento.tiene_archivo = Boolean(documento.archivo_ruta) && await existeArchivo(documento.archivo_ruta);
    return documento;
};

export const crearDocumento = async (datos, archivo, usuario) => {
    const errores = validarCamposDocumento(datos, archivo, { esAlta: true });
    if (Object.keys(errores).length > 0) throw crearError('Hay datos inválidos.', 400, errores);

    const calculo = await armarDatosDelCodigo(datos.prefijo, datos.id_dependencia_origen, datos.numero, datos.anio);
    exigirPermiso(usuario, 'documentos', calculo.id_dependencia_emisora, MENSAJE_PERMISO_ALTA);

    const campos = {
        ...calculo,
        fecha_emision: String(datos.fecha_emision).trim(),
        descripcion: String(datos.descripcion).trim(),
    };

    const id = await conTransaccion(async (client) => {
        const existente = await docRepo.buscarPorCodigo(client, calculo.codigo);
        let idDocumento;

        if (existente && !existente.fecha_baja) {
            throw crearError('Ya existe un documento con ese código.', 409);
        } else if (existente) {
            idDocumento = existente.id;
            await docRepo.reactivarDocumento(client, idDocumento, campos, usuario.id);
        } else {
            idDocumento = await docRepo.insertarDocumento(client, campos, usuario.id);
        }

        const ruta = rutaParaDocumento(idDocumento);
        await guardarArchivo(ruta, archivo.buffer);
        await docRepo.guardarRutaArchivo(client, idDocumento, ruta);
        return idDocumento;
    });

    return await docRepo.obtenerPorId(id);
};

export const prepararModificacion = async (docActual, data, archivo, usuario, { modulo, mensajePermiso }) => {
    const errores = validarCamposDocumento(data, archivo, { esAlta: false });
    if (Object.keys(errores).length > 0) throw crearError('Hay datos inválidos.', 400, errores);

    let nuevo = null;
    if (['prefijo', 'id_dependencia_origen', 'numero', 'anio'].some((c) => data[c] !== undefined)) {
        nuevo = await armarDatosDelCodigo(
            data.prefijo ?? docActual.prefijo,
            data.id_dependencia_origen ?? docActual.id_dependencia_origen,
            data.numero ?? docActual.numero,
            data.anio ?? docActual.anio
        );
        exigirPermiso(usuario, modulo, nuevo.id_dependencia_emisora, mensajePermiso);
    }

    return async (client) => {
        const sets = [];
        const valores = [];
        const poner = (columna, valor) => {
            valores.push(valor);
            sets.push(`${columna} = $${valores.length}`);
        };

        if (nuevo) {
            const otro = await docRepo.buscarPorCodigo(client, nuevo.codigo);
            if (otro && Number(otro.id) !== Number(docActual.id)) throw crearError('Ya existe un documento con ese código.', 409);
            poner('codigo', nuevo.codigo);
            poner('prefijo', nuevo.prefijo);
            poner('id_dependencia_origen', nuevo.id_dependencia_origen);
            poner('numero', nuevo.numero);
            poner('anio', nuevo.anio);
            poner('id_dependencia_emisora', nuevo.id_dependencia_emisora);
        }
        if (data.fecha_emision !== undefined) poner('fecha_emision', String(data.fecha_emision).trim());
        if (data.descripcion !== undefined) poner('descripcion', String(data.descripcion).trim());

        if (data.baja !== undefined) {
            if (String(data.baja) === 'true') {
                sets.push('fecha_baja = NOW()');
                poner('id_usuario_baja', usuario.id);
            } else {
                sets.push('fecha_baja = NULL');
                sets.push('id_usuario_baja = NULL');
            }
        }

        if (archivo) {
            const ruta = rutaParaDocumento(docActual.id);
            await guardarArchivo(ruta, archivo.buffer);
            poner('archivo_ruta', ruta);
        }

        sets.push('fecha_modificacion = NOW()');
        poner('id_usuario_modificacion', usuario.id);

        await docRepo.actualizarDocumentoTx(client, docActual.id, sets, valores);
    };
};

export const actualizarDocumento = async (id, data, archivo, usuario) => {
    const docActual = await docRepo.obtenerPorId(id);
    if (!docActual) throw crearError('Documento no encontrado', 404);

    if ((await docRepo.contarLlamados(id)) > 0) {
        throw crearError('El documento corresponde a un concurso y debe modificarse desde /api/v1/concursos', 409);
    }

    exigirPermiso(usuario, 'documentos', docActual.id_dependencia_emisora, MENSAJE_PERMISO_MODIFICACION);

    const aplicar = await prepararModificacion(docActual, data, archivo, usuario, {
        modulo: 'documentos',
        mensajePermiso: MENSAJE_PERMISO_MODIFICACION,
    });
    await conTransaccion(aplicar);

    return await docRepo.obtenerPorId(id);
};

export const obtenerArchivo = async (id) => {
    const fila = await docRepo.obtenerRutaArchivo(id);
    if (!fila || fila.fecha_baja || !fila.archivo_ruta) throw crearError('El documento no tiene archivo.', 404);
    if (!(await existeArchivo(fila.archivo_ruta))) throw crearError('El documento no tiene archivo.', 404);
    return rutaAbsoluta(fila.archivo_ruta);
};
