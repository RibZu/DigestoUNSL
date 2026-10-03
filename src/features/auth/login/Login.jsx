import { useState } from 'react'
import { useNavigate } from 'react-router'
import EncabezadoPagina from '../../../shared/layout/EncabezadoPagina'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/login/panel', { replace: true })
  }

  return (
    <>
      <EncabezadoPagina titulo="Acceso Institucional">
        <p>Digesto Administrativo — Universidad Nacional de San Luis</p>
      </EncabezadoPagina>

      <section className="container-xl login-page">
        <div className="login-card">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="correo">Correo electrónico</label>
              <input
                type="email"
                id="correo"
                name="correo"
                className="form-control"
                placeholder="nombre@unsl.edu.ar"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                maxLength={254}
                pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                title="Ingresá un correo con el formato nombre@dominio.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
              <div className="invalid-feedback">Ingresá un correo válido, por ejemplo nombre@dominio.com.</div>
            </div>

            <div className="login-form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                placeholder="••••••••"
                autoComplete="current-password"
                maxLength={128}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="invalid-feedback">Ingresá tu contraseña.</div>
            </div>

            <div className="login-options">
              <label className="login-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Recordar mi sesión
              </label>
              <a href="#recuperar" className="login-forgot-link">
                ¿Olvidó su clave?
              </a>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Ingresar al Sistema
            </button>
          </form>

          <footer className="login-footer">
            Acceso restringido para personal autorizado y carga de documentación oficial.
          </footer>
        </div>
      </section>
    </>
  )
}
