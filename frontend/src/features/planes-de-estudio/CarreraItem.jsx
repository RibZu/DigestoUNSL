import { Link } from 'react-router'

export default function CarreraItem({ carrera }) {
    return (
        <li className="carrera-item">
            <h3 className="carrera-item__nombre">{carrera.nombre}</h3>
            <ul className="carrera-item__planes" aria-label={`Planes de ${carrera.nombre}`}>
                {carrera.planes.map((plan) => (
                    <li key={plan.plan}>
                        <Link
                            className="carrera-item__plan btn btn-sm btn-outline-primary"
                            to={`/planes-de-estudio/${carrera.codigo}/${plan.plan.replaceAll('/', '-')}`}
                            aria-label={`Plan ${plan.ordenanza} de ${carrera.nombre}`}
                        >
                            {plan.ordenanza}
                        </Link>
                    </li>
                ))}
            </ul>
        </li>
    )
}
