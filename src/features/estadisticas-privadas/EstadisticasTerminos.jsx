import { useEffect, useState } from 'react'
import Desplegable from '../../shared/ui/Desplegable'
import BarrasEstadistica from './BarrasEstadistica'
import { obtenerTerminosMasBuscados } from '../../services/estadisticas.js'
import './EstadisticasTerminos.css'

export default function EstadisticasTerminos() {
  const [abierto, setAbierto] = useState(false)
  const [estado, setEstado] = useState('cargando')
  const [terminos, setTerminos] = useState([])
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    let ignorar = false

    async function cargar() {
      try {
        const recibidos = await obtenerTerminosMasBuscados()
        if (ignorar) return
        setTerminos(recibidos)
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

  function handleReintentar() {
    setEstado('cargando')
    setIntento((anterior) => anterior + 1)
  }

  const maximo = Math.max(0, ...terminos.map((termino) => termino.busquedas))
  const resumen = `${terminos.length} ${terminos.length === 1 ? 'término' : 'términos'}`

  return (
    <Desplegable
      id="est-terminos"
      titulo="Términos más buscados"
      resumen={estado === 'listo' ? resumen : undefined}
      abierto={abierto}
      onAlternar={handleAlternar}
    >
      {estado === 'cargando' && (
        <div className="d-flex align-items-center gap-2" role="status">
          <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
          <span>Cargando términos...</span>
        </div>
      )}

      {estado === 'error' && (
        <div className="estadisticas-terminos__estado">
          <div className="alert alert-danger mb-0" role="alert">
            No se pudieron cargar los términos más buscados.
          </div>
          <button type="button" className="btn btn-primary" onClick={handleReintentar}>
            Reintentar
          </button>
        </div>
      )}

      {estado === 'listo' && terminos.length === 0 && (
        <p className="estadisticas-terminos__vacio">No hay términos buscados para mostrar.</p>
      )}

      {estado === 'listo' && terminos.length > 0 && (
        <BarrasEstadistica
          filas={terminos.map((termino) => ({
            clave: termino.termino,
            etiqueta: termino.termino,
            cantidad: termino.busquedas,
          }))}
          maximo={maximo}
          unidad="búsquedas"
          unidadSingular="búsqueda"
        />
      )}
    </Desplegable>
  )
}
