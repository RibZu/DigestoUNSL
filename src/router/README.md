# router

Definición de las rutas de la SPA en `AppRouter.jsx` (`createBrowserRouter`, con `RouterProvider` de `react-router/dom`). Los enlaces de la barra y del pie viven en `shared/layout/navigation.js`.

Rutas con particularidades:

- `/planes-de-estudio/:carrera/:plan`: la página de un plan vigente.
- `/login` y `/login/estadisticas`: el ingreso y, dentro de él, las estadísticas. Ninguna de las dos está enlazada desde el sitio público y, mientras no haya backend, ninguna controla sesión.
- `*`: la página de "no encontrada" (`shared/ui/PaginaNoEncontrada`).
