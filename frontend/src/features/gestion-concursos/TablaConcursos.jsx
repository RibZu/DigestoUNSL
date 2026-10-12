import MensajeVacio from '../../shared/ui/MensajeVacio'
import { estaVigente } from '../../services/concursos.js'
import { formatearFecha } from '../../shared/utils/formato.js'

function periodoDeInscripcion(concurso) {
    const desdes = concurso.llamados.map((llamado) => llamado.inscripcionDesde).filter(Boolean).sort()
    const hastas = concurso.llamados.map((llamado) => llamado.inscripcionHasta).filter(Boolean).sort()
    return { desde: desdes[0] ?? null, hasta: hastas.at(-1) ?? null }
}

export default function TablaConcursos({ concursos, total, dependencias }) {
    return (
        <div className="d-flex flex-column gap-3">
            <p className="small mb-0">La modificación y la baja se habilitan cuando el sitio tenga base de datos.</p>
            <p className="small mb-0" aria-live="polite">
                Mostrando {concursos.length} de {total} concursos
            </p>

            {concursos.length === 0 ? (
                <MensajeVacio texto="No hay concursos con esos criterios." />
            ) : (
                <table className="table tabla-apilada gestion-concursos__tabla">
                    <caption className="visually-hidden">Concursos cargados</caption>
                    <thead>
                        <tr>
                            <th scope="col">Resolución</th>
                            <th scope="col">Dependencia</th>
                            <th scope="col">Llamados</th>
                            <th scope="col">Inscripción</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {concursos.map((concurso) => {
                            const { desde, hasta } = periodoDeInscripcion(concurso)
                            const vigente = concurso.llamados.some(estaVigente)
                            return (
                                <tr key={concurso.id}>
                                    <th scope="row" data-label="Resolución">
                                        <strong>{concurso.codigo}</strong>
                                    </th>
                                    <td data-label="Dependencia">
                                        {dependencias.find((dependencia) => dependencia.codigo === concurso.dependencia)
                                            ?.sigla ?? concurso.dependencia}
                                    </td>
                                    <td data-label="Llamados">
                                        <ul className="list-unstyled mb-0">
                                            {concurso.llamados.map((llamado) => (
                                                <li key={llamado.id}>
                                                    {llamado.cargo} · {llamado.dedicacion} · {llamado.caracter}
                                                    <div className="small">
                                                        {llamado.departamento} — {llamado.area}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td data-label="Inscripción">
                                        del {formatearFecha(desde)} al {formatearFecha(hasta)}
                                    </td>
                                    <td data-label="Estado">
                                        <span className={`badge text-bg-${vigente ? 'success' : 'secondary'}`}>
                                            {vigente ? 'Vigente' : 'Vencido'}
                                        </span>
                                    </td>
                                    <td data-label="Acciones">
                                        <div className="d-flex flex-wrap gap-2">
                                            <button type="button" className="btn btn-sm btn-outline-primary" disabled>
                                                Modificar
                                            </button>
                                            <button type="button" className="btn btn-sm btn-outline-danger" disabled>
                                                Dar de baja
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            )}
        </div>
    )
}
