function formatearFecha(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })
}

export default function ConcursosFacultad({ facultad, anios }) {
  return (
    <section className="concursos-facultad">
      <h3 className="concursos-facultad__titulo">
        {facultad.nombre}
        <span className="concursos-facultad__total">
          {facultad.total} {facultad.total === 1 ? 'llamado' : 'llamados'}
        </span>
      </h3>

      {facultad.total === 0 ? (
        <p className="concursos-facultad__vacio">Sin llamados en el período.</p>
      ) : (
        <>
          <table className="table tabla-apilada">
            <caption>Cargos por año</caption>
            <thead>
              <tr>
                <th scope="col">Cargo</th>
                {anios.map((anio) => (
                  <th key={anio} scope="col">
                    {anio}
                  </th>
                ))}
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {facultad.porCargo.map((cargo) => (
                <tr key={cargo.cargo}>
                  <th scope="row" data-label="Cargo">
                    {cargo.cargo}
                  </th>
                  {anios.map((anio) => (
                    <td key={anio} data-label={anio}>
                      {cargo.porAnio[anio] ?? 0}
                    </td>
                  ))}
                  <td data-label="Total">{cargo.total}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <table className="table tabla-apilada">
            <caption>Llamados</caption>
            <thead>
              <tr>
                <th scope="col">Cargo</th>
                <th scope="col">Dedicación</th>
                <th scope="col">Carácter</th>
                <th scope="col">Inscripción</th>
                <th scope="col">Estado</th>
              </tr>
            </thead>
            {facultad.llamadosPorAnio.map((grupo) => (
              <tbody key={grupo.anio}>
                <tr className="estadistica-tabla__anio">
                  <th scope="rowgroup" colSpan={5}>
                    {grupo.anio}
                  </th>
                </tr>
                {grupo.llamados.map((llamado) => (
                  <tr key={llamado.id}>
                    <th scope="row" data-label="Cargo">
                      {llamado.cargo}
                    </th>
                    <td data-label="Dedicación">{llamado.dedicacion}</td>
                    <td data-label="Carácter">{llamado.caracter}</td>
                    <td data-label="Inscripción">
                      {formatearFecha(llamado.inscripcionDesde)} al{' '}
                      {formatearFecha(llamado.inscripcionHasta)}
                    </td>
                    <td data-label="Estado">
                      <span
                        className={`badge ${llamado.vigente ? 'estadistica-estado--vigente' : 'estadistica-estado--vencido'}`}
                      >
                        {llamado.vigente ? 'Vigente' : 'Vencido'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </>
      )}
    </section>
  )
}
