import { esRequerido } from '../../shared/utils/validaciones.js'

const ANIO_MINIMO = 1973

function esEnteroPositivo(valor) {
    const numero = Number(valor)
    return Number.isInteger(numero) && numero >= 1
}

export function armarCodigo(valores, catalogos) {
    const { tipo, organo, origen, numero, anio } = valores
    const sinCodigo = { codigo: null, error: null, campo: null }

    if (![tipo, organo, origen, numero, anio].every(esRequerido)) return sinCodigo

    const fila = catalogos.codificacion.find(
        (codificacion) => codificacion.tipo === tipo && codificacion.organo === organo
    )
    if (!fila) {
        return {
            codigo: null,
            error: `No hay un código del Digesto para ${tipo} de ${organo}.`,
            campo: 'organo',
        }
    }

    const numeroDeOrigen = catalogos.origenes.find((o) => o.nombre === origen)?.numero ?? null
    if (numeroDeOrigen === null) {
        return {
            codigo: null,
            error: `El origen ${origen} no tiene número en la codificación del Digesto.`,
            campo: 'origen',
        }
    }

    if (!esEnteroPositivo(numero) || String(anio).trim().length !== 4) return sinCodigo

    return {
        codigo: `${fila.prefijo}-${numeroDeOrigen}-${Number(numero)}/${String(anio).trim().slice(-2)}`,
        error: null,
        campo: null,
    }
}

export function validarConcurso({ valores, llamados, archivo, catalogos, anioActual }) {
    const errores = {}
    const { error: errorDeCodigo, campo: campoDelError } = armarCodigo(valores, catalogos)

    if (!esRequerido(valores.dependencia)) errores.dependencia = 'Elegí la dependencia.'

    if (!esRequerido(valores.tipo)) errores.tipo = 'Elegí el tipo de documento.'

    if (!esRequerido(valores.organo)) errores.organo = 'Elegí el órgano emisor.'
    else if (campoDelError === 'organo') errores.organo = errorDeCodigo

    if (!esRequerido(valores.origen)) errores.origen = 'Elegí el origen del trámite.'
    else if (campoDelError === 'origen') errores.origen = errorDeCodigo

    if (!esRequerido(valores.numero)) errores.numero = 'Ingresá el número de la resolución.'
    else if (!esEnteroPositivo(valores.numero))
        errores.numero = 'El número tiene que ser un entero mayor que 0.'

    const anio = Number(valores.anio)
    if (!esRequerido(valores.anio)) errores.anio = 'Ingresá el año.'
    else if (
        !Number.isInteger(anio) ||
        String(valores.anio).trim().length !== 4 ||
        anio < ANIO_MINIMO ||
        anio > anioActual
    )
        errores.anio = `El año tiene que tener 4 cifras, entre ${ANIO_MINIMO} y ${anioActual}.`

    if (!esRequerido(valores.fechaEmision)) errores.fechaEmision = 'Ingresá la fecha de emisión.'

    if (!esRequerido(valores.descripcion)) errores.descripcion = 'Ingresá la descripción.'

    if (archivo === null) errores.pdf = 'Adjuntá el PDF de la resolución.'

    for (const llamado of llamados) {
        const clave = (campo) => `${campo}-${llamado.id}`

        if (!esRequerido(llamado.departamento)) errores[clave('departamento')] = 'Elegí el departamento.'
        if (!esRequerido(llamado.area)) errores[clave('area')] = 'Elegí el área.'
        if (!esRequerido(llamado.cargo)) errores[clave('cargo')] = 'Elegí el cargo.'
        if (!esRequerido(llamado.dedicacion)) errores[clave('dedicacion')] = 'Elegí la dedicación.'
        if (!esRequerido(llamado.caracter)) errores[clave('caracter')] = 'Elegí el carácter.'
        if (!esRequerido(llamado.inscripcionDesde))
            errores[clave('inscripcionDesde')] = 'Ingresá la fecha de inicio.'

        if (!esRequerido(llamado.inscripcionHasta))
            errores[clave('inscripcionHasta')] = 'Ingresá la fecha de cierre.'
        else if (
            esRequerido(llamado.inscripcionDesde) &&
            llamado.inscripcionHasta < llamado.inscripcionDesde
        )
            errores[clave('inscripcionHasta')] = 'El cierre no puede ser anterior al inicio.'
    }

    return errores
}
