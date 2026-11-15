import { pedirApi } from '../../auth'

const CARGOS = [
  'Profesores Titulares',
  'Profesores Asociados',
  'Profesores Adjuntos',
  'Jefes de Trabajos Practicos',
  'Auxiliares de Primera',
  'Auxiliares de Segunda',
  'Agregados Ad-Honorem Alumnos',
  'Agregados Ad-Honorem Diplomados',
  'Varios',
]

const DEDICACIONES = ['Exclusivos', 'Semiexclusivos', 'Simples', 'Completos', 'Varias']

const CARACTERES = [
  'Efectivos',
  'Interinos',
  'Suplentes',
  'Temporarios',
  'Reemplazantes',
  'Contratados',
  'Varios',
]

export async function obtenerCatalogos() {
  const [tiposDocumento, organos, prefijos, dependencias, departamentos, areas] = await Promise.all([
    pedirApi('/tipos-documento'),
    pedirApi('/organos'),
    pedirApi('/prefijos'),
    pedirApi('/dependencias'),
    pedirApi('/departamentos'),
    pedirApi('/areas'),
  ])

  return {
    tiposDocumento,
    organos,
    prefijos,
    dependencias,
    departamentos,
    areas,
    cargos: CARGOS,
    dedicaciones: DEDICACIONES,
    caracteres: CARACTERES,
  }
}
