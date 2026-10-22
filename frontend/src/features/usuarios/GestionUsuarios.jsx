import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router';
import EncabezadoPagina from '../../shared/layout/EncabezadoPagina';
import TablaUsuarios from './components/TablaUsuarios';
import ModalCrearUsuario from './components/ModalCrearUsuario';
import ModalEditarUsuario from './components/ModalEditarUsuario';
import ModalPermisosUsuario from './components/ModalPermisosUsuario';
import {
  listarUsuarios,
  obtenerDependencias,
  crearUsuario,
  actualizarUsuario,
  actualizarPermisos,
} from '../../services/usuarios';
import './GestionUsuarios.css';

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [dependencias, setDependencias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [notificacion, setNotificacion] = useState(null);

  // Filtros unificados y limpios
  const [busqueda, setBusqueda] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('todos'); // 'todos' | 'admin' | 'operador' | 'inactivos'

  // Modales
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [usuarioPermisos, setUsuarioPermisos] = useState(null);
  const [usuarioParaBaja, setUsuarioParaBaja] = useState(null);

  const cargarDatos = useCallback(async () => {
    try {
      setCargando(true);
      const [listaUsuarios, listaDeps] = await Promise.all([
        listarUsuarios(),
        obtenerDependencias(),
      ]);
      setUsuarios(listaUsuarios);
      setDependencias(listaDeps);
    } catch {
      mostrarNotificacion('Error al cargar la información de usuarios.', 'danger');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    let cancelado = false;
    async function inicializar() {
      try {
        const [listaUsuarios, listaDeps] = await Promise.all([
          listarUsuarios(),
          obtenerDependencias(),
        ]);
        if (!cancelado) {
          setUsuarios(listaUsuarios);
          setDependencias(listaDeps);
          setCargando(false);
        }
      } catch {
        if (!cancelado) {
          mostrarNotificacion('Error al cargar la información de usuarios.', 'danger');
          setCargando(false);
        }
      }
    }
    inicializar();
    return () => {
      cancelado = true;
    };
  }, []);

  function mostrarNotificacion(mensaje, tipo = 'success') {
    setNotificacion({ mensaje, tipo });
    setTimeout(() => {
      setNotificacion(null);
    }, 4000);
  }

  // Filtrado reactivo y limpio
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u) => {
      if (busqueda.trim()) {
        const q = busqueda.trim().toLowerCase();
        const coincideNombre = u.nombre.toLowerCase().includes(q);
        const coincideEmail = u.email.toLowerCase().includes(q);
        if (!coincideNombre && !coincideEmail) return false;
      }

      if (filtroActivo === 'admin') return u.es_admin && !u.fecha_baja;
      if (filtroActivo === 'operador') return !u.es_admin && !u.fecha_baja;
      if (filtroActivo === 'inactivos') return Boolean(u.fecha_baja);

      return true;
    });
  }, [usuarios, busqueda, filtroActivo]);

  // Manejadores de acciones
  async function handleCrearUsuario(datos) {
    const creado = await crearUsuario(datos);
    await cargarDatos();
    if (creado.reactivado) {
      mostrarNotificacion(`El usuario "${creado.nombre}" fue reactivado exitosamente.`);
    } else {
      mostrarNotificacion(`Usuario "${creado.nombre}" creado exitosamente.`);
    }
  }

  async function handleGuardarEdicion(id, datos) {
    const actualizado = await actualizarUsuario(id, datos);
    await cargarDatos();
    mostrarNotificacion(`Datos de "${actualizado.nombre}" actualizados.`);
  }

  async function handleGuardarPermisos(id, listaPermisos) {
    await actualizarPermisos(id, listaPermisos);
    await cargarDatos();
    mostrarNotificacion('Permisos actualizados correctamente.');
  }

  async function confirmarToggleBaja() {
    if (!usuarioParaBaja) return;
    const dandoDeBaja = !usuarioParaBaja.fecha_baja;
    try {
      await actualizarUsuario(usuarioParaBaja.id, { baja: dandoDeBaja });
      await cargarDatos();
      mostrarNotificacion(
        dandoDeBaja
          ? `Usuario "${usuarioParaBaja.nombre}" dado de baja.`
          : `Usuario "${usuarioParaBaja.nombre}" reactivado.`
      );
    } catch (err) {
      mostrarNotificacion(err.message || 'Error al modificar estado.', 'danger');
    } finally {
      setUsuarioParaBaja(null);
    }
  }

  return (
    <>
      <EncabezadoPagina titulo="Usuarios y Permisos">
        <p>Cuentas de acceso y permisos por dependencia de la UNSL.</p>
        <Link to="/login/panel" className="btn btn-outline-light btn-sm">
          Volver al panel
        </Link>
      </EncabezadoPagina>

      <main className="container-xl pb-5 gestion-usuarios">
        {/* Notificación limpia */}
        {notificacion && (
          <div
            className={`alert alert-${notificacion.tipo} py-2 px-3 small d-flex align-items-center justify-content-between mb-3 border-0 rounded-3 shadow-sm`}
            role="alert"
          >
            <span>{notificacion.mensaje}</span>
            <button
              type="button"
              className="btn-close btn-close-white"
              style={{ fontSize: '0.65rem' }}
              aria-label="Cerrar"
              onClick={() => setNotificacion(null)}
            ></button>
          </div>
        )}

        {/* Barra de herramientas minimalista */}
        <div className="usuarios-toolbar">
          <div className="usuarios-search">
            <svg
              className="usuarios-search-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              className="form-control form-control-sm"
              placeholder="Buscar por nombre o correo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            {/* Píldoras de filtro */}
            <nav className="filtros-pildoras" aria-label="Filtrar por categoría">
              <button
                type="button"
                className={`filtro-btn ${filtroActivo === 'todos' ? 'active' : ''}`}
                onClick={() => setFiltroActivo('todos')}
              >
                Todos ({usuarios.length})
              </button>
              <button
                type="button"
                className={`filtro-btn ${filtroActivo === 'admin' ? 'active' : ''}`}
                onClick={() => setFiltroActivo('admin')}
              >
                Admins
              </button>
              <button
                type="button"
                className={`filtro-btn ${filtroActivo === 'operador' ? 'active' : ''}`}
                onClick={() => setFiltroActivo('operador')}
              >
                Operadores
              </button>
              <button
                type="button"
                className={`filtro-btn ${filtroActivo === 'inactivos' ? 'active' : ''}`}
                onClick={() => setFiltroActivo('inactivos')}
              >
                Inactivos
              </button>
            </nav>

            <button
              type="button"
              className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1"
              onClick={() => setModalCrearAbierto(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Nuevo usuario
            </button>
          </div>
        </div>

        {/* Tabla */}
        {cargando ? (
          <div className="text-center py-5 text-muted small">
            <div className="spinner-border spinner-border-sm text-secondary me-2" role="status"></div>
            Cargando usuarios...
          </div>
        ) : (
          <TablaUsuarios
            usuarios={usuariosFiltrados}
            onEditar={(u) => setUsuarioEditando(u)}
            onPermisos={(u) => setUsuarioPermisos(u)}
            onToggleBaja={(u) => setUsuarioParaBaja(u)}
          />
        )}
      </main>

      {/* Modales */}
      <ModalCrearUsuario
        abierto={modalCrearAbierto}
        dependencias={dependencias}
        onCerrar={() => setModalCrearAbierto(false)}
        onCrear={handleCrearUsuario}
      />

      <ModalEditarUsuario
        abierto={Boolean(usuarioEditando)}
        usuario={usuarioEditando}
        onCerrar={() => setUsuarioEditando(null)}
        onGuardar={handleGuardarEdicion}
      />

      <ModalPermisosUsuario
        abierto={Boolean(usuarioPermisos)}
        usuario={usuarioPermisos}
        dependencias={dependencias}
        onCerrar={() => setUsuarioPermisos(null)}
        onGuardar={handleGuardarPermisos}
      />

      {/* Modal de confirmación minimalista para Baja / Reactivación */}
      {usuarioParaBaja && (
        <div className="modal fade show d-block modal-minimal" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(15,23,42,0.4)' }}>
          <div className="modal-dialog modal-dialog-centered modal-sm" role="document">
            <div className="modal-content shadow-sm border-0">
              <div className="modal-body p-4 text-center">
                <h6 className="fw-bold text-dark mb-2">
                  {usuarioParaBaja.fecha_baja ? 'Reactivar cuenta' : 'Dar de baja cuenta'}
                </h6>
                <p className="text-muted small mb-3">
                  {usuarioParaBaja.fecha_baja
                    ? `¿Deseas reactivar al usuario ${usuarioParaBaja.nombre}?`
                    : `¿Confirmas dar de baja el acceso para ${usuarioParaBaja.nombre}?`}
                </p>
                <div className="d-flex justify-content-center gap-2">
                  <button
                    type="button"
                    className="btn btn-light btn-sm px-3"
                    onClick={() => setUsuarioParaBaja(null)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm px-3 ${usuarioParaBaja.fecha_baja ? 'btn-success' : 'btn-danger'}`}
                    onClick={confirmarToggleBaja}
                  >
                    {usuarioParaBaja.fecha_baja ? 'Reactivar' : 'Dar de baja'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
