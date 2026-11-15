import { useRef, useState } from 'react'
import CampoFormulario from '../../../shared/components/CampoFormulario'
import {
  esDniValido,
  esEmailValido,
  esRequerido,
  esTelefonoValido,
} from '../../../shared/utils/validaciones.js'
import { pedirRestablecimiento } from '../services/restablecimientoService'

const VALORES_INICIALES = { nombre: '', email: '', telefono: '', dni: '' }

function validar(valores) {
  const errores = {}
  if (!esRequerido(valores.nombre)) errores.nombre = 'Ingresá tu nombre.'
  else if (valores.nombre.trim().length > 100)
    errores.nombre = 'El nombre puede tener hasta 100 caracteres.'
  if (!esEmailValido(valores.email))
    errores.email = 'Ingresá un correo válido, por ejemplo nombre@unsl.edu.ar.'
  else if (valores.email.trim().length > 150)
    errores.email = 'El correo puede tener hasta 150 caracteres.'
  if (!esTelefonoValido(valores.telefono))
    errores.telefono = 'Ingresá un teléfono válido, por ejemplo 2664 123456.'
  if (!esDniValido(valores.dni)) errores.dni = 'Ingresá tu DNI sin puntos (7 u 8 dígitos).'
  return errores
}

function FormularioRestablecimiento({ onEnviado }) {
  const [valores, setValores] = useState(VALORES_INICIALES)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState(null)
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
      const respuesta = await pedirRestablecimiento(valores)
      onEnviado(respuesta.mensaje)
    } catch (err) {
      if (err.campos) mostrarErrores(err.campos)
      setErrorGeneral(err.message)
      setEstado('escribiendo')
    }
  }

  return (
    <form ref={formularioRef} onSubmit={handleSubmit} noValidate>
      {errorGeneral && (
        <div className="alert alert-danger py-2 mb-3" role="alert">
          {errorGeneral}
        </div>
      )}

      <div className="row g-3">
        <CampoFormulario
          {...propiedades('nombre')}
          etiqueta="Nombre completo"
          columnas="col-12"
          autoComplete="name"
          maxLength={100}
        />
        <CampoFormulario
          {...propiedades('email')}
          etiqueta="Correo electrónico de la cuenta"
          tipo="email"
          columnas="col-12"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={150}
        />
        <CampoFormulario
          {...propiedades('telefono')}
          etiqueta="Teléfono"
          tipo="tel"
          columnas="col-12"
          autoComplete="tel"
          maxLength={30}
        />
        <CampoFormulario
          {...propiedades('dni')}
          etiqueta="DNI"
          columnas="col-12"
          inputMode="numeric"
          maxLength={8}
        />
        <div className="col-12">
          <button type="submit" className="btn btn-primary w-100" disabled={estado === 'enviando'}>
            {estado === 'enviando' ? 'Enviando...' : 'Enviar pedido'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default FormularioRestablecimiento
