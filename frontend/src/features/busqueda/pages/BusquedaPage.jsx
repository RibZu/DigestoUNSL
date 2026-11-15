import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import EncabezadoPagina from '../../../shared/layout/EncabezadoPagina'
import MensajeVacio from '../../../shared/components/MensajeVacio'
import Paginacion from '../../../shared/components/Paginacion'
import Spinner from '../../../shared/components/Spinner'
import { useFetch } from '../../../shared/hooks/useFetch'
import { formatearFecha, SIN_DATO } from '../../../shared/utils/formato.js'
import { obtenerCatalogos } from '../../catalogos'
import { buscarDocumentos } from '../services/busquedaService'
import './Busqueda.css'

const VALORES_INICIALES = {
  searchTerm: '',
  tipoDocumento: '',
  organismoEmisor: '',
  numeroNorma: '',
  anioNorma: '',
  fechaDesde: '',
  fechaHasta: '',
}

const LIMITE = 20
const ANIO_MINIMO = 1973
const ANIO_MAXIMO = 2050
const ANIOS = Array.from({ length: ANIO_MAXIMO - ANIO_MINIMO + 1 }, (_, i) => ANIO_MINIMO + i)

function validar(valores) {
  const errores = {}
  if (valores.fechaDesde && valores.fechaHasta && valores.fechaDesde > valores.fechaHasta) {
    errores.fechaHasta = 'La fecha hasta no puede ser anterior a la fecha desde.'
  }
  return errores
}

