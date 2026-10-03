# shared/ui

Componentes visuales genéricos reutilizables entre secciones, sin lógica de negocio de ninguna feature en particular.

- `Desplegable`: sección con título y resumen que se pliega y despliega (botón con `aria-expanded`). Lo usan Concursos, Planes de estudio y las estadísticas privadas; quien lo usa decide cuáles están abiertos. Se puede anidar (en "Concursos por facultad" hay uno por año, con `nivel={3}`) y el título de un desplegable anidado se ve más chico. La línea vertical a la izquierda del contenido es del azul marino de la barra superior.
- `PaginaNoEncontrada`: la página que se muestra cuando la dirección no existe.
