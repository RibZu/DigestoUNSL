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
                    'Hay resoluciones, ordenanzas, disposiciones, decretos, convenios, actas y circulares.',
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
                    'No, toda la consulta es pública. "Ingreso" es solo para el personal institucional.',
            },
            {
                id: 'generales-celular',
                pregunta: '¿Puedo usar el sitio desde el celular?',
                respuesta:
                    'Sí, el sitio se adapta a pantallas chicas. En el celular, el menú se abre con el botón de la barra superior.',
            },
            {
                id: 'generales-enlaces-externos',
                pregunta:
                    '¿Por qué algunos enlaces abren otra pestaña o llevan a otro sitio de la UNSL?',
                respuesta:
                    'Los planes de estudio, las resoluciones de los concursos, el Portal y el Correo están en sitios oficiales de la UNSL. Esos enlaces se abren en otra pestaña para que no pierdas tu lugar en el Digesto.',
            },
            {
                id: 'generales-error',
                pregunta: '¿Qué hago si una página no carga o muestra un error?',
                respuesta:
                    'Usá el botón "Reintentar" cuando aparece, como en Concursos y en Planes de estudio. Si no alcanza, recargá la página o volvé a intentar más tarde.',
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
                    'Tres accesos rápidos: Búsqueda, Novedades y Concursos. Cada uno explica qué ofrece su sección y tiene un botón para ir a ella. El pie de página tiene los accesos a Ingreso, Ayuda y Estadísticas.',
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
                    'Escribí la palabra en el campo principal y apretá "Buscar". Podés usar una palabra, un concepto o parte del resumen del documento.',
            },
            {
                id: 'busqueda-filtros',
                pregunta: '¿Cómo filtro por tipo de documento o por organismo emisor?',
                respuesta:
                    'Elegí una opción en "Tipo de Documento" (Resolución, Ordenanza, Decreto, Convenio o Acta / Circular). También podés elegir un "Organismo Emisor", como el Rectorado o una facultad.',
            },
            {
                id: 'busqueda-avanzada',
                pregunta:
                    '¿Cómo encuentro un documento si conozco su número y su año, o un rango de fechas?',
                respuesta:
                    'Apretá "Filtros avanzados". Ahí aparecen los campos de número, año, fecha desde y fecha hasta.',
            },
            {
                id: 'busqueda-contenido-completo',
                pregunta:
                    '¿Qué cambia si marco "Buscar también dentro del contenido completo del documento"?',
                respuesta:
                    'La búsqueda deja de mirar solo los datos del documento y también revisa su texto completo. Sirve cuando recordás una frase, pero no el título.',
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
        id: 'novedades',
        titulo: 'Novedades',
        ruta: '/novedades',
        preguntas: [
            {
                id: 'novedades-que-y-orden',
                pregunta: '¿Qué documentos aparecen en Novedades y en qué orden?',
                respuesta:
                    'Los últimos documentos incorporados al Digesto, del más reciente al más antiguo.',
            },
            {
                id: 'novedades-filtrar-buscar',
                pregunta: '¿Cómo filtro por tipo o busco dentro de las novedades?',
                respuesta:
                    'Usá "Filtrar por tipo" (Resoluciones, Ordenanzas o Disposiciones) o el buscador por título, descripción o código. El buscador no distingue mayúsculas de minúsculas.',
            },
            {
                id: 'novedades-ver-y-descargar',
                pregunta: '¿Cómo veo el documento completo y descargo su PDF?',
                respuesta:
                    'Hacé clic en el título para abrir el detalle. Si solo querés el archivo, usá "Descargar PDF" en la tarjeta.',
            },
            {
                id: 'novedades-detalle',
                pregunta:
                    '¿Qué información muestra el detalle de una normativa (código, fecha, expediente, visto, considerando, artículos) y cómo copio su enlace?',
                respuesta:
                    'El detalle muestra el código, el lugar y la fecha, el expediente, el Visto, el Considerando y los artículos. Con "Copiar Enlace" copiás su dirección y con "Descargar PDF" bajás el archivo. Para volver, usá el botón de la parte superior.',
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
                pregunta: '¿Qué es un llamado a concurso y cómo veo los de una facultad?',
                respuesta:
                    'Es un llamado público para cubrir un cargo docente. Las facultades aparecen plegadas, con su ciudad a la derecha, y un clic despliega sus concursos. Cuando buscás o filtrás, se abren solas las que tienen resultados.',
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
                id: 'concursos-fechas-resolucion',
                pregunta: '¿Dónde veo las fechas de inscripción y la resolución del llamado?',
                respuesta:
                    'Cada tarjeta muestra la "Inscripción", con las fechas de inicio y de cierre. El botón "Ver resolución" abre la resolución del llamado en el Digesto. El buscador acepta cargo, área, departamento o número de resolución.',
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
                    'Buscá por carrera u ordenanza, o filtrá por facultad y desplegala. Cada plan tiene un enlace a su ordenanza en el sitio oficial de planes de estudio.',
            },
            {
                id: 'planes-vigente-activo',
                pregunta: '¿Qué diferencia hay entre un plan vigente y uno activo?',
                respuesta:
                    'Un plan vigente rige para los ingresantes. Uno activo es un plan anterior que todavía tiene estudiantes cursando.',
            },
            {
                id: 'planes-no-aparece',
                pregunta: '¿Por qué no aparece mi plan?',
                respuesta:
                    'Se muestran solo los planes vigentes y activos posteriores a 2009. Para ver todos los planes, usá el botón "¿No encontrás tu plan? …", que lleva al sitio oficial planesestudio.unsl.edu.ar.',
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
                id: 'estadisticas-que-muestran',
                pregunta:
                    '¿Qué muestran las estadísticas: indicadores, documentos por órgano emisor y por año?',
                respuesta:
                    'Muestran indicadores generales, como los documentos registrados y las consultas mensuales. Además, las barras "Documentación por Órgano Emisor" y "Normativas por Año de Emisión" comparan cuántos documentos hay por origen y por año.',
            },
        ],
    },
    {
        id: 'ingreso',
        titulo: 'Ingreso',
        ruta: '/login',
        preguntas: [
            {
                id: 'ingreso-quien',
                pregunta: '¿Quién puede ingresar y para qué?',
                respuesta:
                    'Es un acceso para el personal institucional que administra el Digesto. Se ingresa en "Acceso Institucional", con el usuario o correo institucional y la contraseña.',
            },
            {
                id: 'ingreso-para-consultar',
                pregunta: '¿Tengo que ingresar para consultar documentos?',
                respuesta: 'No, la consulta del Digesto es libre y no requiere ingresar.',
            },
        ],
    },
]

export const ENLACES_DE_INTERES = [
    { id: 'portal-unsl', texto: 'Portal de la UNSL', url: 'http://www.unsl.edu.ar' },
    { id: 'correo', texto: 'Correo institucional', url: 'https://webmail.unsl.edu.ar' },
    {
        id: 'planes-oficial',
        texto: 'Planes de estudio (sitio oficial)',
        url: 'http://planesestudio.unsl.edu.ar/',
    },
]
