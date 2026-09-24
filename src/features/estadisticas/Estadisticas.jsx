import './Estadisticas.css'

export default function Estadisticas() {
  const indicadores = [
    { title: 'Documentos Registrados', value: '45.280', trend: '+1.200 este año' },
    { title: 'Resoluciones de Rectorado', value: '18.420', trend: '40.6% del total' },
    { title: 'Ordenanzas C. Superior', value: '6.150', trend: '13.5% del total' },
    { title: 'Consultas Mensuales', value: '12.850', trend: '+8% vs mes anterior' },
  ]

  const estadisticasEmisor = [
    { label: 'Rectorado (RR)', count: 18420, percentage: 40.6 },
    { label: 'Consejo Superior (RCS / OCS)', count: 12300, percentage: 27.1 },
    { label: 'Facultad de FCFMyN', count: 5400, percentage: 11.9 },
    { label: 'Facultad de Ciencias de la Salud', count: 4200, percentage: 9.2 },
    { label: 'Otras Dependencias', count: 4960, percentage: 11.2 },
  ]

  const estadisticasAnuales = [
    { label: '2026 (En curso)', count: 850, percentage: 25 },
    { label: '2025', count: 3420, percentage: 100 },
    { label: '2024', count: 3210, percentage: 94 },
    { label: '2023', count: 2980, percentage: 87 },
  ]

  return (
    <div className="estadisticas-page">
      <header className="estadisticas-header">
        <h1>Estadísticas del Digesto</h1>
        <p>Métricas y volumen de documentación administrativa registrada en la UNSL.</p>
      </header>

      <section className="estadisticas-kpis" aria-label="Indicadores principales">
        {indicadores.map((kpi, idx) => (
          <div key={idx} className="kpi-card">
            <span className="kpi-title">{kpi.title}</span>
            <span className="kpi-value">{kpi.value}</span>
            <span className="kpi-trend">{kpi.trend}</span>
          </div>
        ))}
      </section>

      <div className="estadisticas-grid">
        <section className="chart-card">
          <h2>Documentación por Órgano Emisor</h2>
          <div className="chart-bar-list">
            {estadisticasEmisor.map((item, idx) => (
              <div key={idx} className="chart-bar-item">
                <div className="chart-bar-header">
                  <span>{item.label}</span>
                  <span>{item.count.toLocaleString()} ({item.percentage}%)</span>
                </div>
                <div className="chart-bar-track">
                  <div className="chart-bar-fill" style={{ width: `${item.percentage * 2.2}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="chart-card">
          <h2>Normativas por Año de Emisión</h2>
          <div className="chart-bar-list">
            {estadisticasAnuales.map((item, idx) => (
              <div key={idx} className="chart-bar-item">
                <div className="chart-bar-header">
                  <span>{item.label}</span>
                  <span>{item.count.toLocaleString()} normativas</span>
                </div>
                <div className="chart-bar-track">
                  <div className="chart-bar-fill" style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
