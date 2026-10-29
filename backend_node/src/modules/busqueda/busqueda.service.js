import {buscarDocumentos, registrarTerminoBuscado } from './busqueda.repository.js';

export const realizarBusqueda = async (filtros) => {
    // Si viene un parámetro de búsqueda general, incrementamos la estadística en termino_buscado
    if (filtros.q) {
        await registrarTerminoBuscado(filtros.q);
    }
    
    return await buscarDocumentos(filtros);
};