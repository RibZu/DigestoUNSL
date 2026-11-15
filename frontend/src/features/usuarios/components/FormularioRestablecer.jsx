import { useRef, useState } from 'react'
import CampoClave from '../../../shared/components/CampoClave'
import { restablecerClave } from '../services/solicitudesService'

const VALORES_INICIALES = { password: '', confirmacion: '' }

function validar(valores) {
  const errores = {}
  if (valores.password.length < 8)
    errores.password = 'La contraseña tiene que tener al menos 8 caracteres.'
  if (valores.confirmacion !== valores.password)
    errores.confirmacion = 'Las contraseñas no coinciden.'
  return errores
}

function FormularioRestablecer({ solicitud, onRestablecida, onCancelar }) {
  const [valores, setValores] = useState(VALORES_INICIALES)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState(null)
  const [estado, setEstado] = useState('escribiendo')
  const formularioRef = useRef(null)

  function handleChange(e) {
    const { name, value } = e.target
    setValores({ ...valores, [name]: value })
    if (errores[name]) setErrores({ ...errores, [name]: undefined })
  }

  function mostrarErrores(nuevosErrores) {
    setErrores(nuevosErrores)
    const primerCampoConError = Object.keys(nuevosErrores)[0]
    if (primerCampoConError) formularioRef.current.elements[primerCampoConError]?.focus()
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const nuevosErrores = validar(valores)
    if (Object.keys(nuevosErrores).length > 0) {
      mostrarErrores(nuevosErrores)
      return
    }

    setErrorGeneral(null)
    setEstado('enviando')
    try {
      await restablecerClave(solicitud.id, valores.password)
      onRestablecida()
    } catch (err) {
      if (err.campos) mostrarErrores(err.campos)
      setErrorGeneral(err.message)
      setEstado('escribiendo')
    }
  }

  return (
    <form ref={formularioRef} className="card card-body" onSubmit={handleSubmit} noValidate>
      <h3 className="h5 mb-1">
        Restablecer la contraseña de {solicitud.nombre_cuenta ?? solicitud.nombre}
      </h3>
      <p className="small">{solicitud.email}</p>

      {errorGeneral && (
        <div className="alert alert-danger" role="alert">
          {errorGeneral}
        </div>
      )}

      <div className="row g-3">
        <div className="col-md-6">
          <CampoClave
            id={`restablecer-password-${solicitud.id}`}
            name="password"
            etiqueta="Contraseña nueva"
            autoComplete="new-password"
            value={valores.password}
            onChange={handleChange}
            error={errores.password}
          />
        </div>
        <div className="col-md-6">
          <CampoClave
            id={`restablecer-confirmacion-${solicitud.id}`}
            name="confirmacion"
            etiqueta="Repetir contraseña"
            autoComplete="new-password"
            value={valores.confirmacion}
            onChange={handleChange}
            error={errores.confirmacion}
          />
        </div>
      </div>

      <div className="formulario-acciones mt-3">
        <button
          type="button"
          className="btn btn-outline-primary"
          disabled={estado === 'enviando'}
          onClick={onCancelar}
        >
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={estado === 'enviando'}>
          {estado === 'enviando' ? 'Guardando...' : 'Restablecer contraseña'}
        </button>
      </div>
    </form>
  )
}

export default FormularioRestablecer
