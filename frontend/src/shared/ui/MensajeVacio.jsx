export default function MensajeVacio({ texto, children }) {
    return (
        <div className="text-center py-4 px-3 border rounded-3 bg-body-tertiary">
            <p className="mb-0">{texto}</p>
            {children && <div className="mt-2">{children}</div>}
        </div>
    )
}
