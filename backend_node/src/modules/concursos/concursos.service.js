import * as concursosRepo from './concursos.repository.js';
import * as docRepo from '../documentos/documentos.repository.js';
import {
    armarDatosDelCodigo,
    prepararModificacion,
    validarCamposDocumento,
} from '../documentos/documentos.service.js';
import { crearError, exigirPermiso } from '../documentos/errores.js';
import { esPdf, existeArchivo, guardarArchivo, rutaParaDocumento } from '../documentos/archivos.js';
import { validarFiltros } from '../documentos/filtros.js';
import { conTransaccion } from '../../config/transaccion.js';
import { pool } from '../../config/db.js';
import { env } from '../../config/env.js';
import { pedirConcursosDeGo, descargarPdf } from './concursos.client.js';

const CARGOS = [
    'Profesores Titulares',
    'Profesores Asociados',
    'Profesores Adjuntos',
    'Jefes de Trabajos Practicos',
    'Auxiliares de Primera',
    'Auxiliares de Segunda',
    'Agregados Ad-Honorem Alumnos',
    'Agregados Ad-Honorem Diplomados',
    'Varios',
];
const DEDICACIONES = ['Exclusivos', 'Semiexclusivos', 'Simples', 'Completos', 'Varias'];
const CARACTERES = ['Efectivos', 'Interinos', 'Suplentes', 'Temporarios', 'Reemplazantes', 'Contratados', 'Varios'];

const TIPO_RESOLUCIONES = 'Resoluciones';
const CAMPOS_DEL_CODIGO = ['prefijo', 'id_dependencia_origen', 'numero', 'anio'];

const MENSAJE_PERMISO_ALTA = 'No tiene permiso para cargar concursos de esta dependencia.';
const MENSAJE_PERMISO_MODIFICACION = 'No tiene permiso para modificar concursos de esta dependencia.';

