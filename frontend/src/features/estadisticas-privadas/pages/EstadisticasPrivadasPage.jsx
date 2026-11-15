import EncabezadoPagina from '../../../shared/layout/EncabezadoPagina'
import MensajeVacio from '../../../shared/components/MensajeVacio'
import Spinner from '../../../shared/components/Spinner'
import VolverAlPanel from '../../../shared/components/VolverAlPanel'
import { useFetch } from '../../../shared/hooks/useFetch'
import { obtenerConcursosPorAnio, obtenerTerminosMasBuscados } from '../../estadisticas'
import EstadisticasConcursos from '../components/EstadisticasConcursos'
import EstadisticasTerminos from '../components/EstadisticasTerminos'

function EstadisticasPrivadasPage() {
  const terminos = useFetch(obtenerTerminosMasBuscados)
  const anios = useFetch(obtenerConcursosPorAnio)
  const cargando = terminos.cargando || anios.cargando
  const error = terminos.error ?? anios.error

  return (
    <>
      <EncabezadoPagina titulo="Estadísticas de búsquedas y concursos">
        <p>Términos más buscados y llamados a concurso por año y facultad.</p>
        <VolverAlPanel />
      </EncabezadoPagina>

      <section className="container-xl d-flex flex-column gap-2 pb-5">
        {cargando && <Spinner texto="Cargando estadísticas..." />}

        {error && <MensajeVacio texto={error.message} />}

        {terminos.datos && anios.datos && (
          <>
            <EstadisticasTerminos terminos={terminos.datos} />
            <EstadisticasConcursos anios={anios.datos} />
          </>
        )}
      </section>
    </>
  )
}

export default EstadisticasPrivadasPage
