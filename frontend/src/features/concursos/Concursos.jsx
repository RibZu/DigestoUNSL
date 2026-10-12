import { useState } from 'react'
import EncabezadoPagina from '../../shared/layout/EncabezadoPagina'
import Desplegable from '../../shared/ui/Desplegable'
import Filtros from '../../shared/ui/Filtros'
import MensajeVacio from '../../shared/ui/MensajeVacio'
import ConcursoCard from './ConcursoCard'
import { obtenerConcursosVigentes, obtenerFacultades } from '../../services/concursos.js'
import { alternar, comoOpciones, contieneTexto, tieneValores } from '../../shared/utils/listas.js'
import './Concursos.css'

const CRITERIO_VACIO = { texto: '', facultad: '', caracter: '', dedicacion: '' }

function filtrarLlamados(llamados, criterio) {
    return llamados.filter(
        (llamado) =>
            contieneTexto([llamado.cargo, llamado.area, llamado.departamento, llamado.resolucion], criterio.texto) &&
            (criterio.facultad === '' || llamado.facultad === criterio.facultad) &&
            (criterio.caracter === '' || llamado.caracter === criterio.caracter) &&
            (criterio.dedicacion === '' || llamado.dedicacion === criterio.dedicacion)
    )
}

function opcionesDe(llamados, campo) {
    return comoOpciones([...new Set(llamados.map((llamado) => llamado[campo]))].sort((a, b) => a.localeCompare(b, 'es')))
}

export default function Concursos() {
    const [criterio, setCriterio] = useState(CRITERIO_VACIO)
    const [abiertas, setAbiertas] = useState([])
    const facultades = obtenerFacultades()
    const llamados = obtenerConcursosVigentes()
    const filtrados = filtrarLlamados(llamados, criterio)
    const hayCriterio = tieneValores(criterio)
    const facultadesAMostrar = hayCriterio
        ? facultades.filter((facultad) => filtrados.some((llamado) => llamado.facultad === facultad.codigo))
        : facultades

    function handleAplicar(nuevo) {
        setCriterio(nuevo)
        setAbiertas(
            tieneValores(nuevo) ? [...new Set(filtrarLlamados(llamados, nuevo).map((llamado) => llamado.facultad))] : []
        )
    }

    function handleAlternar(codigo) {
        setAbiertas(alternar(abiertas, codigo))
    }

    return (
        <>
            <EncabezadoPagina titulo="Concursos">
                <p>Llamado a concursos de cargos vigentes, agrupados por facultad</p>
            </EncabezadoPagina>

            <section className="container-xl d-flex flex-column gap-4 pb-5">
                <Filtros
                    id="concursos"
                    placeholder="Cargo, área, departamento o resolución"
                    selects={[
                        {
                            name: 'facultad',
                            etiqueta: 'Facultad',
                            todas: 'Todas',
                            opciones: facultades.map((facultad) => ({ valor: facultad.codigo, texto: facultad.nombre })),
                        },
                        { name: 'caracter', etiqueta: 'Carácter', todas: 'Todos', opciones: opcionesDe(llamados, 'caracter') },
                        {
                            name: 'dedicacion',
                            etiqueta: 'Dedicación',
                            todas: 'Todas',
                            opciones: opcionesDe(llamados, 'dedicacion'),
                        },
                    ]}
                    vacio={CRITERIO_VACIO}
                    aplicado={criterio}
                    onAplicar={handleAplicar}
                />

                {llamados.length === 0 && <MensajeVacio texto="No hay concursos vigentes por el momento." />}

                {llamados.length > 0 && hayCriterio && filtrados.length === 0 && (
                    <MensajeVacio texto="No se encontraron concursos con los criterios seleccionados." />
                )}

                <div className="concursos-page__facultades">
                    {facultadesAMostrar.map((facultad) => {
                        const deLaFacultad = filtrados.filter((llamado) => llamado.facultad === facultad.codigo)
                        return (
                            <Desplegable
                                key={facultad.codigo}
                                id={`concursos-${facultad.codigo}`}
                                titulo={facultad.nombre}
                                resumen={facultad.ubicacion}
                                abierto={abiertas.includes(facultad.codigo)}
                                onAlternar={() => handleAlternar(facultad.codigo)}
                            >
                                {deLaFacultad.length > 0 ? (
                                    <div className="concursos-page__lista">
                                        {deLaFacultad.map((llamado) => (
                                            <ConcursoCard key={llamado.id} concurso={llamado} />
                                        ))}
                                    </div>
                                ) : (
                                    <MensajeVacio texto="No hay concursos vigentes en esta facultad por el momento." />
                                )}
                            </Desplegable>
                        )
                    })}
                </div>
            </section>
        </>
    )
}
