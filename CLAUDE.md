# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Qué es este proyecto

Digesto Administrativo UNSL: una SPA que reemplaza el sitio legacy en PHP del Digesto de la
Universidad Nacional de San Luis (búsqueda de documentos administrativos, novedades, concursos,
planes de estudio, estadísticas, y un área de ingreso con un panel de tres módulos: estadísticas
privadas, gestión de concursos y gestión y alta de documentos).

El repo es de un solo proyecto (Vite en la raíz, sin carpeta `frontend/` separada — no hay
backend en este repo). El backend/API que va a servir estos datos todavía no está definido ni
presente acá.

## Comandos

Todos los comandos corren desde la raíz del repo:

```bash
npm install       # instalar dependencias
npm run dev       # servidor de desarrollo (Vite)
npm run build     # build de producción
npm run preview   # servir el build de producción localmente
npm run lint      # ESLint sobre todo el proyecto
```

No hay suite de tests configurada todavía (sin test runner en `package.json`). No inventes
comandos de test que no existen. La verificación mínima de cada cambio es `npm run lint` sin
errores nuevos y `npm run build` sin errores. Hoy `npm run lint` da un error conocido en
`features/alta` (código de Ema): no se corrige.

## Arquitectura

- **Organización por feature, no por tipo de archivo**: cada sección vive en
  `src/features/<nombre>` con su página y sus estilos propios.
  - `home`: la portada. La foto `portada-unsl.webp` va de fondo con un velo azul encima y el
    título centrado en blanco. Abajo, tres tarjetas que se apilan en el celular y quedan en fila
    desde 768 px, cada una con el borde superior de otro color (celeste, violeta y azul).
  - `busqueda` (**código de Ema**): tarjeta con un buscador grande y filtros en dos columnas desde
    640 px.
  - `novedades` (**código de Ema**): lista de tarjetas blancas.
  - `normativas` (**código de Ema**): el documento va en una tarjeta blanca con barra de
    herramientas; cada artículo, sobre fondo gris con un borde azul a la izquierda.
  - `auth/login`: tarjeta blanca centrada con sombra.
  - `panel`: tarjetas con borde superior azul. Al pasar el mouse aparece la sombra y, con el
    teclado, un contorno azul rodea toda la tarjeta.
  - `gestion-concursos`: el formulario se arma con bloques blancos de borde redondeado y cada
    llamado va en su propio recuadro, con el botón de quitar montado sobre el borde superior
    derecho. El código armado se ve en un recuadro azul muy suave con borde azul, que pasa a rojo
    si hay error. En la tabla, los encabezados y los botones no se cortan en dos líneas.
  - `alta` (**código de Ema**): pestañas y tarjeta blanca con sombra.
  - `estadisticas` (**código de Ema**): indicadores en grilla y tarjetas de barras.
  - `estadisticas-privadas`: barras horizontales azules sobre una pista gris, con el extremo
    derecho redondeado y el número de puesto delante de cada etiqueta.
  - `ayuda`: índice de enlaces centrado y bloques separados por una línea fina.
  - `concursos`: tarjetas blancas en una grilla que acomoda las columnas según el ancho; al pasar
    el mouse se elevan y la sombra crece.
  - `planes-de-estudio`: cada carrera es una fila con línea inferior que se tiñe al pasar el mouse;
    desde 768 px el nombre queda a la izquierda y los planes a la derecha. En el detalle, los datos
    del plan van en la franja azul con etiquetas en mayúsculas, y las materias, en tablas por año
    dentro de un recuadro blanco, con columnas de ancho fijo.
- **Estética**: la del sitio de la UNSL (`unsl.edu.ar`, rediseño de octubre de 2026): PT Sans,
  azul marino, fondo gris claro con bloques blancos, barra fija azul marino sólida arriba, del
  mismo azul que la franja, y levemente translúcida con desenfoque al bajar 50 px (en Inicio es
  transparente hasta bajar 50 px), y pie claro. Todos los botones tienen esquinas redondeadas con
  `--radio` (ninguno es píldora). Solo versión clara (no hay modo oscuro). Los colores y medidas
  son tokens en `:root` de `src/index.css`; cada página interior empieza con la franja azul con
  el `h1`. Los logos y el favicon son los oficiales, en `src/assets/logo/`.
