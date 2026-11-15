import { useRef, useState } from 'react'
import CampoFormulario from '../../../shared/components/CampoFormulario'
import { guardarMisDatos } from '../services/miUsuarioService'
import { validarMisDatos } from '../validarMisDatos'

function valoresDesdeRegistro(registro) {
  return {
    nombre: registro.nombre,
    email: registro.email,
    telefono: registro.telefono ?? '',
    dni: registro.dni ?? '',
  }
}

function FormularioMisDatos({ registro, onGuardado }) {
  const [valores, setValores] = useState(valoresDesdeRegistro(registro))
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState(null)
  const [guardado, setGuardado] = useState(false)
  const [estado, setEstado] = useState('escribiendo')
  const formularioRef = useRef(null)

  function propiedades(nombre) {
    return {
      nombre,
      value: valores[nombre],
      error: errores[nombre],
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

    const nuevosErrores = validarMisDatos(valores)
    if (Object.keys(nuevosErrores).length > 0) {
      mostrarErrores(nuevosErrores)
      return
    }

    setErrorGeneral(null)
    setGuardado(false)
    setEstado('enviando')
    try {
      const usuario = await guardarMisDatos(valores)
      setValores(valoresDesdeRegistro(usuario))
      setErrores({})
      setGuardado(true)
      onGuardado(usuario)
    } catch (error) {
      if (error.campos) mostrarErrores(error.campos)
      setErrorGeneral(error.message)
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
          Tus datos se guardaron.
        </div>
      )}

      <fieldset disabled={estado === 'enviando'} className="p-0 m-0 border-0 min-w-0">
        <div className="row g-3 mb-3">
          <CampoFormulario {...propiedades('nombre')} etiqueta="Nombre completo" maxLength={100} />
          <CampoFormulario
            {...propiedades('email')}
            etiqueta="Correo electrónico"
            tipo="email"
            autoComplete="email"
            maxLength={150}
          />
          <CampoFormulario
            {...propiedades('telefono')}
            etiqueta="Teléfono"
            tipo="tel"
            autoComplete="tel"
            maxLength={30}
            ayuda="Opcional."
          />
          <CampoFormulario
            {...propiedades('dni')}
            etiqueta="DNI"
            inputMode="numeric"
            maxLength={8}
            ayuda="Opcional. 7 u 8 dígitos, sin puntos."
          />
        </div>

        <div className="formulario-acciones">
          <button type="submit" className="btn btn-primary">
            {estado === 'enviando' ? 'Guardando...' : 'Guardar mis datos'}
          </button>
        </div>
      </fieldset>
    </form>
  )
}

export default FormularioMisDatos
