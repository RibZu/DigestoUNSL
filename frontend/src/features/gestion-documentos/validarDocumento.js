import { esRequerido } from '../../shared/utils/validaciones.js'

const ANIO_MINIMO = 1973
const FECHA = /^\d{4}-\d{2}-\d{2}$/
const SESION = /^\d{1,2}\/\d{1,2}$/

function esEnteroPositivo(valor) {
  const numero = Number(valor)
  return Number.isInteger(numero) && numero >= 1
}

function esOrdenDelDia(valores, catalogos) {
  const tipo = catalogos.tiposDocumento.find((candidato) => String(candidato.id) === valores.tipo)
  if (!tipo) return false
  return tipo.nombre
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .startsWith('ordenes del')
}

export function esArchivoPdf(archivo) {
  return archivo.type === 'application/pdf' || archivo.name.toLowerCase().endsWith('.pdf')
}

export function prefijosDelTipo(valores, catalogos) {
  return catalogos.prefijos.filter((prefijo) => String(prefijo.id_tipo) === valores.tipo)
}

export function usaOrgano(valores, catalogos) {
  return prefijosDelTipo(valores, catalogos).some((prefijo) => prefijo.id_organo !== null)
}

export function organosDelTipo(valores, catalogos) {
  const vistos = new Map()
  for (const prefijo of prefijosDelTipo(valores, catalogos)) {
    if (prefijo.id_organo !== null) vistos.set(prefijo.id_organo, prefijo.organo_nombre)
  }
  return [...vistos.entries()].map(([id, nombre]) => ({ valor: String(id), texto: nombre }))
}

export function prefijoDe(valores, catalogos) {
  const prefijos = prefijosDelTipo(valores, catalogos)
  const elegido = usaOrgano(valores, catalogos)
    ? prefijos.find((prefijo) => String(prefijo.id_organo) === valores.organo)
    : prefijos.find((prefijo) => prefijo.prefijo === valores.prefijo)
  return elegido?.prefijo ?? null
}

export function cambiarCampoDocumento(valores, nombre, valor) {
  const siguiente = { ...valores, [nombre]: valor }
  if (nombre === 'tipo') {
    siguiente.organo = ''
    siguiente.prefijo = ''
  }
  return siguiente
}

export function valoresDesdeRegistro(registro, catalogos) {
  const prefijo = catalogos.prefijos.find((candidato) => candidato.prefijo === registro.prefijo)

  return {
    tipo: String(prefijo?.id_tipo ?? ''),
    organo: String(prefijo?.id_organo ?? ''),
    prefijo: registro.prefijo ?? '',
    id_dependencia_origen: String(registro.id_dependencia_origen ?? registro.id_dependencia_emisora),
    numero: String(registro.numero ?? ''),
    anio: String(registro.anio ?? ''),
    fecha_emision: registro.fecha_emision ? registro.fecha_emision.slice(0, 10) : '',
    descripcion: registro.descripcion ?? '',
  }
}

export function armarCodigo(valores, catalogos) {
  const sinCodigo = { codigo: null, error: null }
  const prefijo = prefijoDe(valores, catalogos)
  const origen = catalogos.dependencias.find(
    (dependencia) => String(dependencia.id) === valores.id_dependencia_origen,
  )

  if (!prefijo || !origen || !esRequerido(valores.numero) || String(valores.anio).trim().length !== 4)
    return sinCodigo

  if (origen.numero === null)
    return { codigo: null, error: `${origen.sigla} no tiene número para armar códigos.` }

  const esSesion = esOrdenDelDia(valores, catalogos)
  if (esSesion ? !SESION.test(valores.numero.trim()) : !esEnteroPositivo(valores.numero))
    return sinCodigo

  const numero = esSesion ? valores.numero.trim() : Number(valores.numero)
  return {
    codigo: `${prefijo}-${origen.numero}-${numero}/${String(valores.anio).trim().slice(-2)}`,
    error: null,
  }
}

export function validarDocumento({ valores, archivo, catalogos, anioActual, esAlta }) {
  const errores = {}
  const esSesion = esOrdenDelDia(valores, catalogos)
  const origen = catalogos.dependencias.find(
    (dependencia) => String(dependencia.id) === valores.id_dependencia_origen,
  )

  if (!esRequerido(valores.tipo)) errores.tipo = 'Elegí el tipo de documento.'
  else if (usaOrgano(valores, catalogos)) {
    if (!esRequerido(valores.organo)) errores.organo = 'Elegí el órgano emisor.'
  } else if (!esRequerido(valores.prefijo)) errores.prefijo = 'Elegí el prefijo.'

  if (!esRequerido(valores.id_dependencia_origen))
    errores.id_dependencia_origen = 'Elegí la dependencia de origen.'
  else if (origen && origen.numero === null)
    errores.id_dependencia_origen = `${origen.sigla} no tiene número para armar códigos.`

  if (!esRequerido(valores.numero)) errores.numero = 'Ingresá el número de la resolución.'
  else if (esSesion && !SESION.test(valores.numero.trim()))
    errores.numero = 'En las órdenes del día, el número es la fecha de la sesión (por ejemplo 17/03).'
  else if (!esSesion && !esEnteroPositivo(valores.numero))
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

  if (!esRequerido(valores.fecha_emision) || !FECHA.test(valores.fecha_emision))
    errores.fecha_emision = 'Ingresá la fecha de emisión.'

  if (!esRequerido(valores.descripcion)) errores.descripcion = 'Ingresá la descripción.'

  if (esAlta && archivo === null) errores.archivo = 'Adjuntá el PDF de la resolución.'

  return errores
}

export function datosDeDocumento(valores, catalogos, archivo) {
  const datos = new FormData()
  datos.append('prefijo', prefijoDe(valores, catalogos))
  datos.append('id_dependencia_origen', valores.id_dependencia_origen)
  datos.append('numero', valores.numero.trim())
  datos.append('anio', valores.anio)
  datos.append('fecha_emision', valores.fecha_emision)
  datos.append('descripcion', valores.descripcion.trim())
  if (archivo) datos.append('archivo', archivo)
  return datos
}
