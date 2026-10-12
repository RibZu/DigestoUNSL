# estadisticas

Módulo de estadísticas del Digesto, dentro del ingreso: ruta `/login/estadisticas`. No está enlazado desde la barra ni desde el pie; se llega escribiendo la dirección o desde el formulario de ingreso. Mientras no haya backend no hay control de sesión ni de rol; cuando exista, este módulo queda restringido a administradores.

Se organiza en cinco desplegables (`shared/ui/Desplegable`), plegados al entrar, cada uno con un resumen a la derecha:

- **Documentos por tipo**: los ocho tipos de la codificación oficial.
- **Documentos por dependencia**: Rectorado, facultades, ENJPP, etc.; las que no tienen dato figuran como "sin datos".
- **Documentos por oficina**: envíos por oficina, agrupados por dependencia.
- **Términos más buscados**: ranking de mayor a menor; los empates, por orden alfabético.
- **Concursos por facultad**: por cada facultad, los cargos llamados por año y el detalle de cada llamado (dedicación, carácter, inscripción y si está vigente o vencido).

Cada barra (`BarrasEstadistica.jsx`) es una sola serie con un solo color y muestra su valor en texto; el ancho es el único estilo inline, porque se calcula en tiempo de ejecución.

## Datos

`estadisticas.mock.json` trae los conteos por tipo y por dependencia del documento de modelo de datos, los envíos por oficina de `digesto.unsl.edu.ar/estadisticas.php3` (leídos el 2026-10-02) y un ranking de términos de prueba. Los conteos por tipo y por dependencia suman 167.684, que no coincide exactamente con el total del sitio actual (166.968).

"Concursos por facultad" no está en ese archivo: `services/estadisticas.js` lo calcula sobre `features/concursos/concursos.mock.json`, incluyendo los llamados vencidos y excluyendo los documentos dados de baja.
