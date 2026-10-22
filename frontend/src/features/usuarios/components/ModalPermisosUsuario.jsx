import { useState, useMemo } from 'react';

function ModalPermisosUsuarioContenido({ usuario, dependencias = [], onCerrar, onGuardar }) {
  const [permisosActivos, setPermisosActivos] = useState(() => {
    const set = new Set();
    (usuario.permisos || []).forEach((p) => {
      set.add(`${p.id_dependencia}:${p.modulo}`);
    });
    return set;
  });

  const [busqueda, setBusqueda] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');

  const dependenciasFiltradas = useMemo(() => {
    if (!busqueda.trim()) return dependencias;
    const q = busqueda.trim().toLowerCase();
    return dependencias.filter(
      (d) => d.sigla.toLowerCase().includes(q) || d.nombre.toLowerCase().includes(q)
    );
  }, [dependencias, busqueda]);

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

  function limpiarTodo() {
    setPermisosActivos(new Set());
  }

  async function handleGuardar() {
    try {
      setGuardando(true);
      setErrorGeneral('');
      const listaPermisos = [];
      permisosActivos.forEach((key) => {
        const [idDepStr, modulo] = key.split(':');
        listaPermisos.push({
          id_dependencia: Number(idDepStr),
          modulo,
        });
      });

      await onGuardar(usuario.id, listaPermisos);
      onCerrar();
    } catch (err) {
      setErrorGeneral(err.message || 'Error al guardar los permisos.');
    } finally {
      setGuardando(false);
    }
  }

  const esAdmin = Boolean(usuario.es_admin);

  return (
    <div className="modal fade show d-block modal-minimal" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(15,23,42,0.4)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header d-flex justify-content-between align-items-center">
            <div>
              <h5 className="modal-title fw-bold text-dark mb-0">Administración de Permisos</h5>
              <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                Usuario: <strong className="text-dark">{usuario.nombre}</strong> ({usuario.email})
              </div>
            </div>
            <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCerrar} disabled={guardando}></button>
          </div>

          <div className="modal-body p-3">
            {errorGeneral && (
              <div className="alert alert-danger py-2 px-3 small mb-3 border-0 rounded-2" role="alert">
                {errorGeneral}
              </div>
            )}

            {esAdmin ? (
              <div className="py-4 text-center text-muted" style={{ fontSize: '0.95rem' }}>
                <p className="mb-0">
                  Este usuario es <strong>Administrador General</strong> y posee acceso global a todos los módulos y dependencias de la universidad. No requiere permisos individuales.
                </p>
              </div>
            ) : (
              <>
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                  <input
                    type="search"
                    className="form-control"
                    style={{ maxWidth: '300px', fontSize: '0.925rem' }}
                    placeholder="Filtrar por facultad o dependencia..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />

                  <div className="d-flex gap-1 flex-wrap">
                    <button
                      type="button"
                      className="btn btn-light btn-sm text-secondary"
                      style={{ fontSize: '0.825rem' }}
                      onClick={() => marcarTodosModulo('documentos', true)}
                    >
                      + Todo Documentos
                    </button>
                    <button
                      type="button"
                      className="btn btn-light btn-sm text-secondary"
                      style={{ fontSize: '0.825rem' }}
                      onClick={() => marcarTodosModulo('concursos', true)}
                    >
                      + Todo Concursos
                    </button>
                    <button
                      type="button"
                      className="btn btn-light btn-sm text-danger"
                      style={{ fontSize: '0.825rem' }}
                      onClick={limpiarTodo}
                    >
                      Limpiar
                    </button>
                  </div>
                </div>

                <div className="border rounded-2 overflow-hidden" style={{ maxHeight: '360px', overflowY: 'auto' }}>
                  <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.925rem' }}>
                    <thead className="table-light sticky-top">
                      <tr>
                        <th scope="col" className="ps-3 py-2 text-secondary fw-semibold" style={{ fontSize: '0.825rem' }}>
                          Facultad / Dependencia
                        </th>
                        <th scope="col" className="text-center py-2 text-secondary fw-semibold" style={{ width: '140px', fontSize: '0.825rem' }}>
                          Documentos
                        </th>
                        <th scope="col" className="text-center py-2 text-secondary fw-semibold" style={{ width: '140px', fontSize: '0.825rem' }}>
                          Concursos
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dependenciasFiltradas.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="text-center py-4 text-muted small">
                            No se encontraron dependencias para configurar permisos.
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
                                    id={`sw-doc-${dep.id}`}
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
                                    id={`sw-con-${dep.id}`}
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

                <div className="d-flex justify-content-between align-items-center mt-2 px-1 text-muted" style={{ fontSize: '0.85rem' }}>
                  <span>Permisos activos: <strong className="text-primary">{permisosActivos.size}</strong></span>
                  <span>Dependencias listadas: {dependenciasFiltradas.length}</span>
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-light" onClick={onCerrar} disabled={guardando} style={{ fontSize: '0.95rem' }}>
              Cerrar
            </button>
            {!esAdmin && (
              <button
                type="button"
                className="btn btn-primary px-3"
                onClick={handleGuardar}
                disabled={guardando}
                style={{ fontSize: '0.95rem' }}
              >
                {guardando ? 'Guardando...' : 'Guardar Permisos'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ModalPermisosUsuario({ abierto, usuario, dependencias, onCerrar, onGuardar }) {
  if (!abierto || !usuario) return null;

  return (
    <ModalPermisosUsuarioContenido
      key={usuario.id}
      usuario={usuario}
      dependencias={dependencias}
      onCerrar={onCerrar}
      onGuardar={onGuardar}
    />
  );
}
