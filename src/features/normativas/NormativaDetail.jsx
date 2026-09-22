import { useParams, useNavigate } from 'react-router'
import './NormativaDetail.css'

export default function NormativaDetail({ data }) {
  const { id } = useParams()
  const navigate = useNavigate()

  // Datos adaptados de la estructura del Digesto real de la UNSL
  const doc = data || {
    id: id || 'rcd-3-002-26',
    codigo: 'RCD-3-002/26',
    lugarFecha: 'SAN LUIS, 12 de marzo de 2026',
    expediente: 'Expte. F-3-0905/26',
    area: 'ÁREA IV — PROGRAMACIÓN Y METODOLOGÍA DEL DESARROLLO DE SOFTWARE',
    titulo:
      'Designación de la Srta. María Elena GÓMEZ en UN (1) cargo de AUXILIAR DE SEGUNDA CATEGORÍA ALUMNO, dedicación SIMPLE, carácter INTERINO.',
    visto:
      'El Expte. F-3-0905/26 referente a la Inscripción de Aspirantes a UN (1) cargo de AUXILIAR DE SEGUNDA CATEGORÍA ALUMNO, dedicación SIMPLE, carácter INTERINO para el Área IV "Programación y Metodología del Desarrollo de Software"; y',
    considerando: [
      'Que la Comisión Asesora, designada por Res. 736/25-D, en base a la evaluación y clase de oposición de los postulantes, propone un orden de mérito y la designación de la Srta. María Elena GÓMEZ en el cargo motivo del llamado.',
      'Que la Comisión de Asuntos Académicos aconseja aprobar lo actuado por la Comisión Asesora.',
      'Que el Departamento de Personal de la Facultad certifica la existencia y disponibilidad del correspondiente crédito presupuestario.',
    ],
    resolvingBody:
      'Por ello, en su sesión del día 28 de febrero de 2026 y en uso de sus atribuciones, EL CONSEJO DIRECTIVO DE LA FACULTAD DE CIENCIAS FÍSICO-MATEMÁTICAS Y NATURALES RESUELVE:',
    ordenMerito: [
      '1° María Elena GÓMEZ (D.N.I. N° 42.116.158)',
      '2° Ana Laura MARTÍNEZ (D.N.I. N° 41.520.304)',
      '3° Lucas Gabriel ROLANDI (D.N.I. N° 43.001.928)',
    ],
    articulos: [
      {
        numero: 'ARTÍCULO 1°.-',
        contenido:
          'Aprobar el Orden de Mérito propuesto por la Comisión Asesora que intervino en el presente llamado a Inscripción de Aspirantes.',
      },
      {
        numero: 'ARTÍCULO 2°.-',
        contenido:
          'Designar a la Srta. María Elena GÓMEZ (D.N.I. N° 42.116.158), en UN (1) cargo de AUXILIAR DE SEGUNDA CATEGORÍA ALUMNO, dedicación SIMPLE, carácter INTERINO, con funciones en el Área IV "Programación y Metodología del Desarrollo de Software" del Departamento de Informática de esta Facultad; a partir del 01 de marzo de 2026 y no más allá del 31 de marzo de 2027, inclusive.',
      },
      {
        numero: 'ARTÍCULO 3°.-',
        contenido:
          'El gasto que demande la designación precedente deberá ser imputado al presupuesto ordinario de acuerdo al siguiente detalle:',
        imputacion: [
          { label: 'FINALIDAD', value: '3 - SERVICIOS SOCIALES' },
          { label: 'PROGRAMA', value: '731 - EDUCACIÓN UNIVERSITARIA' },
          { label: 'INCISO', value: '1 - GASTO EN PERSONAL' },
          { label: 'PARTIDA', value: '11 - PERSONAL PERMANENTE' },
          { label: 'APARTADO', value: '08 - FACULTAD DE CS. FCO.-MATEM. Y NAT.' },
        ],
      },
      {
        numero: 'ARTÍCULO 4°.-',
        contenido: 'Comuníquese, insértese en el Libro de Resoluciones y archívese.',
      },
    ],
    numeroResolucion: 'RESOLUCIÓN N° 00202/26',
    iniciales: 'meg',
    docOriginalUrl: '#',
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Enlace al documento copiado al portapapeles.')
  }

  return (
    <div className="normativa-detail-page">
      {/* Botón Volver */}
      <button onClick={() => navigate(-1)} className="normativa-back-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Volver a los resultados
      </button>

      {/* Tarjeta del Documento */}
      <article className="normativa-document-card">
        {/* Cabecera Superior */}
        <header className="normativa-top-header">
          <div className="normativa-header-meta">
            <span className="normativa-code-badge">{doc.codigo}</span>
            <span className="normativa-date-location">{doc.lugarFecha}</span>
          </div>

          <h1 className="normativa-main-title">{doc.titulo}</h1>
        </header>

        {/* Barra de Herramientas */}
        <div className="normativa-toolbar">
          <span className="normativa-expte-ref">{doc.expediente}</span>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button type="button" className="normativa-toolbar-btn" onClick={handleCopyLink}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              Copiar Enlace
            </button>
            <a
              href={doc.docOriginalUrl}
              className="normativa-toolbar-btn primary"
              onClick={(e) => {
                e.preventDefault()
                alert(`Descargando PDF oficial de ${doc.codigo}`)
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Descargar PDF
            </a>
          </div>
        </div>

        {/* Cuerpo del Documento Legal */}
        <section className="normativa-legal-body">
          {/* VISTO */}
          <div className="normativa-legal-section">
            <span className="normativa-section-heading">VISTO:</span>
            <p style={{ margin: 0 }}>{doc.visto}</p>
          </div>

          {/* CONSIDERANDO */}
          <div className="normativa-legal-section">
            <span className="normativa-section-heading">CONSIDERANDO:</span>
            {doc.considerando.map((item, idx) => (
              <p key={idx} style={{ margin: '0 0 0.5rem 0' }}>
                {item}
              </p>
            ))}
          </div>

          {/* Fórmula Resolutiva */}
          <div className="normativa-resolving-intro">{doc.resolvingBody}</div>

          {/* Orden de mérito en artículo 1 */}
          <div className="normativa-article-card">
            <span className="normativa-article-heading">{doc.articulos[0].numero}</span>
            <p style={{ margin: 0 }}>{doc.articulos[0].contenido}</p>

            <ul className="normativa-order-list">
              {doc.ordenMerito.map((merito, idx) => (
                <li key={idx}>{merito}</li>
              ))}
            </ul>
          </div>

          {/* Artículo 2 */}
          <div className="normativa-article-card">
            <span className="normativa-article-heading">{doc.articulos[1].numero}</span>
            <p style={{ margin: 0 }}>{doc.articulos[1].contenido}</p>
          </div>

          {/* Artículo 3 con Tabla Presupuestaria */}
          <div className="normativa-article-card">
            <span className="normativa-article-heading">{doc.articulos[2].numero}</span>
            <p style={{ margin: 0 }}>{doc.articulos[2].contenido}</p>

            {doc.articulos[2].imputacion && (
              <table className="normativa-budget-table">
                <tbody>
                  {doc.articulos[2].imputacion.map((row, idx) => (
                    <tr key={idx}>
                      <td className="label">{row.label}</td>
                      <td>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Artículo 4 */}
          <div className="normativa-article-card">
            <span className="normativa-article-heading">{doc.articulos[3].numero}</span>
            <p style={{ margin: 0 }}>{doc.articulos[3].contenido}</p>
          </div>
        </section>

        {/* Cierre Oficial del Documento */}
        <footer className="normativa-official-footer">
          <span className="normativa-resolution-number">{doc.numeroResolucion}</span>
          <span className="normativa-initials">{doc.iniciales}</span>
        </footer>
      </article>
    </div>
  )
}
