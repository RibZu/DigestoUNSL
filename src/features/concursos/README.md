# concursos

Llamados a concursos de cargos, agrupados por facultad, con el contacto de cada una para pedir información.

Incluye un buscador de texto libre (cargo, área, departamento, resolución) y filtros por facultad,
carácter y dedicación, todo aplicado del lado del cliente sobre los datos ya cargados — sin
volver a consultar la fuente de datos por cada tecla o cada filtro. Una facultad sin ningún
concurso vigente se muestra igual, con un mensaje propio, en vez de desaparecer.

Cada facultad es un desplegable (botón con `aria-expanded`) que muestra su ciudad a la derecha y
arranca plegado. Al buscar o filtrar, las facultades con resultados se abren solas; al cambiar un
criterio o limpiar los filtros, se descartan los despliegues manuales. El carácter puede ser
Efectivos, Interinos o Suplentes, y las opciones de los filtros salen de los datos, ordenadas.

El mock (`concursos.mock.json`) trae `facultades` como `{ codigo: { nombre, ubicacion } }` y 45
concursos, 5 por facultad, que cubren todas las combinaciones de carácter y dedicación.

Fuente real: feed RSS por facultad en `digesto.unsl.edu.ar/feeds/rss.html?id=N` (a confirmar si se consume directo o a través de una API externa que ya resuelve XML → JSON).
