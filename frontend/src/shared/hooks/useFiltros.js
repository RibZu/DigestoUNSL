import { useState } from 'react'

export function useFiltros(filas, vacio, coincide) {
  const [aplicado, setAplicado] = useState(vacio)
  const filtradas = (filas ?? []).filter((fila) => coincide(fila, aplicado))

  return { aplicado, setAplicado, filtradas }
}
