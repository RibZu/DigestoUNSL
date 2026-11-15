import { useState } from 'react'
import MensajeVacio from '../../../shared/components/MensajeVacio'
import { contieneTexto } from '../../../shared/utils/listas.js'

const MODULOS = [
  { clave: 'documentos', etiqueta: 'Documentos' },
  { clave: 'concursos', etiqueta: 'Concursos' },
]

function ListaPermisos({ dependencias, permisos, deshabilitada, error, onCambiar }) {
  const [filtro, setFiltro] = useState('')
  const visibles = dependencias.filter((dependencia) =>
    contieneTexto([dependencia.sigla, dependencia.nombre], filtro),
  )

  function tienePermiso(dependencia, modulo) {
    return permisos.some(
      (permiso) => permiso.id_dependencia === dependencia.id && permiso.modulo === modulo,
    )
  }

  function handleFiltro(e) {
    setFiltro(e.target.value)
  }

  return (
    <fieldset className="formulario-bloque" disabled={deshabilitada}>
      <legend className="h5">Permisos por dependencia</legend>

      <label htmlFor="filtro-permisos" className="form-label">
        Filtrar dependencias
      </label>
      <input
        id="filtro-permisos"
        name="permisos"
        type="search"
        className={`form-control${error ? ' is-invalid' : ''}`}
        placeholder="Sigla o nombre de la dependencia"
        value={filtro}
        onChange={handleFiltro}
      />
      {error && <div className="invalid-feedback">{error}</div>}

      <p className="small my-2" aria-live="polite">
        {deshabilitada
          ? 'Un administrador accede a todos los módulos de todas las dependencias.'
          : `Permisos seleccionados: ${permisos.length}`}
      </p>

      {visibles.length === 0 ? (
        <MensajeVacio texto="No hay dependencias con ese filtro." />
      ) : (
        <table className="table tabla-apilada">
          <caption className="visually-hidden">Permisos por dependencia</caption>
          <thead>
            <tr>
              <th scope="col">Dependencia</th>
              {MODULOS.map((modulo) => (
                <th key={modulo.clave} scope="col">
                  {modulo.etiqueta}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibles.map((dependencia) => (
              <tr key={dependencia.id}>
                <th scope="row" data-label="Dependencia">
                  {dependencia.sigla} · {dependencia.nombre}
                </th>
                {MODULOS.map((modulo) => (
                  <td key={modulo.clave} data-label={modulo.etiqueta}>
                    <div className="form-check form-switch">
                      <input
                        id={`permiso-${dependencia.id}-${modulo.clave}`}
                        type="checkbox"
                        role="switch"
                        className="form-check-input"
                        aria-label={`${modulo.etiqueta} de ${dependencia.sigla}`}
                        checked={tienePermiso(dependencia, modulo.clave)}
                        onChange={() => onCambiar(dependencia.id, modulo.clave)}
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </fieldset>
  )
}

export default ListaPermisos
