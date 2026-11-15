import { pedirApi } from '../../auth'

export async function obtenerMiUsuario() {
  return pedirApi('/usuarios/yo')
}

export async function guardarMisDatos(datos) {
  return pedirApi('/usuarios/yo', {
    metodo: 'PATCH',
    cuerpo: {
      nombre: datos.nombre.trim(),
      email: datos.email.trim(),
      telefono: datos.telefono.trim(),
      dni: datos.dni.trim(),
    },
  })
}

export async function cambiarMiClave(actual, nueva) {
  return pedirApi('/usuarios/yo', {
    metodo: 'PATCH',
    cuerpo: { password_actual: actual, password: nueva },
  })
}
