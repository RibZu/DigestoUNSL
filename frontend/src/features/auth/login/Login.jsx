import { useNavigate } from 'react-router'
import EncabezadoPagina from '../../../shared/layout/EncabezadoPagina'
import FormularioLogin from './FormularioLogin'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()

  function handleIngresar() {
    navigate('/login/panel', { replace: true })
  }

  return (
    <>
      <EncabezadoPagina titulo="Acceso institucional">
        <p>Digesto Administrativo — Universidad Nacional de San Luis</p>
      </EncabezadoPagina>

      <section className="container-xl login-page">
        <div className="login-card">
          <FormularioLogin onIngresar={handleIngresar} />

          <footer className="login-footer">
            Acceso restringido para personal autorizado y carga de documentación oficial.
          </footer>
        </div>
      </section>
    </>
  )
}
