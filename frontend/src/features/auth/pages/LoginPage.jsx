import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import EncabezadoPagina from '../../../shared/layout/EncabezadoPagina'
import FormularioLogin from '../components/FormularioLogin'
import { iniciarSesion } from '../services/authService'
import './Login.css'

function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  async function handleIngresar(valores) {
    try {
      setError(null)
      setCargando(true)

      await iniciarSesion(valores.correo, valores.clave, valores.recordar)

      const destino = searchParams.get('destino')
      navigate(destino?.startsWith('/panel') ? destino : '/panel', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <>
      <EncabezadoPagina titulo="Acceso institucional">
        <p>Digesto Administrativo — Universidad Nacional de San Luis</p>
      </EncabezadoPagina>

      <section className="container-xl login-page">
        <div className="login-card">
          <FormularioLogin onIngresar={handleIngresar} error={error} cargando={cargando} />

          <footer className="login-footer">
            Acceso restringido para personal autorizado y carga de documentación oficial.
          </footer>
        </div>
      </section>
    </>
  )
}

export default LoginPage
