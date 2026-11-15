import { pedirApi } from '../../auth'

export async function guardarConcurso(id, datos) {
  return pedirApi(id ? `/concursos/${id}` : '/concursos', {
    metodo: id ? 'PATCH' : 'POST',
    cuerpo: datos,
  })
}

export async function cambiarBajaConcurso(id, baja) {
  return pedirApi(`/concursos/${id}`, { metodo: 'PATCH', cuerpo: { baja } })
}
