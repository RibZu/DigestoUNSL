import { useRef, useState } from 'react'
import { esEmailValido, esRequerido } from '../../../shared/utils/validaciones.js'

const VALORES_INICIALES = { correo: '', clave: '', recordar: false }

function validar(valores) {
    const errores = {}
    if (!esRequerido(valores.correo)) errores.correo = 'Ingresá tu correo.'
    else if (!esEmailValido(valores.correo))
        errores.correo = 'El correo no tiene un formato válido, por ejemplo nombre@unsl.edu.ar.'
    if (!esRequerido(valores.clave)) errores.clave = 'Ingresá tu contraseña.'
    return errores
}

export default function FormularioLogin({ onIngresar }) {
    const [valores, setValores] = useState(VALORES_INICIALES)
    const [errores, setErrores] = useState({})
    const formularioRef = useRef(null)

    function handleChange(e) {
        const { name, value, type, checked } = e.target
        setValores({ ...valores, [name]: type === 'checkbox' ? checked : value })
        if (errores[name]) setErrores({ ...errores, [name]: undefined })
    }

    function handleSubmit(e) {
        e.preventDefault()

        const nuevosErrores = validar(valores)
        setErrores(nuevosErrores)

        const primerCampoConError = Object.keys(nuevosErrores)[0]
        if (primerCampoConError) {
            formularioRef.current.elements[primerCampoConError].focus()
            return
        }

        onIngresar(valores)
    }

    return (
        <form ref={formularioRef} className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="login-form-group">
                <label htmlFor="correo">Correo electrónico</label>
                <input
                    type="email"
                    id="correo"
                    name="correo"
                    className={`form-control${errores.correo ? ' is-invalid' : ''}`}
                    placeholder="nombre@unsl.edu.ar"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    maxLength={254}
                    value={valores.correo}
                    onChange={handleChange}
                />
                {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
            </div>

            <div className="login-form-group">
                <label htmlFor="clave">Contraseña</label>
                <input
                    type="password"
                    id="clave"
                    name="clave"
                    className={`form-control${errores.clave ? ' is-invalid' : ''}`}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    maxLength={128}
                    value={valores.clave}
                    onChange={handleChange}
                />
                {errores.clave && <div className="invalid-feedback">{errores.clave}</div>}
            </div>

            <div className="login-options">
                <label className="login-checkbox-label">
                    <input type="checkbox" name="recordar" checked={valores.recordar} onChange={handleChange} />
                    Recordar mi sesión
                </label>
                <a href="#recuperar" className="login-forgot-link">
                    ¿Olvidaste tu contraseña?
                </a>
            </div>

            <button type="submit" className="btn btn-primary w-100">
                Ingresar al sistema
            </button>
        </form>
    )
}
