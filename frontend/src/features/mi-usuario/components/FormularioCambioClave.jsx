import { useRef, useState } from 'react'
import CampoClave from '../../../shared/components/CampoClave'
import { cambiarMiClave } from '../services/miUsuarioService'
import { validarCambioClave } from '../validarMisDatos'

const VALORES_INICIALES = { actual: '', nueva: '', confirmacion: '' }

const CAMPOS_DE_LA_API = { password_actual: 'actual', password: 'nueva' }

function erroresDesdeApi(campos) {
  const errores = {}
  for (const [campo, mensaje] of Object.entries(campos)) {
    errores[CAMPOS_DE_LA_API[campo] ?? campo] = mensaje
  }
  return errores
}

function FormularioCambioClave() {
  const [valores, setValores] = useState(VALORES_INICIALES)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState(null)
  const [guardado, setGuardado] = useState(false)
  const [estado, setEstado] = useState('escribiendo')
  const formularioRef = useRef(null)

  function propiedades(nombre, autoComplete) {
    return {
      id: `clave-${nombre}`,
      name: nombre,
      value: valores[nombre],
      error: errores[nombre],
      autoComplete,
      onChange: handleChange,
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setValores({ ...valores, [name]: value })
    setErrores({ ...errores, [name]: undefined })
    setGuardado(false)
  }

  function mostrarErrores(nuevosErrores) {
    setErrores(nuevosErrores)
    const primerCampoConError = Object.keys(nuevosErrores)[0]
    if (primerCampoConError) formularioRef.current.elements[primerCampoConError]?.focus()
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const nuevosErrores = validarCambioClave(valores)
    if (Object.keys(nuevosErrores).length > 0) {
      mostrarErrores(nuevosErrores)
      return
    }

    setErrorGeneral(null)
    setGuardado(false)
    setEstado('enviando')
    try {
      await cambiarMiClave(valores.actual, valores.nueva)
      setValores(VALORES_INICIALES)
      setErrores({})
      setGuardado(true)
    } catch (error) {
      if (error.campos) mostrarErrores(erroresDesdeApi(error.campos))
      else setErrorGeneral(error.message)
    }
    setEstado('escribiendo')
  }

  return (
    <form ref={formularioRef} onSubmit={handleSubmit} noValidate>
      {errorGeneral && (
        <div className="alert alert-danger" role="alert">
          {errorGeneral}
        </div>
      )}

      {guardado && (
        <div className="alert alert-success" role="status">
          Tu contraseña se cambió.
        </div>
      )}

      <fieldset disabled={estado === 'enviando'} className="p-0 m-0 border-0 min-w-0">
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <CampoClave
              {...propiedades('actual', 'current-password')}
              etiqueta="Contraseña actual"
            />
          </div>
          <div className="col-md-4">
            <CampoClave {...propiedades('nueva', 'new-password')} etiqueta="Contraseña nueva" />
            <div className="form-text">Al menos 8 caracteres.</div>
          </div>
          <div className="col-md-4">
            <CampoClave
              {...propiedades('confirmacion', 'new-password')}
              etiqueta="Repetir contraseña nueva"
            />
          </div>
        </div>

        <div className="formulario-acciones">
          <button type="submit" className="btn btn-primary">
            {estado === 'enviando' ? 'Guardando...' : 'Cambiar contraseña'}
          </button>
        </div>
      </fieldset>
    </form>
  )
}

export default FormularioCambioClave
