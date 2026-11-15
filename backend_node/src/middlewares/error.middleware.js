export const errorHandler = (err, req, res, next) => {
  const status = err.status ?? 500;

  if (status === 500) {
    console.error(err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }

  if (err.campos) {
    return res.status(status).json({ error: err.message, campos: err.campos });
  }

  res.status(status).json({ error: err.message });
};
