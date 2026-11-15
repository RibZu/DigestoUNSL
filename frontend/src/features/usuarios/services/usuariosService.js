import { pedirApi } from '../../auth'

export async function obtenerUsuarios() {
  return pedirApi('/usuarios')
}

export async function guardarUsuario(id, datos, permisos) {
  const cuerpo = {
    nombre: datos.nombre.trim(),
    email: datos.email.trim(),
    telefono: datos.telefono.trim(),
    dni: datos.dni.trim(),
    es_admin: datos.es_admin,
  }
  if (datos.password) cuerpo.password = datos.password

  const usuario = await pedirApi(id ? `/usuarios/${id}` : '/usuarios', {
    metodo: id ? 'PATCH' : 'POST',
    cuerpo,
  })

  if (!datos.es_admin || id) {
    await pedirApi(`/usuarios/${id ?? usuario.id}/permisos`, {
      metodo: 'PUT',
      cuerpo: datos.es_admin ? [] : permisos,
    })
  }

  return usuario
}

export async function cambiarBajaUsuario(id, baja) {
  return pedirApi(`/usuarios/${id}`, { metodo: 'PATCH', cuerpo: { baja } })
}
