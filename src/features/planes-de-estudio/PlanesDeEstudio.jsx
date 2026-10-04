import { useState } from 'react'
import EncabezadoPagina from '../../shared/layout/EncabezadoPagina'
import Desplegable from '../../shared/ui/Desplegable'
import Filtros from '../../shared/ui/Filtros'
import MensajeVacio from '../../shared/ui/MensajeVacio'
import CarreraItem from './CarreraItem'
import { obtenerPlanesDeEstudio, SITIO_PLANES_DE_ESTUDIO } from '../../services/planesDeEstudio.js'
import { alternar, contieneTexto, tieneValores } from '../../shared/utils/listas.js'
import './PlanesDeEstudio.css'

const CRITERIO_VACIO = { texto: '', facultad: '' }

function filtrarFacultades(facultades, criterio) {
    return facultades
        .filter((facultad) => criterio.facultad === '' || facultad.codigo === criterio.facultad)
        .map((facultad) => ({
            ...facultad,
            carreras: facultad.carreras.filter((carrera) =>
                contieneTexto([carrera.nombre, ...carrera.planes.map((plan) => plan.ordenanza)], criterio.texto)
            ),
        }))
        .filter((facultad) => facultad.carreras.length > 0)
}

export default function PlanesDeEstudio() {
    const [criterio, setCriterio] = useState(CRITERIO_VACIO)
    const [abiertas, setAbiertas] = useState([])
    const facultades = obtenerPlanesDeEstudio()
    const visibles = filtrarFacultades(facultades, criterio)

    function handleAplicar(nuevo) {
        setCriterio(nuevo)
        setAbiertas(tieneValores(nuevo) ? filtrarFacultades(facultades, nuevo).map((facultad) => facultad.codigo) : [])
    }

    function handleAlternar(codigo) {
        setAbiertas(alternar(abiertas, codigo))
    }

    return (
        <>
            <EncabezadoPagina titulo="Planes de estudio">
                <p>Planes de estudio vigentes de cada carrera, agrupados por facultad</p>
                <a
                    className="btn btn-light planes-page__sitio-oficial"
                    href={SITIO_PLANES_DE_ESTUDIO}
                    target="_blank"
                    rel="noreferrer"
                >
                    ¿No encontrás tu plan? Consultá todos los planes en el sitio oficial
                </a>
            </EncabezadoPagina>

            <section className="container-xl d-flex flex-column gap-4 pb-5">
                <Filtros
                    id="planes"
                    placeholder="Carrera u ordenanza"
                    selects={[
                        {
                            name: 'facultad',
                            etiqueta: 'Facultad',
                            todas: 'Todas',
                            opciones: facultades.map((facultad) => ({ valor: facultad.codigo, texto: facultad.nombre })),
                        },
                    ]}
                    vacio={CRITERIO_VACIO}
                    aplicado={criterio}
                    onAplicar={handleAplicar}
                />

                {visibles.length === 0 ? (
                    <MensajeVacio texto="No se encontraron carreras con los criterios seleccionados.">
                        <a href={SITIO_PLANES_DE_ESTUDIO} target="_blank" rel="noreferrer">
                            Buscá tu plan en el sitio oficial de planes de estudio
                        </a>
                    </MensajeVacio>
                ) : (
                    <div className="planes-page__facultades">
                        {visibles.map((facultad) => (
                            <Desplegable
                                key={facultad.codigo}
                                id={`carreras-${facultad.codigo}`}
                                titulo={facultad.nombre}
                                resumen={facultad.ubicacion}
                                abierto={abiertas.includes(facultad.codigo)}
                                onAlternar={() => handleAlternar(facultad.codigo)}
                            >
                                <ul className="planes-page__carreras">
                                    {facultad.carreras.map((carrera) => (
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
