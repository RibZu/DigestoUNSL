import CampoFormulario from './CampoFormulario'
import { comoOpciones } from '../../shared/utils/listas.js'

export default function CamposLlamado({
    llamado,
    numero,
    errores,
    departamentos,
    cargos,
    dedicaciones,
    caracteres,
    puedeQuitarse,
    onCambiar,
    onQuitar,
}) {
    const areas = departamentos.find((departamento) => departamento.nombre === llamado.departamento)?.areas ?? []

    function handleChange(e) {
        onCambiar(llamado.id, e.target.dataset.campo, e.target.value)
    }

    function propiedades(campo) {
        const nombre = `${campo}-${llamado.id}`
        return {
            nombre,
            'data-campo': campo,
            value: llamado[campo],
            error: errores[nombre],
            onChange: handleChange,
        }
    }

    return (
        <fieldset className="gestion-concursos__llamado">
            <legend className="h6 w-auto">Llamado {numero}</legend>
            <button
                type="button"
                className="btn btn-sm btn-outline-danger gestion-concursos__quitar"
                disabled={!puedeQuitarse}
                aria-label={`Quitar el llamado ${numero}`}
                onClick={() => onQuitar(llamado.id)}
            >
                Quitar
            </button>

            <div className="row g-3">
                <CampoFormulario
                    {...propiedades('departamento')}
                    etiqueta="Departamento"
                    tipo="select"
                    opciones={comoOpciones(departamentos.map((departamento) => departamento.nombre))}
                    disabled={departamentos.length === 0}
                />
                <CampoFormulario
                    {...propiedades('area')}
                    etiqueta="Área"
                    tipo="select"
                    opciones={comoOpciones(areas)}
                    disabled={areas.length === 0}
                />
                <CampoFormulario
                    {...propiedades('cargo')}
                    etiqueta="Cargo"
                    tipo="select"
                    opciones={comoOpciones(cargos)}
                    columnas="col-md-4"
                />
                <CampoFormulario
                    {...propiedades('dedicacion')}
                    etiqueta="Dedicación"
                    tipo="select"
                    opciones={comoOpciones(dedicaciones)}
                    columnas="col-md-4"
                />
                <CampoFormulario
                    {...propiedades('caracter')}
                    etiqueta="Carácter"
                    tipo="select"
                    opciones={comoOpciones(caracteres)}
                    columnas="col-md-4"
                />
                <CampoFormulario
                    {...propiedades('inscripcionDesde')}
                    etiqueta="Inscripción desde"
                    tipo="date"
                />
                <CampoFormulario
                    {...propiedades('inscripcionHasta')}
                    etiqueta="Inscripción hasta"
                    tipo="date"
                />
            </div>
        </fieldset>
    )
}
