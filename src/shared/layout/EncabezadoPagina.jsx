import './EncabezadoPagina.css'

export default function EncabezadoPagina({ titulo, children }) {
    return (
        <header className="encabezado-pagina">
            <div className="container-xl encabezado-pagina__contenido">
                <h1 className="encabezado-pagina__titulo">{titulo}</h1>
                {children}
            </div>
        </header>
    )
}
