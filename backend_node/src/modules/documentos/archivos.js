import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from '../../config/env.js';

const raiz = () => path.resolve(env.ARCHIVOS_DIR);

const dos = (n) => String(n).padStart(2, '0');

export const esPdf = (buffer) =>
  Buffer.isBuffer(buffer) && buffer.length >= 5 && buffer.subarray(0, 5).toString('latin1') === '%PDF-';

export const rutaParaDocumento = (id, fecha = new Date()) => {
  const aaaamm = `${fecha.getFullYear()}${dos(fecha.getMonth() + 1)}`;
  const marca = `${aaaamm}${dos(fecha.getDate())}${dos(fecha.getHours())}${dos(fecha.getMinutes())}${dos(fecha.getSeconds())}`;
  return `${aaaamm}/${marca}_${String(id).padStart(5, '0')}.pdf`;
};

export const rutaAbsoluta = (rutaRelativa) => {
  const base = raiz();
  const completa = path.resolve(base, rutaRelativa);
  if (completa !== base && !completa.startsWith(base + path.sep)) return null;
  return completa;
};

export const guardarArchivo = async (rutaRelativa, buffer) => {
  const destino = rutaAbsoluta(rutaRelativa);
  await fs.mkdir(path.dirname(destino), { recursive: true });
  await fs.writeFile(destino, buffer);
};

export const existeArchivo = async (rutaRelativa) => {
  const destino = rutaAbsoluta(rutaRelativa);
  if (!destino) return false;
  try {
    await fs.access(destino);
    return true;
  } catch {
    return false;
  }
};
