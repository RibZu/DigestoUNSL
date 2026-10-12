import { formatearFecha, SIN_DATO } from '../../shared/utils/formato.js'

export default function ConcursoCard({ concurso }) {
    function handleVerResolucion() {
        console.log(concurso.resolucion)
    }

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

            <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={handleVerResolucion}
            >
                Ver resolución {concurso.resolucion}
            </button>
        </article>
    )
}
