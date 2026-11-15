import { useState } from 'react'
import { useOutletContext } from 'react-router'
import BotonPdf from '../../../shared/components/BotonPdf'
import Filtros from '../../../shared/components/Filtros'
import MensajeVacio from '../../../shared/components/MensajeVacio'
import Paginacion from '../../../shared/components/Paginacion'
import PantallaGestion from '../../../shared/components/PantallaGestion'
import Spinner from '../../../shared/components/Spinner'
import TablaGestion from '../../../shared/components/TablaGestion'
import { useFetch } from '../../../shared/hooks/useFetch'
import { formatearFecha, SIN_DATO } from '../../../shared/utils/formato.js'
import { obtenerCatalogos } from '../../catalogos'
import { enlaceDelArchivo } from '../../normativas'
import FormularioDocumento from '../components/FormularioDocumento'
import ConfirmarAccion from '../../../shared/components/ConfirmarAccion'
import { cambiarBajaDocumento, obtenerDocumentosCargados } from '../services/documentosService'

const FILTROS_VACIOS = { texto: '', tipo: '', dependencia: '' }
const POR_PAGINA = 20

function armarColumnas() {
  return [
    {
      clave: 'codigo',
      encabezado: 'Documento',
      celda: (documento) => (
        <>
          <strong>{documento.codigo}</strong>
          {documento.fecha_baja && <span className="badge text-bg-secondary ms-2">De baja</span>}
        </>
      ),
    },
    {
      clave: 'tipo',
      encabezado: 'Tipo',
      celda: (documento) => documento.tipo_nombre ?? SIN_DATO,
    },
    {
      clave: 'dependencia',
      encabezado: 'Dependencia',
      celda: (documento) => documento.dependencia_emisora_sigla,
    },
    {
      clave: 'emision',
      encabezado: 'Emisión',
      celda: (documento) => formatearFecha(documento.fecha_emision),
    },
    {
      clave: 'descripcion',
      encabezado: 'Descripción',
      celda: (documento) => documento.descripcion || SIN_DATO,
    },
    {
      clave: 'archivo',
      encabezado: 'Archivo',
      celda: (documento) => {
        const enlace = enlaceDelArchivo(documento)
        if (!enlace) return SIN_DATO
        return <BotonPdf enlace={enlace} codigo={documento.codigo} chico />
      },
    },
  ]
}

function armarConsulta(aplicado, pagina) {
  const parametros = new URLSearchParams({
    orden: 'registro',
    limite: String(POR_PAGINA),
    pagina: String(pagina),
  })
  const criterios = { q: aplicado.texto.trim(), tipo: aplicado.tipo, dependencia: aplicado.dependencia }
  for (const [clave, valor] of Object.entries(criterios)) {
    if (valor) parametros.set(clave, valor)
  }
  return parametros.toString()
}

function puedeGestionar(documento, usuario) {
  if (!usuario || usuario.es_admin) return true

  return usuario.permisos.some(
    (permiso) =>
      permiso.modulo === 'documentos' && permiso.id_dependencia === documento.id_dependencia_emisora,
  )
}

function GestionDocumentosPage() {
  const { usuario } = useOutletContext() ?? {}
  const [vista, setVista] = useState('lista')
  const [registro, setRegistro] = useState(null)
  const [baja, setBaja] = useState(null)
  const [aplicado, setAplicado] = useState(FILTROS_VACIOS)
  const [pagina, setPagina] = useState(1)
  const documentosPedidos = useFetch(obtenerDocumentosCargados, armarConsulta(aplicado, pagina))
  const catalogosPedidos = useFetch(obtenerCatalogos)
  const documentos = documentosPedidos.datos

  if (documentos && pagina > 1 && documentos.resultados.length === 0) setPagina(1)

  const catalogos = catalogosPedidos.datos
  const cargando = documentosPedidos.cargando || catalogosPedidos.cargando
  const error = documentosPedidos.error ?? catalogosPedidos.error

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

  function handleModificar(documento) {
    setRegistro(documento)
    setVista('formulario')
  }

  function handlePedirBaja(documento) {
    setBaja({ documento, enviando: false, error: null })
  }

  async function handleConfirmarBaja() {
    setBaja({ ...baja, enviando: true, error: null })
    try {
      await cambiarBajaDocumento(baja.documento.id, true)
      setBaja(null)
      documentosPedidos.recargar()
    } catch (err) {
      setBaja({ ...baja, enviando: false, error: err.message })
    }
  }

  function armarAcciones(documento) {
    const permitido = puedeGestionar(documento, usuario)

    return [
      { texto: 'Modificar', variante: 'primary', onClick: handleModificar, deshabilitada: !permitido },
      { texto: 'Dar de baja', variante: 'danger', onClick: handlePedirBaja, deshabilitada: !permitido },
    ]
  }

  return (
    <PantallaGestion
      titulo="Gestión de documentos"
      descripcion="Carga, modificación y baja de los documentos del Digesto."
      textoAlta="Cargar nuevo documento"
      vista={vista}
      onVerLista={handleVerLista}
      onVerFormulario={handleVerFormulario}
    >
      {cargando && vista === 'lista' && <Spinner texto="Cargando documentos..." />}

      {error && <MensajeVacio texto={error.message} />}

      {catalogos && vista === 'lista' && (
        <>
          <Filtros
            id="gestion-documentos"
            placeholder="Código o descripción"
            selects={[
              {
                name: 'tipo',
                etiqueta: 'Tipo',
                todas: 'Todos',
                opciones: catalogos.tiposDocumento.map((tipo) => ({
                  valor: String(tipo.id),
                  texto: tipo.nombre,
                })),
              },
              {
                name: 'dependencia',
                etiqueta: 'Dependencia',
                todas: 'Todas',
                opciones: catalogos.dependencias.map((dependencia) => ({
                  valor: String(dependencia.id),
                  texto: dependencia.sigla,
                })),
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
                texto={`¿Dar de baja el documento ${baja.documento.codigo}?`}
                textoConfirmar="Dar de baja"
                enviando={baja.enviando}
                onConfirmar={handleConfirmarBaja}
                onCancelar={() => setBaja(null)}
              />
            </>
          )}
          {documentos && (
            <>
              <TablaGestion
                titulo="Documentos cargados"
                columnas={armarColumnas()}
                filas={documentos.resultados}
                claveDeFila={(documento) => documento.id}
                total={documentos.total}
                unidad="documentos"
                vacio="No hay documentos con esos criterios."
                acciones={armarAcciones}
              />
              <Paginacion
                pagina={pagina}
                total={documentos.total}
                limite={POR_PAGINA}
                onCambiar={setPagina}
              />
            </>
          )}
        </>
      )}

      {catalogos && vista === 'formulario' && (
        <FormularioDocumento
          key={registro?.id ?? 'nuevo'}
          catalogos={catalogos}
          registro={registro}
          onGuardado={documentosPedidos.recargar}
          onCancelar={handleVerLista}
        />
      )}
    </PantallaGestion>
  )
}

export default GestionDocumentosPage
