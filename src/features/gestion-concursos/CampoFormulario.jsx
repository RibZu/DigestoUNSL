export default function CampoFormulario({
    nombre,
    etiqueta,
    tipo = 'text',
    opciones,
    columnas = 'col-md-6',
    error,
    ...propiedades
}) {
    const claseDeError = error ? ' is-invalid' : ''

    return (
        <div className={columnas}>
            <label htmlFor={nombre} className="form-label">
                {etiqueta}
            </label>
            {tipo === 'select' ? (
                <select id={nombre} name={nombre} className={`form-select${claseDeError}`} {...propiedades}>
                    <option value="">Elegí…</option>
                    {opciones.map((opcion) => (
                        <option key={opcion.valor} value={opcion.valor}>
                            {opcion.texto}
                        </option>
                    ))}
                </select>
            ) : tipo === 'textarea' ? (
                <textarea
                    id={nombre}
                    name={nombre}
                    rows="3"
                    className={`form-control${claseDeError}`}
                    {...propiedades}
                />
            ) : (
                <input
                    id={nombre}
                    name={nombre}
                    type={tipo}
                    className={`form-control${claseDeError}`}
                    {...propiedades}
                />
            )}
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    )
}