function BusquedaPage() {
  const [valores, setValores] = useState(VALORES_INICIALES)
  const [errores, setErrores] = useState({})
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [criterios, setCriterios] = useState(null)
  const [pagina, setPagina] = useState(1)
  const resultadosRef = useRef(null)
  const fechaHastaRef = useRef(null)
  const catalogos = useFetch(obtenerCatalogos).datos

  let consulta = null
  if (criterios !== null) {
    const parametros = new URLSearchParams(criterios)
    parametros.set('pagina', String(pagina))
    parametros.set('limite', String(LIMITE))
    consulta = parametros.toString()
  }

  const { datos, cargando, error } = useFetch(buscarDocumentos, consulta)

  if (datos && datos.resultados.length === 0 && datos.total > 0 && pagina > 1) {
    setPagina(1)
  }

  useEffect(() => {
    if (errores.fechaHasta) fechaHastaRef.current?.focus()
  }, [errores])

  function handleChange(e) {
    const { name, value } = e.target
    setValores({ ...valores, [name]: value })
    if (name === 'fechaDesde' || name === 'fechaHasta') setErrores({})
  }

  function handleSearch(e) {
    e.preventDefault()
    const erroresNuevos = validar(valores)
    setErrores(erroresNuevos)
    if (Object.keys(erroresNuevos).length > 0) {
      setShowAdvanced(true)
      return
    }
    const parametros = new URLSearchParams()
    const filtros = {
      q: valores.searchTerm.trim(),
      tipo: valores.tipoDocumento,
      dependencia: valores.organismoEmisor,
      numero: valores.numeroNorma.trim(),
      anio: valores.anioNorma,
      desde: valores.fechaDesde,
      hasta: valores.fechaHasta,
    }
    for (const [clave, valor] of Object.entries(filtros)) {
      if (valor) parametros.set(clave, valor)
    }
    setCriterios(parametros.toString())
    setPagina(1)
  }

  function handleCambiarPagina(nueva) {
    resultadosRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setPagina(nueva)
  }

  function handleClearText() {
    setValores({ ...valores, searchTerm: '' })
  }

  return (
    <>
      <EncabezadoPagina titulo="Búsqueda de Normativas">
        <p>
          Explore el digesto administrativo de la Universidad Nacional de San Luis mediante
          búsquedas en texto y filtros estructurados.
        </p>
      </EncabezadoPagina>

      <section className="container-xl busqueda-page">
        <form className="busqueda-card" onSubmit={handleSearch}>
          <div className="busqueda-hero-bar">
            <div className="busqueda-hero-input-wrapper">
              <svg
                className="busqueda-search-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                name="searchTerm"
                className="busqueda-hero-input"
                placeholder="Buscar por palabra clave, concepto o resumen del documento..."
                value={valores.searchTerm}
                onChange={handleChange}
              />
              {valores.searchTerm && (
                <button
                  type="button"
                  className="busqueda-clear-btn"
                  onClick={handleClearText}
                  title="Limpiar texto"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>

            <button type="submit" className="busqueda-submit-btn">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              Buscar
            </button>
          </div>

          <div className="row g-2">
            <div className="col-12 col-md-6">
              <div className="form-floating">
                <select
                  id="tipo-doc"
                  name="tipoDocumento"
                  className="form-select"
                  value={valores.tipoDocumento}
                  onChange={handleChange}
                >
                  <option value="">Todos los tipos</option>
                  {(catalogos?.tiposDocumento ?? []).map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
                <label htmlFor="tipo-doc">Tipo de Documento</label>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="form-floating">
                <select
                  id="organismo"
                  name="organismoEmisor"
                  className="form-select"
                  value={valores.organismoEmisor}
                  onChange={handleChange}
                >
                  <option value="">Todos los organismos</option>
                  {(catalogos?.dependencias ?? []).map((dependencia) => (
                    <option key={dependencia.id} value={dependencia.id}>
                      {dependencia.sigla} · {dependencia.nombre}
                    </option>
                  ))}
                </select>
                <label htmlFor="organismo">Organismo Emisor (Área / Facultad)</label>
              </div>
            </div>
          </div>

          <div className="busqueda-advanced-toggle-wrapper">
            <button
              type="button"
              className="busqueda-advanced-toggle-btn"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
              {showAdvanced ? 'Ocultar filtros avanzados' : 'Filtros avanzados'}
              <svg
                className={`busqueda-advanced-chevron${showAdvanced ? ' busqueda-advanced-chevron--abierto' : ''}`}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>

          {showAdvanced && (
            <div className="busqueda-advanced-panel">
              <h3 className="busqueda-advanced-title">Búsqueda por Identificador y Rango de Fechas</h3>

              <div className="row g-2">
                <div className="col-12 col-sm-6 col-lg-3">
                  <div className="form-floating">
                    <input
                      type="text"
                      id="num-norma"
                      name="numeroNorma"
                      className="form-control"
                      placeholder="Ej: 125"
                      value={valores.numeroNorma}
                      onChange={handleChange}
                    />
                    <label htmlFor="num-norma">Número de Norma</label>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3">
                  <div className="form-floating">
                    <select
                      id="anio-norma"
                      name="anioNorma"
                      className="form-select"
                      value={valores.anioNorma}
                      onChange={handleChange}
                    >
                      <option value="">Todos los años</option>
                      {ANIOS.map((anio) => (
                        <option key={anio} value={anio}>
                          {anio}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="anio-norma">Año</label>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3">
                  <div className="form-floating">
                    <input
                      type="date"
                      id="fecha-desde"
                      name="fechaDesde"
                      className="form-control"
                      placeholder="Fecha desde"
                      value={valores.fechaDesde}
                      onChange={handleChange}
                    />
                    <label htmlFor="fecha-desde">Fecha Desde</label>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3">
                  <div className="form-floating">
                    <input
                      type="date"
                      id="fecha-hasta"
                      name="fechaHasta"
                      ref={fechaHastaRef}
                      className={`form-control${errores.fechaHasta ? ' is-invalid' : ''}`}
                      placeholder="Fecha hasta"
                      aria-invalid={errores.fechaHasta ? 'true' : undefined}
                      aria-describedby={errores.fechaHasta ? 'fecha-hasta-error' : undefined}
                      value={valores.fechaHasta}
                      onChange={handleChange}
                    />
                    <label htmlFor="fecha-hasta">Fecha Hasta</label>
                    {errores.fechaHasta && (
                      <div id="fecha-hasta-error" className="invalid-feedback">
                        {errores.fechaHasta}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>

        <div ref={resultadosRef} className="busqueda-resultados">
          {consulta !== null && cargando && <Spinner texto="Buscando documentos..." />}

          {consulta !== null && error && <MensajeVacio texto={error.message} />}

          {datos && (
            <section className="busqueda-results" aria-label="Resultados de búsqueda">
              <div className="busqueda-results-header">
                <h2>Resultados encontrados</h2>
                <span className="busqueda-results-count">
                  {datos.total.toLocaleString('es-AR')} documentos encontrados
                </span>
              </div>

              {datos.resultados.length === 0 ? (
                <div className="busqueda-result-card busqueda-result-card--vacio">
                  <p>No se encontraron documentos que coincidan con los criterios de búsqueda.</p>
                </div>
              ) : (
                datos.resultados.map((result) => (
                  <article key={result.id} className="busqueda-result-card">
                    <div className="busqueda-result-header">
                      <Link to={`/normativas/${result.id}`} className="busqueda-result-title-link stretched-link">
                        {result.codigo}
                      </Link>
                      <div className="busqueda-result-meta">
                        <span className="busqueda-meta-tag tipo">{result.tipo_nombre ?? SIN_DATO}</span>
                        <span className="busqueda-meta-tag fecha">
                          {formatearFecha(result.fecha_emision)}
                        </span>
                      </div>
                    </div>
                    <span className="busqueda-result-organo">{result.dependencia_emisora_nombre}</span>
                    <p className="busqueda-result-snippet">{result.descripcion || SIN_DATO}</p>
                  </article>
                ))
              )}

              <Paginacion
                pagina={pagina}
                total={datos.total}
                limite={LIMITE}
                onCambiar={handleCambiarPagina}
              />
            </section>
          )}
        </div>
      </section>
    </>
  )
}

export default BusquedaPage
