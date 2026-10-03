import { Link } from 'react-router'
import EncabezadoPagina from '../layout/EncabezadoPagina'

export default function PaginaNoEncontrada() {
    return (
        <>
            <EncabezadoPagina titulo="Página no encontrada">
                <p>La dirección que buscás no existe o cambió.</p>
            </EncabezadoPagina>
            <section className="container-xl pb-5">
                <Link to="/" className="btn btn-primary">
                    Volver al inicio
                </Link>
            </section>
        </>
    )
}
