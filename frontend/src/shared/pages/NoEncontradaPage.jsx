import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import EncabezadoPagina from '../layout/EncabezadoPagina'

function NoEncontradaPage() {
  const error = useRouteError()
  const esErrorInesperado = Boolean(error) && !(isRouteErrorResponse(error) && error.status === 404)

  return (
    <>
      <EncabezadoPagina titulo={esErrorInesperado ? 'Algo salió mal' : 'Página no encontrada'}>
        <p>
          {esErrorInesperado
            ? 'Ocurrió un error inesperado. Probá volver al inicio.'
            : 'La dirección que buscás no existe o cambió.'}
        </p>
      </EncabezadoPagina>
      <section className="container-xl pb-5">
        <Link to="/" className="btn btn-primary">
          Volver al inicio
        </Link>
      </section>
    </>
  )
}

export default NoEncontradaPage
