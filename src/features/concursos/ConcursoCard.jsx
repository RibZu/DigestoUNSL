function formatearFecha(iso) {
    return new Date(`${iso}T00:00:00`).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
    })
}

export default function ConcursoCard({ concurso }) {
    return (
        <article className="concurso-card">
            <header className="concurso-card__encabezado">
                <h3 className="concurso-card__cargo">{concurso.cargo}</h3>
                <span className="concurso-card__caracter badge">{concurso.caracter}</span>
            </header>

            <dl className="concurso-card__detalle">
                <div>
                    <dt>Departamento</dt>
                    <dd>{concurso.departamento}</dd>
                </div>
                <div>
                    <dt>Área</dt>
                    <dd>{concurso.area}</dd>
                </div>
                <div>
                    <dt>Dedicación</dt>
                    <dd>{concurso.dedicacion}</dd>
                </div>
                <div>
                    <dt>Inscripción</dt>
                    <dd>
                        {formatearFecha(concurso.inscripcionDesde)} al{' '}
                        {formatearFecha(concurso.inscripcionHasta)}
                    </dd>
                </div>
            </dl>

            <a
                className="concurso-card__resolucion btn btn-sm"
                href={concurso.resolucionUrl}
                target="_blank"
                rel="noreferrer"
            >
                Ver resolución {concurso.resolucion}
            </a>
        </article>
    )
}
