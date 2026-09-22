import { useState } from 'react'
import { Link } from 'react-router'
import './Novedades.css'

export default function Novedades() {
  const [filterTipo, setFilterTipo] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const novedades = [
    {
      id: 'res-145-2026',
      codigo: 'RR-1-145/26',
      title: 'Resolución Rectoral N° 145/2026',
      organo: 'Rectorado',
      tipo: 'Resolución',
      fecha: '18 de Septiembre de 2026',
      descripcion:
        'Aprobación del calendario de actividades académicas e institucionales para el ciclo lectivo 2026/2027 en la Universidad Nacional de San Luis.',
      pdfUrl: '#',
    },
    {
      id: 'ord-012-2026',
      codigo: 'OCS-1-12/26',
      title: 'Ordenanza Consejo Superior N° 12/2026',
      organo: 'Consejo Superior',
      tipo: 'Ordenanza',
      fecha: '15 de Septiembre de 2026',
      descripcion:
        'Modificación y actualización del régimen de regularidad y correlatividades para las carreras de grado de la Facultad de Ciencias Físico-Matemáticas y Naturales.',
      pdfUrl: '#',
    },
    {
      id: 'res-140-2026',
      codigo: 'RR-1-140/26',
      title: 'Resolución Rectoral N° 140/2026',
      organo: 'Rectorado',
      tipo: 'Resolución',
      fecha: '10 de Septiembre de 2026',
      descripcion:
        'Llamado a inscripción de aspirantes para cubrir cargos docentes interinos en la Facultad de Ciencias Económicas, Jurídicas y Sociales.',
      pdfUrl: '#',
    },
    {
      id: 'disp-045-2026',
      codigo: 'CD-4-45/26',
      title: 'Disposición Consejo Directivo N° 45/2026',
      organo: 'Facultad de Ciencias de la Salud',
      tipo: 'Disposición',
      fecha: '05 de Septiembre de 2026',
      descripcion:
        'Asignación de espacio físico y equipamiento de laboratorio para proyectos de investigación en salud pública.',
      pdfUrl: '#',
    },
    {
      id: 'res-132-2026',
      codigo: 'RCS-1-132/26',
      title: 'Resolución Consejo Superior N° 132/2026',
      organo: 'Consejo Superior',
      tipo: 'Resolución',
      fecha: '28 de Agosto de 2026',
      descripcion:
        'Concesión de licencias por capacitación técnica al personal no docente de la Universidad.',
      pdfUrl: '#',
    },
  ]

  const filteredNovedades = novedades.filter((item) => {
    const matchesTipo = filterTipo === '' || item.tipo.toLowerCase() === filterTipo.toLowerCase()
    const matchesQuery =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.codigo.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTipo && matchesQuery
  })

  return (
    <div className="novedades-page">
      <header className="novedades-header">
        <h1>Novedades del Digesto</h1>
        <p>Listado cronológico de los últimos documentos y normativas oficializadas en el sistema.</p>
      </header>

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

      <main className="novedades-list">
        {filteredNovedades.length === 0 ? (
          <div className="novedad-card" style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No se encontraron normativas recientes que coincidan con el filtro.</p>
          </div>
        ) : (
          filteredNovedades.map((item) => (
            <article key={item.id} className="novedad-card">
              <div className="novedad-header">
                <div className="novedad-title-group">
                  <Link to={`/normativas/${item.id}`} style={{ textDecoration: 'none' }}>
                    <h2 className="novedad-title" style={{ cursor: 'pointer' }}>{item.title}</h2>
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
      </main>
    </div>
  )
}
