import { useRef, useState } from 'react'
import AvisoGuardado from '../../../shared/components/AvisoGuardado'
import {
  CamposDocumento,
  cambiarCampoDocumento,
  datosDeDocumento,
  esArchivoPdf,
  valoresDesdeRegistro,
} from '../../gestion-documentos'
import { guardarConcurso } from '../services/gestionConcursosService'
import { llamadosParaEnviar, validarConcurso } from '../validarConcurso'
import CamposLlamado from './CamposLlamado'

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

function catalogosDeConcurso(catalogos) {
  return {
    ...catalogos,
    tiposDocumento: catalogos.tiposDocumento.filter((tipo) => tipo.nombre === 'Resoluciones'),
    prefijos: catalogos.prefijos.filter(
      (prefijo) =>
        prefijo.tipo_nombre === 'Resoluciones' && prefijo.ambito === 'facultad' && !prefijo.fecha_baja,
    ),
  }
}

function valoresIniciales(registro, catalogos, idResoluciones) {
  if (!registro) return { ...VALORES_INICIALES, tipo: idResoluciones }
  const valores = { ...valoresDesdeRegistro(registro, catalogos), tipo: idResoluciones }
  const delTipo = catalogos.prefijos.some((prefijo) => prefijo.prefijo === registro.prefijo)
  return delTipo ? valores : { ...valores, organo: '', prefijo: '' }
}

function crearLlamadoVacio() {
  return {
    id: crypto.randomUUID(),
    idServidor: null,
    departamento: '',
    id_area: '',
    cargo: '',
    dedicacion: '',
    caracter: '',
    inscripcionDesde: '',
    inscripcionHasta: '',
  }
}

function llamadosDesdeRegistro(registro) {
  return registro.llamados.map((llamado) => ({
    id: crypto.randomUUID(),
    idServidor: llamado.id,
    departamento: String(llamado.departamento_id),
    id_area: String(llamado.id_area),
    cargo: llamado.cargo,
    dedicacion: llamado.dedicacion ?? '',
    caracter: llamado.caracter,
    inscripcionDesde: llamado.inscripcionDesde ?? '',
    inscripcionHasta: llamado.inscripcionHasta ?? '',
  }))
}

function FormularioConcurso({ catalogos: catalogosCompletos, registro, onGuardado, onCancelar }) {
  const catalogos = catalogosDeConcurso(catalogosCompletos)
  const idResoluciones = String(catalogos.tiposDocumento[0]?.id ?? '')
  const [valores, setValores] = useState(() => valoresIniciales(registro, catalogos, idResoluciones))
  const [llamados, setLlamados] = useState(() =>
    registro ? llamadosDesdeRegistro(registro) : [crearLlamadoVacio()],
  )
  const [archivo, setArchivo] = useState(null)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState(null)
  const [guardado, setGuardado] = useState(null)
  const [estado, setEstado] = useState('escribiendo')
  const formularioRef = useRef(null)

  const departamentos = catalogosCompletos.departamentos.filter(
    (departamento) => String(departamento.id_dependencia) === valores.id_dependencia_origen,
  )
  const dependencias = catalogosCompletos.dependencias
    .filter((dependencia) => dependencia.es_facultad && dependencia.numero !== null)
    .map((dependencia) => ({
      valor: String(dependencia.id),
      texto: `${dependencia.sigla} · ${dependencia.nombre}`,
    }))

  function handleChange(e) {
    const { name, value } = e.target
    setValores(cambiarCampoDocumento(valores, name, value))
    setErrores({ ...errores, [name]: undefined })

    if (name === 'id_dependencia_origen') {
      setLlamados(
        llamados.map((llamado) => ({ ...llamado, departamento: '', id_area: '' })),
      )
    }
  }

  function handleCambiarLlamado(id, campo, valor) {
    setLlamados(
      llamados.map((llamado) =>
        llamado.id === id
          ? { ...llamado, [campo]: valor, ...(campo === 'departamento' ? { id_area: '' } : {}) }
          : llamado,
      ),
    )
    setErrores({ ...errores, [`${campo}-${id}`]: undefined })
  }

  function handleAgregarLlamado() {
    setLlamados([...llamados, crearLlamadoVacio()])
  }

  function handleQuitarLlamado(id) {
    if (llamados.length === 1) return
    setLlamados(llamados.filter((llamado) => llamado.id !== id))
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

    const nuevosErrores = validarConcurso({
      valores,
      llamados,
      archivo,
      catalogos,
      anioActual: new Date().getFullYear(),
      esAlta: !registro,
    })
    if (Object.keys(nuevosErrores).length > 0) {
      mostrarErrores(nuevosErrores)
      return
    }

    const datos = datosDeDocumento(valores, catalogos, archivo)
    datos.append('llamados', JSON.stringify(llamadosParaEnviar(llamados)))

    setErrorGeneral(null)
    setEstado('enviando')
    try {
      const concurso = await guardarConcurso(registro?.id, datos)
      setGuardado(concurso)
      setEstado('enviado')
      onGuardado()
    } catch (error) {
      if (error.campos) {
        const camposDelDocumento = Object.fromEntries(
          Object.entries(error.campos).filter(([campo]) => !campo.startsWith('llamados')),
        )
        mostrarErrores(camposDelDocumento)
      }
      setErrorGeneral(error.message)
      setEstado('escribiendo')
    }
  }

  function handleCargarOtro() {
    setValores({ ...VALORES_INICIALES, tipo: idResoluciones })
    setLlamados([crearLlamadoVacio()])
    setArchivo(null)
    setErrores({})
    setGuardado(null)
    setEstado('escribiendo')
  }

  if (estado === 'enviado') {
    return (
      <AvisoGuardado
        titulo={`Se guardó el concurso ${guardado?.codigo ?? ''}`}
        textoBoton={registro ? 'Volver al panel de gestión' : 'Cargar otro concurso'}
        onCargarOtro={registro ? onCancelar : handleCargarOtro}
      />
    )
  }

  return (
    <form ref={formularioRef} onSubmit={handleSubmit} noValidate>
      <h2>{registro ? 'Modificar concurso' : 'Cargar concurso'}</h2>

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
          tipoFijo
          titulo="1. Resolución"
          onChange={handleChange}
          onArchivo={handleArchivo}
        />

        <fieldset className="formulario-bloque">
          <legend className="h5">2. Llamados (uno por cargo)</legend>
          {llamados.map((llamado, posicion) => (
            <CamposLlamado
              key={llamado.id}
              llamado={llamado}
              numero={posicion + 1}
              errores={errores}
              departamentos={departamentos}
              areas={catalogosCompletos.areas}
              cargos={catalogosCompletos.cargos}
              dedicaciones={catalogosCompletos.dedicaciones}
              caracteres={catalogosCompletos.caracteres}
              puedeQuitarse={llamados.length > 1}
              onCambiar={handleCambiarLlamado}
              onQuitar={handleQuitarLlamado}
            />
          ))}
          <button type="button" className="btn btn-outline-primary" onClick={handleAgregarLlamado}>
            + Agregar otro llamado
          </button>
        </fieldset>

        <div className="formulario-acciones">
          <button type="button" className="btn btn-outline-primary" onClick={onCancelar}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            {estado === 'enviando' ? 'Guardando...' : 'Guardar concurso'}
          </button>
        </div>
      </fieldset>
    </form>
  )
}

export default FormularioConcurso
