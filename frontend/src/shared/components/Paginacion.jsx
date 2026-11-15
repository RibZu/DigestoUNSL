function Paginacion({ pagina, total, limite, onCambiar }) {
  const totalPaginas = Math.max(1, Math.ceil(total / limite))

  if (totalPaginas === 1) return null

  const esPrimera = pagina <= 1
  const esUltima = pagina >= totalPaginas

  return (
    <nav aria-label="Páginas de resultados">
      <ul className="pagination justify-content-center flex-wrap mb-0">
        <li className={`page-item${esPrimera ? ' disabled' : ''}`}>
          <button type="button" className="page-link" disabled={esPrimera} onClick={() => onCambiar(1)}>
            Primera
          </button>
        </li>
        <li className={`page-item${esPrimera ? ' disabled' : ''}`}>
          <button
            type="button"
            className="page-link"
            disabled={esPrimera}
            onClick={() => onCambiar(pagina - 1)}
          >
            Anterior
          </button>
        </li>
        <li className="page-item active" aria-current="page">
          <span className="page-link">
            Página {pagina.toLocaleString('es-AR')} de {totalPaginas.toLocaleString('es-AR')}
          </span>
        </li>
        <li className={`page-item${esUltima ? ' disabled' : ''}`}>
          <button
            type="button"
            className="page-link"
            disabled={esUltima}
            onClick={() => onCambiar(pagina + 1)}
          >
            Siguiente
          </button>
        </li>
        <li className={`page-item${esUltima ? ' disabled' : ''}`}>
          <button
            type="button"
            className="page-link"
            disabled={esUltima}
            onClick={() => onCambiar(totalPaginas)}
          >
            Última
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Paginacion
