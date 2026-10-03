import './BarrasEstadistica.css'

function calcularAncho(cantidad, maximo) {
  return maximo === 0 ? 0 : (cantidad / maximo) * 100
}

function elegirUnidad(cantidad, unidad, unidadSingular) {
  return cantidad === 1 && unidadSingular ? unidadSingular : unidad
}

export default function BarrasEstadistica({ filas, maximo, unidad = '', unidadSingular = '' }) {
  return (
    <ol className="barras">
      {filas.map((fila) => (
        <li key={fila.clave} className="barras__fila">
          <div className="barras__encabezado">
            <span className="barras__etiqueta">{fila.etiqueta}</span>
            <span className="barras__valor">
              {fila.cantidad.toLocaleString('es-AR')}
              {unidad && ` ${elegirUnidad(fila.cantidad, unidad, unidadSingular)}`}
            </span>
          </div>
          <div className="barras__pista" aria-hidden="true">
            {fila.cantidad > 0 && (
              <div
                className="barras__relleno"
                style={{ width: `${calcularAncho(fila.cantidad, maximo)}%` }}
              />
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}
