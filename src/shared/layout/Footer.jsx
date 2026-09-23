import { Link } from 'react-router';
import Universidad from './Universidad';
import { ayudaSection, estadisticasSection, loginSection } from './navigation';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="digesto-footer">
      <div className="footer-container">
       
        <div className="footer-main-grid">
     
          <div className="footer-col-brand">
            <Universidad variant="dark" />
            <p className="footer-brand-desc">
              Repositorio oficial de resoluciones, ordenanzas y normativas de la{' '}
              <a 
                href="http://www.unsl.edu.ar" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-unsl-link"
              >
                Universidad Nacional de San Luis
              </a>.
            </p>
          </div>

      
          <div className="footer-col-contacts">
            <h2 className="footer-heading">Contacto y Administración</h2>
            <ul className="footer-contact-list">
              <li>
                <span className="contact-role">Administración:</span>
                <span className="contact-email">
                  <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  lruiz@unsl.edu.ar
                </span>
              </li>
            </ul>

            <div className="footer-cta-buttons">
              <Link to={loginSection.path} className="btn btn-light">
                {loginSection.label}
              </Link>
              <Link to={ayudaSection.path} className="btn btn-outline-light">
                {ayudaSection.label}
              </Link>
              <Link to={estadisticasSection.path} className="btn btn-outline-light">
                {estadisticasSection.label}
              </Link>
            </div>
          </div>
        </div>

     
        <div className="footer-bottom-bar">
          <p className="copyright-text">
            &copy; 2026–{currentYear}{' '}
            <a 
              href="http://www.unsl.edu.ar" 
              target="_blank" 
              rel="noopener noreferrer"
              className="copyright-unsl"
            >
              Universidad Nacional de San Luis
            </a>{' '}
            — Todos los Derechos Reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
