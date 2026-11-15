import { useState } from 'react'
import { useOutletContext } from 'react-router'
import Filtros from '../../../shared/components/Filtros'
import MensajeVacio from '../../../shared/components/MensajeVacio'
import Paginacion from '../../../shared/components/Paginacion'
import PantallaGestion from '../../../shared/components/PantallaGestion'
import Spinner from '../../../shared/components/Spinner'
import TablaGestion from '../../../shared/components/TablaGestion'
import { useFetch } from '../../../shared/hooks/useFetch'
import BotonPdf from '../../../shared/components/BotonPdf'
import { formatearFecha, SIN_DATO } from '../../../shared/utils/formato.js'
import { obtenerCatalogos } from '../../catalogos'
import { estaVigente, obtenerConcursosCargados } from '../../concursos'
import { enlaceDelArchivo } from '../../normativas'
import ConfirmarAccion from '../../../shared/components/ConfirmarAccion'
import FormularioConcurso from '../components/FormularioConcurso'
import { cambiarBajaConcurso } from '../services/gestionConcursosService'

const FILTROS_VACIOS = { texto: '', dependencia: '' }
const POR_PAGINA = 20

function armarConsulta(aplicado, pagina) {
  const parametros = new URLSearchParams({
    estado: 'todos',
    orden: 'registro',
    limite: String(POR_PAGINA),
    pagina: String(pagina),
  })
  const criterios = { q: aplicado.texto.trim(), facultad: aplicado.dependencia }
  for (const [clave, valor] of Object.entries(criterios)) {
    if (valor) parametros.set(clave, valor)
  }
  return parametros.toString()
}

function periodoDeInscripcion(concurso) {
  const desdes = concurso.llamados.map((llamado) => llamado.inscripcionDesde).filter(Boolean).sort()
  const hastas = concurso.llamados.map((llamado) => llamado.inscripcionHasta).filter(Boolean).sort()
  return { desde: desdes[0] ?? null, hasta: hastas.at(-1) ?? null }
}

function armarColumnas() {
  return [
    {
      clave: 'resolucion',
      encabezado: 'Resolución',
      celda: (concurso) => <strong>{concurso.codigo}</strong>,
    },
    {
      clave: 'dependencia',
      encabezado: 'Dependencia',
      celda: (concurso) => concurso.dependencia,
    },
    {
      clave: 'llamados',
      encabezado: 'Llamados',
      celda: (concurso) => (
        <ul className="list-unstyled mb-0">
          {concurso.llamados.map((llamado) => (
            <li key={llamado.id}>
              {llamado.cargo} · {llamado.dedicacion} · {llamado.caracter}
              <div className="small">
                {llamado.departamento} — {llamado.area}
              </div>
            </li>
          ))}
        </ul>
      ),
    },
    {
      clave: 'inscripcion',
      encabezado: 'Inscripción',
      celda: (concurso) => {
        const { desde, hasta } = periodoDeInscripcion(concurso)
        return `del ${formatearFecha(desde)} al ${formatearFecha(hasta)}`
      },
    },
    {
      clave: 'estado',
      encabezado: 'Estado',
      celda: (concurso) => {
        const vigente = concurso.llamados.some(estaVigente)
        return (
          <span className={`badge text-bg-${vigente ? 'success' : 'secondary'}`}>
            {vigente ? 'Vigente' : 'Vencido'}
          </span>
        )
      },
    },
    {
      clave: 'archivo',
      encabezado: 'Archivo',
      celda: (concurso) => {
        const enlace = enlaceDelArchivo(concurso)
        if (!enlace) return SIN_DATO
        return <BotonPdf enlace={enlace} codigo={concurso.codigo} chico />
      },
    },
  ]
}

function puedeGestionar(concurso, usuario) {
  if (!usuario || usuario.es_admin) return true

  return usuario.permisos.some(
    (permiso) =>
      permiso.modulo === 'concursos' && permiso.id_dependencia === concurso.id_dependencia_emisora,
  )
}

