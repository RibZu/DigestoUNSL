import { useState } from 'react'
import { Link } from 'react-router'
import './Busqueda.css'

export default function Busqueda() {
  const [searchTerm, setSearchTerm] = useState('')
  const [tipoDocumento, setTipoDocumento] = useState('')
  const [organismoEmisor, setOrganismoEmisor] = useState('')
  
  // Filtros avanzados
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [numeroNorma, setNumeroNorma] = useState('')
  const [anioNorma, setAnioNorma] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [buscarTextoCompleto, setBuscarTextoCompleto] = useState(false)

  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    setHasSearched(true)
  }

  const handleClearText = () => {
    setSearchTerm('')
  }

  // Resultados simulados de prueba
  const mockResults = [
    {
      id: 1,
      title: 'Resolución Rectoral N° 145/2026',
      codigo: 'RR-1-145/26',
      organo: 'Consejo Superior / Rectorado',
      tipo: 'Resolución',
      fecha: '12-05-2026',
      snippet: '... por la cual se aprueba el calendario académico para el ciclo lectivo 2026 en todas las facultades ...',
    },
    {
      id: 2,
      title: 'Ordenanza Consejo Superior N° 12/2026',
      codigo: 'OCS-1-12/26',
      organo: 'FCFMyN (Fac. de Ciencias Físico-Matemáticas y Naturales)',
      tipo: 'Ordenanza',
      fecha: '05-04-2026',
      snippet: '... actualización del plan de estudios de la carrera Licenciatura en Ciencias de la Computación ...',
    },
    {
      id: 3,
      title: 'Resolución Rectoral N° 140/2026',
      codigo: 'RR-1-140/26',
      organo: 'Consejo Superior / Rectorado',
      tipo: 'Resolución',
      fecha: '01-04-2026',
      snippet: '... designación de autoridades para la comisión de evaluación institucional ...',
    },
  ]

  return (
    <div className="busqueda-page">
      <header className="busqueda-header">
        <h1>Búsqueda de Normativas</h1>
        <p>Explore el digesto administrativo de la Universidad Nacional de San Luis mediante búsquedas en texto y filtros estructurados.</p>
      </header>

      <form className="busqueda-card" onSubmit={handleSearch}>
        {/* Input Destacado con Icono */}
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
              className="busqueda-hero-input"
              placeholder="Buscar por palabra clave, concepto o resumen del documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="busqueda-clear-btn"
                onClick={handleClearText}
                title="Limpiar texto"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>

          <button type="submit" className="busqueda-submit-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            Buscar
          </button>
        </div>

        {/* Filtros Principales (Siempre Visibles) */}
        <div className="busqueda-main-filters">
          <div className="busqueda-filter-field">
            <label htmlFor="tipo-doc" className="busqueda-filter-label">
              Tipo de Documento
            </label>
            <select
              id="tipo-doc"
              className="busqueda-select"
              value={tipoDocumento}
              onChange={(e) => setTipoDocumento(e.target.value)}
            >
              <option value="">Todos los tipos</option>
              <option value="resolucion">Resolución (Rectoral / de Consejo Directivo)</option>
              <option value="ordenanza">Ordenanza</option>
              <option value="decreto">Decreto</option>
              <option value="convenio">Convenio</option>
              <option value="acta">Acta / Circular</option>
            </select>
          </div>

          <div className="busqueda-filter-field">
            <label htmlFor="organismo" className="busqueda-filter-label">
              Organismo Emisor (Área / Facultad)
            </label>
            <select
              id="organismo"
              className="busqueda-select"
              value={organismoEmisor}
              onChange={(e) => setOrganismoEmisor(e.target.value)}
            >
              <option value="">Todos los organismos</option>
              <option value="rectorado">Consejo Superior / Rectorado</option>
              <option value="fcfmyn">FCFMyN (Fac. de Ciencias Físico-Matemáticas y Naturales)</option>
              <option value="fcejs">FCEJS (Fac. de Ciencias Económicas, Jurídicas y Sociales)</option>
              <option value="fch">FCH (Fac. de Ciencias Humanas)</option>
              <option value="fqbyf">FQByF (Fac. de Química, Bioquímica y Farmacia)</option>
              <option value="fcs">FCS (Fac. de Ciencias de la Salud)</option>
              <option value="fapyp">FAPyP (Fac. de Psicología)</option>
              <option value="secretarias">Secretarías o Direcciones Generales</option>
            </select>
          </div>
        </div>

        {/* Desplegable de Filtros Avanzados */}
        <div className="busqueda-advanced-toggle-wrapper">
          <button
            type="button"
            className="busqueda-advanced-toggle-btn"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            {showAdvanced ? 'Ocultar filtros avanzados' : 'Filtros avanzados'}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ transform: showAdvanced ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>

        {showAdvanced && (
          <div className="busqueda-advanced-panel">
            <h3 className="busqueda-advanced-title">Búsqueda por Identificador y Rango de Fechas</h3>
            
            <div className="busqueda-advanced-grid">
              <div className="busqueda-filter-field">
                <label htmlFor="num-norma" className="busqueda-filter-label">
                  Número de Norma
                </label>
                <input
                  type="text"
                  id="num-norma"
                  className="busqueda-input"
                  placeholder="Ej: 125"
                  value={numeroNorma}
                  onChange={(e) => setNumeroNorma(e.target.value)}
                />
              </div>

              <div className="busqueda-filter-field">
                <label htmlFor="anio-norma" className="busqueda-filter-label">
                  Año
                </label>
                <input
                  type="text"
                  id="anio-norma"
                  className="busqueda-input"
                  placeholder="Ej: 2025"
                  value={anioNorma}
                  onChange={(e) => setAnioNorma(e.target.value)}
                />
              </div>

              <div className="busqueda-filter-field">
                <label htmlFor="fecha-desde" className="busqueda-filter-label">
                  Fecha Desde
                </label>
                <input
                  type="date"
                  id="fecha-desde"
                  className="busqueda-input"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                />
              </div>

              <div className="busqueda-filter-field">
                <label htmlFor="fecha-hasta" className="busqueda-filter-label">
                  Fecha Hasta
                </label>
                <input
                  type="date"
                  id="fecha-hasta"
                  className="busqueda-input"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                />
              </div>
            </div>

            <label className="busqueda-checkbox-container" style={{ marginTop: '0.5rem' }}>
              <input
                type="checkbox"
                className="busqueda-checkbox-input"
                checked={buscarTextoCompleto}
                onChange={(e) => setBuscarTextoCompleto(e.target.checked)}
              />
              Buscar también dentro del contenido completo del documento
            </label>
          </div>
        )}
      </form>

      {/* Resultados de Búsqueda */}
      {hasSearched && (
        <section className="busqueda-results" aria-label="Resultados de búsqueda">
          <div className="busqueda-results-header">
            <h2>Resultados encontrados</h2>
            <span className="busqueda-results-count">{mockResults.length} normativas encontradas</span>
          </div>

          {mockResults.map((result) => (
            <article key={result.id} className="busqueda-result-card">
              <div className="busqueda-result-header">
                <Link to={`/normativas/${result.id}`} className="busqueda-result-title-link">
                  {result.title}
                </Link>
                <div className="busqueda-result-meta">
                  <span className="busqueda-meta-tag tipo">{result.tipo}</span>
                  <span className="busqueda-meta-tag">{result.codigo}</span>
                  <span className="busqueda-meta-tag fecha">{result.fecha}</span>
                </div>
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>
                {result.organo}
              </span>
              <p className="busqueda-result-snippet">{result.snippet}</p>
            </article>
          ))}
        </section>
      )}
    </div>
  )
}
