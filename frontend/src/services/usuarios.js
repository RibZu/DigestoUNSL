import mockData from '../features/usuarios/usuarios.mock.json';

const STORAGE_KEY = 'digesto_usuarios_data';

function obtenerDatosPersistidos() {
  const guardado = localStorage.getItem(STORAGE_KEY);
  if (!guardado) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
    return structuredClone(mockData);
  }
  try {
    return JSON.parse(guardado);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
    return structuredClone(mockData);
  }
}

function guardarDatos(datos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
}

// Simula la latencia de red para dar retroalimentación realista
function esperar(ms = 150) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Obtiene la lista completa de dependencias de la UNSL.
 */
export async function obtenerDependencias() {
  await esperar(50);
  const datos = obtenerDatosPersistidos();
  return datos.dependencias || [];
}

/**
 * Lista todos los usuarios con sus roles y permisos (Equivalente a GET /api/v1/usuarios).
 */
export async function listarUsuarios() {
  await esperar();
  const datos = obtenerDatosPersistidos();
  return datos.usuarios;
}

/**
 * Crea un nuevo usuario o reactiva uno dado de baja si el email coincide (POST /api/v1/usuarios).
 */
export async function crearUsuario(datosUsuario) {
  const { nombre, email, es_admin = false, permisos = [] } = datosUsuario;
  await esperar();
  const datos = obtenerDatosPersistidos();
  const emailNormalizado = email.trim().toLowerCase();

  const dependenciasMap = new Map((datos.dependencias || []).map((d) => [d.id, d.sigla]));
  const permisosNormalizados = (permisos || []).map((p) => ({
    id_dependencia: Number(p.id_dependencia),
    sigla: dependenciasMap.get(Number(p.id_dependencia)) || `Dep. #${p.id_dependencia}`,
    modulo: p.modulo,
  }));

  const usuarioExistente = datos.usuarios.find(
    (u) => u.email.trim().toLowerCase() === emailNormalizado
  );

  if (usuarioExistente) {
    if (usuarioExistente.fecha_baja) {
      // Regla de negocio UNSL: si ya existía pero estaba dado de baja, se reactiva
      usuarioExistente.nombre = nombre.trim();
      usuarioExistente.es_admin = Boolean(es_admin);
      usuarioExistente.fecha_baja = null;
      usuarioExistente.permisos = permisosNormalizados;
      guardarDatos(datos);
      return { ...usuarioExistente, reactivado: true };
    }
    const err = new Error('Ya existe un usuario activo con ese correo electrónico.');
    err.status = 409;
    throw err;
  }

  const nuevoId = datos.usuarios.length > 0 ? Math.max(...datos.usuarios.map((u) => u.id)) + 1 : 1;

  const nuevoUsuario = {
    id: nuevoId,
    nombre: nombre.trim(),
    email: emailNormalizado,
    es_admin: Boolean(es_admin),
    fecha_alta: new Date().toISOString(),
    fecha_baja: null,
    permisos: permisosNormalizados,
  };

  datos.usuarios.push(nuevoUsuario);
  guardarDatos(datos);
  return nuevoUsuario;
}

/**
 * Modifica datos generales, clave o estado de baja/reactivación (PATCH /api/v1/usuarios/:id).
 */
export async function actualizarUsuario(id, cambios) {
  await esperar();
  const datos = obtenerDatosPersistidos();
  const idx = datos.usuarios.findIndex((u) => Number(u.id) === Number(id));

  if (idx === -1) {
    const err = new Error('Usuario no encontrado.');
    err.status = 404;
    throw err;
  }

  const usuario = datos.usuarios[idx];

  // Si se cambia el email, verificar colisiones
  if (cambios.email) {
    const emailNorm = cambios.email.trim().toLowerCase();
    const colision = datos.usuarios.find(
      (u) => u.id !== usuario.id && u.email.trim().toLowerCase() === emailNorm
    );
    if (colision) {
      const err = new Error('Ya existe otro usuario con ese correo electrónico.');
      err.status = 409;
      throw err;
    }
    usuario.email = emailNorm;
  }

  if (cambios.nombre !== undefined) {
    usuario.nombre = cambios.nombre.trim();
  }

  if (cambios.es_admin !== undefined) {
    usuario.es_admin = Boolean(cambios.es_admin);
  }

  if (cambios.baja !== undefined) {
    usuario.fecha_baja = cambios.baja ? new Date().toISOString() : null;
  }

  datos.usuarios[idx] = usuario;
  guardarDatos(datos);
  return usuario;
}

/**
 * Modifica la lista completa de permisos de un usuario (PUT /api/v1/usuarios/:id/permisos).
 * @param {number} id
 * @param {Array<{ id_dependencia: number, modulo: 'documentos'|'concursos' }>} nuevosPermisos
 */
export async function actualizarPermisos(id, nuevosPermisos) {
  await esperar();
  const datos = obtenerDatosPersistidos();
  const usuario = datos.usuarios.find((u) => Number(u.id) === Number(id));

  if (!usuario) {
    const err = new Error('Usuario no encontrado.');
    err.status = 404;
    throw err;
  }

  // Enriquecer los permisos con la sigla de la dependencia
  const dependenciasMap = new Map((datos.dependencias || []).map((d) => [d.id, d.sigla]));

  const permisosNormalizados = nuevosPermisos.map((p) => ({
    id_dependencia: Number(p.id_dependencia),
    sigla: dependenciasMap.get(Number(p.id_dependencia)) || `Dep. #${p.id_dependencia}`,
    modulo: p.modulo,
  }));

  usuario.permisos = permisosNormalizados;
  guardarDatos(datos);
  return usuario.permisos;
}
