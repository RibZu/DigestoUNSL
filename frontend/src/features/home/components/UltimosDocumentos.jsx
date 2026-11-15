import { Link } from 'react-router'
import MensajeVacio from '../../../shared/components/MensajeVacio'
import { formatearFecha } from '../../../shared/utils/formato.js'
import './UltimosDocumentos.css'

function UltimosDocumentos({ documentos }) {
  return (
    <section className="container-xl ultimos-documentos" aria-labelledby="ultimos-documentos-titulo">
      <h2 id="ultimos-documentos-titulo" className="ultimos-documentos__titulo">
        Últimos documentos subidos
      </h2>

      {documentos.length === 0 ? (
        <MensajeVacio texto="Todavía no hay documentos cargados." />
      ) : (
        <ul className="ultimos-documentos__lista">
          {documentos.map((documento) => (
            <li key={documento.id}>
              <Link to={`/normativas/${documento.id}`} className="ultimo-documento">
                <span className="ultimo-documento__codigo">{documento.codigo}</span>
                <span className="ultimo-documento__meta">
                  {documento.tipo_nombre} · {documento.dependencia_emisora_sigla} ·{' '}
                  {formatearFecha(documento.fecha_emision)}
                </span>
                <span className="ultimo-documento__descripcion">
                  {documento.descripcion || 'Sin descripción'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default UltimosDocumentos
