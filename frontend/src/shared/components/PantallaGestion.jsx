import EncabezadoPagina from '../layout/EncabezadoPagina'
import BarraGestion from './BarraGestion'
import VolverAlPanel from './VolverAlPanel'
import './PantallaGestion.css'

function PantallaGestion({
  titulo,
  descripcion,
  textoAlta,
  vista,
  onVerLista,
  onVerFormulario,
  children,
}) {
  return (
    <>
      <EncabezadoPagina titulo={titulo}>
        <p>{descripcion}</p>
        <VolverAlPanel />
      </EncabezadoPagina>

      <section className="container-xl d-flex flex-column gap-3 pb-5">
        <BarraGestion
          vista={vista}
          textoAlta={textoAlta}
          onVerLista={onVerLista}
          onVerFormulario={onVerFormulario}
        />
        {children}
      </section>
    </>
  )
}

export default PantallaGestion
