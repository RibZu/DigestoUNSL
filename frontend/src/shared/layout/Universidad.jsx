import logoBlanco from '../../assets/logo/logo-unsl-blanco.png'
import logoColor from '../../assets/logo/logo-unsl-color.png'
import './Universidad.css'

const LOGOS = { barra: logoBlanco, pie: logoColor }

export default function Universidad({ variante = 'barra' }) {
  return (
    <div className={`universidad universidad--${variante}`}>
      <img
        className="universidad__logo"
        src={LOGOS[variante]}
        alt="Universidad Nacional de San Luis"
      />
      <span className="universidad__separador" aria-hidden="true" />
      <p className="universidad__lockup">
        <span className="universidad__lockup-main">Digesto</span>
        <span className="universidad__lockup-sub">Administrativo</span>
      </p>
    </div>
  )
}
