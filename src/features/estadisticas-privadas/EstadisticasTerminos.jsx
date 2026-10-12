import { useState } from 'react'
import Desplegable from '../../shared/ui/Desplegable'
import MensajeVacio from '../../shared/ui/MensajeVacio'
import BarrasEstadistica from './BarrasEstadistica'
import { contar } from './contar.js'
import { obtenerTerminosMasBuscados } from '../../services/estadisticas.js'

export default function EstadisticasTerminos() {
    const [abierto, setAbierto] = useState(false)
    const terminos = obtenerTerminosMasBuscados()
    const maximo = Math.max(0, ...terminos.map((termino) => termino.busquedas))

    function handleAlternar() {
        setAbierto(!abierto)
    }

    return (
        <Desplegable
            id="est-terminos"
            titulo="Términos más buscados"
            resumen={contar(terminos.length, 'término', 'términos')}
            abierto={abierto}
            onAlternar={handleAlternar}
        >
            {terminos.length === 0 ? (
                <MensajeVacio texto="No hay términos buscados para mostrar." />
            ) : (
                <BarrasEstadistica
                    filas={terminos.map((termino) => ({
                        clave: termino.termino,
                        etiqueta: termino.termino,
                        cantidad: termino.busquedas,
                        texto: contar(termino.busquedas, 'búsqueda', 'búsquedas'),
                    }))}
                    maximo={maximo}
                />
            )}
        </Desplegable>
    )
}
