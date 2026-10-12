# planes-de-estudio

Lista las carreras con planes vigentes posteriores a 2009, agrupadas en desplegables por facultad. Cada facultad muestra su ubicación (San Luis, Villa Mercedes o Merlo) e incluye a FICES. La Licenciatura en Análisis y Gestión de Datos figura en FCFMyN y en FCEJS. Ruta: `/planes-de-estudio`.

Incluye un buscador (nombre de carrera u ordenanza) y un filtro por facultad, aplicados del lado del cliente. Con un criterio activo, las facultades con resultados se despliegan solas.

## Página de cada plan

Cada plan del listado es un enlace interno a `/planes-de-estudio/:carrera/:plan` (`PlanDeEstudio.jsx`), por ejemplo `/planes-de-estudio/02005/18-24`. `:carrera` es el código oficial de la carrera y `:plan` es el parámetro `plan` de la URL oficial con `/` reemplazada por `-`.

La página muestra el encabezado del plan (carrera, código, plan, ordenanza, años y cantidad de materias) y una tabla por año (`MateriasDelAnio.jsx`) con código, materia, período, tipo de cursado y correlativas. Las materias sin año del sitio oficial ("Materias del Año") van en una tabla final.

- La fila genérica de optativas del plan (por ejemplo "OPTATIVOS Farmacia 18/24") figura en su año. El bloque "Materias Optativas" que el sitio oficial agrega al final **no** se muestra.
- No se muestra la columna de programas: sus enlaces van a otro dominio.
- Todos los enlaces externos (ver el plan oficial y las correlativas de cada materia) van solo a `planesestudio.unsl.edu.ar` y se abren en una pestaña nueva.
- Un plan inexistente o no vigente muestra "Plan no encontrado".
- En celular las tablas se apilan; desde 768 px son tablas normales.
- `orden` (el número de la materia dentro del plan) es la `key` de cada fila, porque el sitio oficial repite algún código en planes puntuales (por ejemplo `02MA01420` en `02010/1-25`).

## Datos

Maquetas servidas por `services/planesDeEstudio.js`:

- `planes-de-estudio.mock.json`: el listado, solo planes vigentes.
- `planes-de-estudio.detalle.mock.json`: el detalle de cada plan vigente (107 planes). El service lo carga con `import()` dinámico, así que va en un chunk aparte.

Ambos salen de leer el HTML de `planesestudio.unsl.edu.ar` con Cheerio, la misma librería que declara `API-planesEstudio`, y tienen la forma de las respuestas que esa API va a devolver. Ese sitio no ofrece JSON, XML ni CORS, así que no se puede consultar en vivo desde el navegador. El contrato está en `specs/010-estetica-unsl-mocks-planes/contracts/api-planes-estudio.md`.
