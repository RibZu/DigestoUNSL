export const crearError = (mensaje, status = 400, campos = undefined) => {
  const error = new Error(mensaje);
  error.status = status;
  if (campos) error.campos = campos;
  return error;
};

export const exigirPermiso = (usuario, modulo, idDependencia, mensaje) => {
  if (usuario.es_admin) return;
  const tiene = usuario.permisos?.some(
    (p) => p.modulo === modulo && Number(p.id_dependencia) === Number(idDependencia)
  );
  if (!tiene) throw crearError(mensaje, 403);
};
