import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import EncabezadoPagina from '../../shared/layout/EncabezadoPagina'
import MateriasDelAnio from './MateriasDelAnio'
import { obtenerPlanDeEstudio } from '../../services/planesDeEstudio.js'
import './PlanDeEstudio.css'

const SITIO_OFICIAL = 'http://planesestudio.unsl.edu.ar/'
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
const TITULO_SIN_ANIO = 'Otras materias del plan'

function tituloDelGrupo(anio) {
    return anio === null ? TITULO_SIN_ANIO : ANIOS[anio - 1]
}

export default function PlanDeEstudio() {
    const { carrera, plan } = useParams()
    const [intento, setIntento] = useState(0)
    const [resultado, setResultado] = useState({ clave: null })
    const clave = `${carrera}/${plan}/${intento}`

    useEffect(() => {
        let ignorar = false

        async function cargar() {
            try {
                const datos = await obtenerPlanDeEstudio(carrera, plan)
                if (ignorar) return
                setResultado({ clave, estado: datos ? 'listo' : 'no-encontrado', detalle: datos })
            } catch {
                if (!ignorar) setResultado({ clave, estado: 'error' })
            }
        }

        cargar()
        return () => {
            ignorar = true
        }
    }, [carrera, plan, clave])

    function handleReintentar() {
        setIntento((anterior) => anterior + 1)
    }

    const estado = resultado.clave === clave ? resultado.estado : 'cargando'

    if (estado === 'cargando') {
        return (
            <>
                <EncabezadoPagina titulo="Plan de estudios" />
                <section className="container-xl plan-page">
                    <div className="d-flex align-items-center gap-2" role="status">
                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        <span>Cargando plan de estudios...</span>
                    </div>
                </section>
            </>
        )
    }

    if (estado === 'error') {
        return (
            <>
                <EncabezadoPagina titulo="Plan de estudios" />
                <section className="container-xl plan-page">
                    <div className="alert alert-danger mb-0" role="alert">
                        No se pudo cargar el plan de estudios.
                    </div>
                    <button type="button" className="btn btn-primary align-self-start" onClick={handleReintentar}>
                        Reintentar
                    </button>
                </section>
            </>
        )
    }

    if (estado === 'no-encontrado') {
        return (
            <>
                <EncabezadoPagina titulo="Plan no encontrado">
                    <p>El plan que buscás no existe o ya no está vigente.</p>
                </EncabezadoPagina>
                <section className="container-xl plan-page plan-page--acciones">
                    <Link to="/planes-de-estudio" className="btn btn-primary">
                        Volver a Planes de estudio
                    </Link>
                    <a className="btn btn-outline-primary" href={SITIO_OFICIAL} target="_blank" rel="noreferrer">
                        Buscá tu plan en el sitio oficial
                    </a>
                </section>
            </>
        )
    }

    const detalle = resultado.detalle
    const cantidadMaterias = detalle.materiasPorAnio.reduce((total, grupo) => total + grupo.materias.length, 0)

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

            <section className="container-xl plan-page">
                <div className="plan-materias">
                    {detalle.materiasPorAnio.map((grupo) => (
                        <MateriasDelAnio
                            key={grupo.anio ?? 'sin-anio'}
                            titulo={tituloDelGrupo(grupo.anio)}
                            materias={grupo.materias}
                        />
                    ))}
                </div>
            </section>
        </>
    )
}
