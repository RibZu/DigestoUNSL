# planes-de-estudio

Lista las carreras con planes vigentes posteriores a 2009, agrupadas en desplegables por facultad. Cada facultad muestra su ubicación (San Luis, Villa Mercedes o Merlo) e incluye a FICES. La Licenciatura en Análisis y Gestión de Datos figura en FCFMyN y en FCEJS. Ruta: `/planes-de-estudio`.

Incluye un buscador (nombre de carrera u ordenanza) y un filtro por facultad, aplicados del lado del cliente. Con un criterio activo, las facultades con resultados se despliegan solas.

## Página de cada plan

Cada plan del listado es un enlace interno a `/planes-de-estudio/:carrera/:plan` (`PlanDeEstudio.jsx`), por ejemplo `/planes-de-estudio/02005/18-24`. `:carrera` es el código oficial de la carrera y `:plan` es el parámetro `plan` de la URL oficial con `/` reemplazada por `-`.

La página muestra el encabezado del plan (carrera, código, plan, ordenanza, años y cantidad de materias) y una tabla por año (`MateriasDelAnio.jsx`) con código, materia y período. Las materias sin año del sitio oficial ("Materias del Año") van en una tabla final. Todas las tablas están dentro de un recuadro con borde, con una línea que separa cada año, y usan textos y márgenes compactos. Desde 768 px las columnas tienen el mismo ancho en las tablas de todos los años (Código y Período fijos, Materia ocupa el resto) y un texto largo pasa de línea dentro de su columna.

- La fila genérica de optativas del plan (por ejemplo "OPTATIVOS Farmacia 18/24") figura en su año. El bloque "Materias Optativas" que el sitio oficial agrega al final **no** se muestra.
- No se muestra la columna de programas: sus enlaces van a otro dominio.
- No se muestran las correlativas. Todos los enlaces externos (ver el plan en el sitio oficial y buscar otro plan) van solo a `planesestudio.unsl.edu.ar` y se abren en una pestaña nueva.
- Un plan inexistente o no vigente muestra "Plan no encontrado".
- En celular cada materia es una caja con borde y líneas entre sus datos; desde 768 px son tablas con líneas entre todas las filas y columnas.
- `codigo` es la `key` de cada fila: es único dentro de cada año, aunque el sitio oficial repite algún código en un mismo plan en años distintos (por ejemplo `02MA01420` en `02010/1-25`).

## Datos

Maquetas servidas por `services/planesDeEstudio.js`. Tienen la forma mínima que tiene que devolver la API: solo lo que la página muestra o necesita para filtrar, identificar o enlazar, sin datos que se puedan calcular a partir de otros.

- `planes-de-estudio.mock.json`: el listado, solo planes vigentes. Por facultad (`codigo`, `nombre`, `ubicacion`), sus carreras (`codigo`, `nombre`) y, por carrera, sus planes (`plan`, el número oficial como `18/24`, y `ordenanza`, el texto que se muestra, que a veces lleva prefijo). La dirección del detalle usa `plan` con `-` en lugar de `/`.
- `planes-de-estudio.detalle.mock.json`: el detalle de cada plan vigente (107 planes): `carrera`, `nombreCarrera`, `plan`, `ordenanza`, `anios`, `url` (el enlace al sitio oficial) y las materias agrupadas por año (`codigo`, `nombre`, `periodo` y `optativa`). No tiene correlativas, y la cantidad de materias se calcula en vez de guardarse. El service lo carga con `import()` dinámico, así que va en un chunk aparte.

Ambos salen de leer el HTML de `planesestudio.unsl.edu.ar` con Cheerio, la misma librería que declara `API-planesEstudio`, y son las respuestas que esa API va a devolver. Ese sitio no ofrece JSON, XML ni CORS, así que no se puede consultar en vivo desde el navegador.
