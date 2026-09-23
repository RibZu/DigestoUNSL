import { useEffect, useState } from 'react'
import CarreraItem from './CarreraItem'
import { obtenerPlanesDeEstudio } from '../../services/planesDeEstudio.js'
import './PlanesDeEstudio.css'

const SITIO_OFICIAL = 'http://planesestudio.unsl.edu.ar/'

function cargarPlanes(setEstado, setFacultades) {
    setEstado('cargando')
    obtenerPlanesDeEstudio()
        .then((facultadesRecibidas) => {
            setFacultades(facultadesRecibidas)
            setEstado('listo')
        })
        .catch(() => setEstado('error'))
}

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

    useEffect(() => {
        cargarPlanes(setEstado, setFacultades)
    }, [])

    function handleReintentar() {
        cargarPlanes(setEstado, setFacultades)
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
            <section className="planes-page">
                <header className="planes-page__encabezado">
                    <h1>Planes de estudio</h1>
                    <p role="status">Cargando planes de estudio...</p>
                </header>
            </section>
        )
    }

    if (estado === 'error') {
        return (
            <section className="planes-page">
                <header className="planes-page__encabezado">
                    <h1>Planes de estudio</h1>
                    <p role="alert">No se pudieron cargar los planes de estudio</p>
                    <button type="button" className="btn btn-primary" onClick={handleReintentar}>
                        Reintentar
                    </button>
                </header>
            </section>
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
        <section className="planes-page">
            <header className="planes-page__encabezado">
                <h1>Planes de estudio</h1>
                <p>Planes de estudio vigentes y activos de cada carrera, agrupados por facultad</p>
                <a className="btn planes-page__sitio-oficial" href={SITIO_OFICIAL} target="_blank" rel="noreferrer">
                    ¿No encontrás tu plan? Consultá todos los planes en el sitio oficial
                    <svg
                        className="planes-page__icono"
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
            </header>

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

            <p className="planes-page__referencias">
                <span className="planes-page__muestra">Vigente</span> rige para los ingresantes ·{' '}
                <span className="planes-page__muestra planes-page__muestra--activo">Activo</span> todavía tiene
                alumnos cursando
            </p>

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
                        <section key={f.codigo} className="planes-page__facultad">
                            <h2 className="planes-page__facultad-titulo">
                                <button
                                    type="button"
                                    className="planes-page__facultad-boton"
                                    aria-expanded={estaAbierta(f.codigo)}
                                    aria-controls={`carreras-${f.codigo}`}
                                    onClick={() => handleAlternarFacultad(f.codigo)}
                                >
                                    <svg
                                        className="planes-page__chevron"
                                        aria-hidden="true"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                    <span className="planes-page__facultad-nombre">{f.nombre}</span>{' '}
                                    <span className="planes-page__ubicacion">{f.ubicacion}</span>
                                </button>
                            </h2>
                            <ul
                                id={`carreras-${f.codigo}`}
                                className="planes-page__carreras"
                                hidden={!estaAbierta(f.codigo)}
                            >
                                {f.carreras.map((carrera) => (
                                    <CarreraItem key={carrera.codigo} carrera={carrera} />
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
            )}
        </section>
    )
}
