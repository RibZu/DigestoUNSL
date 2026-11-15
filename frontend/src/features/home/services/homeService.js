import { pedirApi } from '../../auth'

export async function obtenerUltimosDocumentos() {
  const datos = await pedirApi('/documentos?orden=registro&limite=6')
  return datos.resultados
}
