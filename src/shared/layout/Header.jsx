import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import Universidad from './Universidad';
import { layoutNavigationSections } from './navigation';
import './Header.css';

const UMBRAL_SCROLL = 50;

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [conFondo, setConFondo] = useState(() => window.scrollY > UMBRAL_SCROLL);
  const location = useLocation();
  const [renderedPathname, setRenderedPathname] = useState(location.pathname);

  useEffect(() => {
    function handleScroll() {
      setConFondo(window.scrollY > UMBRAL_SCROLL);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (location.pathname !== renderedPathname) {
    setRenderedPathname(location.pathname);
    setIsOpen(false);
  }

  return (
    <header className={`digesto-header${conFondo || isOpen ? ' digesto-header--solida' : ''}`}>
      <nav
        className="navbar navbar-expand-md"
        data-bs-theme="dark"
        aria-label="Secciones del Digesto"
      >
        <div className="container-xl">
          <Link to="/" className="navbar-brand header-marca">
            <Universidad variante="barra" />
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
            <ul className="header-nav-list navbar-nav ms-md-auto">
              {layoutNavigationSections.map((section) => (
                <li key={section.key}>
                  <NavLink
                    className="header-nav-link"
                    to={section.path}
                    end={section.path === '/'}
                  >
                    {section.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
