const API_URL = 'http://localhost:3000/api/v1/auth';

// Envia credenciales al backend y guarda el token si es exitoso
export async function loginService(email, password) {
  const respuesta = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(data.error || 'Error al iniciar sesión');
  }

  // Guardar datos en localStorage
  localStorage.setItem('token', data.token);
  localStorage.setItem('usuario', JSON.stringify(data.usuario));

  return data;
}

// Obtener los datos del usuario logueado
export function obtenerUsuarioActual() {
  const guardado = localStorage.getItem('usuario');
  try {
    return guardado ? JSON.parse(guardado) : null;
  } catch {
    return null;
  }
}

// Obtener el token JWT guardado
export function obtenerToken() {
  return localStorage.getItem('token');
}

// Cerrar sesión
export function cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
}

