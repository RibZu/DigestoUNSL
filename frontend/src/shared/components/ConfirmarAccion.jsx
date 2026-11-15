function ConfirmarAccion({
  texto,
  textoConfirmar,
  variante = 'danger',
  enviando = false,
  onConfirmar,
  onCancelar,
}) {
  return (
    <div className="alert alert-warning d-flex flex-wrap align-items-center gap-3 mb-0" role="alert">
      <span className="flex-grow-1">{texto}</span>
      <div className="d-flex gap-2">
        <button
          type="button"
          className="btn btn-outline-primary"
          disabled={enviando}
          onClick={onCancelar}
        >
          Cancelar
        </button>
        <button
          type="button"
          className={`btn btn-${variante}`}
          disabled={enviando}
          onClick={onConfirmar}
        >
          {enviando ? 'Guardando...' : textoConfirmar}
        </button>
      </div>
    </div>
  )
}

export default ConfirmarAccion
