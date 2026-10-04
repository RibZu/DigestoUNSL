import { useState } from 'react'
import Desplegable from '../../shared/ui/Desplegable'
import MensajeVacio from '../../shared/ui/MensajeVacio'
import BarrasEstadistica from './BarrasEstadistica'
import { contar } from './contar.js'
import { obtenerConcursosPorAnio } from '../../services/estadisticas.js'
import { alternar } from '../../shared/utils/listas.js'

export default function EstadisticasConcursos() {
    const [abierto, setAbierto] = useState(false)
    const [aniosAbiertos, setAniosAbiertos] = useState([])
    const anios = obtenerConcursosPorAnio()
    const total = anios.reduce((suma, grupo) => suma + grupo.total, 0)
    const maximo = Math.max(0, ...anios.flatMap((grupo) => grupo.facultades.map((facultad) => facultad.cantidad)))

    function handleAlternar() {
        setAbierto(!abierto)
    }

    function handleAlternarAnio(anio) {
        setAniosAbiertos(alternar(aniosAbiertos, anio))
    }

    return (
        <Desplegable
            id="est-concursos"
            titulo="Concursos por facultad"
            resumen={contar(total, 'llamado', 'llamados')}
            abierto={abierto}
            onAlternar={handleAlternar}
        >
            {anios.length === 0 ? (
                <MensajeVacio texto="No hay llamados a concurso para mostrar." />
            ) : (
                <div className="d-flex flex-column gap-2">
                    {anios.map((grupo) => (
                        <Desplegable
                            key={grupo.anio}
                            id={`est-concursos-${grupo.anio}`}
                            nivel={3}
                            titulo={grupo.anio}
                            resumen={contar(grupo.total, 'llamado', 'llamados')}
                            abierto={aniosAbiertos.includes(grupo.anio)}
                            onAlternar={() => handleAlternarAnio(grupo.anio)}
                        >
                            <BarrasEstadistica
                                filas={grupo.facultades.map((facultad) => ({
                                    clave: facultad.codigo,
                                    etiqueta: facultad.nombre,
                                    cantidad: facultad.cantidad,
                                    texto: contar(facultad.cantidad, 'llamado', 'llamados'),
                                }))}
                                maximo={maximo}
                            />
                        </Desplegable>
                    ))}
                </div>
            )}
        </Desplegable>
    )
}
