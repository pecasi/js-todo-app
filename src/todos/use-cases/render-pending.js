import { TodoStore } from "../../store/todo.store";
import { TaskState } from "../../enums/taskState";

const { getTodos } = new TodoStore();   
let todosPending;

const ElementIDs = {
    TODOS_PENDING: '#pending-count'
}  

/**
 * @description Esta función se encarga de actualizar el contador de tareas pendientes (todosPending) en la interfaz de usuario. Verifica si el elemento todosPending ya ha sido referenciado; si no es así, intenta obtenerlo del DOM utilizando document.querySelector con el identificador correspondiente. Si no se encuentra el elemento, lanzará un error indicando que no se encontró el elemento con el id pending-count. Luego, obtiene la lista de tareas pendientes utilizando la función getTodos con el filtro TaskState.PENDING y actualiza el texto del elemento todosPending con la cantidad de tareas pendientes.
 * @returns {void} Esta función no devuelve ningún valor, simplemente actualiza el contador de tareas pendientes en la interfaz de usuario según la cantidad de tareas pendientes presentes en la lista.
 */
const updatePendingCount = () => {
    if (!todosPending) {
        todosPending = document.querySelector(ElementIDs.TODOS_PENDING);
    }
    
    if (!todosPending) {
        throw new Error('No se encontró el elemento con id pending-count');
    }
    
    const todosPend = getTodos(TaskState.PENDING);
    todosPending.innerText = todosPend.length;
}

export { updatePendingCount };