import { useRef, useState } from 'react'
import AvisoGuardado from '../../../shared/components/AvisoGuardado'
import CampoFormulario from '../../../shared/components/CampoFormulario'
import { guardarUsuario } from '../services/usuariosService'
import { validarUsuario } from '../validarUsuario'
import ListaPermisos from './ListaPermisos'

const VALORES_INICIALES = {
  nombre: '',
  email: '',
  telefono: '',
  dni: '',
  password: '',
  confirmacion: '',
  es_admin: false,
  permisos: [],
}

function valoresDesdeRegistro(registro) {
  return {
    nombre: registro.nombre,
    email: registro.email,
    telefono: registro.telefono ?? '',
    dni: registro.dni ?? '',
    password: '',
    confirmacion: '',
    es_admin: registro.es_admin,
    permisos: registro.permisos.map(({ id_dependencia, modulo }) => ({ id_dependencia, modulo })),
  }
}

function FormularioUsuario({ dependencias, registro, onGuardado, onCancelar }) {
  const [valores, setValores] = useState(registro ? valoresDesdeRegistro(registro) : VALORES_INICIALES)
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
    const { name, value, type, checked } = e.target
    const siguiente = { ...valores, [name]: type === 'checkbox' ? checked : value }
    let limpiar = { [name]: undefined }

    if (name === 'es_admin' && checked) {
      siguiente.permisos = []
      limpiar = { ...limpiar, permisos: undefined }
    }

    setValores(siguiente)
    setErrores({ ...errores, ...limpiar })
  }

  function handleCambiarPermiso(idDependencia, modulo) {
    const existe = valores.permisos.some(
      (permiso) => permiso.id_dependencia === idDependencia && permiso.modulo === modulo,
    )
    const permisos = existe
      ? valores.permisos.filter(
          (permiso) => !(permiso.id_dependencia === idDependencia && permiso.modulo === modulo),
        )
      : [...valores.permisos, { id_dependencia: idDependencia, modulo }]

    setValores({ ...valores, permisos })
    setErrores({ ...errores, permisos: undefined })
  }

  function mostrarErrores(nuevosErrores) {
    setErrores(nuevosErrores)
    const primerCampoConError = Object.keys(nuevosErrores)[0]
    if (primerCampoConError) formularioRef.current.elements[primerCampoConError]?.focus()
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const nuevosErrores = validarUsuario(valores, !registro)
    if (Object.keys(nuevosErrores).length > 0) {
      mostrarErrores(nuevosErrores)
      return
    }

    setErrorGeneral(null)
    setEstado('enviando')
    try {
      await guardarUsuario(registro?.id, valores, valores.permisos)
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
    setErrores({})
    setEstado('escribiendo')
  }

  if (estado === 'enviado') {
    return (
      <AvisoGuardado
        titulo={`Se guardó la cuenta ${valores.email.trim()}`}
        textoBoton={registro ? 'Volver al panel de gestión' : 'Cargar otro usuario'}
        onCargarOtro={registro ? onCancelar : handleCargarOtro}
      />
    )
  }

  return (
    <form ref={formularioRef} onSubmit={handleSubmit} noValidate>
      <h2>{registro ? 'Modificar usuario' : 'Cargar usuario'}</h2>

      {errorGeneral && (
        <div className="alert alert-danger" role="alert">
          {errorGeneral}
        </div>
      )}

      <fieldset disabled={estado === 'enviando'} className="p-0 m-0 border-0 min-w-0">
        <fieldset className="formulario-bloque">
          <legend className="h5">Datos de la cuenta</legend>
          <div className="row g-3">
            <CampoFormulario {...propiedades('nombre')} etiqueta="Nombre completo" maxLength={100} />
            <CampoFormulario
              {...propiedades('email')}
              etiqueta="Correo electrónico"
              tipo="email"
              autoComplete="off"
              maxLength={150}
            />
            <CampoFormulario
              {...propiedades('telefono')}
              etiqueta="Teléfono (opcional)"
              tipo="tel"
              autoComplete="off"
              maxLength={30}
            />
            <CampoFormulario
              {...propiedades('dni')}
              etiqueta="DNI (opcional)"
              inputMode="numeric"
              autoComplete="off"
              maxLength={8}
            />
            <CampoFormulario
              {...propiedades('password')}
              etiqueta="Contraseña"
              tipo="password"
              autoComplete="new-password"
              ayuda={registro ? 'Dejala vacía para no cambiarla. Al menos 8 caracteres.' : 'Al menos 8 caracteres.'}
            />
            <CampoFormulario
              {...propiedades('confirmacion')}
              etiqueta="Repetir contraseña"
              tipo="password"
              autoComplete="new-password"
            />
            <div className="col-12">
              <div className="form-check form-switch">
                <input
                  id="es_admin"
                  name="es_admin"
                  type="checkbox"
                  role="switch"
                  className="form-check-input"
                  checked={valores.es_admin}
                  onChange={handleChange}
                />
                <label htmlFor="es_admin" className="form-check-label">
                  Cuenta de administrador (accede a todos los módulos)
                </label>
              </div>
            </div>
          </div>
        </fieldset>

        <ListaPermisos
          dependencias={dependencias}
          permisos={valores.permisos}
          deshabilitada={valores.es_admin}
          error={errores.permisos}
          onCambiar={handleCambiarPermiso}
        />

        <div className="formulario-acciones">
          <button type="button" className="btn btn-outline-primary" onClick={onCancelar}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            {estado === 'enviando' ? 'Guardando...' : registro ? 'Guardar cambios' : 'Crear usuario'}
          </button>
        </div>
      </fieldset>
    </form>
  )
}

export default FormularioUsuario
