import { pedirApi } from '../../auth'

export async function obtenerDocumentosCargados(consulta) {
  return pedirApi(`/documentos?${consulta}`)
}

export async function guardarDocumento(id, datos) {
  return pedirApi(id ? `/documentos/${id}` : '/documentos', {
    metodo: id ? 'PATCH' : 'POST',
    cuerpo: datos,
  })
}

export async function cambiarBajaDocumento(id, baja) {
  return pedirApi(`/documentos/${id}`, { metodo: 'PATCH', cuerpo: { baja } })
}