- **Código transversal fuera de `features/`**:
  - `shared/layout`: la barra, el pie, el logo UNSL con el lockup "Digesto Administrativo" y el
    encabezado azul de cada página; `navigation.js` tiene los enlaces de la barra (Inicio,
    Búsqueda, Novedades, Concursos, Planes de estudio y Estadísticas). La barra se despliega en
    horizontal desde 992 px; por debajo muestra el botón de menú. El pie enlaza a Ayuda e
    Ingresar.
  - `shared/ui`: piezas visuales compartidas; solo el desplegable tiene estilos propios.
  - `shared/utils`: funciones puras que usa más de una sección. `formato.js` (`formatearFecha`,
    `SIN_DATO`), `listas.js` (`contieneTexto`, `tieneValores`, `alternar`, `comoOpciones`) y
    `validaciones.js` (`esRequerido`, `esEmailValido`).
  - `services/`: un archivo por fuente de datos, todos mockeados hasta que exista un backend
    real, con la forma que va a devolver la API. Son funciones sincrónicas: devuelven el dato
    directo, sin demoras ni promesas (salvo `busqueda.js` y `novedades.js`, que todavía simulan
    la demora). `concursos.js` lee la respuesta de la API de Concursos (`RibZu/API-CONCURSOS`,
    mock `concursos.mock.json`, 10 filas con el formato del feed): descarta los avisos de "no hay
    llamados", convierte las fechas y agrega la ciudad de cada facultad; expone
    `obtenerFacultades`, `obtenerLlamados`, `obtenerConcursosVigentes`,
    `obtenerConcursosCargados` (agrupados por resolución, para Gestión) y `estaVigente`. No guarda
    nada (sin `localStorage` ni ABM). `catalogos.js` expone `obtenerCatalogosDeConcursos()` (el
    catálogo fijo); `planesDeEstudio.js` expone `SITIO_PLANES_DE_ESTUDIO`,
    `obtenerPlanesDeEstudio()` (listado) y `obtenerPlanDeEstudio(carrera, plan)` (detalle o
    `null`; mocks `planes-de-estudio.mock.json` y `planes-de-estudio.detalle.mock.json`);
    `estadisticas.js` expone `obtenerTerminosMasBuscados()` (mock
    `estadisticas-privadas/terminos.mock.json`) y `obtenerConcursosPorAnio()` (calculado sobre los
    llamados de `concursos.js`).


## Convenciones

- Nombres de features y contenido de dominio en español; nombres técnicos genéricos (archivos de
  convención de Vite) pueden ir en inglés.
- CSS mobile-first siguiendo la cátedra, sin `!important`. Las media queries van solo con
  `min-width`, en los cortes de Bootstrap: 768 px y 992 px.
- Colores, tipografía, tamaños, radios y sombras salen de los tokens de `:root` en
  `src/index.css`; no hay colores hexadecimales fuera de ese archivo. Las transparencias van con
  `rgb(r g b / alfa)`.
- Clases con la forma `bloque__elemento--modificador` y el nombre de la feature como prefijo
  (`concurso-card__cargo`, `gestion-concursos__codigo--error`).
- Antes de escribir CSS propio, usar lo que ya trae Bootstrap 5 (botones, grilla, formularios y
  utilidades).
- Enlaces y botones táctiles de al menos 44 px de alto, y el foco siempre visible.
- Toda transición se desactiva con `prefers-reduced-motion: reduce`.
- **Código sin uso**: lo que un cambio deja sin uso (estilos, imágenes) se borra en
  el mismo cambio.
- **Autoría**: el código es de Simón (RibZu), salvo el de Ema (otro integrante del grupo):
  `features/alta`, `features/estadisticas`, `features/busqueda`, `features/novedades` y
  `features/normativas`, sus services (`busqueda.js` y `novedades.js`) y sus rutas. El código de
  Ema no se edita ni se corrige, salvo pedido explícito y acotado del usuario; un permiso puntual
  no se extiende al resto de su código. Ante la duda sobre de quién es un archivo, mirar
  `git log` / `git blame` y preguntar.
- **Formato de archivos**: fin de línea CRLF en todos los archivos. La sangría y el punto y coma
  son los del archivo que se toca; los archivos nuevos van con 4 espacios y sin punto y coma en JS
  (con punto y coma en CSS).
- JavaScript, datos y seguridad siguiendo la cátedra: `const`/`let` y `===`, los datos se leen
  solo desde `services/` y nunca `alert()` ni `confirm()`. Mientras no haya backend, los services
  devuelven los JSON en forma directa, sin demoras simuladas. Cuando un service pida datos por
  red, usa `async/await` con `try/catch` y `response.ok`.
- Services y utils exportan funciones con nombre, sin `export default`; las de lectura de los
  services se llaman `obtener…`.
- Cada mock va en la carpeta de su feature como `<nombre>.mock.json` y solo lo importa su
  service.
- Dentro del código, las fechas van en ISO (`AAAA-MM-DD`); en pantalla se muestran con
  `formatearFecha`, y un dato faltante, con `SIN_DATO`.
