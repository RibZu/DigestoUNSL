import { useEffect, useState } from 'react'
import Desplegable from '../../shared/ui/Desplegable'
import BarrasEstadistica from './BarrasEstadistica'
import { obtenerConcursosPorAnio } from '../../services/estadisticas.js'
import './EstadisticasConcursos.css'

function contarLlamados(cantidad) {
  return `${cantidad.toLocaleString('es-AR')} ${cantidad === 1 ? 'llamado' : 'llamados'}`
}

export default function EstadisticasConcursos() {
  const [abierto, setAbierto] = useState(false)
  const [estado, setEstado] = useState('cargando')
  const [anios, setAnios] = useState([])
  const [intento, setIntento] = useState(0)
  const [aniosAbiertos, setAniosAbiertos] = useState([])

  useEffect(() => {
    let ignorar = false

    async function cargar() {
      try {
        const recibidos = await obtenerConcursosPorAnio()
        if (ignorar) return
        setAnios(recibidos)
        setEstado('listo')
      } catch {
        if (!ignorar) setEstado('error')
      }
    }

    cargar()
    return () => {
      ignorar = true
    }
  }, [intento])

  function handleAlternar() {
    setAbierto((actual) => !actual)
  }

  function handleAlternarAnio(anio) {
    setAniosAbiertos((actuales) =>
      actuales.includes(anio) ? actuales.filter((otro) => otro !== anio) : [...actuales, anio]
    )
  }

  function handleReintentar() {
    setEstado('cargando')
    setIntento((anterior) => anterior + 1)
  }

  const total = anios.reduce((suma, grupo) => suma + grupo.total, 0)
  const maximo = Math.max(
    0,
    ...anios.flatMap((grupo) => grupo.facultades.map((facultad) => facultad.cantidad))
  )

  return (
    <Desplegable
      id="est-concursos"
      titulo="Concursos por facultad"
      resumen={estado === 'listo' ? contarLlamados(total) : undefined}
      abierto={abierto}
      onAlternar={handleAlternar}
    >
      {estado === 'cargando' && (
        <div className="d-flex align-items-center gap-2" role="status">
          <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
          <span>Cargando concursos...</span>
        </div>
      )}

      {estado === 'error' && (
        <div className="estadisticas-concursos__estado">
          <div className="alert alert-danger mb-0" role="alert">
            No se pudieron cargar los concursos.
          </div>
          <button type="button" className="btn btn-primary" onClick={handleReintentar}>
            Reintentar
          </button>
        </div>
      )}

      {estado === 'listo' && anios.length === 0 && (
        <p className="estadisticas-concursos__vacio">No hay llamados a concurso para mostrar.</p>
      )}

      {estado === 'listo' && anios.length > 0 && (
        <div className="d-flex flex-column gap-2">
          {anios.map((grupo) => (
            <Desplegable
              key={grupo.anio}
              id={`est-concursos-${grupo.anio}`}
              nivel={3}
              titulo={grupo.anio}
              resumen={contarLlamados(grupo.total)}
              abierto={aniosAbiertos.includes(grupo.anio)}
              onAlternar={() => handleAlternarAnio(grupo.anio)}
            >
              <BarrasEstadistica
                filas={grupo.facultades.map((facultad) => ({
                  clave: facultad.codigo,
                  etiqueta: facultad.nombre,
                  cantidad: facultad.cantidad,
                }))}
                maximo={maximo}
                unidad="llamados"
                unidadSingular="llamado"
              />
            </Desplegable>
          ))}
        </div>
      )}
    </Desplegable>
  )
}
