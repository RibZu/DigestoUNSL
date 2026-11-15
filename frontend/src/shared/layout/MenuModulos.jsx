import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { MODULOS_PANEL } from './navigation'
import { puedeUsarModulo } from '../../features/auth'

function MenuModulos({ usuario }) {
  const location = useLocation()
  const [abierto, setAbierto] = useState(false)
  const [renderedPathname, setRenderedPathname] = useState(location.pathname)
  const modulos = MODULOS_PANEL.filter((modulo) => puedeUsarModulo(usuario, modulo))
  const enPanel = location.pathname.startsWith('/panel')

  if (location.pathname !== renderedPathname) {
    setRenderedPathname(location.pathname)
    setAbierto(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') setAbierto(false)
  }

  function handleBlur(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) setAbierto(false)
  }

  return (
    <div className="menu-modulos" onKeyDown={handleKeyDown} onBlur={handleBlur}>
      <button
        type="button"
        className={`btn btn-outline-light menu-modulos__boton${enPanel ? ' active' : ''}`}
        aria-expanded={abierto}
        aria-controls="menu-modulos-lista"
        onClick={() => setAbierto(!abierto)}
      >
        Módulos
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {abierto && (
        <ul id="menu-modulos-lista" className="menu-modulos__lista">
          <li className="menu-modulos__sesion">Sesión de {usuario.nombre}</li>
          <li>
            <NavLink className="menu-modulos__enlace" to="/panel" end>
              Panel
            </NavLink>
          </li>
          {modulos.map((modulo) => (
            <li key={modulo.clave}>
              <Link className="menu-modulos__enlace" to={modulo.ruta}>
                {modulo.nombre}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MenuModulos
