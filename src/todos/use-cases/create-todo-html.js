import { Todo } from '../models/todo.model.js';

/**
 * @param {Todo} todo tarea a renderizar
 * @throws {Error} si no se proporciona una tarea (todo)
 * @returns {string} HTML de la tarea a renderizar
 * @description Esta función se encarga de generar el HTML para una tarea (todo) específica. Requiere un objeto de tipo Todo como parámetro y devuelve una cadena de texto que representa el HTML de la tarea. El HTML generado incluye un elemento li con la descripción de la tarea y, si la tarea está marcada como completada (done), se agrega una clase 'completed' al elemento li.
 */
const createTodoHTML = (todo) => {
    if (!todo) {
        throw new Error('todo es requerido');
    }

    const { description, done, id } = todo;

    const html = `<div class="view">
                    <input class="toggle" type="checkbox" ${done ? 'checked' : ''}>
                    <label>${description}</label>
                    <button class="destroy"></button>
                </div>
                <input class="edit" value="Create a TodoMVC template">`;

    const element = document.createElement('li',);

    if (done) {
        element.classList.add('completed');
    }
    
    element.setAttribute('data-id', id);
    element.innerHTML = html;   

    return element;
}

export { createTodoHTML };