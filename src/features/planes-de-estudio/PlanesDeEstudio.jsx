import { useEffect, useState } from 'react'
import EncabezadoPagina from '../../shared/layout/EncabezadoPagina'
import Desplegable from '../../shared/ui/Desplegable'
import CarreraItem from './CarreraItem'
import { obtenerPlanesDeEstudio } from '../../services/planesDeEstudio.js'
import './PlanesDeEstudio.css'

const SITIO_OFICIAL = 'http://planesestudio.unsl.edu.ar/'

function normalizarTexto(valor) {
    return valor.toLocaleLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

function coincideTexto(carrera, textoNormalizado) {
    return (
        textoNormalizado === '' ||
        normalizarTexto(carrera.nombre).includes(textoNormalizado) ||
        carrera.planes.some((plan) => normalizarTexto(plan.ordenanza).includes(textoNormalizado))
    )
}

export default function PlanesDeEstudio() {
    const [estado, setEstado] = useState('cargando')
    const [facultades, setFacultades] = useState([])
    const [texto, setTexto] = useState('')
    const [facultad, setFacultad] = useState('')
    const [alternadas, setAlternadas] = useState(() => new Set())
    const [intento, setIntento] = useState(0)

    useEffect(() => {
        let ignorar = false

        async function cargar() {
            try {
                const facultadesRecibidas = await obtenerPlanesDeEstudio()
                if (ignorar) return
                setFacultades(facultadesRecibidas)
                setEstado('listo')
            } catch {
                if (!ignorar) setEstado('error')
            }
        }

        cargar()
        return () => {
            ignorar = true
        }
    }, [intento])

    function handleReintentar() {
        setEstado('cargando')
        setIntento((anterior) => anterior + 1)
    }

    function handleTextoChange(e) {
        setTexto(e.target.value)
        setAlternadas(new Set())
    }

    function handleFacultadChange(e) {
        setFacultad(e.target.value)
        setAlternadas(new Set())
    }

    function handleLimpiarFiltros() {
        setTexto('')
        setFacultad('')
        setAlternadas(new Set())
    }

    function handleQuitarTexto() {
        setTexto('')
        setAlternadas(new Set())
    }

    function handleQuitarFacultad() {
        setFacultad('')
        setAlternadas(new Set())
    }

    function handleAlternarFacultad(codigo) {
        setAlternadas((actuales) => {
            const nuevas = new Set(actuales)
            if (nuevas.has(codigo)) {
                nuevas.delete(codigo)
            } else {
                nuevas.add(codigo)
            }
            return nuevas
        })
    }

    if (estado === 'cargando') {
        return (
            <>
                <EncabezadoPagina titulo="Planes de estudio" />
                <section className="container-xl planes-page">
                    <div className="d-flex align-items-center gap-2" role="status">
                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        <span>Cargando planes de estudio...</span>
                    </div>
                </section>
            </>
        )
    }

    if (estado === 'error') {
        return (
            <>
                <EncabezadoPagina titulo="Planes de estudio" />
                <section className="container-xl planes-page">
                    <div className="alert alert-danger mb-0" role="alert">
                        No se pudieron cargar los planes de estudio.
                    </div>
                    <button type="button" className="btn btn-primary align-self-start" onClick={handleReintentar}>
                        Reintentar
                    </button>
                </section>
            </>
        )
    }

    const textoNormalizado = normalizarTexto(texto.trim())
    const hayCriterioActivo = texto.trim() !== '' || facultad !== ''
    const estaAbierta = (codigo) => hayCriterioActivo !== alternadas.has(codigo)

    const facultadesVisibles = facultades
        .filter((f) => facultad === '' || f.codigo === facultad)
        .map((f) => ({ ...f, carreras: f.carreras.filter((c) => coincideTexto(c, textoNormalizado)) }))
        .filter((f) => f.carreras.length > 0)

    const nombreFacultadElegida = facultades.find((f) => f.codigo === facultad)?.nombre

    return (
        <>
            <EncabezadoPagina titulo="Planes de estudio">
                <p>Planes de estudio vigentes de cada carrera, agrupados por facultad</p>
                <a className="btn btn-light planes-page__sitio-oficial" href={SITIO_OFICIAL} target="_blank" rel="noreferrer">
                    ¿No encontrás tu plan? Consultá todos los planes en el sitio oficial
                </a>
            </EncabezadoPagina>

            <section className="container-xl planes-page">
                <search className="planes-page__criterios">
                    <div className="planes-page__campo">
                        <label htmlFor="planes-texto">Buscar</label>
                        <input
                            type="search"
                            id="planes-texto"
                            name="texto"
                            className="form-control"
                            placeholder="Carrera u ordenanza"
                            value={texto}
                            onChange={handleTextoChange}
                        />
                    </div>

                    <div className="planes-page__campo">
                        <label htmlFor="planes-facultad">Facultad</label>
                        <select
                            id="planes-facultad"
                            name="facultad"
                            className="form-select"
                            value={facultad}
                            onChange={handleFacultadChange}
                        >
                            <option value="">Todas</option>
                            {facultades.map((f) => (
                                <option key={f.codigo} value={f.codigo}>
                                    {f.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </search>

                {hayCriterioActivo && (
                    <div className="planes-page__chips">
                        <ul className="planes-page__lista-chips">
                            {texto.trim() !== '' && (
                                <li key="texto">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary planes-page__chip"
                                        onClick={handleQuitarTexto}
                                        aria-label={`Quitar filtro: Búsqueda: "${texto}"`}
                                    >
                                        Búsqueda: "{texto}" ✕
                                    </button>
                                </li>
                            )}
                            {facultad !== '' && (
                                <li key="facultad">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary planes-page__chip"
                                        onClick={handleQuitarFacultad}
                                        aria-label={`Quitar filtro: ${nombreFacultadElegida}`}
                                    >
                                        {nombreFacultadElegida} ✕
                                    </button>
                                </li>
                            )}
                        </ul>
                        <button
                            type="button"
                            className="btn btn-sm planes-page__limpiar"
                            onClick={handleLimpiarFiltros}
                        >
                            Limpiar filtros
                        </button>
                    </div>
                )}

                {facultadesVisibles.length === 0 && (
                    <div className="planes-page__mensaje-vacio">
                        <p>No se encontraron carreras con los criterios seleccionados.</p>
                        <a href={SITIO_OFICIAL} target="_blank" rel="noreferrer">
                            Buscá tu plan en el sitio oficial de planes de estudio
                        </a>
                    </div>
                )}

                {facultadesVisibles.length > 0 && (
                    <div className="planes-page__facultades">
                        {facultadesVisibles.map((f) => (
                            <Desplegable
                                key={f.codigo}
                                id={`carreras-${f.codigo}`}
                                titulo={f.nombre}
                                resumen={f.ubicacion}
                                abierto={estaAbierta(f.codigo)}
                                onAlternar={() => handleAlternarFacultad(f.codigo)}
                            >
                                <ul className="planes-page__carreras">
                                    {f.carreras.map((carrera) => (
                                        <CarreraItem key={carrera.codigo} carrera={carrera} />
                                    ))}
                                </ul>
                            </Desplegable>
                        ))}
                    </div>
                )}
            </section>
        </>
    )
}
