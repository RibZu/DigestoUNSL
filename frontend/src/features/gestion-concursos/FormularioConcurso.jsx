import { useRef, useState } from 'react'
import CamposResolucion from './CamposResolucion'
import CamposLlamado from './CamposLlamado'
import { armarCodigo, validarConcurso } from './validarConcurso.js'

const VALORES_INICIALES = {
    dependencia: '',
    tipo: '',
    organo: '',
    origen: '',
    numero: '',
    anio: '',
    fechaEmision: '',
    descripcion: '',
}

function crearLlamadoVacio() {
    return {
        id: crypto.randomUUID(),
        departamento: '',
        area: '',
        cargo: '',
        dedicacion: '',
        caracter: '',
        inscripcionDesde: '',
        inscripcionHasta: '',
    }
}

export default function FormularioConcurso({ catalogos }) {
    const [valores, setValores] = useState(VALORES_INICIALES)
    const [llamados, setLlamados] = useState(() => [crearLlamadoVacio()])
    const [archivo, setArchivo] = useState(null)
    const [errores, setErrores] = useState({})
    const [estado, setEstado] = useState('escribiendo')
    const formularioRef = useRef(null)

    const departamentos = catalogos.departamentos[valores.dependencia] ?? []

    function handleChange(e) {
        const { name, value } = e.target
        const siguiente = { ...valores, [name]: value }
        let limpiar = { [name]: undefined }

        if (name === 'dependencia') {
            const anterior = catalogos.dependencias.find((d) => d.codigo === valores.dependencia)
            const elegida = catalogos.dependencias.find((d) => d.codigo === value)
            if (valores.origen === '' || valores.origen === anterior?.origen) {
                siguiente.origen = elegida?.origen ?? ''
                limpiar = { ...limpiar, origen: undefined }
            }
            setLlamados(llamados.map((llamado) => ({ ...llamado, departamento: '', area: '' })))
        }

        setValores(siguiente)
        setErrores({ ...errores, ...limpiar })
    }

    function handleCambiarLlamado(id, campo, valor) {
        setLlamados(
            llamados.map((llamado) =>
                llamado.id === id
                    ? { ...llamado, [campo]: valor, ...(campo === 'departamento' ? { area: '' } : {}) }
                    : llamado
            )
        )
        setErrores({ ...errores, [`${campo}-${id}`]: undefined })
    }

    function handleAgregarLlamado() {
        setLlamados([...llamados, crearLlamadoVacio()])
    }

    function handleQuitarLlamado(id) {
        if (llamados.length === 1) return
        setLlamados(llamados.filter((llamado) => llamado.id !== id))
    }

    function handleArchivo(e) {
        const seleccionado = e.target.files[0]
        if (!seleccionado) {
            setArchivo(null)
            return
        }
        const esPdf =
            seleccionado.type === 'application/pdf' || seleccionado.name.toLowerCase().endsWith('.pdf')
        if (!esPdf) {
            e.target.value = ''
            setArchivo(null)
            setErrores({ ...errores, pdf: 'Elegí un archivo PDF.' })
            return
        }
        setArchivo({ nombre: seleccionado.name })
        setErrores({ ...errores, pdf: undefined })
    }

    function handleSubmit(e) {
        e.preventDefault()

        const nuevosErrores = validarConcurso({
            valores,
            llamados,
            archivo,
            catalogos,
            anioActual: new Date().getFullYear(),
        })
        setErrores(nuevosErrores)

        const primerCampoConError = Object.keys(nuevosErrores)[0]
        if (primerCampoConError) {
            formularioRef.current.elements[primerCampoConError]?.focus()
            return
        }

        setEstado('enviado')
    }

    function handleCargarOtro() {
        setValores(VALORES_INICIALES)
        setLlamados([crearLlamadoVacio()])
        setArchivo(null)
        setErrores({})
        setEstado('escribiendo')
    }

    if (estado === 'enviado') {
        return (
            <div className="alert alert-success" role="status">
                <h2 className="h5">Los datos del concurso {armarCodigo(valores, catalogos).codigo} son válidos</h2>
                <p>Todavía no se guardan: el guardado se habilita cuando el sitio tenga base de datos.</p>
                <button type="button" className="btn btn-primary" onClick={handleCargarOtro}>
                    Cargar otro concurso
                </button>
            </div>
        )
    }

    return (
        <form ref={formularioRef} onSubmit={handleSubmit} noValidate>
            <h2>Cargar concurso</h2>

            <CamposResolucion
                valores={valores}
                errores={errores}
                catalogos={catalogos}
                archivo={archivo}
                onChange={handleChange}
                onArchivo={handleArchivo}
            />

            <fieldset className="gestion-concursos__bloque">
                <legend className="h5">2. Llamados (uno por cargo)</legend>
                {llamados.map((llamado, posicion) => (
                    <CamposLlamado
                        key={llamado.id}
                        llamado={llamado}
                        numero={posicion + 1}
                        errores={errores}
                        departamentos={departamentos}
                        cargos={catalogos.cargos}
                        dedicaciones={catalogos.dedicaciones}
                        caracteres={catalogos.caracteres}
                        puedeQuitarse={llamados.length > 1}
                        onCambiar={handleCambiarLlamado}
                        onQuitar={handleQuitarLlamado}
                    />
                ))}
                <button type="button" className="btn btn-outline-primary" onClick={handleAgregarLlamado}>
                    + Agregar otro llamado
                </button>
            </fieldset>

            <div className="gestion-concursos__acciones">
                <button type="submit" className="btn btn-primary">
                    Guardar concurso
                </button>
            </div>
        </form>
    )
}
