import './BarrasEstadistica.css'

function BarrasEstadistica({ filas, ordenada = false }) {
  const Lista = ordenada ? 'ol' : 'ul'

  return (
    <Lista className={`barras${ordenada ? ' barras--ordenada' : ''}`}>
      {filas.map((fila) => (
        <li key={fila.clave} className="barras__fila">
          <div className="barras__encabezado">
            <span className="barras__etiqueta">
              {fila.etiqueta}
              {fila.detalle && <span className="barras__detalle">{fila.detalle}</span>}
            </span>
            <span className="barras__valor">{fila.texto}</span>
          </div>
          {fila.ancho > 0 && (
            <div className="barras__pista" aria-hidden="true">
              <div className="barras__relleno" style={{ width: `${fila.ancho}%` }} />
            </div>
          )}
        </li>
      ))}
    </Lista>
  )
}

export default BarrasEstadistica
