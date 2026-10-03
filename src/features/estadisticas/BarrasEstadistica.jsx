function formatearPorcentaje(valor) {
  if (valor > 0 && valor < 0.1) return '<0,1'
  return valor.toLocaleString('es-AR', { maximumFractionDigits: 1 })
}

export default function BarrasEstadistica({ filas, unidad = '', ordenada = false }) {
  const Lista = ordenada ? 'ol' : 'ul'

  return (
    <Lista className="barras">
      {filas.map((fila) => (
        <li key={fila.clave} className="barras__fila">
          <div className="barras__encabezado">
            <span className="barras__etiqueta">
              {fila.etiqueta}
              {fila.detalle && <span className="barras__detalle">{fila.detalle}</span>}
            </span>
            <span className="barras__valor">
              {fila.cantidad === null ? (
                'sin datos'
              ) : (
                <>
                  {fila.cantidad.toLocaleString('es-AR')}
                  {unidad && ` ${unidad}`}
                  {typeof fila.porcentaje === 'number' && (
                    <span className="barras__porcentaje">
                      {' '}
                      ({formatearPorcentaje(fila.porcentaje)}%)
                    </span>
                  )}
                </>
              )}
            </span>
          </div>
          {fila.cantidad !== null && (
            <div className="barras__pista" aria-hidden="true">
              <div className="barras__relleno" style={{ width: `${fila.ancho}%` }} />
            </div>
          )}
        </li>
      ))}
    </Lista>
  )
}
