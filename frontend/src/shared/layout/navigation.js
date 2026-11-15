export const layoutNavigationSections = [
  { key: 'home', label: 'Inicio', path: '/' },
  { key: 'busqueda', label: 'Búsqueda', path: '/busqueda' },
  { key: 'concursos', label: 'Concursos', path: '/concursos' },
  {
    key: 'planes-de-estudio',
    label: 'Planes de estudio',
    path: '/planes-de-estudio',
  },
  { key: 'estadisticas', label: 'Estadísticas', path: '/estadisticas' },
]

export const ayudaSection = { key: 'ayuda', label: 'Ayuda', path: '/ayuda' }

export const ingresoSection = { key: 'login', label: 'Ingresar', path: '/login' }

export const MODULOS_PANEL = [
  {
    clave: 'documentos',
    nombre: 'Gestión de documentos',
    descripcion: 'Carga, modificación y baja de los documentos del Digesto.',
    ruta: '/panel/documentos',
    permiso: 'documentos',
  },
  {
    clave: 'concursos',
    nombre: 'Gestión de concursos',
    descripcion: 'Carga y consulta de llamados a concurso y sus resoluciones.',
    ruta: '/panel/concursos',
    permiso: 'concursos',
  },
  {
    clave: 'usuarios',
    nombre: 'Gestión de usuarios',
    descripcion: 'Cuentas institucionales y permisos por dependencia.',
    ruta: '/panel/usuarios',
    permiso: 'admin',
  },
  {
    clave: 'estadisticas',
    nombre: 'Estadísticas',
    descripcion: 'Términos más buscados y llamados a concurso por año y facultad.',
    ruta: '/panel/estadisticas',
    permiso: 'admin',
  },
  {
    clave: 'mi-usuario',
    nombre: 'Mi usuario',
    descripcion: 'Tus datos de contacto y tu contraseña.',
    ruta: '/panel/mi-usuario',
    permiso: 'todos',
  },
]
