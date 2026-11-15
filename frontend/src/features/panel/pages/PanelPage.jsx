import { Link, useOutletContext } from 'react-router'
import EncabezadoPagina from '../../../shared/layout/EncabezadoPagina'
import MensajeVacio from '../../../shared/components/MensajeVacio'
import { MODULOS_PANEL } from '../../../shared/layout/navigation'
import { puedeUsarModulo } from '../../auth'
import './Panel.css'

function PanelPage() {
  const { usuario } = useOutletContext()
  const modulos = MODULOS_PANEL.filter((modulo) => puedeUsarModulo(usuario, modulo))

  return (
    <>
      <EncabezadoPagina titulo="Panel de administración">
        <p>Elegí el módulo con el que vas a trabajar.</p>
      </EncabezadoPagina>

      <nav className="container-xl pb-5" aria-label="Módulos">
        {modulos.length === 0 ? (
          <MensajeVacio texto="No tenés módulos asignados." />
        ) : (
          <ul className="row g-3 list-unstyled mb-0">
            {modulos.map((modulo) => (
              <li key={modulo.clave} className="col-12 col-md-6 col-lg-4">
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
        )}
      </nav>
    </>
  )
}

export default PanelPage
