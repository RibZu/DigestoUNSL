import { useState } from 'react'
import { Link } from 'react-router'
import EncabezadoPagina from '../../shared/layout/EncabezadoPagina'
import Filtros from '../../shared/ui/Filtros'
import { contieneTexto } from '../../shared/utils/listas.js'
import { obtenerConcursosCargados } from '../../services/concursos.js'
import { obtenerCatalogosDeConcursos } from '../../services/catalogos.js'
import FormularioConcurso from './FormularioConcurso'
import TablaConcursos from './TablaConcursos'
import './GestionConcursos.css'

const CRITERIO_VACIO = { texto: '', dependencia: '' }

function coincide(concurso, criterio) {
    const campos = [
        concurso.codigo,
        ...concurso.llamados.flatMap((llamado) => [llamado.cargo, llamado.departamento, llamado.area]),
    ]
    return (
        contieneTexto(campos, criterio.texto) &&
        (criterio.dependencia === '' || concurso.dependencia === criterio.dependencia)
    )
}

export default function GestionConcursos() {
    const [pestania, setPestania] = useState('lista')
    const [criterio, setCriterio] = useState(CRITERIO_VACIO)
    const concursos = obtenerConcursosCargados()
    const catalogos = obtenerCatalogosDeConcursos()
    const filtrados = concursos.filter((concurso) => coincide(concurso, criterio))

    function handleVerLista() {
        setPestania('lista')
    }

    function handleVerFormulario() {
        setPestania('formulario')
    }

    return (
        <>
            <EncabezadoPagina titulo="Gestión de concursos">
                <p>Carga y consulta de llamados a concurso y sus resoluciones.</p>
                <Link to="/login/panel" className="btn btn-outline-light">
                    Volver al panel
                </Link>
            </EncabezadoPagina>

            <section className="container-xl d-flex flex-column gap-3 pb-5">
                <nav aria-label="Secciones de la gestión de concursos">
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <button
                                type="button"
                                className={`nav-link${pestania === 'lista' ? ' active' : ''}`}
                                aria-current={pestania === 'lista' ? 'page' : undefined}
                                onClick={handleVerLista}
                            >
                                Concursos cargados
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                type="button"
                                className={`nav-link${pestania === 'formulario' ? ' active' : ''}`}
                                aria-current={pestania === 'formulario' ? 'page' : undefined}
                                onClick={handleVerFormulario}
                            >
                                Cargar concurso
                            </button>
                        </li>
                    </ul>
                </nav>

                {pestania === 'lista' ? (
                    <>
                        <h2 className="visually-hidden">Concursos cargados</h2>
                        <Filtros
                            id="gestion"
                            placeholder="Código, cargo, departamento o área"
                            selects={[
                                {
                                    name: 'dependencia',
                                    etiqueta: 'Dependencia',
                                    todas: 'Todas',
                                    opciones: catalogos.dependencias.map((dependencia) => ({
                                        valor: dependencia.codigo,
                                        texto: dependencia.sigla,
                                    })),
                                },
                            ]}
                            vacio={CRITERIO_VACIO}
                            aplicado={criterio}
                            onAplicar={setCriterio}
                        />
                        <TablaConcursos
                            concursos={filtrados}
                            total={concursos.length}
                            dependencias={catalogos.dependencias}
                        />
                    </>
                ) : (
                    <FormularioConcurso catalogos={catalogos} />
                )}
            </section>
        </>
    )
}
