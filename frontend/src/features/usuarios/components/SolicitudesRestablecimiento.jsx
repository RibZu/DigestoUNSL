import { useState } from 'react'
import ConfirmarAccion from '../../../shared/components/ConfirmarAccion'
import MensajeVacio from '../../../shared/components/MensajeVacio'
import { formatearFecha } from '../../../shared/utils/formato.js'
import { rechazarSolicitud } from '../services/solicitudesService'
import FormularioRestablecer from './FormularioRestablecer'

function marcasDe(solicitud) {
  if (solicitud.id_usuario === null) return [{ texto: 'Sin cuenta', clase: 'secondary' }]

  return [
    solicitud.cuenta_activa
      ? { texto: 'Cuenta activa', clase: 'success' }
      : { texto: 'Cuenta dada de baja', clase: 'secondary' },
    solicitud.coincide_dni
      ? { texto: 'DNI coincide', clase: 'success' }
      : { texto: 'DNI distinto', clase: 'warning' },
    solicitud.coincide_telefono
      ? { texto: 'Teléfono coincide', clase: 'success' }
      : { texto: 'Teléfono distinto', clase: 'warning' },
  ]
}

function SolicitudesRestablecimiento({ solicitudes, onResuelta }) {
  const [accion, setAccion] = useState(null)

  function handleElegirRestablecer(solicitud) {
    setAccion({ id: solicitud.id, tipo: 'restablecer', enviando: false, error: null })
  }

  function handleElegirRechazar(solicitud) {
    setAccion({ id: solicitud.id, tipo: 'rechazar', enviando: false, error: null })
  }

  function handleCancelar() {
    setAccion(null)
  }

  function handleRestablecida() {
    setAccion(null)
    onResuelta()
  }

  async function handleConfirmarRechazo() {
    setAccion({ ...accion, enviando: true, error: null })
    try {
      await rechazarSolicitud(accion.id)
      setAccion(null)
      onResuelta()
    } catch (err) {
      setAccion({ ...accion, enviando: false, error: err.message })
    }
  }

  if (solicitudes.length === 0) return <MensajeVacio texto="No hay pedidos pendientes." />

  return (
    <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
      {solicitudes.map((solicitud) => {
        const enAccion = accion?.id === solicitud.id ? accion : null

        return (
          <li key={solicitud.id}>
            {enAccion?.tipo === 'restablecer' ? (
              <FormularioRestablecer
                solicitud={solicitud}
                onRestablecida={handleRestablecida}
                onCancelar={handleCancelar}
              />
            ) : (
              <article className="card card-body">
                <h3 className="h5 mb-1">{solicitud.nombre}</h3>
                <p className="mb-2">{solicitud.email}</p>
                <dl className="row small mb-2">
                  <dt className="col-sm-3">Teléfono</dt>
                  <dd className="col-sm-9">{solicitud.telefono}</dd>
                  <dt className="col-sm-3">DNI</dt>
                  <dd className="col-sm-9">{solicitud.dni}</dd>
                  <dt className="col-sm-3">Fecha del pedido</dt>
                  <dd className="col-sm-9 mb-0">{formatearFecha(solicitud.fecha_solicitud)}</dd>
                </dl>
                <div className="d-flex flex-wrap gap-1 mb-3">
                  {marcasDe(solicitud).map((marca) => (
                    <span key={marca.texto} className={`badge text-bg-${marca.clase}`}>
                      {marca.texto}
                    </span>
                  ))}
                </div>

                {enAccion?.error && (
                  <div className="alert alert-danger" role="alert">
                    {enAccion.error}
                  </div>
                )}

                {enAccion?.tipo === 'rechazar' ? (
                  <ConfirmarAccion
                    texto={`¿Rechazar el pedido de ${solicitud.email}?`}
                    textoConfirmar="Rechazar"
                    enviando={enAccion.enviando}
                    onConfirmar={handleConfirmarRechazo}
                    onCancelar={handleCancelar}
                  />
                ) : (
                  <div className="d-flex flex-wrap gap-2">
                    {solicitud.cuenta_activa && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleElegirRestablecer(solicitud)}
                      >
                        Restablecer
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => handleElegirRechazar(solicitud)}
                    >
                      Rechazar
                    </button>
                  </div>
                )}
              </article>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default SolicitudesRestablecimiento
