import { useState } from 'react'
import { tieneValores } from '../utils/listas.js'

export default function Filtros({ id, placeholder, selects, vacio, aplicado, onAplicar }) {
    const [valores, setValores] = useState(aplicado)

    function handleChange(e) {
        setValores({ ...valores, [e.target.name]: e.target.value })
    }

    function handleSubmit(e) {
        e.preventDefault()
        onAplicar(valores)
    }

    function handleLimpiar() {
        setValores(vacio)
        onAplicar(vacio)
    }

    return (
        <search>
            <form className="row g-3 align-items-end" onSubmit={handleSubmit}>
                <div className="col-12 col-md">
                    <label htmlFor={`${id}-texto`} className="form-label">
                        Buscar
                    </label>
                    <input
                        type="search"
                        id={`${id}-texto`}
                        name="texto"
                        className="form-control"
                        placeholder={placeholder}
                        value={valores.texto}
                        onChange={handleChange}
                    />
                </div>

                {selects.map((select) => (
                    <div key={select.name} className="col-12 col-md">
                        <label htmlFor={`${id}-${select.name}`} className="form-label">
                            {select.etiqueta}
                        </label>
                        <select
                            id={`${id}-${select.name}`}
                            name={select.name}
                            className="form-select"
                            value={valores[select.name]}
                            onChange={handleChange}
                        >
                            <option value="">{select.todas}</option>
                            {select.opciones.map((opcion) => (
                                <option key={opcion.valor} value={opcion.valor}>
                                    {opcion.texto}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}

                <div className="col-12 col-md-auto d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                        Buscar
                    </button>
                    {tieneValores(aplicado) && (
                        <button type="button" className="btn btn-outline-primary" onClick={handleLimpiar}>
                            Limpiar filtros
                        </button>
                    )}
                </div>
            </form>
        </search>
    )
}
