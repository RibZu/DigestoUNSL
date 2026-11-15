import { useNavigate, useParams } from 'react-router'
import EncabezadoPagina from '../../../shared/layout/EncabezadoPagina'
import BotonPdf from '../../../shared/components/BotonPdf'
import MensajeVacio from '../../../shared/components/MensajeVacio'
import Spinner from '../../../shared/components/Spinner'
import { useFetch } from '../../../shared/hooks/useFetch'
import { formatearFecha, SIN_DATO } from '../../../shared/utils/formato.js'
import { enlaceDelArchivo, obtenerDocumento } from '../services/normativasService'
import './NormativaPage.css'

function NormativaPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { datos: doc, cargando, error } = useFetch(obtenerDocumento, id)
  const enlace = doc ? enlaceDelArchivo(doc) : null

  return (
    <>
      <EncabezadoPagina titulo={doc ? doc.codigo : 'Documento'}>
        {doc && (
          <div className="normativa-header-meta">
            <span className="normativa-code-badge">{doc.tipo_nombre ?? SIN_DATO}</span>
            <span className="normativa-date-location">{doc.dependencia_emisora_nombre}</span>
          </div>
        )}
      </EncabezadoPagina>

      <section className="container-xl normativa-detalle">
        <div className="normativa-detalle__acciones">
          <button
            type="button"
            className="btn btn-outline-primary normativa-detalle__volver"
            onClick={() => navigate(-1)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Volver
          </button>
          {enlace && <BotonPdf enlace={enlace} codigo={doc.codigo} />}
        </div>

        {cargando && <Spinner texto="Cargando documento..." />}

        {error && <MensajeVacio texto={error.message} />}

        {doc && (
          <article className="ficha-documento" aria-labelledby="ficha-descripcion-titulo">
            <header className="ficha-documento__cabecera">
              <div>
                <p className="ficha-documento__tipo">{doc.tipo_nombre ?? SIN_DATO}</p>
                <p className="ficha-documento__codigo">{doc.codigo}</p>
              </div>
              <p className="ficha-documento__fecha">
                Emitida el {formatearFecha(doc.fecha_emision)}
              </p>
            </header>

            <section className="ficha-documento__seccion">
              <h2 id="ficha-descripcion-titulo">Descripción</h2>
              <p className="ficha-documento__descripcion">{doc.descripcion || SIN_DATO}</p>
            </section>

            <div className="ficha-documento__seccion ficha-documento__datos">
              <section aria-labelledby="ficha-identificacion-titulo">
                <h2 id="ficha-identificacion-titulo">Identificación</h2>
                <dl className="ficha-documento__lista">
                  <div>
                    <dt>Tipo</dt>
                    <dd>{doc.tipo_nombre ?? SIN_DATO}</dd>
                  </div>
                  <div>
                    <dt>Número y año</dt>
                    <dd>
                      {doc.numero}/{doc.anio}
                    </dd>
                  </div>
                  <div>
                    <dt>Fecha de emisión</dt>
                    <dd>{formatearFecha(doc.fecha_emision)}</dd>
                  </div>
                  <div>
                    <dt>Fecha de registro</dt>
                    <dd>{formatearFecha(doc.fecha_registro?.slice(0, 10))}</dd>
                  </div>
                </dl>
              </section>

              <section aria-labelledby="ficha-origen-titulo">
                <h2 id="ficha-origen-titulo">Origen</h2>
                <dl className="ficha-documento__lista">
                  <div>
                    <dt>Órgano emisor</dt>
                    <dd>{doc.organo_nombre ?? SIN_DATO}</dd>
                  </div>
                  <div>
                    <dt>Dependencia de origen</dt>
                    <dd>{doc.dependencia_origen_nombre ?? SIN_DATO}</dd>
                  </div>
                  <div>
                    <dt>Dependencia emisora</dt>
                    <dd>{doc.dependencia_emisora_nombre ?? SIN_DATO}</dd>
                  </div>
                </dl>
              </section>
            </div>

            {doc.llamados?.length > 0 && (
              <section className="ficha-documento__seccion" aria-labelledby="ficha-llamados-titulo">
                <h2 id="ficha-llamados-titulo">Llamados a concurso</h2>
                <ol className="ficha-documento__llamados">
                  {doc.llamados.map((llamado) => (
                    <li key={llamado.id}>
                      <strong>{llamado.cargo}</strong>
                      <span className="ficha-documento__secundario">
                        {llamado.dedicacion ?? SIN_DATO} · {llamado.caracter}
                      </span>
                      <span>
                        {llamado.departamento_nombre} — {llamado.area_nombre}
                      </span>
                      <span className="ficha-documento__secundario">
                        Inscripción del {formatearFecha(llamado.inscripcion_desde?.slice(0, 10))} al{' '}
                        {formatearFecha(llamado.inscripcion_hasta?.slice(0, 10))}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </article>
        )}
      </section>
    </>
  )
}

export default NormativaPage
