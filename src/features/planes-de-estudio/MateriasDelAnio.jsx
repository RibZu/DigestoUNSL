const SIN_DATO = '—'

export default function MateriasDelAnio({ titulo, materias }) {
    return (
        <section className="materias-anio">
            <h2 className="materias-anio__titulo">{titulo}</h2>
            <table className="table tabla-apilada materias-tabla">
                <caption className="visually-hidden">Materias de {titulo}</caption>
                <thead>
                    <tr>
                        <th scope="col">Código</th>
                        <th scope="col">Materia</th>
                        <th scope="col">Período</th>
                        <th scope="col">Tipo de cursado</th>
                        <th scope="col">Correlativas</th>
                    </tr>
                </thead>
                <tbody>
                    {materias.map((materia) => (
                        <tr
                            key={materia.orden}
                            className={materia.optativa ? 'materias-tabla__fila--optativa' : undefined}
                        >
                            <td data-label="Código">{materia.codigo}</td>
                            <th scope="row" data-label="Materia">
                                {materia.nombre}
                            </th>
                            <td data-label="Período">{materia.periodo ?? SIN_DATO}</td>
                            <td data-label="Tipo de cursado">{materia.tipoCursado ?? SIN_DATO}</td>
                            <td data-label="Correlativas">
                                {materia.correlativas ? (
                                    <a
                                        href={materia.correlativas.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label={`Ver correlativas de ${materia.nombre} (se abre en una pestaña nueva)`}
                                    >
                                        Ver correlativas ({materia.correlativas.cantidad})
                                    </a>
                                ) : (
                                    'No tiene'
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    )
}
