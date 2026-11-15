import { useState } from 'react'
import BarrasEstadistica from '../../../shared/components/BarrasEstadistica'
import Desplegable from '../../../shared/components/Desplegable'
import MensajeVacio from '../../../shared/components/MensajeVacio'
import { anchoRelativo, contar } from '../../../shared/utils/formato.js'

function EstadisticasTerminos({ terminos }) {
  const [abierto, setAbierto] = useState(false)
  const maximo = Math.max(0, ...terminos.map((termino) => termino.busquedas))

  function handleAlternar() {
    setAbierto(!abierto)
  }

  return (
    <Desplegable
      id="est-terminos"
      titulo="Términos más buscados"
      resumen={contar(terminos.length, 'término', 'términos')}
      abierto={abierto}
      onAlternar={handleAlternar}
    >
      {terminos.length === 0 ? (
        <MensajeVacio texto="No hay términos buscados para mostrar." />
      ) : (
        <BarrasEstadistica
          ordenada
          filas={terminos.map((termino) => ({
            clave: termino.termino,
            etiqueta: termino.termino,
            texto: contar(termino.busquedas, 'búsqueda', 'búsquedas'),
            ancho: anchoRelativo(termino.busquedas, maximo),
          }))}
        />
      )}
    </Desplegable>
  )
}

export default EstadisticasTerminos
