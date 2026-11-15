import { useRef, useState } from 'react'
import AvisoGuardado from '../../../shared/components/AvisoGuardado'
import {
  cambiarCampoDocumento,
  datosDeDocumento,
  esArchivoPdf,
  validarDocumento,
  valoresDesdeRegistro,
} from '../validarDocumento'
import { guardarDocumento } from '../services/documentosService'
import CamposDocumento from './CamposDocumento'

const VALORES_INICIALES = {
  tipo: '',
  organo: '',
  prefijo: '',
  id_dependencia_origen: '',
  numero: '',
  anio: '',
  fecha_emision: '',
  descripcion: '',
}

function FormularioDocumento({ catalogos, registro, onGuardado, onCancelar }) {
  const [valores, setValores] = useState(
    registro ? valoresDesdeRegistro(registro, catalogos) : VALORES_INICIALES,
  )
  const [archivo, setArchivo] = useState(null)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState(null)
  const [guardado, setGuardado] = useState(null)
  const [estado, setEstado] = useState('escribiendo')
  const formularioRef = useRef(null)

  const dependencias = catalogos.dependencias
    .filter((dependencia) => dependencia.numero !== null)
    .map((dependencia) => ({
      valor: String(dependencia.id),
      texto: `${dependencia.sigla} · ${dependencia.nombre}`,
    }))

  function handleChange(e) {
    const { name, value } = e.target
    setValores(cambiarCampoDocumento(valores, name, value))
    setErrores({ ...errores, [name]: undefined })
  }

  function handleArchivo(e) {
    const seleccionado = e.target.files[0]
    if (!seleccionado) {
      setArchivo(null)
      return
    }
    if (!esArchivoPdf(seleccionado)) {
      e.target.value = ''
      setArchivo(null)
      setErrores({ ...errores, archivo: 'Elegí un archivo PDF.' })
      return
    }
    setArchivo(seleccionado)
    setErrores({ ...errores, archivo: undefined })
  }

  function mostrarErrores(nuevosErrores) {
    setErrores(nuevosErrores)
    const primerCampoConError = Object.keys(nuevosErrores)[0]
    if (primerCampoConError) formularioRef.current.elements[primerCampoConError]?.focus()
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const nuevosErrores = validarDocumento({
      valores,
      archivo,
      catalogos,
      anioActual: new Date().getFullYear(),
      esAlta: !registro,
    })
    if (Object.keys(nuevosErrores).length > 0) {
      mostrarErrores(nuevosErrores)
      return
    }

    setErrorGeneral(null)
    setEstado('enviando')
    try {
      const documento = await guardarDocumento(
        registro?.id,
        datosDeDocumento(valores, catalogos, archivo),
      )
      setGuardado(documento)
      setEstado('enviado')
      onGuardado()
    } catch (error) {
      if (error.campos) mostrarErrores(error.campos)
      else setErrorGeneral(error.message)
      setEstado('escribiendo')
    }
  }

  function handleCargarOtro() {
    setValores(VALORES_INICIALES)
    setArchivo(null)
    setErrores({})
    setGuardado(null)
    setEstado('escribiendo')
  }

  if (estado === 'enviado') {
    return (
      <AvisoGuardado
        titulo={`Se guardó el documento ${guardado?.codigo ?? ''}`}
        textoBoton={registro ? 'Volver al panel de gestión' : 'Cargar otro documento'}
        onCargarOtro={registro ? onCancelar : handleCargarOtro}
      />
    )
  }

  return (
    <form ref={formularioRef} onSubmit={handleSubmit} noValidate>
      <h2>{registro ? 'Modificar documento' : 'Cargar documento'}</h2>

      {errorGeneral && (
        <div className="alert alert-danger" role="alert">
          {errorGeneral}
        </div>
      )}

      <fieldset disabled={estado === 'enviando'} className="p-0 m-0 border-0 min-w-0">
        <CamposDocumento
          valores={valores}
          errores={errores}
          catalogos={catalogos}
          dependencias={dependencias}
          archivo={archivo}
          esAlta={!registro}
          titulo="Datos del documento"
          onChange={handleChange}
          onArchivo={handleArchivo}
        />

        <div className="formulario-acciones">
          <button type="button" className="btn btn-outline-primary" onClick={onCancelar}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            {estado === 'enviando' ? 'Guardando...' : 'Guardar documento'}
          </button>
        </div>
      </fieldset>
    </form>
  )
}

export default FormularioDocumento
