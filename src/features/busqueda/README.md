# busqueda

Búsqueda rápida, avanzada y búsqueda en el texto del documento, unificadas en una sola sección.

- Rápida: un único campo de texto (equivalente a `busrap.php3`).
- Avanzada: tipo de documento, origen del trámite, órgano emisor, área de interés, fecha de emisión, código del documento y frase clave (equivalente a `busav.php3`).
- En texto: búsqueda de una palabra o frase dentro del contenido de los documentos.

El backend normaliza el HTML del Digesto a JSON antes de devolver los resultados. Los filtros sobre los resultados ya devueltos (tipo, fecha, dependencia) se aplican del lado del cliente, sin volver a consultar al Digesto.
