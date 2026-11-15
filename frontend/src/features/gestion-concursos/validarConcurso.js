import { esRequerido } from '../../shared/utils/validaciones.js'
import { validarDocumento } from '../gestion-documentos'

export function validarConcurso({ valores, llamados, archivo, catalogos, anioActual, esAlta }) {
  const errores = validarDocumento({ valores, archivo, catalogos, anioActual, esAlta })

  for (const llamado of llamados) {
    const clave = (campo) => `${campo}-${llamado.id}`

    if (!esRequerido(llamado.departamento)) errores[clave('departamento')] = 'Elegí el departamento.'
    if (!esRequerido(llamado.id_area)) errores[clave('id_area')] = 'Elegí el área.'
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

export function llamadosParaEnviar(llamados) {
  return llamados.map((llamado) => ({
    ...(llamado.idServidor ? { id: llamado.idServidor } : {}),
    id_area: Number(llamado.id_area),
    cargo: llamado.cargo,
    dedicacion: llamado.dedicacion,
    caracter: llamado.caracter,
    inscripcion_desde: llamado.inscripcionDesde,
    inscripcion_hasta: llamado.inscripcionHasta,
  }))
}
