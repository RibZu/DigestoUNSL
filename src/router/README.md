# router

Definición de las rutas de la SPA en `AppRouter.jsx` (`createBrowserRouter`, con `RouterProvider` de `react-router/dom`). Los enlaces de la barra y del pie viven en `shared/layout/navigation.js`.

Rutas con particularidades:

- `/planes-de-estudio/:carrera/:plan`: la página de un plan vigente.
- `/estadisticas`: la página pública de `features/estadisticas`, enlazada desde la barra y con el encabezado estándar.
- `/login`, `/login/panel` y `/login/estadisticas`: el ingreso (con el botón Ingresar del pie), el panel de `features/panel` al que lleva el formulario y, desde el panel, el módulo de estadísticas de `features/estadisticas-privadas`.
- `/alta` (también `/alta-documentos`): la gestión y alta de documentos de `features/alta`, a la que se llega desde el panel.
- Mientras no haya backend, ninguna de las rutas del ingreso ni `/alta` controla sesión.
- `*`: la página de "no encontrada" (`shared/ui/PaginaNoEncontrada`).
