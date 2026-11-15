function AvisoGuardado({ titulo, textoBoton, onCargarOtro }) {
  return (
    <div className="alert alert-success" role="status">
      <h2 className="h5">{titulo}</h2>
      <button type="button" className="btn btn-primary" onClick={onCargarOtro}>
        {textoBoton}
      </button>
    </div>
  )
}

export default AvisoGuardado
