# shared/layout

Estructura presente en todas las páginas de la aplicación, con la estética del sitio de la UNSL (`unsl.edu.ar`).

- `Header`: barra fija arriba. Es transparente en la posición inicial de la página y pasa a azul marino con desenfoque y sombra cuando se baja más de 50 px (también con el menú móvil abierto). Sin transición si la persona prefiere movimiento reducido.
- `Footer`: pie claro con el logo en color, el contacto y los botones de Ayuda e Ingresar. No enlaza a Estadísticas.
- `Universidad`: logo de la UNSL y nombre "Digesto Administrativo", en variante `barra` (logo blanco) o `pie` (logo en color).
- `EncabezadoPagina`: la franja azul con el único `h1` de cada página, detrás de la barra transparente.
- `navigation.js`: enlaces de la barra (`layoutNavigationSections`), de Ayuda y de Ingreso (`ayudaSection`, `ingresoSection`).
