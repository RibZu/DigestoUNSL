import { useState } from 'react'
import { Link } from 'react-router'
import EncabezadoPagina from '../../../shared/layout/EncabezadoPagina'
import FormularioRestablecimiento from '../components/FormularioRestablecimiento'
import './Login.css'

function RestablecerContrasenaPage() {
  const [mensaje, setMensaje] = useState(null)

  function handleEnviado(texto) {
    setMensaje(texto)
  }

  return (
    <>
      <EncabezadoPagina titulo="Restablecer la contraseña">
        <p>
          Completá tus datos. La administración revisa el pedido y se contacta con vos para
          darte una contraseña nueva.
        </p>
      </EncabezadoPagina>

      <section className="container-xl login-page">
        <div className="login-card">
          {mensaje ? (
            <>
              <div className="alert alert-success mb-0" role="status">
                {mensaje}
              </div>
              <Link to="/login">Volver al ingreso</Link>
            </>
          ) : (
            <>
              <FormularioRestablecimiento onEnviado={handleEnviado} />
              <footer className="login-footer">
                <Link to="/login">Volver al ingreso</Link>
              </footer>
            </>
          )}
        </div>
      </section>
    </>
  )
}

export default RestablecerContrasenaPage
