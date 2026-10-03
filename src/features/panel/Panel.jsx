import { Link } from 'react-router'
import EncabezadoPagina from '../../shared/layout/EncabezadoPagina'
import './Panel.css'

const MODULOS = [
  {
    clave: 'estadisticas',
    nombre: 'Estadísticas',
    descripcion: 'Términos más buscados y llamados a concurso por año y facultad.',
    ruta: '/login/estadisticas',
  },
  {
    clave: 'alta',
    nombre: 'Gestión y alta de documentos',
    descripcion: 'Carga, edición y baja de los documentos del Digesto.',
    ruta: '/alta',
  },
]

export default function Panel() {
  return (
    <>
      <EncabezadoPagina titulo="Panel de administración">
        <p>Elegí el módulo con el que vas a trabajar.</p>
      </EncabezadoPagina>

      <nav className="container-xl pb-5" aria-label="Módulos">
        <ul className="row g-3 list-unstyled mb-0">
          {MODULOS.map((modulo) => (
            <li key={modulo.clave} className="col-12 col-md-6">
              <article className="card h-100 panel-modulo">
                <div className="card-body">
                  <h2 className="panel-modulo__nombre">
                    <Link className="panel-modulo__enlace stretched-link" to={modulo.ruta}>
                      {modulo.nombre}
                    </Link>
                  </h2>
                  <p className="card-text">{modulo.descripcion}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
