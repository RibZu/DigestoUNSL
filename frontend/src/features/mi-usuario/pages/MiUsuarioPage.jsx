import { useRevalidator } from 'react-router'
import MensajeVacio from '../../../shared/components/MensajeVacio'
import Spinner from '../../../shared/components/Spinner'
import VolverAlPanel from '../../../shared/components/VolverAlPanel'
import '../../../shared/components/PantallaGestion.css'
import { useFetch } from '../../../shared/hooks/useFetch'
import EncabezadoPagina from '../../../shared/layout/EncabezadoPagina'
import { actualizarUsuarioDeSesion } from '../../auth'
import FormularioCambioClave from '../components/FormularioCambioClave'
import FormularioMisDatos from '../components/FormularioMisDatos'
import { obtenerMiUsuario } from '../services/miUsuarioService'

const ETIQUETAS_MODULO = {
  documentos: 'Documentos',
  concursos: 'Concursos',
}

function agruparPorDependencia(permisos) {
  const grupos = new Map()
  for (const permiso of permisos) {
    const grupo = grupos.get(permiso.id_dependencia) ?? { sigla: permiso.sigla, modulos: [] }
    grupo.modulos.push(ETIQUETAS_MODULO[permiso.modulo] ?? permiso.modulo)
    grupos.set(permiso.id_dependencia, grupo)
  }
  return [...grupos.entries()].map(([id, grupo]) => ({ id, ...grupo }))
}

function MiUsuarioPage() {
  const { datos, error, cargando } = useFetch(obtenerMiUsuario)
  const revalidator = useRevalidator()

  function handleGuardado(usuario) {
    actualizarUsuarioDeSesion(usuario)
    revalidator.revalidate()
  }

  function renderPermisos(usuario) {
    if (usuario.es_admin) {
      return <p className="mb-0">Accede a todos los módulos de todas las dependencias.</p>
    }

    const dependencias = agruparPorDependencia(usuario.permisos)
    if (dependencias.length === 0) return <p className="mb-0">Sin permisos asignados.</p>

    return (
      <table className="table tabla-apilada mb-0">
        <caption className="visually-hidden">Permisos por dependencia</caption>
        <thead>
          <tr>
            <th scope="col">Dependencia</th>
            <th scope="col">Módulos</th>
          </tr>
        </thead>
        <tbody>
          {dependencias.map((dependencia) => (
            <tr key={dependencia.id}>
              <th scope="row" data-label="Dependencia">
                {dependencia.sigla}
              </th>
              <td data-label="Módulos">{dependencia.modulos.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <>
      <EncabezadoPagina titulo="Mi usuario">
        <p>Tus datos de contacto, tu contraseña y los permisos de tu cuenta.</p>
        <VolverAlPanel />
      </EncabezadoPagina>

      <section className="container-xl d-flex flex-column gap-3 pb-5">
        {cargando && <Spinner texto="Cargando tus datos..." />}

        {error && <MensajeVacio texto={error.message} />}

        {datos && (
          <>
            <section className="formulario-bloque mb-0" aria-labelledby="mi-usuario-rol">
              <h2 id="mi-usuario-rol" className="h5 mb-3">
                Rol y permisos
              </h2>
              <p>
                <span className={`badge text-bg-${datos.es_admin ? 'primary' : 'secondary'}`}>
                  {datos.es_admin ? 'Administrador' : 'Moderador'}
                </span>
              </p>
              {renderPermisos(datos)}
            </section>

            <fieldset className="formulario-bloque mb-0">
              <legend className="h5">Mis datos</legend>
              <FormularioMisDatos registro={datos} onGuardado={handleGuardado} />
            </fieldset>

            <fieldset className="formulario-bloque mb-0">
              <legend className="h5">Cambiar contraseña</legend>
              <FormularioCambioClave />
            </fieldset>
          </>
        )}
      </section>
    </>
  )
}

export default MiUsuarioPage
