# estadisticas-privadas

Módulo de estadísticas dentro del ingreso: ruta `/login/estadisticas`, a la que se llega desde el panel (`/login/panel`), que es adonde lleva el formulario de `/login`. No está enlazado desde la barra. Mientras no haya backend no hay control de sesión ni de rol; cuando exista, este módulo queda restringido a administradores.

La página pública de estadísticas es otra feature, `features/estadisticas`, con su propia ruta (`/estadisticas`) y su propio código.

`EstadisticasPrivadas.jsx` arma la página: el encabezado común y dos desplegables (`shared/ui/Desplegable`), plegados al entrar y con un resumen a la derecha. Cada desplegable es un componente autocontenido, con su estilo y sus estados de carga, error (con "Reintentar") y vacío:

- **Términos más buscados** (`EstadisticasTerminos`): ranking de mayor a menor cantidad de búsquedas; los empates, por orden alfabético.
- **Concursos por facultad** (`EstadisticasConcursos`): un desplegable anidado por año, del más reciente al más antiguo, plegado al entrar y con el total de llamados del año a la derecha; adentro, una barra por facultad. El año es el del inicio de la inscripción. Cuenta los llamados vigentes y los vencidos; descarta los avisos de "no hay llamados" y a FICES, que es histórica. Las facultades sin llamados en un año figuran con 0. Todos los años usan la misma escala, para poder compararlos.

`BarrasEstadistica.jsx` es el ranking de barras que comparten los dos: una sola serie con un solo color, con el valor en texto. Recibe `maximo` para fijar la escala; el ancho es el único estilo inline, porque se calcula en tiempo de ejecución.

## Datos

- `terminos.mock.json`: los términos más buscados (`termino`, `busquedas`), de prueba. Lo sirve `services/estadisticas.js`.
- "Concursos por facultad" no tiene archivo propio: `services/estadisticas.js` lo calcula sobre `features/concursos/concursos.mock.json` (la respuesta de la API de Concursos).
