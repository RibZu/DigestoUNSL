import EncabezadoPagina from '../../../shared/layout/EncabezadoPagina'
import VolverAlPanel from '../../../shared/components/VolverAlPanel'

function AccesoDenegadoPage() {
  return (
    <EncabezadoPagina titulo="Acceso denegado">
      <p>Tu cuenta no tiene permiso para ese módulo.</p>
      <VolverAlPanel />
    </EncabezadoPagina>
  )
}

export default AccesoDenegadoPage
