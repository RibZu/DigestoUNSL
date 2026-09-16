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
            'Búsqueda rápida por texto',
            'Búsqueda avanzada por tipo, órgano emisor y fecha',
            'Búsqueda en el texto del documento',
          ]}
          ctaLabel="Ir a búsqueda"
          ctaHref="/busqueda"
        />
        <HomeShowcaseCard
          title="Novedades"
          sampleItems={[
            'Resolución 145/2026 — Consejo Superior',
            'Ordenanza 12/2026 — Facultad de Ciencias',
            'Resolución 140/2026 — Rectorado',
          ]}
          ctaLabel="Ver todas las novedades"
          ctaHref="/novedades"
        />
        <HomeShowcaseCard
          title="Concursos"
          sampleItems={[
            'Facultad de Ciencias Físico-Matemáticas y Naturales',
            'Facultad de Ciencias de la Salud',
            'Facultad de Ciencias Económicas, Jurídicas y Sociales',
          ]}
          ctaLabel="Ver todos los concursos"
          ctaHref="/concursos"
        />
      </section>
    </div>
  )
}
