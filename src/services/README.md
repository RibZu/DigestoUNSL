# services

Un archivo por fuente de datos. Todos devuelven maquetas con la misma forma que va a devolver la API, de modo que conectarla después cambie solo el service y ningún componente.

- `concursos.js`: `obtenerFacultades()` y `obtenerConcursos()` (solo vigentes). Une los llamados con sus documentos y catálogos, y descarta los documentos dados de baja. Datos: `features/concursos/concursos.mock.json`.
- `planesDeEstudio.js`: `obtenerPlanesDeEstudio()` (listado de planes vigentes) y `obtenerPlanDeEstudio(carrera, plan)` (detalle con materias; `null` si no existe). Datos: `features/planes-de-estudio/*.mock.json`.
- `estadisticas.js`: `obtenerEstadisticasDocumentos()`, `obtenerTerminosMasBuscados()` y `obtenerConcursosPorFacultad()` (calculado sobre el mock de concursos). Datos: `features/estadisticas/estadisticas.mock.json`.
