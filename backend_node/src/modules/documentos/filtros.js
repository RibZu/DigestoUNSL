import { crearError } from './errores.js';

const MAXIMO_ENTERO = 2147483647;
const NUMEROS = ['tipo', 'organo', 'dependencia'];
const FECHAS = ['desde', 'hasta'];
const TEXTOS = ['q', 'facultad', 'cargo', 'dedicacion', 'caracter', 'numero', 'orden', 'estado'];

const vacio = (valor) => valor === undefined || valor === null || String(valor).trim() === '';

export const esFechaValida = (valor) => {
  const texto = String(valor).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
  const fecha = new Date(`${texto}T00:00:00Z`);
  return !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === texto;
};

export const validarFiltros = (filtros) => {
  const campos = {};

  for (const campo of NUMEROS) {
    const valor = filtros[campo];
    if (!vacio(valor) && (!/^\d+$/.test(String(valor).trim()) || Number(valor) < 1 || Number(valor) > MAXIMO_ENTERO)) {
      campos[campo] = 'Tiene que ser un número entero positivo.';
    }
  }

  if (!vacio(filtros.anio) && !/^\d{4}$/.test(String(filtros.anio).trim())) {
    campos.anio = 'El año tiene que tener 4 cifras.';
  }

  for (const campo of FECHAS) {
    if (!vacio(filtros[campo]) && !esFechaValida(filtros[campo])) {
      campos[campo] = 'La fecha tiene que tener el formato AAAA-MM-DD.';
    }
  }

  for (const campo of TEXTOS) {
    if (filtros[campo] !== undefined && typeof filtros[campo] !== 'string') {
      campos[campo] = 'Tiene que ser un texto.';
    }
  }

  if (Object.keys(campos).length > 0) throw crearError('Hay datos inválidos.', 400, campos);
};
