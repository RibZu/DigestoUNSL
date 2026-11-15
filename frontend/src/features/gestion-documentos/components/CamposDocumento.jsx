import CampoFormulario from '../../../shared/components/CampoFormulario'
import { armarCodigo, organosDelTipo, prefijosDelTipo, usaOrgano } from '../validarDocumento'

function CamposDocumento({
  valores,
  errores,
  catalogos,
  dependencias,
  archivo,
  esAlta,
  tipoFijo = false,
  titulo,
  onChange,
  onArchivo,
}) {
  const { codigo, error: errorDeCodigo } = armarCodigo(valores, catalogos)
  const conOrgano = usaOrgano(valores, catalogos)

  function propiedades(nombre) {
    return {
      nombre,
      value: valores[nombre],
      error: errores[nombre],
      onChange,
    }
  }

  return (
    <fieldset className="formulario-bloque">
      <legend className="h5">{titulo}</legend>
      <div className="row g-3">
        <CampoFormulario
          {...propiedades('tipo')}
          etiqueta="Tipo de documento"
          tipo="select"
          opciones={catalogos.tiposDocumento.map((tipo) => ({
            valor: String(tipo.id),
            texto: tipo.nombre,
          }))}
          disabled={tipoFijo}
        />
        {conOrgano ? (
          <CampoFormulario
            {...propiedades('organo')}
            etiqueta="Órgano emisor"
            tipo="select"
            opciones={organosDelTipo(valores, catalogos)}
          />
        ) : (
          <CampoFormulario
            {...propiedades('prefijo')}
            etiqueta="Prefijo"
            tipo="select"
            opciones={prefijosDelTipo(valores, catalogos).map((prefijo) => ({
              valor: prefijo.prefijo,
              texto: prefijo.prefijo,
            }))}
            disabled={!valores.tipo}
          />
        )}
        <CampoFormulario
          {...propiedades('id_dependencia_origen')}
          etiqueta="Dependencia de origen"
          tipo="select"
          opciones={dependencias}
        />
        <CampoFormulario {...propiedades('numero')} etiqueta="Número" maxLength={10} />
        <CampoFormulario {...propiedades('anio')} etiqueta="Año" tipo="number" min="1973" />

        <div className="col-12">
          <output
            className={`formulario-codigo${errorDeCodigo ? ' formulario-codigo--error' : ''}`}
            aria-live="polite"
          >
            {codigo !== null ? (
              <>
                Código generado: <strong>{codigo}</strong>
              </>
            ) : (
              errorDeCodigo || 'Completá tipo, órgano, origen, número y año'
            )}
          </output>
        </div>

        <CampoFormulario
          {...propiedades('fecha_emision')}
          etiqueta="Fecha de emisión"
          tipo="date"
        />
        <CampoFormulario
          {...propiedades('descripcion')}
          etiqueta="Descripción"
          tipo="textarea"
          columnas="col-12"
        />
        <CampoFormulario
          nombre="archivo"
          etiqueta="Archivo PDF de la resolución"
          tipo="file"
          accept="application/pdf,.pdf"
          columnas="col-12"
          error={errores.archivo}
          ayuda={
            archivo
              ? `Archivo elegido: ${archivo.name}.`
              : esAlta
                ? 'Obligatorio, solo .pdf, hasta 20 MB.'
                : 'Opcional: si elegís uno, reemplaza al actual. Solo .pdf, hasta 20 MB.'
          }
          onChange={onArchivo}
        />
      </div>
    </fieldset>
  )
}

export default CamposDocumento
