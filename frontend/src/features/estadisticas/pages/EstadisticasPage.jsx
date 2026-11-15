import EncabezadoPagina from '../../../shared/layout/EncabezadoPagina'
import BarrasEstadistica from '../../../shared/components/BarrasEstadistica'
import MensajeVacio from '../../../shared/components/MensajeVacio'
import Spinner from '../../../shared/components/Spinner'
import { useFetch } from '../../../shared/hooks/useFetch'
import { anchoRelativo, contar } from '../../../shared/utils/formato.js'
import { obtenerEstadisticas } from '../services/estadisticasService'
import './Estadisticas.css'

function filasDe(items, claveDe, etiquetaDe) {
  const maximo = Math.max(0, ...items.map((item) => item.cantidad))

  return items.map((item) => ({
    clave: claveDe(item),
    etiqueta: etiquetaDe(item),
    texto: contar(item.cantidad, 'documento', 'documentos'),
    ancho: anchoRelativo(item.cantidad, maximo),
  }))
}

function EstadisticasPage() {
  const { datos, cargando, error } = useFetch(obtenerEstadisticas)

  return (
    <>
      <EncabezadoPagina titulo="Estadísticas del Digesto">
        <p>Cantidad de documentos administrativos registrados, por tipo, órgano y año.</p>
      </EncabezadoPagina>

      <div className="container-xl pb-5">
        {cargando && <Spinner texto="Cargando estadísticas..." />}

        {error && <MensajeVacio texto={error.message} />}

        {datos && (
          <div className="estadisticas-page">
            <section className="estadisticas-kpis" aria-label="Indicadores principales">
              <div className="kpi-card">
                <span className="kpi-title">Documentos registrados</span>
                <span className="kpi-value">{datos.total.toLocaleString('es-AR')}</span>
              </div>
              <div className="kpi-card">
                <span className="kpi-title">Del año en curso</span>
                <span className="kpi-value">{datos.del_anio.toLocaleString('es-AR')}</span>
              </div>
            </section>

            <div className="estadisticas-grid">
              <section className="chart-card">
                <h2>Documentos por tipo</h2>
                <BarrasEstadistica
                  filas={filasDe(
                    datos.por_tipo,
                    (item) => item.tipo,
                    (item) => item.tipo,
                  )}
                />
              </section>

              <section className="chart-card">
                <h2>Documentos por órgano</h2>
                <BarrasEstadistica
                  filas={filasDe(
                    datos.por_organo,
                    (item) => item.organo,
                    (item) => item.organo,
                  )}
                />
              </section>

              <section className="chart-card">
                <h2>Documentos por año</h2>
                <BarrasEstadistica
                  filas={filasDe(
                    datos.por_anio,
                    (item) => item.anio,
                    (item) => String(item.anio),
                  )}
                />
              </section>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default EstadisticasPage
