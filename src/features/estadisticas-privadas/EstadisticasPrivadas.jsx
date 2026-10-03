import EncabezadoPagina from '../../shared/layout/EncabezadoPagina'
import EstadisticasConcursos from './EstadisticasConcursos'
import EstadisticasTerminos from './EstadisticasTerminos'

export default function EstadisticasPrivadas() {
  return (
    <>
      <EncabezadoPagina titulo="Estadísticas de búsquedas y concursos">
        <p>Términos más buscados y llamados a concurso por año y facultad.</p>
      </EncabezadoPagina>

      <section className="container-xl d-flex flex-column gap-2 pb-5">
        <EstadisticasTerminos />
        <EstadisticasConcursos />
      </section>
    </>
  )
}
