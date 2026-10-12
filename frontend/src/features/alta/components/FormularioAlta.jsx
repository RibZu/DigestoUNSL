import { useState, useEffect } from 'react'

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

export default function FormularioAlta({ documentoEditar, onGuardar, onCancelar, triggerToast }) {
  const [formData, setFormData] = useState({
    tipo: '',
    origen: '',
    organo: '',
    descripcion: '',
  })
  const [file, setFile] = useState(null)
  const [currentDate, setCurrentDate] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)

  // Cargar datos en caso de edición
  useEffect(() => {
    if (documentoEditar) {
      setFormData({
        tipo: documentoEditar.tipo || '',
        origen: documentoEditar.origen || '',
        organo: documentoEditar.organo || '',
        descripcion: documentoEditar.descripcion || '',
      })
      setFile(null)
    } else {
      setFormData({
        tipo: '',
        origen: '',
        organo: '',
        descripcion: '',
      })
      setFile(null)
    }
  }, [documentoEditar])

  // Actualizar fecha dinámicamente
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const formatted = now.toLocaleString('es-AR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      setCurrentDate(formatted)
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return
    if (selectedFile.type !== 'application/pdf') {
      triggerToast('Por favor suba un archivo válido en formato PDF.', true)
      return
    }
    setFile(selectedFile)
  }

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    validateAndSetFile(selected)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const removeFile = () => {
    setFile(null)
  }

  const formatBytes = (bytes) => {
    if (!bytes) return ''
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!documentoEditar && !file) {
      triggerToast('Debe adjuntar un archivo PDF obligatoriamente.', true)
      return
    }

    const docResult = {
      id: documentoEditar ? documentoEditar.id : Date.now(),
      fecha: documentoEditar ? documentoEditar.fecha : currentDate,
      tipo: formData.tipo,
      origen: formData.origen,
      organo: formData.organo,
      descripcion: formData.descripcion,
      pdfNombre: file ? file.name : (documentoEditar ? documentoEditar.pdfNombre : ''),
      pdfTamano: file ? file.size : (documentoEditar ? documentoEditar.pdfTamano : null),
    }

    onGuardar(docResult)
  }

  const handleReset = () => {
    setFormData({
      tipo: '',
      origen: '',
      organo: '',
      descripcion: '',
    })
    setFile(null)
    onCancelar()
  }

  return (
    <div className="alta-card">
      <div className="alta-form-header">
        <h2>{documentoEditar ? 'Modificar Documento' : 'Registrar Nuevo Documento'}</h2>
        {documentoEditar && (
          <span className="editing-notice">
            Modificando el registro. Deje el archivo PDF sin cambios si no requiere reemplazarlo.
          </span>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="alta-grid">
          {/* Campo PDF Drag & Drop */}
          <div className="alta-form-group alta-full-width">
            <label>
              Documento PDF {documentoEditar ? '(Opcional al editar)' : <span className="alta-required">*</span>}
            </label>

            <div
              className={`alta-dropzone ${isDragOver ? 'drag-over' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="alta-file-input"
                required={!documentoEditar && !file}
              />
              <div className="alta-dropzone-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              <div className="alta-dropzone-text">
                <p>Arrastre y suelte un nuevo archivo PDF aquí o <strong>haga clic para seleccionar</strong></p>
                <span>Solo archivos en formato .PDF</span>
              </div>
            </div>

            {file && (
              <div className="alta-file-preview">
                <div className="alta-file-info">
                  <span className="alta-pdf-badge">PDF</span>
                  <div className="alta-file-details">
                    <span className="alta-file-name">{file.name}</span>
                    <span className="alta-file-size">{formatBytes(file.size)}</span>
                  </div>
                </div>
                <button type="button" className="alta-btn-remove" onClick={removeFile} title="Eliminar archivo seleccionado">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Tipo de Documento */}
          <div className="alta-form-group">
            <label htmlFor="tipo">
              Tipo de Documento <span className="alta-required">*</span>
            </label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
              className="alta-select"
              required
            >
              <option value="" disabled>Seleccione un tipo...</option>
              {TIPOS_DOCUMENTO.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Origen del Trámite */}
          <div className="alta-form-group">
            <label htmlFor="origen">
              Origen del Trámite <span className="alta-required">*</span>
            </label>
            <select
              id="origen"
              name="origen"
              value={formData.origen}
              onChange={handleInputChange}
              className="alta-select"
              required
            >
              <option value="" disabled>Seleccione el origen...</option>
              {ORIGENES_TRAMITE.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          {/* Órgano Emisor */}
          <div className="alta-form-group alta-full-width">
            <label htmlFor="organo">
              Órgano Emisor <span className="alta-required">*</span>
            </label>
            <select
              id="organo"
              name="organo"
              value={formData.organo}
              onChange={handleInputChange}
              className="alta-select"
              required
            >
              <option value="" disabled>Seleccione el órgano emisor...</option>
              {ORGANOS_EMISORES.map((org) => (
                <option key={org} value={org}>{org}</option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div className="alta-form-group">
            <label>Fecha y Hora {documentoEditar ? 'del Registro' : 'de Registro'}</label>
            <div className="alta-date-box">
              <svg className="alta-date-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{documentoEditar ? documentoEditar.fecha : (currentDate || 'Cargando fecha...')}</span>
            </div>
          </div>

          {/* Descripción */}
          <div className="alta-form-group alta-full-width">
            <label htmlFor="descripcion">
              Descripción / Resumen <span className="alta-required">*</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Ingrese una descripción o resumen del documento..."
              className="alta-textarea"
              required
            />
          </div>
        </div>

        <div className="alta-actions">
          <button type="button" className="alta-btn alta-btn-secondary" onClick={handleReset}>
            {documentoEditar ? 'Cancelar' : 'Limpiar Campos'}
          </button>
          <button type="submit" className="alta-btn alta-btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {documentoEditar ? (
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              ) : (
                <>
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </>
              )}
            </svg>
            {documentoEditar ? 'Guardar Cambios' : 'Registrar Documento'}
          </button>
        </div>
      </form>
    </div>
  )
}