const esFechaValida = (valor) => {
    const texto = String(valor ?? '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
    const fecha = new Date(`${texto}T00:00:00Z`);
    return !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === texto;
};

const leerLlamados = (datos) => {
    if (datos.llamados === undefined) return undefined;
    let llamados = datos.llamados;
    if (typeof llamados === 'string') {
        try {
            llamados = JSON.parse(llamados);
        } catch {
            throw crearError('Hay datos inválidos.', 400, { llamados: 'llamados tiene que ser un arreglo en formato JSON.' });
        }
    }
    if (!Array.isArray(llamados) || llamados.length === 0) {
        throw crearError('Hay datos inválidos.', 400, { llamados: 'Cargá al menos un llamado.' });
    }
    return llamados;
};

const validarLlamados = async (llamados, idsExistentes) => {
    const errores = {};

    for (const [i, l] of llamados.entries()) {
        const clave = (campo) => `llamados[${i}].${campo}`;

        if (l.id !== undefined && l.id !== null && !idsExistentes.includes(Number(l.id)))
            errores[clave('id')] = 'El llamado no pertenece a este concurso.';

        if (!/^\d+$/.test(String(l.id_area ?? '')) || !(await concursosRepo.areaActiva(Number(l.id_area))))
            errores[clave('id_area')] = 'Elegí un área activa.';
        if (!CARGOS.includes(l.cargo)) errores[clave('cargo')] = 'Elegí el cargo.';
        if (!DEDICACIONES.includes(l.dedicacion)) errores[clave('dedicacion')] = 'Elegí la dedicación.';
        if (!CARACTERES.includes(l.caracter)) errores[clave('caracter')] = 'Elegí el carácter.';

        const desdeValida = esFechaValida(l.inscripcion_desde);
        if (!desdeValida) errores[clave('inscripcion_desde')] = 'La fecha de inicio tiene que tener el formato AAAA-MM-DD.';
        if (!esFechaValida(l.inscripcion_hasta))
            errores[clave('inscripcion_hasta')] = 'La fecha de cierre tiene que tener el formato AAAA-MM-DD.';
        else if (desdeValida && l.inscripcion_hasta < l.inscripcion_desde)
            errores[clave('inscripcion_hasta')] = 'El cierre no puede ser anterior al inicio.';
    }

    if (Object.keys(errores).length > 0) throw crearError('Hay datos inválidos.', 400, errores);
};

const aplicarLlamados = async (client, idDocumento, llamados, idUsuario, darDeBaja) => {
    const vigentes = [];
    for (const l of llamados) {
        const datos = {
            ...l,
            id_area: Number(l.id_area),
            inscripcion_desde: String(l.inscripcion_desde).trim(),
            inscripcion_hasta: String(l.inscripcion_hasta).trim(),
        };
        if (l.id !== undefined && l.id !== null) {
            await concursosRepo.actualizarLlamado(client, idDocumento, { ...datos, id: Number(l.id) });
            vigentes.push(Number(l.id));
        } else {
            vigentes.push(await concursosRepo.insertarOReactivarLlamado(client, idDocumento, datos));
        }
    }
    if (darDeBaja) await concursosRepo.darDeBajaLlamadosExcepto(client, idDocumento, vigentes, idUsuario);
};

const traducirDuplicado = (error) => {
    if (error.code === '23505') return crearError('Ya existe un llamado igual en este concurso.', 409);
    return error;
};

const exigirResolucionDeFacultad = async (prefijo) => {
    const codificacion = await docRepo.buscarPrefijoConTipo(String(prefijo ?? '').trim());
    if (!codificacion) return;
    if (codificacion.tipo_nombre !== TIPO_RESOLUCIONES || codificacion.ambito !== 'facultad') {
        throw crearError('Hay datos inválidos.', 400, {
            prefijo: 'Un concurso se carga como resolución de una facultad.',
        });
    }
};

export const listarConcursos = async (filtros) => {
    validarFiltros(filtros);
    const pagina = await concursosRepo.buscarConcursosBD(filtros);
    const resultados = await Promise.all(
        pagina.resultados.map(async (fila) => ({
            ...fila,
            tiene_archivo: Boolean(fila.archivo_ruta) && (await existeArchivo(fila.archivo_ruta)),
        }))
    );
    return { ...pagina, resultados };
};

export const obtenerConcursoPorId = async (id) => {
    const concurso = await concursosRepo.obtenerConcursoPorIdBD(id);
    if (!concurso) {
        throw crearError('Concurso no encontrado o dado de baja', 404);
    }
    return concurso;
};

export const crearConcurso = async (datos, archivo, usuario) => {
    const errores = validarCamposDocumento(datos, archivo, { esAlta: true });
    if (Object.keys(errores).length > 0) {
        const llamadosFaltan = datos.llamados === undefined ? { llamados: 'Cargá al menos un llamado.' } : {};
        throw crearError('Hay datos inválidos.', 400, { ...errores, ...llamadosFaltan });
    }
    if (datos.llamados === undefined) throw crearError('Hay datos inválidos.', 400, { llamados: 'Cargá al menos un llamado.' });

    const llamados = leerLlamados(datos);
    await validarLlamados(llamados, []);

    await exigirResolucionDeFacultad(datos.prefijo);
    const calculo = await armarDatosDelCodigo(datos.prefijo, datos.id_dependencia_origen, datos.numero, datos.anio);
    exigirPermiso(usuario, 'concursos', calculo.id_dependencia_emisora, MENSAJE_PERMISO_ALTA);

    const campos = {
        ...calculo,
        fecha_emision: String(datos.fecha_emision).trim(),
        descripcion: String(datos.descripcion).trim(),
    };

    let completado = false;

    try {
        const id = await conTransaccion(async (client) => {
            const existente = await docRepo.buscarPorCodigo(client, calculo.codigo);
            let idDocumento;

            if (existente && !existente.fecha_baja) {
                const trajoLaSincronizacion =
                    existente.id_usuario_alta === null && (await docRepo.contarLlamados(existente.id)) > 0;
                if (!trajoLaSincronizacion) throw crearError('Ya existe un concurso con ese código.', 409);
                idDocumento = existente.id;
                completado = true;
                await docRepo.completarDocumento(client, idDocumento, campos, usuario.id);
                await aplicarLlamados(client, idDocumento, llamados, usuario.id, false);
            } else if (existente) {
                idDocumento = existente.id;
                await docRepo.reactivarDocumento(client, idDocumento, campos, usuario.id);
                await aplicarLlamados(client, idDocumento, llamados, usuario.id, true);
            } else {
                idDocumento = await docRepo.insertarDocumento(client, campos, usuario.id);
                await aplicarLlamados(client, idDocumento, llamados, usuario.id, false);
            }

            const ruta = rutaParaDocumento(idDocumento);
            await guardarArchivo(ruta, archivo.buffer);
            await docRepo.guardarRutaArchivo(client, idDocumento, ruta);
            return idDocumento;
        });

        return { completado, concurso: await concursosRepo.obtenerConcursoPorIdBD(id, true) };
    } catch (error) {
        throw traducirDuplicado(error);
    }
};

export const actualizarConcurso = async (id, datos, archivo, usuario) => {
    const docActual = await docRepo.obtenerPorId(id);
    if (!docActual || (await docRepo.contarLlamados(id)) === 0) throw crearError('Concurso no encontrado', 404);

    exigirPermiso(usuario, 'concursos', docActual.id_dependencia_emisora, MENSAJE_PERMISO_MODIFICACION);

    const llamados = leerLlamados(datos);
    if (llamados) await validarLlamados(llamados, await concursosRepo.idsDeLlamados(id));
    if (archivo && !esPdf(archivo.buffer)) {
        throw crearError('Hay datos inválidos.', 400, { archivo: 'El archivo tiene que ser un PDF.' });
    }

    if (CAMPOS_DEL_CODIGO.some((campo) => datos[campo] !== undefined)) {
        await exigirResolucionDeFacultad(datos.prefijo ?? docActual.prefijo);
    }

    const aplicar = await prepararModificacion(docActual, datos, archivo, usuario, {
        modulo: 'concursos',
        mensajePermiso: MENSAJE_PERMISO_MODIFICACION,
    });

    try {
        await conTransaccion(async (client) => {
            await aplicar(client);
            if (llamados) await aplicarLlamados(client, Number(id), llamados, usuario.id, true);
        });
    } catch (error) {
        throw traducirDuplicado(error);
    }

    return await concursosRepo.obtenerConcursoPorIdBD(id, true);
};

const PREFIJO_LOG = '[actualización de concursos]';
const ALIAS_NOMBRES = {
    agorpecuarias: 'agropecuarias',
    adminisstracion: 'administracion',
    psicobilogica: 'psicobiologica',
};

let corriendoConcursos = false;
let ultimaDescarga = 0;

const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms));

