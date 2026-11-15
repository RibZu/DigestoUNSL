import './BarraGestion.css'

function BarraGestion({ vista, textoAlta, onVerLista, onVerFormulario }) {
  const enLista = vista === 'lista'

  return (
    <nav className="barra-gestion" aria-label="Acciones de la gestión">
      <button
        type="button"
        className={`btn btn-lg ${enLista ? 'btn-primary' : 'btn-outline-primary'}`}
        aria-current={enLista ? 'page' : undefined}
        onClick={onVerLista}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
        Panel de gestión
      </button>
      <button
        type="button"
        className={`btn btn-lg ${enLista ? 'btn-outline-primary' : 'btn-primary'}`}
        aria-current={enLista ? undefined : 'page'}
        onClick={onVerFormulario}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        {textoAlta}
      </button>
    </nav>
  )
}

export default BarraGestion
