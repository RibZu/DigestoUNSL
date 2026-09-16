import { Link } from 'react-router'
import './HomeShowcaseCard.css'

export default function HomeShowcaseCard({ title, sampleItems, ctaLabel, ctaHref }) {
  return (
    <div className="home-showcase-card">
      <h2 className="home-showcase-card__title">{title}</h2>
      <ul className="home-showcase-card__list">
        {sampleItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <Link className="home-showcase-card__cta" to={ctaHref}>
        {ctaLabel}
      </Link>
    </div>
  )
}
