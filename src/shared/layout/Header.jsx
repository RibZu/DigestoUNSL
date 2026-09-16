import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import Universidad from './Universidad';
import { layoutNavigationSections } from './navigation';
import './Header.css';

function navHref(path) {
  return path.split('/:')[0];
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [renderedPathname, setRenderedPathname] = useState(location.pathname);

  if (location.pathname !== renderedPathname) {
    setRenderedPathname(location.pathname);
    setIsOpen(false);
  }

  return (
    <header className="digesto-header">
   
      <div className="header-top-bar">
        <div className="header-container top-bar-content">
          <span className="institution-name">Universidad Nacional de San Luis</span>
          <div className="top-nav-links">
            <a 
              href="http://www.unsl.edu.ar" 
              target="_blank" 
              rel="noopener noreferrer"
              className="top-link"
            >
              <svg className="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Portal UNSL
            </a>
            <span className="divider">•</span>
            <a 
              href="https://webmail.unsl.edu.ar" 
              target="_blank" 
              rel="noopener noreferrer"
              className="top-link"
            >
              <svg className="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Correo Institucional
            </a>
          </div>
        </div>
      </div>

 
      <nav className="header-main-bar navbar navbar-expand-md" aria-label="Secciones del Digesto">
        <div className="header-container main-bar-content">

          <Link to="/" className="brand-group navbar-brand">
            <Universidad showLogo={false} />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            aria-controls="header-nav-collapse"
            aria-expanded={isOpen}
            aria-label="Abrir menú de navegación"
            onClick={() => setIsOpen((open) => !open)}
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div
            className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}
            id="header-nav-collapse"
          >
            <ul className="header-nav-list navbar-nav">
              {layoutNavigationSections.map((section) => (
                <li key={section.key}>
                  <Link className="header-nav-link" to={navHref(section.path)}>
                    {section.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Universidad showLockup={false} className="d-none d-md-block" />
        </div>
      </nav>
    </header>
  );
}
