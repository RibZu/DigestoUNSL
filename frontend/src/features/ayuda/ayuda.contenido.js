import { SITIO_PLANES_DE_ESTUDIO } from '../../services/planesDeEstudio.js'

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
                    'No, la consulta es pública. "Ingresar", en el pie de página, es solo para el personal que administra el Digesto.',
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
                    'El sitio oficial de planes de estudio, el Portal y el Correo de la UNSL están en otros sitios. Se abren en otra pestaña para que no pierdas tu lugar en el Digesto.',
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
                    'Tres accesos: Búsqueda, Novedades y Concursos, cada uno con su botón. El pie de página tiene Ayuda e Ingresar.',
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
                    'Escribí la palabra en el campo principal y apretá "Buscar". Se busca en el título, el resumen y el código del documento.',
            },
            {
                id: 'busqueda-filtros',
                pregunta: '¿Cómo filtro por tipo de documento o por organismo emisor?',
                respuesta:
                    'Elegí una opción en "Tipo de Documento" (Resolución, Ordenanza, Decreto, Convenio o Acta / Circular) o en "Organismo Emisor" (el Rectorado, una facultad o las secretarías).',
            },
            {
                id: 'busqueda-avanzada',
                pregunta:
                    '¿Cómo encuentro un documento si conozco su número y su año, o un rango de fechas?',
                respuesta:
                    'Apretá "Filtros avanzados". Ahí aparecen los campos de número, año, fecha desde y fecha hasta.',
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
                id: 'novedades-detalle',
                pregunta: '¿Cómo veo el detalle de una normativa?',
                respuesta:
                    'Hacé clic en su título. El detalle muestra el código, el lugar y la fecha, el expediente, el Visto, el Considerando y los artículos. "Copiar Enlace" copia su dirección y el botón de arriba te devuelve a los resultados.',
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
]

export const ENLACES_DE_INTERES = [
    { id: 'portal-unsl', texto: 'Portal de la UNSL', url: 'http://www.unsl.edu.ar' },
    { id: 'correo', texto: 'Correo institucional', url: 'https://webmail.unsl.edu.ar' },
    { id: 'planes-oficial', texto: 'Planes de estudio (sitio oficial)', url: SITIO_PLANES_DE_ESTUDIO },
]
