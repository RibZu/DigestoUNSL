import { buscarDocumentos, registrarTerminoBuscado } from './busqueda.repository.js';
import { validarFiltros } from '../documentos/filtros.js';

export const realizarBusqueda = async (filtros) => {
    validarFiltros(filtros);
    if (filtros.q) {
        await registrarTerminoBuscado(filtros.q);
    }
    
    return await buscarDocumentos(filtros);
};