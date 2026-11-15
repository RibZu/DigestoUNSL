import { pedirApi } from './authService'

export async function pedirRestablecimiento(datos) {
  return pedirApi('/restablecimientos', {
    metodo: 'POST',
    cuerpo: {
      nombre: datos.nombre.trim(),
      email: datos.email.trim(),
      telefono: datos.telefono.trim(),
      dni: datos.dni.trim(),
    },
  })
}
