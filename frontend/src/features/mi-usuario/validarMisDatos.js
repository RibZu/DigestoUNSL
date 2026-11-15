import {
  esDniValido,
  esEmailValido,
  esRequerido,
  esTelefonoValido,
} from '../../shared/utils/validaciones.js'

export function validarMisDatos(valores) {
  const errores = {}

  if (!esRequerido(valores.nombre)) errores.nombre = 'Ingresá tu nombre.'
  else if (valores.nombre.trim().length > 100)
    errores.nombre = 'El nombre puede tener hasta 100 caracteres.'

  if (!esRequerido(valores.email)) errores.email = 'Ingresá tu correo.'
  else if (!esEmailValido(valores.email))
    errores.email = 'El correo no tiene un formato válido, por ejemplo nombre@unsl.edu.ar.'
  else if (valores.email.trim().length > 150)
    errores.email = 'El correo puede tener hasta 150 caracteres.'

  if (esRequerido(valores.telefono) && !esTelefonoValido(valores.telefono))
    errores.telefono =
      'El teléfono puede tener dígitos, espacios, +, - y paréntesis, con al menos 6 dígitos.'

  if (esRequerido(valores.dni) && !esDniValido(valores.dni))
    errores.dni = 'El DNI tiene 7 u 8 dígitos, sin puntos.'

  return errores
}

export function validarCambioClave(valores) {
  const errores = {}

  if (valores.actual.length === 0) errores.actual = 'Ingresá tu contraseña actual.'

  if (valores.nueva.length < 8)
    errores.nueva = 'La contraseña nueva tiene que tener al menos 8 caracteres.'

  if (valores.confirmacion !== valores.nueva)
    errores.confirmacion = 'Las contraseñas no coinciden.'

  return errores
}
