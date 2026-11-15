const MAXIMO = 2147483647;

export const validarId = (mensaje) => (req, res, next, id) => {
  if (!/^\d+$/.test(id) || Number(id) < 1 || Number(id) > MAXIMO) {
    const error = new Error(mensaje);
    error.status = 404;
    return next(error);
  }
  next();
};
