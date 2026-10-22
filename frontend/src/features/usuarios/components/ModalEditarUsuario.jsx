import { useState } from 'react';
import { esRequerido, esEmailValido } from '../../../shared/utils/validaciones.js';

function ModalEditarUsuarioContenido({ usuario, onCerrar, onGuardar }) {
  const [nombre, setNombre] = useState(usuario.nombre || '');
  const [email, setEmail] = useState(usuario.email || '');
  const [esAdmin, setEsAdmin] = useState(Boolean(usuario.es_admin));
  const [cambiarPassword, setCambiarPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');

  function validar() {
    const err = {};
    if (!esRequerido(nombre)) err.nombre = 'Nombre obligatorio.';
    if (!esRequerido(email)) err.email = 'Correo obligatorio.';
    else if (!esEmailValido(email)) err.email = 'Correo inválido.';

    if (cambiarPassword) {
      if (!esRequerido(password)) {
        err.password = 'Ingresa la nueva clave.';
      } else if (password.length < 6) {
        err.password = 'Mínimo 6 caracteres.';
      }
      if (password !== passwordConfirm) {
        err.passwordConfirm = 'Las claves no coinciden.';
      }
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
      const datosActualizar = {
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        es_admin: esAdmin,
      };

      if (cambiarPassword && password) {
        datosActualizar.password = password;
      }

      await onGuardar(usuario.id, datosActualizar);
      onCerrar();
    } catch (error) {
      setErrorGeneral(error.message || 'Error al actualizar usuario.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="modal fade show d-block modal-minimal" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(15,23,42,0.4)' }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold text-dark mb-0">
              Editar usuario: {usuario.nombre}
            </h5>
            <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCerrar} disabled={guardando}></button>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-body">
              {errorGeneral && (
                <div className="alert alert-danger py-2 px-3 small mb-3 border-0 rounded-2" role="alert">
                  {errorGeneral}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.95rem' }} htmlFor="editar-nombre">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="editar-nombre"
                  className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  disabled={guardando}
                  style={{ fontSize: '0.975rem' }}
                />
                {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.95rem' }} htmlFor="editar-email">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="editar-email"
                  className={`form-control ${errores.email ? 'is-invalid' : ''}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={guardando}
                  style={{ fontSize: '0.975rem' }}
                />
                {errores.email && <div className="invalid-feedback">{errores.email}</div>}
              </div>

              <div className="form-check form-switch mb-3 p-2 bg-light rounded-3">
                <input
                  className="form-check-input ms-0 me-2"
                  type="checkbox"
                  role="switch"
                  id="editar-es-admin"
                  checked={esAdmin}
                  onChange={(e) => setEsAdmin(e.target.checked)}
                  disabled={guardando}
                />
                <label className="form-check-label fw-bold text-dark" htmlFor="editar-es-admin" style={{ fontSize: '0.95rem' }}>
                  Rol Administrador General
                </label>
              </div>

              {/* Sección de cambio de contraseña */}
              <div className="pt-3 border-top">
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="chk-cambiar-password"
                    checked={cambiarPassword}
                    onChange={(e) => setCambiarPassword(e.target.checked)}
                    disabled={guardando}
                  />
                  <label className="form-check-label fw-semibold text-secondary" htmlFor="chk-cambiar-password" style={{ fontSize: '0.925rem' }}>
                    Restablecer contraseña
                  </label>
                </div>

                {cambiarPassword && (
                  <div className="row g-2 pt-1">
                    <div className="col-12 col-md-6">
                      <input
                        type="password"
                        id="editar-password"
                        className={`form-control ${errores.password ? 'is-invalid' : ''}`}
                        placeholder="Nueva clave (mín. 6)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={guardando}
                        style={{ fontSize: '0.925rem' }}
                      />
                      {errores.password && <div className="invalid-feedback small">{errores.password}</div>}
                    </div>
                    <div className="col-12 col-md-6">
                      <input
                        type="password"
                        id="editar-password-confirm"
                        className={`form-control ${errores.passwordConfirm ? 'is-invalid' : ''}`}
                        placeholder="Confirmar clave"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        disabled={guardando}
                        style={{ fontSize: '0.925rem' }}
                      />
                      {errores.passwordConfirm && <div className="invalid-feedback small">{errores.passwordConfirm}</div>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-light" onClick={onCerrar} disabled={guardando} style={{ fontSize: '0.95rem' }}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary px-3" disabled={guardando} style={{ fontSize: '0.95rem' }}>
                {guardando ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ModalEditarUsuario({ abierto, usuario, onCerrar, onGuardar }) {
  if (!abierto || !usuario) return null;

  return (
    <ModalEditarUsuarioContenido
      key={usuario.id}
      usuario={usuario}
      onCerrar={onCerrar}
      onGuardar={onGuardar}
    />
  );
}
