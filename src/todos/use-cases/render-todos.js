import { createTodoHTML } from "./create-todo-html";
import { Todo } from "../models/todo.model";

let element;

/**
 * 
 * @param {string} elementId de la etiqueta donde se va a renderizar la app
 * @param {Array<Todo>} todos lista de tareas a renderizar
 * @throws {Error} si no se encuentra el elemento con el id especificado
 * @throws {Error} si no se proporciona un elementId
 * @throws {Error} si no se proporciona una lista de tareas (todos)
 * @description Esta función se encarga de renderizar la lista de tareas (todos) en el elemento especificado por elementId. Si no se encuentra el elemento con el id especificado, lanzará un error indicando que no se encontró el elemento. La función limpia el contenido del elemento antes de iterar sobre la lista de tareas y crear un nuevo elemento li para cada tarea, asignando su descripción como texto y agregando una clase 'completed' si la tarea está marcada como completada. Finalmente, cada elemento li se agrega al DOM dentro del elemento especificado por elementId.
 */
const renderTodos = (elementId, todos) => {
    if (!elementId) {
        throw new Error('elementId es requerido');
    }

    if (!todos) {
        throw new Error('todos es requerido');
    }

    if (!element) {
        element = document.querySelector(elementId);
    }

    if (!element) {
        throw new Error('No se encontró el elemento con id todo-list');
    }

    element.innerHTML = '';

    todos.forEach(todo => { 
        element.append(createTodoHTML(todo));
    });
}

export { renderTodos };