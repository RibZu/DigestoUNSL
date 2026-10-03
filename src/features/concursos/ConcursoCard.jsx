const SIN_DATO = '—'

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
            </dl>

            <button
                type="button"
                className="concurso-card__resolucion btn btn-sm"
                onClick={handleVerResolucion}
            >
                Ver resolución {concurso.resolucion}
            </button>
        </article>
    )
}
