import { useState } from 'react'
import './Login.css'

export default function Login() {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Lógica de inicio de sesión frontend
    alert(`Intento de inicio de sesión para: ${usuario}`)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <header className="login-header">
          <h1>Acceso Institucional</h1>
          <p>Digesto Administrativo — Universidad Nacional de San Luis</p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label htmlFor="usuario">Usuario o correo institucional</label>
            <input
              type="text"
              id="usuario"
              className="login-input"
              placeholder="ejemplo@unsl.edu.ar"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              className="login-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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

          <button type="submit" className="login-submit">
            Ingresar al Sistema
          </button>
        </form>

        <footer className="login-footer">
          Acceso restringido para personal autorizado y carga de documentación oficial.
        </footer>
      </div>
    </div>
  )
}
