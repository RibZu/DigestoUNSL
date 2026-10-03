# shared/layout

Estructura presente en todas las páginas de la aplicación, con la estética del sitio de la UNSL (`unsl.edu.ar`).

- `Header`: barra fija arriba, azul marino (`--color-primario`) sólido y sin sombra en la posición inicial, para que se mezcle con la franja (en Inicio, `/`, es transparente sobre la portada hasta que se baja, y con el menú móvil abierto es sólida), con las seis secciones en una línea desde 992 px y el botón de menú por debajo de ese ancho. Al bajar más de 50 px se vuelve algo translúcida (95 %), con desenfoque y sombra, y se ve el fondo detrás. Sin transición si la persona prefiere movimiento reducido.
- `Footer`: pie claro con el logo en color, el contacto y los botones de Ayuda e Ingresar.
- `Universidad`: logo de la UNSL y nombre "Digesto Administrativo", en variante `barra` (logo blanco) o `pie` (logo en color).
- `EncabezadoPagina`: la franja con el único `h1` de cada página, del mismo azul que la barra; empieza detrás de ella, así que se ven como un solo bloque.
- `navigation.js`: enlaces de la barra (`layoutNavigationSections`, que termina en Estadísticas), de Ayuda y de Ingreso (`ayudaSection`, `ingresoSection`).
