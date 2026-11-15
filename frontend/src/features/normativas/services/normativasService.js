import { pedirApi } from '../../auth'
import { API_URL } from '../../../shared/utils/api'

export async function obtenerDocumento(id) {
  return pedirApi(`/documentos/${id}`)
}

export function urlDelArchivo(id) {
  return `${API_URL}/documentos/${id}/archivo`
}

export function enlaceDelArchivo(documento) {
  if (documento.tiene_archivo) return urlDelArchivo(documento.id)
  return documento.url_externa || null
}
