import { useEffect, useState } from 'react'
import ConcursoCard from './ConcursoCard'
import { obtenerConcursos, obtenerFacultades } from '../../services/concursos.js'
import './Concursos.css'

const CRITERIO_INICIAL = { texto: '', facultad: '', caracter: '', dedicacion: '' }

const ETIQUETAS_CRITERIO = {
    texto: (valor) => `Búsqueda: "${valor}"`,
    facultad: (valor, facultades) => facultades[valor] ?? `Facultad: ${valor}`,
    caracter: (valor) => `Carácter: ${valor}`,
    dedicacion: (valor) => `Dedicación: ${valor}`,
}

function cargarConcursos(setEstado, setFacultades, setConcursos) {
    setEstado('cargando')
    Promise.all([obtenerFacultades(), obtenerConcursos()])
        .then(([facultadesRecibidas, concursosRecibidos]) => {
            setFacultades(facultadesRecibidas)
            setConcursos(concursosRecibidos)
            setEstado('listo')
        })
        .catch(() => setEstado('error'))
}

function normalizarTexto(texto) {
    return texto.toLocaleLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

function coincideConCriterio(concurso, criterio) {
    const texto = normalizarTexto(criterio.texto.trim())
    const coincideTexto =
        texto === '' ||
        [concurso.cargo, concurso.area, concurso.departamento, concurso.resolucion].some((campo) =>
            normalizarTexto(campo).includes(texto)
        )

    return (
        coincideTexto &&
        (criterio.facultad === '' || concurso.facultad === criterio.facultad) &&
        (criterio.caracter === '' || concurso.caracter === criterio.caracter) &&
        (criterio.dedicacion === '' || concurso.dedicacion === criterio.dedicacion)
    )
}

function calcularMensajeVacio(concursos, concursosFiltrados, hayCriterioActivo) {
    if (concursos.length === 0 && !hayCriterioActivo) return 'sin-datos'
    if (concursosFiltrados.length === 0 && concursos.length > 0) return 'sin-resultados'
    return null
}

export default function Concursos() {
    const [estado, setEstado] = useState('cargando')
    const [facultades, setFacultades] = useState({})
    const [concursos, setConcursos] = useState([])
    const [criterio, setCriterio] = useState(CRITERIO_INICIAL)

    useEffect(() => {
        cargarConcursos(setEstado, setFacultades, setConcursos)
    }, [])

    function handleReintentar() {
        cargarConcursos(setEstado, setFacultades, setConcursos)
    }

    function handleFiltrosChange(e) {
        const { name, value } = e.target
        setCriterio((valores) => ({ ...valores, [name]: value }))
    }

    function handleLimpiarFiltros() {
        setCriterio(CRITERIO_INICIAL)
    }

    function handleQuitarCriterio(campo) {
        setCriterio((valores) => ({ ...valores, [campo]: '' }))
    }

    if (estado === 'cargando') {
        return (
            <section className="concursos-page">
                <header className="concursos-page__encabezado">
                    <h1>Concursos</h1>
                    <p role="status">Cargando Concursos...</p>
                </header>
            </section>
        )
    }

    if (estado === 'error') {
        return (
            <section className="concursos-page">
                <header className="concursos-page__encabezado">
                    <h1>Concursos</h1>
                    <p role="alert">No se pudieron cargar los concursos</p>
                    <button type="button" className="btn btn-primary" onClick={handleReintentar}>
                        Reintentar
                    </button>
                </header>
            </section>
        )
    }

    const concursosFiltrados = concursos.filter((concurso) => coincideConCriterio(concurso, criterio))
    const hayCriterioActivo = Object.values(criterio).some((valor) => valor !== '')

    const facultadesAMostrar = hayCriterioActivo
        ? Object.keys(facultades).filter((codigo) =>
              concursosFiltrados.some((concurso) => concurso.facultad === codigo)
          )
        : Object.keys(facultades)

    const mensajeVacio = calcularMensajeVacio(concursos, concursosFiltrados, hayCriterioActivo)

    const opcionesCaracter = [...new Set(concursos.map((concurso) => concurso.caracter))]
    const opcionesDedicacion = [...new Set(concursos.map((concurso) => concurso.dedicacion))]

    const criteriosActivos = Object.entries(criterio)
        .filter(([, valor]) => valor !== '')
        .map(([campo, valor]) => ({
            campo,
            etiqueta: ETIQUETAS_CRITERIO[campo](valor, facultades),
        }))

    return (
        <section className="concursos-page">
            <header className="concursos-page__encabezado">
                <h1>Concursos</h1>
                <p>Llamado a concursos de cargos vigentes, agrupados por facultad</p>
            </header>

            <search className="concursos-page__criterios">
                <div className="concursos-page__campo">
                    <label htmlFor="concursos-texto">Buscar</label>
                    <input
                        type="search"
                        id="concursos-texto"
                        name="texto"
                        className="form-control"
                        placeholder="Cargo, área, departamento o resolución"
                        value={criterio.texto}
                        onChange={handleFiltrosChange}
                    />
                </div>

                <div className="concursos-page__campo">
                    <label htmlFor="concursos-facultad">Facultad</label>
                    <select
                        id="concursos-facultad"
                        name="facultad"
                        className="form-select"
                        value={criterio.facultad}
                        onChange={handleFiltrosChange}
                    >
                        <option value="">Todas</option>
                        {Object.entries(facultades).map(([codigo, nombre]) => (
                            <option key={codigo} value={codigo}>
                                {nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="concursos-page__campo">
                    <label htmlFor="concursos-caracter">Carácter</label>
                    <select
                        id="concursos-caracter"
                        name="caracter"
                        className="form-select"
                        value={criterio.caracter}
                        onChange={handleFiltrosChange}
                    >
                        <option value="">Todos</option>
                        {opcionesCaracter.map((valor) => (
                            <option key={valor} value={valor}>
                                {valor}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="concursos-page__campo">
                    <label htmlFor="concursos-dedicacion">Dedicación</label>
                    <select
                        id="concursos-dedicacion"
                        name="dedicacion"
                        className="form-select"
                        value={criterio.dedicacion}
                        onChange={handleFiltrosChange}
                    >
                        <option value="">Todas</option>
                        {opcionesDedicacion.map((valor) => (
                            <option key={valor} value={valor}>
                                {valor}
                            </option>
                        ))}
                    </select>
                </div>
            </search>

            {criteriosActivos.length > 0 && (
                <div className="concursos-page__chips">
                    <ul className="concursos-page__lista-chips">
                        {criteriosActivos.map(({ campo, etiqueta }) => (
                            <li key={campo}>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary concursos-page__chip"
                                    onClick={() => handleQuitarCriterio(campo)}
                                    aria-label={`Quitar filtro: ${etiqueta}`}
                                >
                                    {etiqueta} ✕
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button
                        type="button"
                        className="btn btn-sm concursos-page__limpiar"
                        onClick={handleLimpiarFiltros}
                    >
                        Limpiar filtros
                    </button>
                </div>
            )}

            {mensajeVacio === 'sin-resultados' && (
                <p className="concursos-page__mensaje-vacio">
                    No se encontraron concursos con los criterios seleccionados.
                </p>
            )}

            {mensajeVacio === 'sin-datos' && (
                <p className="concursos-page__mensaje-vacio">No hay concursos vigentes por el momento.</p>
            )}

            {facultadesAMostrar.map((codigo) => {
                const concursosDeFacultad = concursosFiltrados.filter(
                    (concurso) => concurso.facultad === codigo
                )
                return (
                    <article key={codigo} className="concursos-page__facultad">
                        <h2>{facultades[codigo]}</h2>
                        {concursosDeFacultad.length > 0 ? (
                            <div className="concursos-page__lista">
                                {concursosDeFacultad.map((concurso) => (
                                    <ConcursoCard
                                        key={`${concurso.facultad}-${concurso.resolucion}`}
                                        concurso={concurso}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="concursos-page__sin-concursos">
                                No hay concursos vigentes en esta facultad por el momento.
                            </p>
                        )}
                    </article>
                )
            })}
        </section>
    )
}