function GestionConcursosPage() {
  const { usuario } = useOutletContext() ?? {}
  const [vista, setVista] = useState('lista')
  const [registro, setRegistro] = useState(null)
  const [baja, setBaja] = useState(null)
  const [aplicado, setAplicado] = useState(FILTROS_VACIOS)
  const [pagina, setPagina] = useState(1)
  const concursosPedidos = useFetch(obtenerConcursosCargados, armarConsulta(aplicado, pagina))
  const catalogosPedidos = useFetch(obtenerCatalogos)
  const concursos = concursosPedidos.datos

  if (concursos && pagina > 1 && concursos.resultados.length === 0) setPagina(1)

  const catalogos = catalogosPedidos.datos
  const cargando = concursosPedidos.cargando || catalogosPedidos.cargando
  const error = concursosPedidos.error ?? catalogosPedidos.error

  function handleAplicar(filtros) {
    setAplicado(filtros)
    setPagina(1)
  }

  function handleVerLista() {
    setRegistro(null)
    setVista('lista')
  }

  function handleVerFormulario() {
    setRegistro(null)
    setVista('formulario')
  }

  function handleModificar(concurso) {
    setRegistro(concurso)
    setVista('formulario')
  }

  function handlePedirBaja(concurso) {
    setBaja({ concurso, enviando: false, error: null })
  }

  async function handleConfirmarBaja() {
    setBaja({ ...baja, enviando: true, error: null })
    try {
      await cambiarBajaConcurso(baja.concurso.id, true)
      setBaja(null)
      concursosPedidos.recargar()
    } catch (err) {
      setBaja({ ...baja, enviando: false, error: err.message })
    }
  }

  function armarAcciones(concurso) {
    const permitido = puedeGestionar(concurso, usuario)

    return [
      { texto: 'Modificar', variante: 'primary', onClick: handleModificar, deshabilitada: !permitido },
      { texto: 'Dar de baja', variante: 'danger', onClick: handlePedirBaja, deshabilitada: !permitido },
    ]
  }

  return (
    <PantallaGestion
      titulo="Gestión de concursos"
      descripcion="Carga y consulta de llamados a concurso y sus resoluciones."
      textoAlta="Cargar nuevo concurso"
      vista={vista}
      onVerLista={handleVerLista}
      onVerFormulario={handleVerFormulario}
    >
      {cargando && vista === 'lista' && <Spinner texto="Cargando concursos..." />}

      {error && <MensajeVacio texto={error.message} />}

      {catalogos && vista === 'lista' && (
        <>
          <Filtros
            id="gestion-concursos"
            placeholder="Código, descripción o área"
            selects={[
              {
                name: 'dependencia',
                etiqueta: 'Dependencia',
                todas: 'Todas',
                opciones: catalogos.dependencias
                  .filter((dependencia) => dependencia.es_facultad)
                  .map((dependencia) => ({ valor: dependencia.codigo, texto: dependencia.sigla })),
              },
            ]}
            vacio={FILTROS_VACIOS}
            aplicado={aplicado}
            onAplicar={handleAplicar}
          />
          {baja && (
            <>
              {baja.error && (
                <div className="alert alert-danger mb-0" role="alert">
                  {baja.error}
                </div>
              )}
              <ConfirmarAccion
                texto={`¿Dar de baja el concurso ${baja.concurso.codigo}?`}
                textoConfirmar="Dar de baja"
                enviando={baja.enviando}
                onConfirmar={handleConfirmarBaja}
                onCancelar={() => setBaja(null)}
              />
            </>
          )}
          {concursos && (
            <>
              <TablaGestion
                titulo="Concursos cargados"
                columnas={armarColumnas()}
                filas={concursos.resultados}
                claveDeFila={(concurso) => concurso.id}
                total={concursos.total}
                unidad="concursos"
                vacio="No hay concursos con esos criterios."
                acciones={armarAcciones}
              />
              <Paginacion
                pagina={pagina}
                total={concursos.total}
                limite={POR_PAGINA}
                onCambiar={setPagina}
              />
            </>
          )}
        </>
      )}

      {catalogos && vista === 'formulario' && (
        <FormularioConcurso
          key={registro?.id ?? 'nuevo'}
          catalogos={catalogos}
          registro={registro}
          onGuardado={concursosPedidos.recargar}
          onCancelar={handleVerLista}
        />
      )}
    </PantallaGestion>
  )
}

export default GestionConcursosPage
