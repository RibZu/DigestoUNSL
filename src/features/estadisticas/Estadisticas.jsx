import { useEffect, useState } from 'react'
import EncabezadoPagina from '../../shared/layout/EncabezadoPagina'
import Desplegable from '../../shared/ui/Desplegable'
import BarrasEstadistica from './BarrasEstadistica'
import ConcursosFacultad from './ConcursosFacultad'
import {
  obtenerConcursosPorFacultad,
  obtenerEstadisticasDocumentos,
  obtenerTerminosMasBuscados,
} from '../../services/estadisticas.js'
import './Estadisticas.css'

function calcularAncho(cantidad, maximo) {
  return cantidad === null || maximo === 0 ? 0 : (cantidad / maximo) * 100
}

function maximoDe(cantidades) {
  return Math.max(0, ...cantidades.map((cantidad) => cantidad ?? 0))
}

function sumar(cantidades) {
  return cantidades.reduce((suma, cantidad) => suma + (cantidad ?? 0), 0)
}

function formatear(numero) {
  return numero.toLocaleString('es-AR')
}

export default function Estadisticas() {
  const [estado, setEstado] = useState('cargando')
  const [documentos, setDocumentos] = useState(null)
  const [terminos, setTerminos] = useState([])
  const [concursos, setConcursos] = useState(null)
  const [abiertos, setAbiertos] = useState(() => new Set())
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    let ignorar = false

    async function cargar() {
      try {
        const [documentosRecibidos, terminosRecibidos, concursosRecibidos] = await Promise.all([
          obtenerEstadisticasDocumentos(),
          obtenerTerminosMasBuscados(),
          obtenerConcursosPorFacultad(),
        ])
        if (ignorar) return
        setDocumentos(documentosRecibidos)
        setTerminos(terminosRecibidos)
        setConcursos(concursosRecibidos)
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

  function handleReintentar() {
    setEstado('cargando')
    setIntento((anterior) => anterior + 1)
  }

  function handleAlternar(id) {
    setAbiertos((actuales) => {
      const siguientes = new Set(actuales)
      if (siguientes.has(id)) siguientes.delete(id)
      else siguientes.add(id)
      return siguientes
    })
  }

  if (estado === 'cargando') {
    return (
      <>
        <EncabezadoPagina titulo="Estadísticas del Digesto" />
        <section className="container-xl estadisticas-page">
          <div className="d-flex align-items-center gap-2" role="status">
            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
            <span>Cargando estadísticas...</span>
          </div>
        </section>
      </>
    )
  }

  if (estado === 'error') {
    return (
      <>
        <EncabezadoPagina titulo="Estadísticas del Digesto" />
        <section className="container-xl estadisticas-page">
          <div className="alert alert-danger mb-0" role="alert">
            No se pudieron cargar las estadísticas.
          </div>
          <button type="button" className="btn btn-primary align-self-start" onClick={handleReintentar}>
            Reintentar
          </button>
        </section>
      </>
    )
  }

  const hayDatos =
    documentos.porTipo.length > 0 || terminos.length > 0 || concursos.facultades.length > 0

  const maximoTipos = maximoDe(documentos.porTipo.map((tipo) => tipo.cantidad))
  const filasTipos = documentos.porTipo.map((tipo) => ({
    clave: tipo.tipo,
    etiqueta: tipo.tipo,
    cantidad: tipo.cantidad,
    porcentaje: tipo.porcentaje,
    ancho: calcularAncho(tipo.cantidad, maximoTipos),
  }))

  const maximoDependencias = maximoDe(documentos.porDependencia.map((dependencia) => dependencia.cantidad))
  const filasDependencias = documentos.porDependencia.map((dependencia) => ({
    clave: dependencia.numero,
    etiqueta: dependencia.sigla,
    detalle: dependencia.nombre,
    cantidad: dependencia.cantidad,
    porcentaje: dependencia.porcentaje,
    ancho: calcularAncho(dependencia.cantidad, maximoDependencias),
  }))

  const maximoTerminos = maximoDe(terminos.map((termino) => termino.busquedas))
  const filasTerminos = terminos.map((termino) => ({
    clave: termino.termino,
    etiqueta: termino.termino,
    cantidad: termino.busquedas,
    porcentaje: null,
    ancho: calcularAncho(termino.busquedas, maximoTerminos),
  }))

  const totalOficinas = documentos.porOficina.reduce((suma, grupo) => suma + grupo.oficinas.length, 0)

  return (
    <>
      <EncabezadoPagina titulo="Estadísticas del Digesto">
        <p>Volumen de documentos, búsquedas y concursos del Digesto.</p>
      </EncabezadoPagina>

      <section className="container-xl estadisticas-page">
        {!hayDatos && <p className="estadisticas-nota">No hay estadísticas para mostrar por el momento.</p>}

        {hayDatos && (
          <div className="estadisticas-lista">
            <Desplegable
              id="est-tipo"
              titulo="Documentos por tipo"
              resumen={`${formatear(sumar(documentos.porTipo.map((tipo) => tipo.cantidad)))} documentos`}
              abierto={abiertos.has('est-tipo')}
              onAlternar={() => handleAlternar('est-tipo')}
            >
              <BarrasEstadistica filas={filasTipos} />
            </Desplegable>

            <Desplegable
              id="est-dependencia"
              titulo="Documentos por dependencia"
              resumen={`${formatear(sumar(documentos.porDependencia.map((dependencia) => dependencia.cantidad)))} documentos`}
              abierto={abiertos.has('est-dependencia')}
              onAlternar={() => handleAlternar('est-dependencia')}
            >
              <BarrasEstadistica filas={filasDependencias} />
            </Desplegable>

            <Desplegable
              id="est-oficina"
              titulo="Documentos por oficina"
              resumen={`${totalOficinas} oficinas`}
              abierto={abiertos.has('est-oficina')}
              onAlternar={() => handleAlternar('est-oficina')}
            >
              {documentos.porOficina.map((grupo) => {
                const maximoOficinas = maximoDe(grupo.oficinas.map((oficina) => oficina.cantidad))
                const filasOficinas = grupo.oficinas.map((oficina) => ({
                  clave: oficina.nombre,
                  etiqueta: oficina.nombre,
                  cantidad: oficina.cantidad,
                  porcentaje: null,
                  ancho: calcularAncho(oficina.cantidad, maximoOficinas),
                }))
                return (
                  <section key={grupo.dependencia} className="estadisticas-grupo">
                    <h3 className="estadisticas-grupo__titulo">
                      {grupo.dependencia}
                      <span className="estadisticas-grupo__total">{formatear(grupo.total)} documentos</span>
                    </h3>
                    <BarrasEstadistica filas={filasOficinas} />
                  </section>
                )
              })}
            </Desplegable>

            <Desplegable
              id="est-terminos"
              titulo="Términos más buscados"
              resumen={`${terminos.length} términos`}
              abierto={abiertos.has('est-terminos')}
              onAlternar={() => handleAlternar('est-terminos')}
            >
              <BarrasEstadistica filas={filasTerminos} unidad="búsquedas" ordenada />
            </Desplegable>

            <Desplegable
              id="est-concursos"
              titulo="Concursos por facultad"
              resumen={`${sumar(concursos.facultades.map((facultad) => facultad.total))} llamados`}
              abierto={abiertos.has('est-concursos')}
              onAlternar={() => handleAlternar('est-concursos')}
            >
              {concursos.facultades.map((facultad) => (
                <ConcursosFacultad key={facultad.numero} facultad={facultad} anios={concursos.anios} />
              ))}
            </Desplegable>
          </div>
        )}

        <p className="estadisticas-nota">
          Los conteos por tipo, por dependencia y por oficina provienen de fuentes distintas del Digesto y pueden
          no coincidir exactamente entre sí.
        </p>
      </section>
    </>
  )
}
