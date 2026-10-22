import { useState, useMemo } from 'react';
import { esRequerido, esEmailValido } from '../../../shared/utils/validaciones.js';

export default function ModalCrearUsuario({ abierto, dependencias = [], onCerrar, onCrear }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [esAdmin, setEsAdmin] = useState(false);
  const [permisosActivos, setPermisosActivos] = useState(new Set());
  const [busquedaPermisos, setBusquedaPermisos] = useState('');
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');

  const dependenciasFiltradas = useMemo(() => {
    if (!busquedaPermisos.trim()) return dependencias;
    const q = busquedaPermisos.trim().toLowerCase();
    return dependencias.filter(
      (d) => d.sigla.toLowerCase().includes(q) || d.nombre.toLowerCase().includes(q)
    );
  }, [dependencias, busquedaPermisos]);

  if (!abierto) return null;

  function togglePermiso(idDependencia, modulo) {
    const key = `${idDependencia}:${modulo}`;
    setPermisosActivos((prev) => {
      const nuevo = new Set(prev);
      if (nuevo.has(key)) {
        nuevo.delete(key);
      } else {
        nuevo.add(key);
      }
      return nuevo;
    });
  }

  function marcarTodosModulo(modulo, marcar = true) {
    setPermisosActivos((prev) => {
      const nuevo = new Set(prev);
      dependenciasFiltradas.forEach((d) => {
        const key = `${d.id}:${modulo}`;
        if (marcar) {
          nuevo.add(key);
        } else {
          nuevo.delete(key);
        }
      });
      return nuevo;
    });
  }

  function limpiarPermisos() {
    setPermisosActivos(new Set());
  }

  function validar() {
    const err = {};
    if (!esRequerido(nombre)) err.nombre = 'Nombre obligatorio.';
    if (!esRequerido(email)) err.email = 'Correo obligatorio.';
    else if (!esEmailValido(email)) err.email = 'Correo institucional inválido.';
    
    if (!esRequerido(password)) {
      err.password = 'Contraseña obligatoria.';
    } else if (password.length < 6) {
      err.password = 'Mínimo 6 caracteres.';
    }

    if (password !== passwordConfirm) {
      err.passwordConfirm = 'Las contraseñas no coinciden.';
    }

    return err;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorGeneral('');
    const err = validar();
    setErrores(err);
    if (Object.keys(err).length > 0) return;

    try {
      setGuardando(true);
      const listaPermisos = [];
      if (!esAdmin) {
        permisosActivos.forEach((key) => {
          const [idDepStr, modulo] = key.split(':');
          listaPermisos.push({
            id_dependencia: Number(idDepStr),
            modulo,
          });
        });
      }

      await onCrear({
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        password,
        es_admin: esAdmin,
        permisos: listaPermisos,
      });

      setNombre('');
      setEmail('');
      setPassword('');
      setPasswordConfirm('');
      setEsAdmin(false);
      setPermisosActivos(new Set());
      setBusquedaPermisos('');
      setErrores({});
      onCerrar();
    } catch (error) {
      setErrorGeneral(error.message || 'Error al crear usuario.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="modal fade show d-block modal-minimal" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(15,23,42,0.4)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold text-dark mb-0">Nuevo Usuario</h5>
            <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCerrar} disabled={guardando}></button>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-body">
              {errorGeneral && (
                <div className="alert alert-danger py-2 px-3 small mb-3 border-0 rounded-2" role="alert">
                  {errorGeneral}
                </div>
              )}

              {/* Datos principales */}
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.95rem' }} htmlFor="nuevo-nombre">
                    Nombre completo <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="nuevo-nombre"
                    className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                    placeholder="Ej: Lic. Martín Rossi"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    disabled={guardando}
                    style={{ fontSize: '0.975rem' }}
                  />
                  {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.95rem' }} htmlFor="nuevo-email">
                    Correo institucional <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    id="nuevo-email"
                    className={`form-control ${errores.email ? 'is-invalid' : ''}`}
                    placeholder="usuario@unsl.edu.ar"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={guardando}
                    style={{ fontSize: '0.975rem' }}
                  />
                  {errores.email && <div className="invalid-feedback">{errores.email}</div>}
                </div>
              </div>

              {/* Contraseñas */}
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.95rem' }} htmlFor="nuevo-password">
                    Contraseña <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    id="nuevo-password"
                    className={`form-control ${errores.password ? 'is-invalid' : ''}`}
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={guardando}
                    style={{ fontSize: '0.975rem' }}
                  />
                  {errores.password && <div className="invalid-feedback">{errores.password}</div>}
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.95rem' }} htmlFor="nuevo-password-confirm">
                    Confirmar contraseña <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    id="nuevo-password-confirm"
                    className={`form-control ${errores.passwordConfirm ? 'is-invalid' : ''}`}
                    placeholder="Repetir contraseña"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    disabled={guardando}
                    style={{ fontSize: '0.975rem' }}
                  />
                  {errores.passwordConfirm && <div className="invalid-feedback">{errores.passwordConfirm}</div>}
                </div>
              </div>

              {/* Rol Administrador */}
              <div className="form-check form-switch p-2 bg-light rounded-3 mb-3">
                <input
                  className="form-check-input ms-0 me-2"
                  type="checkbox"
                  role="switch"
                  id="nuevo-es-admin"
                  checked={esAdmin}
                  onChange={(e) => setEsAdmin(e.target.checked)}
                  disabled={guardando}
                />
                <label className="form-check-label fw-bold text-dark" htmlFor="nuevo-es-admin" style={{ fontSize: '0.95rem' }}>
                  Rol de Administrador General
                </label>
                <div className="text-muted ms-4" style={{ fontSize: '0.85rem' }}>
                  Los administradores tienen acceso global y no requieren asignación individual de permisos.
                </div>
              </div>

              {/* Administración de Permisos en el Alta */}
              {!esAdmin && (
                <div className="pt-2 border-top">
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                    <div>
                      <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1rem' }}>
                        Asignación de Permisos
                      </h6>
                      <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                        Selecciona los permisos por facultad en Documentos y Concursos.
                      </span>
                    </div>

                    <div className="d-flex gap-1 flex-wrap">
                      <button
                        type="button"
                        className="btn btn-light btn-sm text-secondary"
                        style={{ fontSize: '0.8rem' }}
                        onClick={() => marcarTodosModulo('documentos', true)}
                      >
                        + Todo Documentos
                      </button>
                      <button
                        type="button"
                        className="btn btn-light btn-sm text-secondary"
                        style={{ fontSize: '0.8rem' }}
                        onClick={() => marcarTodosModulo('concursos', true)}
                      >
                        + Todo Concursos
                      </button>
                      <button
                        type="button"
                        className="btn btn-light btn-sm text-danger"
                        style={{ fontSize: '0.8rem' }}
                        onClick={limpiarPermisos}
                      >
                        Limpiar
                      </button>
                    </div>
                  </div>

                  <div className="mb-2">
                    <input
                      type="search"
                      className="form-control form-control-sm"
                      placeholder="Filtrar por facultad o dependencia..."
                      value={busquedaPermisos}
                      onChange={(e) => setBusquedaPermisos(e.target.value)}
                      style={{ maxWidth: '300px', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div className="border rounded-2 overflow-hidden" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.925rem' }}>
                      <thead className="table-light sticky-top">
                        <tr>
                          <th scope="col" className="ps-3 py-2 text-secondary fw-semibold" style={{ fontSize: '0.8rem' }}>
                            Facultad / Dependencia
                          </th>
                          <th scope="col" className="text-center py-2 text-secondary fw-semibold" style={{ width: '130px', fontSize: '0.8rem' }}>
                            Documentos
                          </th>
                          <th scope="col" className="text-center py-2 text-secondary fw-semibold" style={{ width: '130px', fontSize: '0.8rem' }}>
                            Concursos
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dependenciasFiltradas.length === 0 ? (
                          <tr>
                            <td colSpan="3" className="text-center py-3 text-muted small">
                              No se encontraron dependencias para asignar permisos.
                            </td>
                          </tr>
                        ) : (
                          dependenciasFiltradas.map((dep) => {
                            const tieneDoc = permisosActivos.has(`${dep.id}:documentos`);
                            const tieneCon = permisosActivos.has(`${dep.id}:concursos`);

                            return (
                              <tr key={dep.id}>
                                <td className="ps-3 py-2">
                                  <span className="badge-dep me-2">{dep.sigla}</span>
                                  <span className="text-dark small">{dep.nombre}</span>
                                </td>
                                <td className="text-center py-2">
                                  <div className="form-check form-switch d-inline-block mb-0">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      role="switch"
                                      id={`crear-doc-${dep.id}`}
                                      checked={tieneDoc}
                                      onChange={() => togglePermiso(dep.id, 'documentos')}
                                    />
                                  </div>
                                </td>
                                <td className="text-center py-2">
                                  <div className="form-check form-switch d-inline-block mb-0">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      role="switch"
                                      id={`crear-con-${dep.id}`}
                                      checked={tieneCon}
                                      onChange={() => togglePermiso(dep.id, 'concursos')}
                                    />
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="text-muted mt-2" style={{ fontSize: '0.825rem' }}>
                    Permisos seleccionados: <strong className="text-primary">{permisosActivos.size}</strong>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-light" onClick={onCerrar} disabled={guardando} style={{ fontSize: '0.95rem' }}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary px-3" disabled={guardando} style={{ fontSize: '0.95rem' }}>
                {guardando ? 'Guardando...' : 'Crear Usuario'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
