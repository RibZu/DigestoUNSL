import { Link } from 'react-router'
import MensajeVacio from '../../../shared/components/MensajeVacio'
import Spinner from '../../../shared/components/Spinner'
import { useFetch } from '../../../shared/hooks/useFetch'
import HomeShowcaseCard from '../components/HomeShowcaseCard'
import UltimosDocumentos from '../components/UltimosDocumentos'
import { obtenerUltimosDocumentos } from '../services/homeService'
import './Home.css'

function HomePage() {
  const { datos, cargando, error } = useFetch(obtenerUltimosDocumentos)

  return (
    <>
      <section className="home-portada">
        <div className="container-xl home-portada__contenido">
          <h1>Digesto Administrativo</h1>
          <p>
            Repositorio de resoluciones, ordenanzas y normativas de la Universidad Nacional de San
            Luis.
          </p>
          <Link to="/busqueda" className="btn btn-primary btn-lg">
            Buscar en el Digesto
          </Link>
        </div>
      </section>

      {cargando && (
        <div className="container-xl">
          <Spinner texto="Cargando los últimos documentos..." />
        </div>
      )}

      {error && (
        <div className="container-xl pt-4">
          <MensajeVacio texto={error.message} />
        </div>
      )}

      {datos && <UltimosDocumentos documentos={datos} />}

      <section className="container-xl home-showcase" aria-label="Accesos rápidos">
        <HomeShowcaseCard
          title="Búsqueda"
          sampleItems={[
            'Encontrá resoluciones, ordenanzas y demás normativas por palabra clave',
            'Filtrá por tipo de documento y dependencia emisora',
            'Con los filtros avanzados, buscá por número, año o rango de fechas',
          ]}
          ctaLabel="Ir a búsqueda"
          ctaHref="/busqueda"
        />
        <HomeShowcaseCard
          title="Concursos"
          sampleItems={[
            'Llamados a concursos docentes, agrupados por facultad',
            'Filtrá por carácter (efectivo, interino o suplente) y dedicación',
            'Consultá las fechas de inscripción y la resolución de cada llamado',
          ]}
          ctaLabel="Ver todos los concursos"
          ctaHref="/concursos"
        />
        <HomeShowcaseCard
          title="Planes de estudio"
          sampleItems={[
            'Los planes vigentes de cada carrera, agrupados por facultad',
            'Consultá las materias de cada plan por año',
            'Enlace directo al sitio oficial de planes de estudio',
          ]}
          ctaLabel="Ver planes de estudio"
          ctaHref="/planes-de-estudio"
        />
      </section>
    </>
  )
}

export default HomePage
