# panel

Panel de administración (`/login/panel`): la página a la que lleva el formulario de ingreso. Muestra un acceso por módulo, como tarjeta que se puede clickear entera (`stretched-link`); con el teclado, el contorno de foco marca la tarjeta completa.

Módulos, en la constante `MODULOS` de `Panel.jsx` (es navegación fija, no datos de una API):

- **Estadísticas**: lleva a `/login/estadisticas` (`features/estadisticas-privadas`).
- **Gestión y alta de documentos**: lleva a `/alta` (`features/alta`).

No figura en la barra ni en el pie. Es una maqueta: no controla sesión hasta que haya backend (después, solo para usuarios autenticados). Se vuelve del módulo al panel con "Atrás" del navegador.
