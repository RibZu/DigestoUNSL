# concursos

Llamados a concursos de cargos vigentes, agrupados por facultad. Solo se muestran los llamados cuya inscripción todavía no venció (hasta el final del día de cierre); los vencidos quedan en los datos y cuentan en las estadísticas.

Incluye un buscador de texto libre (cargo, área, departamento, resolución) y filtros por facultad, carácter y dedicación, todo aplicado del lado del cliente sobre los datos ya cargados — sin volver a consultar la fuente de datos por cada tecla o cada filtro. Una facultad sin ningún concurso vigente se muestra igual, con un mensaje propio, en vez de desaparecer.

Cada facultad es un desplegable (`shared/ui/Desplegable`, con `aria-expanded`) que muestra su ciudad a la derecha y arranca plegado. Al buscar o filtrar, las facultades con resultados se abren solas; al cambiar un criterio o limpiar los filtros, se descartan los despliegues manuales.

## Ficha de cada cargo

`ConcursoCard.jsx` muestra el cargo como título y, en una lista de datos, el departamento, el área, la dedicación y el carácter (los datos vacíos se muestran como "—"). No muestra el período de inscripción ni ningún estado. "Ver resolución" es un botón que, por ahora, solo registra el código de la resolución en la consola del navegador: no navega a ningún lado.

La ficha no tiene identificador propio porque la API no lo da; su `key` es la unión de resolución, departamento, área, cargo, dedicación y carácter, porque varios llamados comparten resolución.

## Datos

`concursos.mock.json` es la respuesta de la API de Concursos (`RibZu/API-CONCURSOS`, que convierte a JSON los feeds RSS `digesto.unsl.edu.ar/feeds/{facultad}-conc.xml`) y no tiene nada que esa API no devuelva:

- `facultades`: lo que devuelve `GET /api/facultades`, un objeto código → nombre.
- `concursos`: lo que devuelve `GET /api/concursos`, una lista plana de llamados con diez campos de texto (`facultad`, `departamento`, `area`, `cargo`, `dedicacion`, `caracter`, `inscripcion_desde`, `inscripcion_hasta`, `resolucion` y `resolucion_url`). Las fechas vienen como `dd/mm/aa`; los cargos, dedicaciones y caracteres, en plural y sin tildes en departamento, área y cargo, igual que en los feeds.

Los llamados reales son los de los feeds del 2026-10-02; el resto son llamados de prueba, vigentes y vencidos, en el mismo formato, para que la página y las estadísticas tengan contenido después de esa fecha. Entre ellos hay llamados de 2023, 2024 y 2025, todos vencidos, para que las estadísticas comparen años; no aparecen en la página de Concursos. Los feeds solo publican llamados activos, así que el histórico saldrá de lo que el backend vaya guardando.

Cuando una facultad no tiene llamados activos, su feed trae un aviso ("No hay nuevos llamados…") que la API devuelve como si fuera un llamado, con el texto en `departamento` y el resto vacío. `services/concursos.js` lo descarta: un registro es un llamado solo si tiene cargo y resolución.

`services/concursos.js` hace además lo que la API no da: calcula la vigencia con `inscripcion_hasta`, ordena por fecha de cierre y agrega la ciudad de cada facultad desde una tabla fija propia (fuera del mock). Esa misma tabla marca a FICES como histórica, así que no se muestra ni en Concursos ni en Estadísticas.
