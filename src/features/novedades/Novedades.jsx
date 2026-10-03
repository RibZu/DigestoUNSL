import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import EncabezadoPagina from '../../shared/layout/EncabezadoPagina'
import { obtenerNovedades } from '../../services/novedades'
import './Novedades.css'

export default function Novedades() {
  const [filterTipo, setFilterTipo] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [novedades, setNovedades] = useState([])

  useEffect(() => {
    obtenerNovedades(filterTipo, searchQuery).then(setNovedades)
  }, [filterTipo, searchQuery])

  const filteredNovedades = novedades


  return (
    <>
      <EncabezadoPagina titulo="Novedades del Digesto">
        <p>Listado cronológico de los últimos documentos y normativas oficializadas en el sistema.</p>
      </EncabezadoPagina>

      <section className="container-xl novedades-page">

        <div className="novedades-controls">
          <div className="novedades-filter-group">
            <label htmlFor="tipo-filter" className="novedades-filter-label">
              Filtrar por tipo:
            </label>
            <select
              id="tipo-filter"
              className="novedades-select"
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
            >
              <option value="">Todos los tipos</option>
              <option value="Resolución">Resoluciones</option>
              <option value="Ordenanza">Ordenanzas</option>
              <option value="Disposición">Disposiciones</option>
            </select>
          </div>

          <div className="novedades-filter-group">
            <input
              type="text"
              className="novedades-search-input"
              placeholder="Buscar en novedades..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <section className="novedades-list" aria-label="Listado de novedades">
          {filteredNovedades.length === 0 ? (
            <div className="novedad-card novedad-card--vacia">
              <p>No se encontraron normativas recientes que coincidan con el filtro.</p>
            </div>
          ) : (
            filteredNovedades.map((item) => (
              <article key={item.id} className="novedad-card">
                <div className="novedad-header">
                  <div className="novedad-title-group">
                    <Link to={`/normativas/${item.id}`} className="novedad-enlace">
                      <h2 className="novedad-title">{item.title}</h2>
                    </Link>
                    <span className="novedad-organo">{item.organo}</span>
                  </div>
                  <div className="novedad-badges">
                    <span className="novedad-badge tipo">{item.tipo}</span>
                    <span className="novedad-badge">{item.codigo}</span>
                  </div>
                </div>

                <p className="novedad-description">{item.descripcion}</p>

                <footer className="novedad-footer">
                  <span className="novedad-date">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {item.fecha}
                  </span>

                  <a
                    href={item.pdfUrl}
                    className="novedad-download-btn"
                    download
                    onClick={(e) => {
                      e.preventDefault()
                      alert(`Descargando PDF para: ${item.codigo}`)
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Descargar PDF
                  </a>
                </footer>
              </article>
            ))
          )}
        </section>
      </section>
    </>
  )
}
