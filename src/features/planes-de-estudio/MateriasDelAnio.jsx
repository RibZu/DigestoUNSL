const SIN_DATO = '—'

export default function MateriasDelAnio({ titulo, materias }) {
    return (
        <section className="materias-anio">
            <h2 className="materias-anio__titulo">{titulo}</h2>
            <table className="table tabla-apilada materias-tabla">
                <caption className="visually-hidden">Materias de {titulo}</caption>
                <colgroup>
                    <col className="materias-tabla__col-codigo" />
                    <col />
                    <col className="materias-tabla__col-periodo" />
                </colgroup>
                <thead>
                    <tr>
                        <th scope="col">Código</th>
                        <th scope="col">Materia</th>
                        <th scope="col">Período</th>
                    </tr>
                </thead>
                <tbody>
                    {materias.map((materia) => (
                        <tr
                            key={materia.codigo}
                            className={materia.optativa ? 'materias-tabla__fila--optativa' : undefined}
                        >
                            <td data-label="Código">{materia.codigo}</td>
                            <th scope="row" data-label="Materia">
                                {materia.nombre}
                            </th>
                            <td data-label="Período">{materia.periodo ?? SIN_DATO}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    )
}
