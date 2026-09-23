import mock from "../features/concursos/concursos.mock.json"

function simularRespuesta(datos){
    return new Promise((resolve)=>{
        setTimeout(()=>(resolve(datos),100))
    }
    )
}

export function obtenerFacultades(){
    return simularRespuesta(mock.facultades);
}

export function obtenerConcursos({facultad}={}){
    const todos = mock.concursos
    const filtrados=facultad?todos.filter((concurso) => concurso.facultad == facultad):todos
    return simularRespuesta(filtrados);

}