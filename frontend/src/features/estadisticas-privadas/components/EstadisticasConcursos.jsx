import { useState } from 'react'
import BarrasEstadistica from '../../../shared/components/BarrasEstadistica'
import Desplegable from '../../../shared/components/Desplegable'
import MensajeVacio from '../../../shared/components/MensajeVacio'
import { anchoRelativo, contar } from '../../../shared/utils/formato.js'
import { alternar } from '../../../shared/utils/listas.js'

function EstadisticasConcursos({ anios }) {
  const [abierto, setAbierto] = useState(false)
  const [aniosAbiertos, setAniosAbiertos] = useState([])
  const total = anios.reduce((suma, grupo) => suma + grupo.total, 0)
  const maximo = Math.max(
    0,
    ...anios.flatMap((grupo) => grupo.facultades.map((facultad) => facultad.cantidad)),
  )

  function handleAlternar() {
    setAbierto(!abierto)
  }

  function handleAlternarAnio(anio) {
    setAniosAbiertos(alternar(aniosAbiertos, anio))
  }

  return (
    <Desplegable
      id="est-concursos"
      titulo="Concursos por facultad"
      resumen={contar(total, 'llamado', 'llamados')}
      abierto={abierto}
      onAlternar={handleAlternar}
    >
      {anios.length === 0 ? (
        <MensajeVacio texto="No hay llamados a concurso para mostrar." />
      ) : (
        <div className="d-flex flex-column gap-2">
          {anios.map((grupo) => (
            <Desplegable
              key={grupo.anio}
              id={`est-concursos-${grupo.anio}`}
              nivel={3}
              titulo={grupo.anio}
              resumen={contar(grupo.total, 'llamado', 'llamados')}
              abierto={aniosAbiertos.includes(grupo.anio)}
              onAlternar={() => handleAlternarAnio(grupo.anio)}
            >
              <BarrasEstadistica
                ordenada
                filas={grupo.facultades.map((facultad) => ({
                  clave: facultad.codigo,
                  etiqueta: facultad.nombre,
                  texto: contar(facultad.cantidad, 'llamado', 'llamados'),
                  ancho: anchoRelativo(facultad.cantidad, maximo),
                }))}
              />
            </Desplegable>
          ))}
        </div>
      )}
    </Desplegable>
  )
}

export default EstadisticasConcursos
