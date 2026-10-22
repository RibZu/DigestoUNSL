export default function TablaUsuarios({ usuarios = [], onEditar, onPermisos, onToggleBaja }) {
  if (usuarios.length === 0) {
    return (
      <div className="text-center py-5 my-2 border rounded-3 bg-white">
        <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
          No hay usuarios que coincidan con la búsqueda o filtro aplicado.
        </p>
      </div>
    );
  }

  return (
    <div className="tabla-usuarios-minimal">
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th scope="col" style={{ minWidth: '220px' }}>Usuario</th>
              <th scope="col" style={{ minWidth: '130px' }}>Rol</th>
              <th scope="col" style={{ minWidth: '240px' }}>Permisos Asignados</th>
              <th scope="col" style={{ minWidth: '110px' }}>Estado</th>
              <th scope="col" className="text-end" style={{ minWidth: '140px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => {
              const esInactivo = Boolean(usuario.fecha_baja);
              const dependenciasUnicas = Array.from(
                new Set((usuario.permisos || []).map((p) => p.sigla || `Dep. #${p.id_dependencia}`))
              );

              return (
                <tr key={usuario.id}>
                  {/* Usuario (Nombre + Email) */}
                  <td>
                    <div className="fw-semibold text-dark" style={{ fontSize: '1.05rem' }}>
                      {usuario.nombre}
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                      {usuario.email}
                    </div>
                  </td>

                  {/* Rol */}
                  <td>
                    {usuario.es_admin ? (
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle fw-bold" style={{ fontSize: '0.825rem' }}>
                        Administrador
                      </span>
                    ) : (
                      <span className="text-secondary fw-medium" style={{ fontSize: '0.9rem' }}>
                        Operador
                      </span>
                    )}
                  </td>

                  {/* Permisos Asignados */}
                  <td>
                    {usuario.es_admin ? (
                      <span className="text-secondary small fst-italic" style={{ fontSize: '0.875rem' }}>
                        Acceso global (todos los permisos)
                      </span>
                    ) : dependenciasUnicas.length > 0 ? (
                      <div className="d-flex flex-wrap gap-1">
                        {dependenciasUnicas.map((sigla) => (
                          <span key={sigla} className="badge-dep">
                            {sigla}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted small fst-italic" style={{ fontSize: '0.875rem' }}>
                        Sin permisos asignados
                      </span>
                    )}
                  </td>

                  {/* Estado */}
                  <td>
                    <span className={`estado-dot ${esInactivo ? 'inactivo' : 'activo'}`}>
                      {esInactivo ? 'Inactivo' : 'Activo'}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="text-end">
                    <div className="d-inline-flex align-items-center gap-1">
                      <button
                        type="button"
                        className="btn-accion-ghost"
                        title="Editar datos"
                        onClick={() => onEditar(usuario)}
                        aria-label={`Editar ${usuario.nombre}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        className="btn-accion-ghost"
                        title={usuario.es_admin ? 'Los administradores ya poseen todos los permisos' : 'Administrar permisos'}
                        disabled={usuario.es_admin}
                        onClick={() => onPermisos(usuario)}
                        aria-label={`Permisos de ${usuario.nombre}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        className={`btn-accion-ghost ${esInactivo ? 'success' : 'danger'}`}
                        title={esInactivo ? 'Reactivar usuario' : 'Dar de baja usuario'}
                        onClick={() => onToggleBaja(usuario)}
                        aria-label={esInactivo ? `Reactivar ${usuario.nombre}` : `Dar de baja ${usuario.nombre}`}
                      >
                        {esInactivo ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
