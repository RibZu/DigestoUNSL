import { pedirApi } from '../../auth'

export async function buscarDocumentos(consulta) {
  if (consulta === null) return null

  const { total, resultados } = await pedirApi(`/documentos?${consulta}`)

  return { total, resultados }
}
