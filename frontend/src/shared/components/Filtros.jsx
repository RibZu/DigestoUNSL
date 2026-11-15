import { useState } from 'react'
import { tieneValores } from '../utils/listas.js'
import './Filtros.css'

function Filtros({ id, placeholder, selects, vacio, aplicado, onAplicar }) {
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
    <search className="barra-filtros">
      <form className="row g-2 align-items-stretch" onSubmit={handleSubmit}>
        <div className="col-12 col-md">
          <div className="form-floating">
            <input
              type="search"
              id={`${id}-texto`}
              name="texto"
              className="form-control"
              placeholder={placeholder}
              value={valores.texto}
              onChange={handleChange}
            />
            <label htmlFor={`${id}-texto`}>{placeholder}</label>
          </div>
        </div>

        {selects.map((select) => (
          <div key={select.name} className="col-12 col-md">
            <div className="form-floating">
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
              <label htmlFor={`${id}-${select.name}`}>{select.etiqueta}</label>
            </div>
          </div>
        ))}

        <div className="col-12 col-md-auto d-flex gap-2">
          <button type="submit" className="btn btn-primary barra-filtros__boton">
            Buscar
          </button>
          {tieneValores(aplicado) && (
            <button
              type="button"
              className="btn btn-outline-primary barra-filtros__boton"
              onClick={handleLimpiar}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </form>
    </search>
  )
}

export default Filtros
