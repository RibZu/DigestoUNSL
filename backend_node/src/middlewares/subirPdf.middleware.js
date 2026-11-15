import multer from 'multer';

const LIMITE = 20 * 1024 * 1024;

const subir = multer({ storage: multer.memoryStorage(), limits: { fileSize: LIMITE } }).single('archivo');

export const subirPdf = (req, res, next) => {
  subir(req, res, (err) => {
    if (!err) return next();
    const mensaje = err.code === 'LIMIT_FILE_SIZE' ? 'El PDF puede pesar hasta 20 MB.' : 'No se pudo leer el archivo.';
    const error = new Error(mensaje);
    error.status = 400;
    error.campos = { archivo: mensaje };
    next(error);
  });
};
