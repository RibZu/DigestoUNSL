export default function CarreraItem({ carrera }) {
    return (
        <li className="carrera-item">
            <h3 className="carrera-item__nombre">{carrera.nombre}</h3>
            <ul className="carrera-item__planes" aria-label={`Planes de ${carrera.nombre}`}>
                {carrera.planes.map((plan) => (
                    <li key={plan.url}>
                        <a
                            className={`carrera-item__ordenanza btn btn-sm${plan.condicion === 'activo' ? ' carrera-item__ordenanza--activo' : ''}`}
                            href={plan.url}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Plan ${plan.ordenanza} (${plan.condicion}) de ${carrera.nombre} (se abre en una pestaña nueva)`}
                        >
                            {plan.ordenanza}
                            {plan.condicion === 'activo' && <span className="carrera-item__condicion">activo</span>}
                            <svg
                                className="carrera-item__icono"
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                        </a>
                    </li>
                ))}
            </ul>
        </li>
    )
}
