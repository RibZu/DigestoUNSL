import { useEffect, useState } from 'react'

export function useDesplazamiento(umbral) {
  const [desplazada, setDesplazada] = useState(() => window.scrollY > umbral)

  useEffect(() => {
    function handleScroll() {
      setDesplazada(window.scrollY > umbral)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [umbral])

  return desplazada
}
