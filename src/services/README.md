# services

Un archivo por fuente de datos. Todos devuelven maquetas con la misma forma que va a devolver la API, de modo que conectarla después cambie solo el service y ningún componente.

- `concursos.js`: `obtenerFacultades()` y `obtenerConcursos()` (solo vigentes, por fecha de cierre). Sirve la respuesta de la API de Concursos (`RibZu/API-CONCURSOS`, los feeds RSS por facultad convertidos a JSON): descarta los avisos de "no hay llamados" que la API devuelve como si fueran llamados y agrega la ciudad de cada facultad desde una tabla fija propia (FICES, histórica, no se muestra). Datos: `features/concursos/concursos.mock.json`.
- `planesDeEstudio.js`: `obtenerPlanesDeEstudio()` (listado de planes vigentes) y `obtenerPlanDeEstudio(carrera, plan)` (detalle con materias; `null` si no existe). Datos: `features/planes-de-estudio/*.mock.json`.
- `estadisticas.js`: `obtenerTerminosMasBuscados()` (ranking ordenado) y `obtenerConcursosPorAnio()` (llamados por año y facultad, vigentes y vencidos, calculados sobre el mock de concursos). Datos de los términos: `features/estadisticas-privadas/terminos.mock.json`.
