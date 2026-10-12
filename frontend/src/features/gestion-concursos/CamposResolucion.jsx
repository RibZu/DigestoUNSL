import CampoFormulario from './CampoFormulario'
import { armarCodigo } from './validarConcurso.js'
import { comoOpciones } from '../../shared/utils/listas.js'

export default function CamposResolucion({ valores, errores, catalogos, archivo, onChange, onArchivo }) {
    const { codigo, error: errorDeCodigo } = armarCodigo(valores, catalogos)

    function propiedades(nombre) {
        return {
            nombre,
            value: valores[nombre],
            error: errores[nombre],
            onChange,
        }
    }

    return (
        <fieldset className="gestion-concursos__bloque">
            <legend className="h5">1. Resolución</legend>
            <div className="row g-3">
                <CampoFormulario
                    {...propiedades('dependencia')}
                    etiqueta="Dependencia"
                    tipo="select"
                    opciones={catalogos.dependencias.map((dependencia) => ({
                        valor: dependencia.codigo,
                        texto: `${dependencia.sigla} · ${dependencia.nombre}`,
                    }))}
                />
                <CampoFormulario
                    {...propiedades('tipo')}
                    etiqueta="Tipo de documento"
                    tipo="select"
                    opciones={comoOpciones(catalogos.tiposDocumento)}
                />
                <CampoFormulario
                    {...propiedades('organo')}
                    etiqueta="Órgano emisor"
                    tipo="select"
                    opciones={comoOpciones(catalogos.organos)}
                />
                <CampoFormulario
                    {...propiedades('origen')}
                    etiqueta="Origen del trámite"
                    tipo="select"
                    opciones={comoOpciones(catalogos.origenes.map((origen) => origen.nombre))}
                />
                <CampoFormulario {...propiedades('numero')} etiqueta="Número" tipo="number" min="1" />
                <CampoFormulario {...propiedades('anio')} etiqueta="Año" tipo="number" min="1973" />

                <div className="col-12">
                    <output
                        className={`gestion-concursos__codigo${errorDeCodigo ? ' gestion-concursos__codigo--error' : ''}`}
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

                <CampoFormulario {...propiedades('fechaEmision')} etiqueta="Fecha de emisión" tipo="date" />
                <CampoFormulario
                    {...propiedades('descripcion')}
                    etiqueta="Descripción"
                    tipo="textarea"
                    columnas="col-12"
                />

                <div className="col-12">
                    <label htmlFor="pdf" className="form-label">
                        Archivo PDF de la resolución
                    </label>
                    <input
                        id="pdf"
                        name="pdf"
                        type="file"
                        accept="application/pdf,.pdf"
                        className={`form-control${errores.pdf ? ' is-invalid' : ''}`}
                        onChange={onArchivo}
                    />
                    {errores.pdf && <div className="invalid-feedback">{errores.pdf}</div>}
                    <div className="form-text">
                        {archivo ? `Archivo elegido: ${archivo.nombre}.` : 'Obligatorio, solo .pdf.'}
                    </div>
                </div>
            </div>
        </fieldset>
    )
}
