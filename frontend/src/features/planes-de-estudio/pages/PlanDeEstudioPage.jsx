import { Link, useParams } from 'react-router'
import EncabezadoPagina from '../../../shared/layout/EncabezadoPagina'
import Spinner from '../../../shared/components/Spinner'
import { useFetch } from '../../../shared/hooks/useFetch'
import MateriasDelAnio from '../components/MateriasDelAnio'
import { obtenerPlanDeEstudio, SITIO_PLANES_DE_ESTUDIO } from '../services/planesDeEstudioService'
import './PlanDeEstudio.css'

const ANIOS = [
  'Primer año',
  'Segundo año',
  'Tercer año',
  'Cuarto año',
  'Quinto año',
  'Sexto año',
  'Séptimo año',
  'Octavo año',
]

function PlanDeEstudioPage() {
  const { carrera, plan } = useParams()
  const { datos: detalle, cargando } = useFetch(obtenerPlanDeEstudio, `${carrera}/${plan}`)

  if (cargando) {
    return (
      <>
        <EncabezadoPagina titulo="Cargando plan...">
          <p>Obteniendo información del plan de estudio...</p>
        </EncabezadoPagina>
        <div className="container-xl">
          <Spinner texto="Cargando plan de estudio..." />
        </div>
      </>
    )
  }

  if (!detalle) {
    return (
      <>
        <EncabezadoPagina titulo="Plan no encontrado">
          <p>El plan que buscás no existe o ya no está vigente.</p>
        </EncabezadoPagina>
        <section className="container-xl d-flex flex-wrap gap-4 pb-5">
          <Link to="/planes-de-estudio" className="btn btn-primary">
            Volver a Planes de estudio
          </Link>
          <a
            className="btn btn-outline-primary"
            href={SITIO_PLANES_DE_ESTUDIO}
            target="_blank"
            rel="noreferrer"
          >
            Buscá tu plan en el sitio oficial
          </a>
        </section>
      </>
    )
  }

  const cantidadMaterias = (detalle.materiasPorAnio || []).reduce(
    (total, grupo) => total + (grupo.materias || []).length,
    0,
  )

  return (
    <>
      <EncabezadoPagina titulo={detalle.nombreCarrera}>
        <dl className="plan-datos">
          <div>
            <dt>Código</dt>
            <dd>{detalle.carrera}</dd>
          </div>
          <div>
            <dt>Plan</dt>
            <dd>{detalle.plan}</dd>
          </div>
          <div>
            <dt>Ordenanza</dt>
            <dd>{detalle.ordenanza}</dd>
          </div>
          <div>
            <dt>Años</dt>
            <dd>{detalle.anios}</dd>
          </div>
          <div>
            <dt>Materias</dt>
            <dd>{cantidadMaterias}</dd>
          </div>
        </dl>
        <div className="plan-acciones">
          <Link to="/planes-de-estudio" className="btn btn-outline-light">
            Volver a Planes de estudio
          </Link>
          <a
            className="btn btn-light"
            href={detalle.url}
            target="_blank"
            rel="noreferrer"
            aria-label="Ver plan en el sitio oficial (se abre en una pestaña nueva)"
          >
            Ver plan en el sitio oficial
          </a>
        </div>
      </EncabezadoPagina>

      <section className="container-xl d-flex flex-column gap-4 pb-5">
        <div className="plan-materias">
          {(detalle.materiasPorAnio || []).map((grupo) => (
            <MateriasDelAnio
              key={grupo.anio}
              titulo={ANIOS[grupo.anio - 1] || `Año ${grupo.anio}`}
              materias={grupo.materias}
            />
          ))}
        </div>
      </section>
    </>
  )
}

export default PlanDeEstudioPage
