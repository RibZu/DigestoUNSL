import { useState } from 'react'
import { useNavigate } from 'react-router'
import EncabezadoPagina from '../../../shared/layout/EncabezadoPagina'
import FormularioLogin from './FormularioLogin'
import { loginService } from '../../../services/auth'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  async function handleIngresar(valores) {
    try {
      setError(null)
      setCargando(true)

      // Llamada real a la API de Node
      await loginService(valores.correo, valores.clave)

      // Redirección al panel privado
      navigate('/login/panel', { replace: true })
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
          <FormularioLogin 
            onIngresar={handleIngresar} 
            error={error} 
            cargando={cargando} 
          />

          <footer className="login-footer">
            Acceso restringido para personal autorizado y carga de documentación oficial.
          </footer>
        </div>
      </section>
    </>
  )
}
