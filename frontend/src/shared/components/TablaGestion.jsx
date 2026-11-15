import MensajeVacio from './MensajeVacio'
import './TablaGestion.css'

function TablaGestion({ titulo, columnas, filas, claveDeFila, total, unidad, vacio, acciones }) {
  const accionesDe = typeof acciones === 'function' ? acciones : () => acciones

  return (
    <div className="d-flex flex-column gap-3">
      <p className="small mb-0" aria-live="polite">
        Mostrando {filas.length} de {total} {unidad}
      </p>

      {filas.length === 0 ? (
        <MensajeVacio texto={vacio} />
      ) : (
        <div className="table-responsive">
          <table className="table tabla-apilada tabla-gestion">
            <caption className="visually-hidden">{titulo}</caption>
            <thead>
              <tr>
                {columnas.map((columna) => (
                  <th key={columna.clave} scope="col">
                    {columna.encabezado}
                  </th>
                ))}
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((fila) => (
                <tr key={claveDeFila(fila)}>
                  {columnas.map((columna, posicion) =>
                    posicion === 0 ? (
                      <th key={columna.clave} scope="row" data-label={columna.encabezado}>
                        {columna.celda(fila)}
                      </th>
                    ) : (
                      <td key={columna.clave} data-label={columna.encabezado}>
                        {columna.celda(fila)}
                      </td>
                    ),
                  )}
                  <td data-label="Acciones">
                    <div className="d-flex flex-wrap gap-2">
                      {accionesDe(fila).map((accion) => (
                        <button
                          key={accion.texto}
                          type="button"
                          className={`btn btn-sm btn-outline-${accion.variante}`}
                          disabled={!accion.onClick || accion.deshabilitada}
                          onClick={() => accion.onClick(fila)}
                        >
                          {accion.texto}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default TablaGestion
