import { pedirApi } from '../../auth'

export async function obtenerSolicitudesPendientes() {
  return pedirApi('/restablecimientos?estado=pendientes')
}

export async function restablecerClave(id, password) {
  return pedirApi(`/restablecimientos/${id}`, {
    metodo: 'PATCH',
    cuerpo: { resultado: 'restablecida', password },
  })
}

export async function rechazarSolicitud(id) {
  return pedirApi(`/restablecimientos/${id}`, {
    metodo: 'PATCH',
    cuerpo: { resultado: 'rechazada' },
  })
}
