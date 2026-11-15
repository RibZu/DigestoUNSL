import { SITIO_PLANES_DE_ESTUDIO } from '../planes-de-estudio'

export const BLOQUES_AYUDA = [
  {
    id: 'dudas-generales',
    titulo: 'Dudas generales',
    preguntas: [
      {
        id: 'generales-que-es',
        pregunta: '¿Qué es el Digesto Administrativo?',
        respuesta:
          'Es el repositorio oficial de las normas y los documentos administrativos de la UNSL. Están ordenados para que cualquier persona pueda consultarlos.',
      },
      {
        id: 'generales-tipos-y-emisores',
        pregunta: '¿Qué tipos de documentos encuentro y quién los emite?',
        respuesta:
          'Hay actas, circulares, convenios, decretos, órdenes del día, ordenanzas, proveídos y resoluciones.',
        puntos: [
          'Los emiten el Rectorado y el Consejo Superior.',
          'También los emiten las facultades, con su decanato y su Consejo Directivo.',
          'Y las secretarías de la universidad.',
        ],
      },
      {
        id: 'generales-codigo',
        pregunta: '¿Cómo leo el código de un documento (por ejemplo, RR-1-145/26)?',
        respuesta:
          'El código tiene la forma sigla-dependencia-número/año. RR-1-145/26 es la Resolución Rectoral 145 de 2026, con trámite originado en Rectorado (dependencia 1).',
        puntos: [
          'RR: Resolución Rectoral.',
          'RCS: Resolución del Consejo Superior.',
          'RCD: Resolución del Consejo Directivo.',
          'RD: Resolución Decanal.',
          'OCS: Ordenanza del Consejo Superior.',
        ],
      },
      {
        id: 'generales-cuenta',
        pregunta: '¿Necesito una cuenta para consultar?',
        respuesta:
          'No, la consulta es pública. "Ingresar", en el pie de página, es solo para el personal que administra el Digesto.',
      },
      {
        id: 'generales-olvide-contrasena',
        pregunta: '¿Qué hago si olvidé mi contraseña?',
        respuesta:
          'En Ingresar, "¿Olvidaste tu contraseña?" abre un formulario con nombre, correo, teléfono y DNI. La administración revisa el pedido, se comunica con vos y te da una contraseña nueva, que después podés cambiar en Mi usuario.',
      },
      {
        id: 'generales-celular',
        pregunta: '¿Puedo usar el sitio desde el celular?',
        respuesta:
          'Sí, el sitio se adapta a pantallas chicas. En el celular, el menú se abre con el botón de la barra superior.',
      },
      {
        id: 'generales-enlaces-externos',
        pregunta: '¿Por qué algunos enlaces abren otra pestaña?',
        respuesta:
          'El sitio oficial de planes de estudio, el Portal y el Correo de la UNSL están en otros sitios, y "Ver PDF" abre el documento aparte. Se abren en otra pestaña para que no pierdas tu lugar en el Digesto.',
      },
    ],
  },
  {
    id: 'inicio',
    titulo: 'Inicio',
    ruta: '/',
    preguntas: [
      {
        id: 'inicio-que-encuentro',
        pregunta: '¿Qué encuentro en la página de inicio?',
        respuesta:
          'Arriba, los seis últimos documentos subidos al Digesto, del más reciente al más antiguo; cada uno se abre tocándolo. Debajo, tres accesos: Búsqueda, Concursos y Planes de estudio. El pie de página tiene Ayuda e Ingresar.',
      },
    ],
  },
  {
    id: 'busqueda',
    titulo: 'Búsqueda',
    ruta: '/busqueda',
    preguntas: [
      {
        id: 'busqueda-palabra-clave',
        pregunta: '¿Cómo busco un documento por palabra clave?',
        respuesta:
          'Escribí la palabra en el campo principal y apretá "Buscar". Se busca en el código y en la descripción del documento.',
      },
      {
        id: 'busqueda-filtros',
        pregunta: '¿Cómo filtro por tipo de documento o por organismo emisor?',
        respuesta:
          'Elegí una opción en "Tipo de Documento" (actas, circulares, convenios, decretos, órdenes del día, ordenanzas, proveídos o resoluciones) o en "Organismo Emisor (Área / Facultad)".',
      },
      {
        id: 'busqueda-avanzada',
        pregunta:
          '¿Cómo encuentro un documento si conozco su número y su año, o un rango de fechas?',
        respuesta:
          'Apretá "Filtros avanzados". Ahí están el "Número de Norma", la lista de "Año" (de 1973 a 2050, se elige de la lista) y las fechas "Fecha Desde" y "Fecha Hasta".',
      },
      {
        id: 'busqueda-paginas',
        pregunta: '¿Cómo veo todos los resultados?',
        respuesta:
          'Los resultados se muestran de a 20 por página, y debajo de la lista están los botones Primera, Anterior, Siguiente y Última. Se mantiene lo que buscaste y los filtros que elegiste.',
      },
      {
        id: 'busqueda-abrir',
        pregunta: '¿Cómo abro un resultado?',
        respuesta:
          'Tocá cualquier parte de su tarjeta: no hace falta apuntar al código. Con el teclado, cada tarjeta es un solo enlace.',
      },
      {
        id: 'busqueda-sin-resultados',
        pregunta: '¿Qué hago si la búsqueda no devuelve resultados?',
        respuesta:
          'Probá con menos palabras o con sinónimos, y quitá los filtros que hayas puesto. Si conocés el código del documento, buscalo por el código.',
      },
    ],
  },
  {
    id: 'documento',
    titulo: 'Detalle de un documento',
    ruta: '/busqueda',
    preguntas: [
      {
        id: 'documento-detalle',
        pregunta: '¿Cómo veo el detalle de un documento?',
        respuesta:
          'Tocá su tarjeta en los resultados de la búsqueda o su recuadro en el inicio. Arriba está la descripción y debajo los datos, ordenados en Identificación (tipo, número y año, fecha de emisión y fecha de registro) y Origen (órgano emisor y dependencias).',
      },
      {
        id: 'documento-ver-pdf',
        pregunta: '¿Qué hace el botón "Ver PDF"?',
        respuesta:
          'Abre el documento en otra pestaña. Si el sistema guarda su archivo, se abre ese archivo; si no, se abre el documento en el sitio actual del Digesto. En los dos casos el botón se llama igual.',
      },
    ],
  },
  {
    id: 'concursos',
    titulo: 'Concursos',
    ruta: '/concursos',
    preguntas: [
      {
        id: 'concursos-que-es',
        pregunta: '¿Qué es un llamado a concurso y cuáles aparecen?',
        respuesta:
          'Es un llamado público para cubrir un cargo docente. Solo aparecen los que tienen la inscripción abierta, agrupados por facultad: cada facultad está plegada, con su ciudad a la derecha, y un clic la despliega.',
      },
      {
        id: 'concursos-buscar',
        pregunta: '¿Cómo busco un concurso?',
        respuesta:
          'Escribí un cargo, área, departamento o número de resolución, o elegí facultad, carácter o dedicación, y apretá "Buscar". Se abren las facultades con resultados; "Limpiar filtros" vuelve a mostrar todo.',
      },
      {
        id: 'concursos-caracter',
        pregunta: '¿Qué significan los carácteres Efectivos, Interinos y Suplentes?',
        respuesta: 'Indican el tipo de designación del cargo que se concursa.',
        puntos: [
          'Efectivos: cargo permanente, cubierto por concurso público.',
          'Interinos: cargo cubierto de forma transitoria hasta que haya un concurso efectivo.',
          'Suplentes: reemplazo de quien ocupa el cargo durante su licencia o ausencia.',
        ],
      },
      {
        id: 'concursos-dedicacion',
        pregunta: '¿Qué significan las dedicaciones Exclusiva, Semiexclusiva y Simple?',
        respuesta: 'Indican la carga horaria semanal del cargo, de mayor a menor.',
        puntos: [
          'Exclusiva: la mayor carga horaria.',
          'Semiexclusiva: una carga intermedia.',
          'Simple: la menor carga horaria.',
        ],
      },
      {
        id: 'concursos-fechas',
        pregunta: '¿Dónde veo las fechas de inscripción?',
        respuesta:
          'Cada tarjeta muestra "Inscripción desde" e "Inscripción hasta", con las fechas de inicio y de cierre.',
      },
      {
        id: 'concursos-inscripcion',
        pregunta: '¿Me puedo inscribir desde este sitio?',
        respuesta:
          'No. Los requisitos y el lugar de inscripción figuran en la resolución del llamado.',
      },
    ],
  },
  {
    id: 'planes-de-estudio',
    titulo: 'Planes de estudio',
    ruta: '/planes-de-estudio',
    preguntas: [
      {
        id: 'planes-encontrar',
        pregunta: '¿Cómo encuentro el plan de mi carrera?',
        respuesta:
          'Escribí la carrera o la ordenanza, o elegí una facultad, y apretá "Buscar": se abren las facultades con resultados. Cada plan abre una página con sus materias por año; el plan oficial y las correlativas están en el sitio oficial de planes de estudio.',
      },
      {
        id: 'planes-no-aparece',
        pregunta: '¿Por qué no aparece mi plan?',
        respuesta:
          'Se muestran solo los planes vigentes posteriores a 2009. Para ver todos, usá el botón "¿No encontrás tu plan? …", que lleva al sitio oficial de planes de estudio.',
      },
      {
        id: 'planes-dos-facultades',
        pregunta: '¿Por qué una misma carrera aparece en dos facultades?',
        respuesta:
          'Algunas carreras se dictan en más de una facultad, como la Licenciatura en Análisis y Gestión de Datos. Aparecen en cada una de ellas.',
      },
    ],
  },
  {
    id: 'estadisticas',
    titulo: 'Estadísticas',
    ruta: '/estadisticas',
    preguntas: [
      {
        id: 'estadisticas-que-muestra',
        pregunta: '¿Qué muestra la página de Estadísticas?',
        respuesta:
          'Indicadores generales del Digesto y dos gráficos: la documentación por órgano emisor y las normativas por año de emisión.',
      },
    ],
  },
  {
    id: 'personal',
    titulo: 'Personal del Digesto',
    ruta: '/login',
    preguntas: [
      {
        id: 'personal-ingreso',
        pregunta: '¿Cómo ingreso y cómo cierro la sesión?',
        respuesta:
          'En "Ingresar", escribí tu correo y tu contraseña; el ojito de la contraseña te deja verla mientras la escribís.',
        puntos: [
          'Con "Recordar mi sesión" marcada, la sesión sigue abierta aunque cierres el navegador; sin marcar, se pierde al cerrar la pestaña.',
          'En los dos casos, la sesión se cierra sola unas horas después de ingresar.',
          '"Cerrar sesión" te lleva al inicio.',
          'Si ya tenés la sesión abierta, "Ingresar" te lleva directo a Mi usuario.',
        ],
      },
      {
        id: 'personal-modulos',
        pregunta: '¿Qué hay en el menú "Módulos"?',
        respuesta:
          'Con la sesión abierta, "Módulos" reúne lo que podés usar: Mi usuario y las gestiones que tu cuenta tiene permitidas. El administrador ve además Gestión de usuarios y las estadísticas privadas.',
      },
      {
        id: 'personal-mi-usuario',
        pregunta: '¿Qué puedo cambiar en Mi usuario?',
        respuesta:
          'Tu nombre, correo, teléfono, DNI y contraseña (para cambiarla escribís la actual y la nueva dos veces). Tu rol y tus permisos se ven, pero solo los cambia el administrador.',
      },
      {
        id: 'personal-documentos',
        pregunta: '¿Cómo cargo, modifico o doy de baja un documento?',
        respuesta:
          'En Gestión de documentos, "Cargar nuevo documento" pide el tipo, el órgano, la dependencia de origen, el número, el año, la fecha, la descripción y el PDF (de hasta 20 MB).',
        puntos: [
          'La lista muestra siempre primero lo último cargado, con o sin filtros.',
          '"Modificar" cambia los datos o reemplaza el PDF; "Dar de baja" lo saca de la consulta pública, pero no lo borra.',
          'Solo podés cargar y modificar documentos de las dependencias que tu cuenta tiene permitidas.',
        ],
      },
      {
        id: 'personal-concursos',
        pregunta: '¿Cómo cargo un concurso?',
        respuesta:
          'En Gestión de concursos, "Cargar nuevo concurso". Un concurso se carga siempre como resolución de una facultad, con su PDF y uno o más llamados (área, cargo, dedicación, carácter y fechas de inscripción).',
        puntos: [
          'Aparece en la página pública de Concursos mientras la inscripción de alguno de sus llamados esté abierta.',
          'Los concursos del Digesto llegan solos todos los días; la fecha de emisión y la descripción se completan desde el panel.',
          'En la columna Archivo de cada gestión, "Ver PDF" abre la resolución en otra pestaña: el PDF guardado en el sistema o, si no está, el del Digesto actual.',
        ],
      },
      {
        id: 'personal-administrador',
        pregunta: '¿Qué es solo del administrador?',
        respuesta: 'Tres cosas:',
        puntos: [
          'Gestión de usuarios: cuentas, permisos por dependencia y módulo, y las altas y bajas.',
          'Solicitudes de restablecimiento: los pedidos de quien olvidó su contraseña, que se restablecen o se rechazan.',
          'Estadísticas privadas, con los términos más buscados.',
        ],
      },
    ],
  },
]

export const ENLACES_DE_INTERES = [
  { id: 'portal-unsl', texto: 'Portal de la UNSL', url: 'http://www.unsl.edu.ar' },
  { id: 'correo', texto: 'Correo institucional', url: 'https://webmail.unsl.edu.ar' },
  { id: 'planes-oficial', texto: 'Planes de estudio (sitio oficial)', url: SITIO_PLANES_DE_ESTUDIO },
]
