import isologoUnsl from './isologo-unsl.webp'
import logoUnslBlanco from './logo-unsl-blanco.png'
import './Universidad.css'

export default function Universidad({
  variant = 'light',
  showLogo = true,
  showLockup = true,
  className = '',
}) {
  const logoSrc = variant === 'dark' ? logoUnslBlanco : isologoUnsl

  return (
    <div className={`universidad universidad--${variant} ${className}`.trim()}>
      {showLogo && (
        <img
          className="universidad__logo"
          src={logoSrc}
          alt="Universidad Nacional de San Luis"
        />
      )}
      {showLockup && (
        <p className="universidad__lockup">
          <span className="universidad__lockup-main">Digesto</span>
          <span className="universidad__lockup-sub">Administrativo</span>
        </p>
      )}
    </div>
  )
}
