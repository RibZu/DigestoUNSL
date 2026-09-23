import HomeShowcaseCard from './HomeShowcaseCard'
import './Home.css'

export default function Home() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <h1>Digesto Administrativo</h1>
        <p>Repositorio de resoluciones, ordenanzas y normativas de la Universidad Nacional de San Luis.</p>
      </section>

      <section className="home-showcase" aria-label="Accesos rápidos">
        <HomeShowcaseCard
          title="Búsqueda"
          sampleItems={[
            'Encontrá resoluciones, ordenanzas y demás normativas por palabra clave',
            'Filtrá por tipo de documento y organismo emisor',
            'Con los filtros avanzados, buscá por número, año o rango de fechas',
          ]}
          ctaLabel="Ir a búsqueda"
          ctaHref="/busqueda"
        />
        <HomeShowcaseCard
          title="Novedades"
          sampleItems={[
            'Los últimos documentos incorporados al Digesto, del más reciente al más antiguo',
            'Filtrá por tipo o buscá por título, descripción o código',
            'Abrí el detalle de cada normativa o descargá su PDF',
          ]}
          ctaLabel="Ver todas las novedades"
          ctaHref="/novedades"
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
      </section>
    </div>
  )
}
