import { enlaceDelArchivo } from '../../normativas'
import { formatearFecha, SIN_DATO } from '../../../shared/utils/formato.js'

function ConcursoCard({ concurso }) {
  const urlResolucion = enlaceDelArchivo({
    id: concurso.id_documento,
    tiene_archivo: concurso.tiene_archivo,
    url_externa: concurso.url_externa,
  })

  return (
    <article className="concurso-card">
      <h3 className="concurso-card__cargo">{concurso.cargo}</h3>

      <dl className="concurso-card__detalle">
        <div>
          <dt>Departamento</dt>
          <dd>{concurso.departamento || SIN_DATO}</dd>
        </div>
        <div>
          <dt>Área</dt>
          <dd>{concurso.area || SIN_DATO}</dd>
        </div>
        <div>
          <dt>Dedicación</dt>
          <dd>{concurso.dedicacion || SIN_DATO}</dd>
        </div>
        <div>
          <dt>Carácter</dt>
          <dd>{concurso.caracter || SIN_DATO}</dd>
        </div>
        <div>
          <dt>Inscripción desde</dt>
          <dd>{formatearFecha(concurso.inscripcionDesde)}</dd>
        </div>
        <div>
          <dt>Inscripción hasta</dt>
          <dd>{formatearFecha(concurso.inscripcionHasta)}</dd>
        </div>
      </dl>

      {urlResolucion ? (
        <a
          className="btn btn-sm btn-primary"
          href={urlResolucion}
          target="_blank"
          rel="noreferrer"
        >
          Ver resolución {concurso.resolucion}
        </a>
      ) : (
        <button type="button" className="btn btn-sm btn-primary" disabled>
          Ver resolución {concurso.resolucion}
        </button>
      )}
    </article>
  )
}

export default ConcursoCard
