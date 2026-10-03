# concursos

Llamados a concursos de cargos vigentes, agrupados por facultad. Solo se muestran los llamados cuya inscripción todavía no venció (hasta el final del día de cierre); los vencidos quedan en los datos y cuentan en las estadísticas.

Incluye un buscador de texto libre (cargo, área, departamento, resolución) y filtros por facultad, carácter y dedicación, todo aplicado del lado del cliente sobre los datos ya cargados — sin volver a consultar la fuente de datos por cada tecla o cada filtro. Una facultad sin ningún concurso vigente se muestra igual, con un mensaje propio, en vez de desaparecer.

Cada facultad es un desplegable (`shared/ui/Desplegable`, con `aria-expanded`) que muestra su ciudad a la derecha y arranca plegado. Al buscar o filtrar, las facultades con resultados se abren solas; al cambiar un criterio o limpiar los filtros, se descartan los despliegues manuales. El carácter (Efectivo, Interino o Suplente) y la dedicación salen de los datos, ordenados.

## Datos

`concursos.mock.json` reproduce las tablas del modelo de datos del Digesto, tal como las llenaría el formulario de Concursos: `dependencias`, `codificacion` (los 65 prefijos oficiales), `oficinas`, `departamentos`, `areas`, `documentos` (un registro por PDF, con su código `PREFIJO-dependencia-número/año`) y `llamados` (de 0 a N por documento). La forma exacta está en `specs/010-estetica-unsl-mocks-planes/data-model.md`.

`services/concursos.js` hace lo que haría la API: une cada llamado con su documento y sus catálogos, descarta los documentos dados de baja y devuelve solo los vigentes. FICES figura en `dependencias` como histórica y no tiene llamados.

Fuente real: feed RSS por facultad en `digesto.unsl.edu.ar/feeds/rss.html?id=N` (a confirmar si se consume directo o a través de una API externa que ya resuelve XML → JSON).
