import {
  esDniValido,
  esEmailValido,
  esRequerido,
  esTelefonoValido,
} from '../../shared/utils/validaciones.js'

export function validarUsuario(valores, esAlta) {
  const errores = {}

  if (!esRequerido(valores.nombre)) errores.nombre = 'Ingresá el nombre.'
  else if (valores.nombre.trim().length > 100)
    errores.nombre = 'El nombre puede tener hasta 100 caracteres.'

  if (!esRequerido(valores.email)) errores.email = 'Ingresá el correo.'
  else if (!esEmailValido(valores.email))
    errores.email = 'El correo no tiene un formato válido, por ejemplo nombre@unsl.edu.ar.'
  else if (valores.email.trim().length > 150)
    errores.email = 'El correo puede tener hasta 150 caracteres.'

  if (esRequerido(valores.telefono) && !esTelefonoValido(valores.telefono))
    errores.telefono = 'Ingresá un teléfono válido, por ejemplo 2664 123456.'

  if (esRequerido(valores.dni) && !esDniValido(valores.dni))
    errores.dni = 'Ingresá el DNI sin puntos (7 u 8 dígitos).'

  if ((esAlta || valores.password.length > 0) && valores.password.length < 8)
    errores.password = 'La contraseña tiene que tener al menos 8 caracteres.'

  if (valores.confirmacion !== valores.password)
    errores.confirmacion = 'Las contraseñas no coinciden.'

  if (!valores.es_admin && valores.permisos.length === 0)
    errores.permisos = 'Elegí al menos un permiso para la cuenta.'

  return errores
}
