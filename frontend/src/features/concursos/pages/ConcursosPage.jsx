import { useState } from 'react'
import EncabezadoPagina from '../../../shared/layout/EncabezadoPagina'
import Desplegable from '../../../shared/components/Desplegable'
import Filtros from '../../../shared/components/Filtros'
import MensajeVacio from '../../../shared/components/MensajeVacio'
import Spinner from '../../../shared/components/Spinner'
import { useFetch } from '../../../shared/hooks/useFetch'
import { useFiltros } from '../../../shared/hooks/useFiltros'
import { alternar, comoOpciones, contieneTexto, tieneValores } from '../../../shared/utils/listas.js'
import ConcursoCard from '../components/ConcursoCard'
import { obtenerConcursosVigentes, obtenerFacultades } from '../services/concursosService'
import './Concursos.css'

const CRITERIO_VACIO = { texto: '', facultad: '', caracter: '', dedicacion: '' }

function coincide(llamado, criterio) {
  return (
    contieneTexto(
      [llamado.cargo, llamado.area, llamado.departamento, llamado.resolucion],
      criterio.texto,
    ) &&
    (criterio.facultad === '' || llamado.facultad === criterio.facultad) &&
    (criterio.caracter === '' || llamado.caracter === criterio.caracter) &&
    (criterio.dedicacion === '' || llamado.dedicacion === criterio.dedicacion)
  )
}

function opcionesDe(llamados, campo) {
  return comoOpciones(
    [...new Set(llamados.map((llamado) => llamado[campo]))].sort((a, b) => a.localeCompare(b, 'es')),
  )
}

function ConcursosPage() {
  const [abiertas, setAbiertas] = useState([])
  const facultadesPedidas = useFetch(obtenerFacultades)
  const llamadosPedidos = useFetch(obtenerConcursosVigentes)
  const { aplicado, setAplicado, filtradas } = useFiltros(
    llamadosPedidos.datos,
    CRITERIO_VACIO,
    coincide,
  )

  const facultades = facultadesPedidas.datos ?? []
  const llamados = llamadosPedidos.datos ?? []
  const cargando = facultadesPedidas.cargando || llamadosPedidos.cargando
  const error = facultadesPedidas.error ?? llamadosPedidos.error
  const hayCriterio = tieneValores(aplicado)
  const facultadesAMostrar = hayCriterio
    ? facultades.filter((facultad) => filtradas.some((llamado) => llamado.facultad === facultad.codigo))
    : facultades

  function handleAplicar(nuevo) {
    setAplicado(nuevo)
    setAbiertas(
      tieneValores(nuevo)
        ? [...new Set(llamados.filter((llamado) => coincide(llamado, nuevo)).map((llamado) => llamado.facultad))]
        : [],
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
        {cargando && <Spinner texto="Cargando concursos..." />}

        {error && <MensajeVacio texto={error.message} />}

        {!cargando && !error && (
          <>
            <Filtros
              id="concursos"
              placeholder="Cargo, área, departamento o resolución"
              selects={[
                {
                  name: 'facultad',
                  etiqueta: 'Facultad',
                  todas: 'Todas',
                  opciones: facultades.map((facultad) => ({
                    valor: facultad.codigo,
                    texto: facultad.nombre,
                  })),
                },
                {
                  name: 'caracter',
                  etiqueta: 'Carácter',
                  todas: 'Todos',
                  opciones: opcionesDe(llamados, 'caracter'),
                },
                {
                  name: 'dedicacion',
                  etiqueta: 'Dedicación',
                  todas: 'Todas',
                  opciones: opcionesDe(llamados, 'dedicacion'),
                },
              ]}
              vacio={CRITERIO_VACIO}
              aplicado={aplicado}
              onAplicar={handleAplicar}
            />

            {llamados.length === 0 && (
              <MensajeVacio texto="No hay concursos vigentes por el momento." />
            )}

            {llamados.length > 0 && hayCriterio && filtradas.length === 0 && (
              <MensajeVacio texto="No se encontraron concursos con los criterios seleccionados." />
            )}

            <div className="concursos-page__facultades">
              {facultadesAMostrar.map((facultad) => {
                const deLaFacultad = filtradas.filter((llamado) => llamado.facultad === facultad.codigo)
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
          </>
        )}
      </section>
    </>
  )
}

export default ConcursosPage
