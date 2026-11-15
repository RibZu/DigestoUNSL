import { Link } from 'react-router'
import Universidad from './Universidad'
import { ayudaSection, ingresoSection } from './navigation'
import './Footer.css'

const ANIO_ACTUAL = new Date().getFullYear()

function Footer() {
  return (
    <footer className="digesto-footer">
      <div className="container-xl">
        <div className="footer-grid">
          <section className="footer-marca">
            <Universidad variante="pie" />
            <p className="footer-descripcion">
              Repositorio oficial de resoluciones, ordenanzas y normativas de la{' '}
              <a
                href="http://www.unsl.edu.ar"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-enlace"
              >
                Universidad Nacional de San Luis
              </a>
              .
            </p>
          </section>

          <section className="footer-contacto">
            <h2 className="footer-titulo">Contacto</h2>
            <ul className="footer-lista-contacto">
              <li>
                <span className="footer-correo">
                  <svg
                    className="footer-icono"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  simonriberi@outlook.com
                </span>
              </li>
            </ul>
            <div className="d-flex flex-wrap gap-2">
              <Link to={ayudaSection.path} className="btn btn-primary footer-accion">
                {ayudaSection.label}
              </Link>
              <Link to={ingresoSection.path} className="btn btn-primary footer-accion">
                {ingresoSection.label}
              </Link>
            </div>
          </section>
        </div>

        <p className="footer-legal">
          &copy; 2026–{ANIO_ACTUAL}{' '}
          <a
            href="http://www.unsl.edu.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-enlace"
          >
            Universidad Nacional de San Luis
          </a>{' '}
          — Todos los Derechos Reservados.
        </p>
        <p className="footer-firma">
          Desarrollado por{' '}
          <a
            href="https://simonriberi.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-enlace"
          >
            Simón Riberi Zunino
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
