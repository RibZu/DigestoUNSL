import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router'
import Universidad from './Universidad'
import MenuModulos from './MenuModulos'
import { layoutNavigationSections } from './navigation'
import { cerrarSesion } from '../../features/auth'
import { useDesplazamiento } from '../hooks/useDesplazamiento'
import './Header.css'

const UMBRAL_SCROLL = 50

function Header({ usuario }) {
  const [isOpen, setIsOpen] = useState(false)
  const desplazada = useDesplazamiento(UMBRAL_SCROLL)
  const location = useLocation()
  const navigate = useNavigate()
  const [renderedPathname, setRenderedPathname] = useState(location.pathname)

  if (location.pathname !== renderedPathname) {
    setRenderedPathname(location.pathname)
    setIsOpen(false)
  }

  function handleCerrarSesion() {
    cerrarSesion()
    navigate('/', { replace: true })
  }

  const transparente = location.pathname === '/' && !desplazada && !isOpen
  const claseEstado = desplazada
    ? ' digesto-header--desplazada'
    : transparente
      ? ' digesto-header--transparente'
      : ''

  return (
    <header className={`digesto-header${claseEstado}`}>
      <nav className="navbar navbar-expand-lg" data-bs-theme="dark" aria-label="Secciones del Digesto">
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

          <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="header-nav-collapse">
            <ul className="header-nav-list navbar-nav ms-lg-auto align-items-lg-center">
              {layoutNavigationSections.map((section) => (
                <li key={section.key}>
                  <NavLink className="header-nav-link" to={section.path} end={section.path === '/'}>
                    {section.label}
                  </NavLink>
                </li>
              ))}
              {usuario && (
                <>
                  <li className="header-acceso">
                    <MenuModulos usuario={usuario} />
                  </li>
                  <li className="header-acceso">
                    <button
                      type="button"
                      className="btn btn-outline-light header-salir"
                      onClick={handleCerrarSesion}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Cerrar sesión
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
