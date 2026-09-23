# planes-de-estudio

Lista las carreras con planes vigentes y activos posteriores a 2009, agrupadas en desplegables por facultad. Cada facultad muestra su ubicación (San Luis, Villa Mercedes o Merlo) e incluye a FICES. La Licenciatura en Análisis y Gestión de Datos figura en FCFMyN y en FCEJS. Ruta: `/planes-de-estudio`.

Incluye un buscador (nombre de carrera u ordenanza) y un filtro por facultad, aplicados del lado del cliente. Con un criterio activo, las facultades con resultados se despliegan solas.

Todos los enlaces (cada plan y el botón "¿No encontrás tu plan?") van solo a `planesestudio.unsl.edu.ar`.

Datos: maqueta `planes-de-estudio.mock.json` servida por `services/planesDeEstudio.js`, extraída del HTML de `planesestudio.unsl.edu.ar`. Ese sitio no ofrece JSON, XML ni CORS, así que no se puede consultar en vivo desde el navegador.
