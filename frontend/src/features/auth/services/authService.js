import { redirect } from 'react-router'
import { MODULOS_PANEL } from '../../../shared/layout/navigation'
import { API_URL } from '../../../shared/utils/api'

const CLAVE_TOKEN = 'token'
const CLAVE_USUARIO = 'usuario'

export async function pedirApi(ruta, { metodo = 'GET', cuerpo } = {}) {
  const sesion = obtenerSesion()
  const cabeceras = {}
  let body

  if (sesion) cabeceras.Authorization = `Bearer ${sesion.token}`

  if (cuerpo instanceof FormData) {
    body = cuerpo
  } else if (cuerpo !== undefined) {
    cabeceras['Content-Type'] = 'application/json'
    body = JSON.stringify(cuerpo)
  }

  const respuesta = await fetch(`${API_URL}${ruta}`, { method: metodo, headers: cabeceras, body })
  const esJson = (respuesta.headers.get('content-type') ?? '').includes('application/json')
  const datos = esJson ? await respuesta.json() : null

  if (!respuesta.ok) {
    if (respuesta.status === 401 && sesion) {
      cerrarSesion()
      const destino = encodeURIComponent(location.pathname + location.search)
      window.location.replace(`/login?destino=${destino}`)
    }
    const error = new Error(datos?.error ?? 'No se pudo completar el pedido.')
    error.estado = respuesta.status
    error.campos = datos?.campos
    throw error
  }

  return datos
}

export async function iniciarSesion(email, password, recordar) {
  const data = await pedirApi('/auth', { metodo: 'POST', cuerpo: { email, password } })

  cerrarSesion()
  const almacen = recordar ? localStorage : sessionStorage
  almacen.setItem(CLAVE_TOKEN, data.token)
  almacen.setItem(CLAVE_USUARIO, JSON.stringify(data.usuario))

  return data
}

function leerAlmacen(almacen) {
  const token = almacen.getItem(CLAVE_TOKEN)
  const guardado = almacen.getItem(CLAVE_USUARIO)
  if (!token || !guardado) return null

  try {
    const usuario = JSON.parse(guardado)
    return usuario && typeof usuario === 'object' ? { token, usuario } : null
  } catch {
    return null
  }
}

function leerVencimiento(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(payload)).exp * 1000
  } catch {
    return 0
  }
}

export function obtenerSesion() {
  const sesion = leerAlmacen(sessionStorage) ?? leerAlmacen(localStorage)

  if (sesion && leerVencimiento(sesion.token) > Date.now()) {
    return sesion
  }

  cerrarSesion()
  return null
}

export function actualizarUsuarioDeSesion(datos) {
  for (const almacen of [sessionStorage, localStorage]) {
    const sesion = leerAlmacen(almacen)
    if (sesion) {
      const usuario = { ...sesion.usuario, nombre: datos.nombre, email: datos.email }
      almacen.setItem(CLAVE_USUARIO, JSON.stringify(usuario))
      return
    }
  }
}

export function cerrarSesion() {
  for (const almacen of [localStorage, sessionStorage]) {
    almacen.removeItem(CLAVE_TOKEN)
    almacen.removeItem(CLAVE_USUARIO)
  }
}

export function puedeUsarModulo(usuario, modulo) {
  if (modulo.permiso === 'todos') return true
  if (usuario.es_admin) return true
  if (modulo.permiso === 'admin') return false

  return (usuario.permisos ?? []).some((permiso) => permiso.modulo === modulo.permiso)
}

export function leerSesion() {
  return obtenerSesion()?.usuario ?? null
}

export function protegerRuta({ request }) {
  const sesion = obtenerSesion()

  if (!sesion) {
    const { pathname, search } = new URL(request.url)
    throw redirect(`/login?destino=${encodeURIComponent(pathname + search)}`)
  }

  return sesion.usuario
}

export function redirigirSiHaySesion() {
  if (obtenerSesion()) {
    throw redirect('/panel/mi-usuario')
  }

  return null
}

export function protegerModulo(clave) {
  const modulo = MODULOS_PANEL.find((candidato) => candidato.clave === clave)

  return (argumentos) => {
    const usuario = protegerRuta(argumentos)

    if (!puedeUsarModulo(usuario, modulo)) {
      throw redirect('/panel/acceso-denegado')
    }

    return usuario
  }
}
