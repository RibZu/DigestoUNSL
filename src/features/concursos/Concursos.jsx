import { useEffect, useState } from 'react'
import EncabezadoPagina from '../../shared/layout/EncabezadoPagina'
import Desplegable from '../../shared/ui/Desplegable'
import ConcursoCard from './ConcursoCard'
import { obtenerConcursos, obtenerFacultades } from '../../services/concursos.js'
import './Concursos.css'

const CRITERIO_INICIAL = { texto: '', facultad: '', caracter: '', dedicacion: '' }

const ETIQUETAS_CRITERIO = {
    texto: (valor) => `Búsqueda: "${valor}"`,
    facultad: (valor, facultades) =>
        facultades.find((facultad) => facultad.codigo === valor)?.nombre ?? `Facultad: ${valor}`,
    caracter: (valor) => `Carácter: ${valor}`,
    dedicacion: (valor) => `Dedicación: ${valor}`,
}

function claveDelConcurso(concurso) {
    return [
        concurso.resolucion,
        concurso.departamento,
        concurso.area,
        concurso.cargo,
        concurso.dedicacion,
        concurso.caracter,
    ].join('|')
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
    const [facultades, setFacultades] = useState([])
    const [concursos, setConcursos] = useState([])
    const [criterio, setCriterio] = useState(CRITERIO_INICIAL)
    const [alternadas, setAlternadas] = useState(() => new Set())
    const [intento, setIntento] = useState(0)

    useEffect(() => {
        let ignorar = false

        async function cargar() {
            try {
                const [facultadesRecibidas, concursosRecibidos] = await Promise.all([
                    obtenerFacultades(),
                    obtenerConcursos(),
                ])
                if (ignorar) return
                setFacultades(facultadesRecibidas)
                setConcursos(concursosRecibidos)
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

    function handleFiltrosChange(e) {
        const { name, value } = e.target
        setCriterio((valores) => ({ ...valores, [name]: value }))
        setAlternadas(new Set())
    }

    function handleLimpiarFiltros() {
        setCriterio(CRITERIO_INICIAL)
        setAlternadas(new Set())
    }

    function handleQuitarCriterio(campo) {
        setCriterio((valores) => ({ ...valores, [campo]: '' }))
        setAlternadas(new Set())
    }

    function handleAlternarFacultad(codigo) {
        setAlternadas((actuales) => {
            const siguientes = new Set(actuales)
            if (siguientes.has(codigo)) siguientes.delete(codigo)
            else siguientes.add(codigo)
            return siguientes
        })
    }

    if (estado === 'cargando') {
        return (
            <>
                <EncabezadoPagina titulo="Concursos" />
                <section className="container-xl concursos-page">
                    <div className="d-flex align-items-center gap-2" role="status">
                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        <span>Cargando concursos...</span>
                    </div>
                </section>
            </>
        )
    }

    if (estado === 'error') {
        return (
            <>
                <EncabezadoPagina titulo="Concursos" />
                <section className="container-xl concursos-page">
                    <div className="alert alert-danger mb-0" role="alert">
                        No se pudieron cargar los concursos.
                    </div>
                    <button type="button" className="btn btn-primary align-self-start" onClick={handleReintentar}>
                        Reintentar
                    </button>
                </section>
            </>
        )
    }

    const concursosFiltrados = concursos.filter((concurso) => coincideConCriterio(concurso, criterio))
    const hayCriterioActivo = Object.values(criterio).some((valor) => valor !== '')
    const estaAbierta = (codigo) => hayCriterioActivo !== alternadas.has(codigo)

    const facultadesAMostrar = hayCriterioActivo
        ? facultades.filter((facultad) =>
              concursosFiltrados.some((concurso) => concurso.facultad === facultad.codigo)
          )
        : facultades

    const mensajeVacio = calcularMensajeVacio(concursos, concursosFiltrados, hayCriterioActivo)

    const opcionesCaracter = [...new Set(concursos.map((concurso) => concurso.caracter))].sort((a, b) =>
        a.localeCompare(b, 'es')
    )
    const opcionesDedicacion = [...new Set(concursos.map((concurso) => concurso.dedicacion))].sort(
        (a, b) => a.localeCompare(b, 'es')
    )

    const criteriosActivos = Object.entries(criterio)
        .filter(([, valor]) => valor !== '')
        .map(([campo, valor]) => ({
            campo,
            etiqueta: ETIQUETAS_CRITERIO[campo](valor, facultades),
        }))

    return (
        <>
            <EncabezadoPagina titulo="Concursos">
                <p>Llamado a concursos de cargos vigentes, agrupados por facultad</p>
            </EncabezadoPagina>

            <section className="container-xl concursos-page">
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
                            {facultades.map(({ codigo, nombre }) => (
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


                <div className="concursos-page__facultades">
                    {facultadesAMostrar.map((facultad) => {
                        const concursosDeFacultad = concursosFiltrados.filter(
                            (concurso) => concurso.facultad === facultad.codigo
                        )
                        return (
                            <Desplegable
                                key={facultad.codigo}
                                id={`concursos-${facultad.codigo}`}
                                titulo={facultad.nombre}
                                resumen={facultad.ubicacion}
                                abierto={estaAbierta(facultad.codigo)}
                                onAlternar={() => handleAlternarFacultad(facultad.codigo)}
                            >
                                {concursosDeFacultad.length > 0 ? (
                                    <div className="concursos-page__lista">
                                        {concursosDeFacultad.map((concurso) => (
                                            <ConcursoCard key={claveDelConcurso(concurso)} concurso={concurso} />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="concursos-page__sin-concursos">
                                        No hay concursos vigentes en esta facultad por el momento.
                                    </p>
                                )}
                            </Desplegable>
                        )
                    })}
                </div>
            </section>
        </>
    )
}
