import { useState } from 'react'
import Filtros from '../../../shared/components/Filtros'
import MensajeVacio from '../../../shared/components/MensajeVacio'
import PantallaGestion from '../../../shared/components/PantallaGestion'
import Spinner from '../../../shared/components/Spinner'
import TablaGestion from '../../../shared/components/TablaGestion'
import { useFetch } from '../../../shared/hooks/useFetch'
import { useFiltros } from '../../../shared/hooks/useFiltros'
import { contieneTexto } from '../../../shared/utils/listas.js'
import { obtenerCatalogos } from '../../catalogos'
import FormularioUsuario from '../components/FormularioUsuario'
import ConfirmarAccion from '../../../shared/components/ConfirmarAccion'
import SolicitudesRestablecimiento from '../components/SolicitudesRestablecimiento'
import { obtenerSolicitudesPendientes } from '../services/solicitudesService'
import { cambiarBajaUsuario, obtenerUsuarios } from '../services/usuariosService'

const FILTROS_VACIOS = { texto: '', rol: '', estado: '' }

const MODULOS_ADMIN = ['Documentos', 'Concursos', 'Usuarios', 'Estadísticas']

const OPCIONES_ROL = [
  { valor: 'administrador', texto: 'Administrador' },
  { valor: 'moderador', texto: 'Moderador' },
]

const OPCIONES_ESTADO = [
  { valor: 'activa', texto: 'Activa' },
  { valor: 'baja', texto: 'Dada de baja' },
]

function coincide(usuario, filtros) {
  return (
    contieneTexto([usuario.nombre, usuario.email], filtros.texto) &&
    (filtros.rol === '' || (filtros.rol === 'administrador') === usuario.es_admin) &&
    (filtros.estado === '' || (filtros.estado === 'baja') === Boolean(usuario.fecha_baja))
  )
}

function siglasDe(usuario) {
  return [...new Set(usuario.permisos.map((permiso) => permiso.sigla))]
}

const COLUMNAS = [
  {
    clave: 'cuenta',
    encabezado: 'Cuenta',
    celda: (usuario) => (
      <>
        <strong>{usuario.nombre}</strong>
        <div className="small">{usuario.email}</div>
      </>
    ),
  },
  {
    clave: 'rol',
    encabezado: 'Rol',
    celda: (usuario) => (
      <span className={`badge text-bg-${usuario.es_admin ? 'primary' : 'secondary'}`}>
        {usuario.es_admin ? 'Administrador' : 'Moderador'}
      </span>
    ),
  },
  {
    clave: 'permisos',
    encabezado: 'Permisos',
    celda: (usuario) => {
      const etiquetas = usuario.es_admin ? MODULOS_ADMIN : siglasDe(usuario)
      if (etiquetas.length === 0) return 'Sin permisos'
      return (
        <div className="d-flex flex-wrap gap-1 justify-content-end justify-content-md-start">
          {etiquetas.map((etiqueta) => (
            <span key={etiqueta} className="badge text-bg-light border">
              {etiqueta}
            </span>
          ))}
        </div>
      )
    },
  },
  {
    clave: 'estado',
    encabezado: 'Estado',
    celda: (usuario) => (
      <span className={`badge text-bg-${usuario.fecha_baja ? 'secondary' : 'success'}`}>
        {usuario.fecha_baja ? 'Dada de baja' : 'Activa'}
      </span>
    ),
  },
]