export const claveDeNombre = (nombre) => {
    let clave = String(nombre ?? '')
        .replace(/(?<=\w)#(?=\w)/g, 'n')
        .replace(/ñ/g, 'n')
        .replace(/Ñ/g, 'N')
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
        .join(' ');
    for (const [mal, bien] of Object.entries(ALIAS_NOMBRES)) clave = clave.replaceAll(mal, bien);
    return clave;
};

const claveDeArea = (claveDepartamento, nombre) => {
    const clave = claveDeNombre(nombre);
    if (claveDepartamento === 'departamento de informatica' && clave === 'area de servicio') {
        return 'area de servicios';
    }
    return clave;
};

const bajarPdf = async (ruta) => {
    const falta = env.PAUSA_DESCARGAS - (Date.now() - ultimaDescarga);
    if (falta > 0) await esperar(falta);
    try {
        return await descargarPdf(ruta);
    } finally {
        ultimaDescarga = Date.now();
    }
};

const asegurarPdf = async (concurso, existente, resumen) => {
    if (existente?.archivo_ruta && (await existeArchivo(existente.archivo_ruta))) return existente.archivo_ruta;
    const ruta = concurso.archivo_ruta;
    if (!ruta) return null;
    if (await existeArchivo(ruta)) return ruta;
    try {
        const contenido = await bajarPdf(ruta);
        if (!esPdf(contenido)) throw new Error('el archivo descargado no es un PDF');
        await guardarArchivo(ruta, contenido);
        resumen.pdfBajados += 1;
        return ruta;
    } catch (error) {
        resumen.pdfFallidos += 1;
        console.error(`${PREFIJO_LOG} ${concurso.codigo}: no se pudo bajar el PDF (${error.message})`);
        return null;
    }
};

const prepararConcursos = async (concursos, resumen) => {
    const preparados = [];
    for (const concurso of concursos) {
        try {
            const origen = await concursosRepo.buscarDependenciaPorNumero(concurso.origen);
            if (!origen) throw new Error(`no hay una dependencia con el número ${concurso.origen}`);
            const datos = await armarDatosDelCodigo(concurso.prefijo, origen.id, concurso.numero, concurso.anio);
            if (datos.codigo !== concurso.codigo) {
                console.log(`${PREFIJO_LOG} ${concurso.codigo}: se usa el código ${datos.codigo}`);
            }
            const existente = await docRepo.buscarPorCodigo(pool, datos.codigo);
            if (existente?.fecha_baja) {
                resumen.salteadas += 1;
                console.log(`${PREFIJO_LOG} ${datos.codigo}: dada de baja por una persona, no se reactiva`);
                continue;
            }
            const archivoRuta = await asegurarPdf(concurso, existente, resumen);
            preparados.push({ concurso, datos, existente, archivoRuta });
        } catch (error) {
            resumen.salteadas += 1;
            const motivo = error.campos ? Object.values(error.campos).join(' ') : error.message;
            console.error(`${PREFIJO_LOG} ${concurso.codigo}: salteada (${motivo})`);
        }
    }
    return preparados;
};

const guardarFacultad = async (facultad, preparados, enums, resumen) => {
    const local = { nuevas: 0, completadas: 0, llamadosNuevos: 0, llamadosSalteados: 0, areasCreadas: 0, departamentosCreados: 0 };

    await conTransaccion(async (client) => {
        const estructura = await concursosRepo.estructuraDeFacultad(client, facultad.id);
        const departamentos = new Map(estructura.departamentos.map((d) => [claveDeNombre(d.nombre), d.id]));
        const areas = new Map(estructura.areas.map((a) => [`${a.id_departamento}|${claveDeNombre(a.nombre)}`, a.id]));
        const claveDepartamentos = new Map(estructura.departamentos.map((d) => [d.id, claveDeNombre(d.nombre)]));

        for (const { concurso, datos, existente, archivoRuta } of preparados) {
            let idDocumento;
            if (!existente) {
                idDocumento = await concursosRepo.insertarDocumentoSincronizado(client, {
                    ...datos,
                    url_externa: concurso.url_externa || null,
                    archivo_ruta: archivoRuta,
                    fecha_registro: concurso.fecha_registro || null,
                });
                local.nuevas += 1;
            } else {
                idDocumento = existente.id;
                const cambios = await concursosRepo.completarDocumentoSincronizado(
                    client,
                    idDocumento,
                    concurso.url_externa || null,
                    archivoRuta
                );
                if (cambios > 0) local.completadas += 1;
            }

            for (const llamado of concurso.llamados) {
                const valido =
                    enums.cargo.has(llamado.cargo) &&
                    (llamado.dedicacion === null || llamado.dedicacion === undefined || enums.dedicacion.has(llamado.dedicacion)) &&
                    enums.caracter.has(llamado.caracter);
                if (!valido) {
                    local.llamadosSalteados += 1;
                    console.error(`${PREFIJO_LOG} ${datos.codigo}: llamado con valores desconocidos (${llamado.cargo}, ${llamado.dedicacion}, ${llamado.caracter})`);
                    continue;
                }

                const claveDepartamento = claveDeNombre(llamado.departamento);
                let idDepartamento = departamentos.get(claveDepartamento);
                if (!idDepartamento) {
                    idDepartamento = await concursosRepo.insertarDepartamento(client, facultad.id, llamado.departamento);
                    departamentos.set(claveDepartamento, idDepartamento);
                    claveDepartamentos.set(idDepartamento, claveDepartamento);
                    local.departamentosCreados += 1;
                }

                const claveArea = claveDeArea(claveDepartamentos.get(idDepartamento), llamado.area);
                const claveCompleta = `${idDepartamento}|${claveArea}`;
                let idArea = areas.get(claveCompleta);
                if (!idArea) {
                    idArea = await concursosRepo.insertarArea(client, idDepartamento, llamado.area);
                    areas.set(claveCompleta, idArea);
                    local.areasCreadas += 1;
                }

                const insertados = await concursosRepo.insertarLlamadoSiFalta(client, idDocumento, {
                    id_area: idArea,
                    cargo: llamado.cargo,
                    dedicacion: llamado.dedicacion,
                    caracter: llamado.caracter,
                    inscripcion_desde: llamado.inscripcion_desde,
                    inscripcion_hasta: llamado.inscripcion_hasta,
                });
                if (insertados > 0) local.llamadosNuevos += 1;
            }
        }
    });

    for (const [clave, valor] of Object.entries(local)) resumen[clave] += valor;
};

export const sincronizarConcursos = async () => {
    if (corriendoConcursos) {
        console.log(`${PREFIJO_LOG} ya hay una corrida en curso, se saltea`);
        return;
    }
    corriendoConcursos = true;
    const inicio = Date.now();
    console.log(`${PREFIJO_LOG} inicio ${new Date().toLocaleString('es-AR')}`);

    const resumen = {
        leidas: 0, conError: 0, sinFeed: 0,
        nuevas: 0, completadas: 0, salteadas: 0,
        pdfBajados: 0, pdfFallidos: 0,
        llamadosNuevos: 0, llamadosSalteados: 0,
        areasCreadas: 0, departamentosCreados: 0,
    };

    try {
        const enums = await concursosRepo.valoresDeEnums();
        const facultades = await concursosRepo.listarFacultadesConFeed();
        for (const facultad of facultades) {
            try {
                const concursos = await pedirConcursosDeGo(facultad.codigo);
                if (concursos === null) {
                    resumen.sinFeed += 1;
                    console.log(`${PREFIJO_LOG} ${facultad.codigo}: sin feed`);
                    continue;
                }
                const preparados = await prepararConcursos(concursos, resumen);
                await guardarFacultad(facultad, preparados, enums, resumen);
                resumen.leidas += 1;
                const llamados = concursos.reduce((suma, c) => suma + c.llamados.length, 0);
                console.log(`${PREFIJO_LOG} ${facultad.codigo}: leída (${concursos.length} resoluciones, ${llamados} llamados)`);
            } catch (error) {
                resumen.conError += 1;
                console.error(`${PREFIJO_LOG} ${facultad.codigo}: error (${error.message})`);
            }
        }
    } catch (error) {
        console.error(`${PREFIJO_LOG} error: ${error.message}`);
    } finally {
        corriendoConcursos = false;
    }

    const segundos = Math.round((Date.now() - inicio) / 1000);
    console.log(
        `${PREFIJO_LOG} fin en ${segundos} s: ${resumen.leidas} facultades leídas, ${resumen.conError} con error, ${resumen.sinFeed} sin feed; ` +
            `resoluciones ${resumen.nuevas} nuevas, ${resumen.completadas} completadas, ${resumen.salteadas} salteadas; ` +
            `PDF ${resumen.pdfBajados} bajados, ${resumen.pdfFallidos} fallidos; ` +
            `llamados ${resumen.llamadosNuevos} nuevos, ${resumen.llamadosSalteados} salteados; ` +
            `áreas ${resumen.areasCreadas} y departamentos ${resumen.departamentosCreados} creados`
    );
};
