import { useState } from 'react'

const TIPOS_DOCUMENTO = [
  'Actas',
  'Circulares',
  'Convenios',
  'Decretos',
  'Ordenanzas del día',
  'Ordenanzas',
  'Proveídos',
  'Resoluciones',
]

const ORIGENES_TRAMITE = [
  'Escuela Normal Juan Pascual Pringles',
  'DEDA',
  'IPAU',
  'DOSPU',
  'Facultad de Ciencias Físicas Matemáticas y Naturales',
  'Facultad de Ciencias Humanas',
  'Facultad de Ingeniería y Ciencias Económico-Sociales',
  'Facultad de Química Bioquímica y Farmacia',
  'Organismos Nacionales',
  'Rectorado',
  'Facultad de Ciencias de la Salud',
  'Facultad de Turismo y Urbanismo',
  'Facultad de Psicología',
  'Facultad de Ingeniería y Ciencias Agropecuarias',
  'Facultad de Ciencias Económicas, Jurídicas y Sociales',
]

const ORGANOS_EMISORES = [
  'Asamblea Universitaria',
  'Auditoría Interna',
  'Consejo de Escuela',
  'Consejo Consultivo',
  'Consejo Directivo',
  'Consejo Superior',
  'Consejo de Posgrado',
  'Secretaría de Vinculación Tecnológica y Social',
  'Actas de Comité Académico',
  'Decanato',
  'DEDA',
  'IPAU',
  'DOSPU',
  'Rectorado',
  'Rectoría',
  'Secretaría Académica',
  'Secretaría Administrativa',
  'Secretaría de Asuntos Estudiantiles y Bienestar',
  'Secretaría de Ciencia y Técnica',
  'Secretaría de Extensión Universitaria',
  'Secretaría General',
  'Secretaría de Hacienda',
  'Secretaría de Postgrado',
  'Secretaría de Planeamiento',
  'Dirección General de Administración',
  'Departamento de Física-FCFMN',
  'Departamento de Matemáticas-FCFMN',
  'Departamento de Informática-FCFMN',
  'Departamento de Geología-FCFMN',
  'Departamento de Minería-FCFMN',
  'CONEAU',
  'Ministerio de Ciencia y Tecnología',
  'Ministerio de Educación',
  'Junta Electoral-UNSL',
  'Departamento de Electrónica-FCFMN',
  'Junta Electoral-Facultad',
  'Secretaría de Imagen y Comunicación Institucional',
]

export default function TablaGestion({ documentos, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [filterOrigen, setFilterOrigen] = useState('')
  const [filterOrgano, setFilterOrgano] = useState('')

  const formatBytes = (bytes) => {
    if (!bytes) return ''
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Filtrado de documentos
  const documentosFiltrados = documentos.filter((doc) => {
    const matchesSearch =
      doc.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.pdfNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fecha.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTipo = !filterTipo || doc.tipo === filterTipo
    const matchesOrigen = !filterOrigen || doc.origen === filterOrigen
    const matchesOrgano = !filterOrgano || doc.organo === filterOrgano

    return matchesSearch && matchesTipo && matchesOrigen && matchesOrgano
  })

  return (
    <div className="alta-card">
      <div className="gestion-toolbar">
        <h2>Documentos Registrados</h2>
        <div className="gestion-search-bar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Buscar por descripción, archivo o fecha..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              ×
            </button>
          )}
        </div>
      </div>

      {/* Filtros de la tabla */}
      <div className="gestion-filters">
        <div className="filter-group">
          <label>Tipo:</label>
          <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}>
            <option value="">Todos los tipos</option>
            {TIPOS_DOCUMENTO.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Origen:</label>
          <select value={filterOrigen} onChange={(e) => setFilterOrigen(e.target.value)}>
            <option value="">Todos los orígenes</option>
            {ORIGENES_TRAMITE.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Órgano Emisor:</label>
          <select value={filterOrgano} onChange={(e) => setFilterOrgano(e.target.value)}>
            <option value="">Todos los órganos</option>
            {ORGANOS_EMISORES.map((org) => (
              <option key={org} value={org}>{org}</option>
            ))}
          </select>
        </div>

        {(filterTipo || filterOrigen || filterOrgano || searchTerm) && (
          <button
            className="btn-reset-filters"
            onClick={() => {
              setFilterTipo('')
              setFilterOrigen('')
              setFilterOrgano('')
              setSearchTerm('')
            }}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Tabla de Gestión */}
      <div className="alta-table-wrapper">
        <table className="alta-table">
          <thead>
            <tr>
              <th>Fecha y Hora</th>
              <th>Tipo</th>
              <th>Origen del Trámite</th>
              <th>Órgano Emisor</th>
              <th>Descripción</th>
              <th>PDF Adjunto</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {documentosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="7" className="alta-empty">
                  No se encontraron documentos que coincidan con los criterios de búsqueda.
                </td>
              </tr>
            ) : (
              documentosFiltrados.map((doc) => (
                <tr key={doc.id}>
                  <td className="doc-date-cell">
                    <span className="doc-date">{doc.fecha}</span>
                  </td>
                  <td>
                    <span className="doc-badge-tipo">{doc.tipo}</span>
                  </td>
                  <td>{doc.origen}</td>
                  <td>{doc.organo}</td>
                  <td className="doc-desc-cell">{doc.descripcion}</td>
                  <td>
                    <div className="doc-pdf-link">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      <span className="doc-pdf-name" title={doc.pdfNombre}>
                        {doc.pdfNombre}
                      </span>
                      {doc.pdfTamano && (
                        <span className="doc-pdf-size">({formatBytes(doc.pdfTamano)})</span>
                      )}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="alta-actions-cell">
                      <button
                        className="alta-btn-icon-edit"
                        onClick={() => onEdit(doc)}
                        title="Editar registro"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button
                        className="alta-btn-icon-delete"
                        onClick={() => onDelete(doc.id)}
                        title="Eliminar registro"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