function GestionUsuariosPage() {
  const [vista, setVista] = useState('lista')
  const [registro, setRegistro] = useState(null)
  const [baja, setBaja] = useState(null)
  const [pestania, setPestania] = useState('cuentas')
  const usuariosPedidos = useFetch(obtenerUsuarios)
  const solicitudesPedidas = useFetch(obtenerSolicitudesPendientes)
  const catalogosPedidos = useFetch(obtenerCatalogos)
  const { aplicado, setAplicado, filtradas } = useFiltros(
    usuariosPedidos.datos,
    FILTROS_VACIOS,
    coincide,
  )

  const usuarios = usuariosPedidos.datos
  const catalogos = catalogosPedidos.datos
  const cargando = usuariosPedidos.cargando || catalogosPedidos.cargando
  const error = usuariosPedidos.error ?? catalogosPedidos.error
  const solicitudes = solicitudesPedidas.datos

  function handleVerLista() {
    setRegistro(null)
    setVista('lista')
  }

  function handleVerCuentas() {
    setPestania('cuentas')
  }

  function handleVerSolicitudes() {
    setPestania('solicitudes')
  }

  function handleSolicitudResuelta() {
    solicitudesPedidas.recargar()
    usuariosPedidos.recargar()
  }

  function handleVerFormulario() {
    setRegistro(null)
    setVista('formulario')
  }

  function handleModificar(usuario) {
    setRegistro(usuario)
    setVista('formulario')
  }

  function handlePedirCambioDeBaja(usuario) {
    setBaja({ usuario, enviando: false, error: null })
  }

  async function handleConfirmarBaja() {
    setBaja({ ...baja, enviando: true, error: null })
    try {
      await cambiarBajaUsuario(baja.usuario.id, !baja.usuario.fecha_baja)
      setBaja(null)
      usuariosPedidos.recargar()
    } catch (err) {
      setBaja({ ...baja, enviando: false, error: err.message })
    }
  }

  function accionesDe(usuario) {
    return [
      { texto: 'Modificar', variante: 'primary', onClick: handleModificar },
      usuario.fecha_baja
        ? { texto: 'Reactivar', variante: 'success', onClick: handlePedirCambioDeBaja }
        : { texto: 'Dar de baja', variante: 'danger', onClick: handlePedirCambioDeBaja },
    ]
  }

  return (
    <PantallaGestion
      titulo="Gestión de usuarios"
      descripcion="Cuentas institucionales y permisos por dependencia."
      textoAlta="Cargar nuevo usuario"
      vista={vista}
      onVerLista={handleVerLista}
      onVerFormulario={handleVerFormulario}
    >
      {vista === 'lista' && (
        <ul className="nav nav-tabs" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              type="button"
              role="tab"
              id="pestania-cuentas"
              aria-selected={pestania === 'cuentas'}
              aria-controls="panel-cuentas"
              className={`nav-link${pestania === 'cuentas' ? ' active' : ''}`}
              onClick={handleVerCuentas}
            >
              Cuentas
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              type="button"
              role="tab"
              id="pestania-solicitudes"
              aria-selected={pestania === 'solicitudes'}
              aria-controls="panel-solicitudes"
              className={`nav-link${pestania === 'solicitudes' ? ' active' : ''}`}
              onClick={handleVerSolicitudes}
            >
              Solicitudes de restablecimiento
              {solicitudes && <span className="badge text-bg-primary ms-2">{solicitudes.length}</span>}
            </button>
          </li>
        </ul>
      )}

      {vista === 'lista' && pestania === 'solicitudes' && (
        <div id="panel-solicitudes" role="tabpanel" aria-labelledby="pestania-solicitudes">
          {solicitudesPedidas.cargando && <Spinner texto="Cargando pedidos..." />}
          {solicitudesPedidas.error && <MensajeVacio texto={solicitudesPedidas.error.message} />}
          {solicitudes && (
            <SolicitudesRestablecimiento
              solicitudes={solicitudes}
              onResuelta={handleSolicitudResuelta}
            />
          )}
        </div>
      )}

      {vista === 'lista' && pestania === 'cuentas' && (
        <div
          id="panel-cuentas"
          role="tabpanel"
          aria-labelledby="pestania-cuentas"
          className="d-flex flex-column gap-3"
        >
          {cargando && <Spinner texto="Cargando usuarios..." />}

          {error && <MensajeVacio texto={error.message} />}

          {usuarios && catalogos && (
            <>
              <Filtros
                id="gestion-usuarios"
                placeholder="Nombre o correo"
                selects={[
                  { name: 'rol', etiqueta: 'Rol', todas: 'Todos', opciones: OPCIONES_ROL },
                  { name: 'estado', etiqueta: 'Estado', todas: 'Todos', opciones: OPCIONES_ESTADO },
                ]}
                vacio={FILTROS_VACIOS}
                aplicado={aplicado}
                onAplicar={setAplicado}
              />
              {baja && (
                <>
                  {baja.error && (
                    <div className="alert alert-danger mb-0" role="alert">
                      {baja.error}
                    </div>
                  )}
                  <ConfirmarAccion
                    texto={`¿${baja.usuario.fecha_baja ? 'Reactivar' : 'Dar de baja'} la cuenta ${baja.usuario.email}?`}
                    textoConfirmar={baja.usuario.fecha_baja ? 'Reactivar' : 'Dar de baja'}
                    variante={baja.usuario.fecha_baja ? 'success' : 'danger'}
                    enviando={baja.enviando}
                    onConfirmar={handleConfirmarBaja}
                    onCancelar={() => setBaja(null)}
                  />
                </>
              )}
              <TablaGestion
                titulo="Usuarios cargados"
                columnas={COLUMNAS}
                filas={filtradas}
                claveDeFila={(usuario) => usuario.id}
                total={usuarios.length}
                unidad="usuarios"
                vacio="No hay usuarios con esos criterios."
                acciones={accionesDe}
              />
            </>
          )}
        </div>
      )}

      {catalogos && vista === 'formulario' && (
        <FormularioUsuario
          key={registro?.id ?? 'nuevo'}
          dependencias={catalogos.dependencias}
          registro={registro}
          onGuardado={usuariosPedidos.recargar}
          onCancelar={handleVerLista}
        />
      )}
    </PantallaGestion>
  )
}

export default GestionUsuariosPage
