import './Desplegable.css'

export default function Desplegable({
    id,
    titulo,
    resumen,
    abierto,
    onAlternar,
    nivel = 2,
    children,
}) {
    const Encabezado = `h${nivel}`

    return (
        <section className="desplegable">
            <Encabezado className="desplegable__titulo">
                <button
                    type="button"
                    className="desplegable__boton"
                    aria-expanded={abierto}
                    aria-controls={id}
                    onClick={onAlternar}
                >
                    <svg
                        className="desplegable__chevron"
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                    <span className="desplegable__nombre">{titulo}</span>
                    {resumen && <span className="desplegable__resumen">{resumen}</span>}
                </button>
            </Encabezado>
            <div id={id} className="desplegable__contenido" hidden={!abierto}>
                {children}
            </div>
        </section>
    )
}
