import { useEffect, useState } from 'react'

export function useFetch(servicio, parametro) {
  const [version, setVersion] = useState(0)
  const [respuesta, setRespuesta] = useState({
    servicio: null,
    parametro: undefined,
    version: 0,
    datos: null,
    error: null,
  })

  useEffect(() => {
    let ignorar = false

    servicio(parametro)
      .then((datos) => {
        if (!ignorar) setRespuesta({ servicio, parametro, version, datos, error: null })
      })
      .catch((error) => {
        if (!ignorar) setRespuesta({ servicio, parametro, version, datos: null, error })
      })

    return () => {
      ignorar = true
    }
  }, [servicio, parametro, version])

  const cargando =
    respuesta.servicio !== servicio ||
    respuesta.parametro !== parametro ||
    respuesta.version !== version

  function recargar() {
    setVersion(version + 1)
  }

  return {
    datos: cargando ? null : respuesta.datos,
    error: cargando ? null : respuesta.error,
    cargando,
    recargar,
  }
}
