import { Todo } from '../models/todo.model';
import { TodoStore } from '../../store/todo.store';
import { TaskState} from '../../enums/taskState';
import { 
    renderTodos, 
    updatePendingCount
} from './index';

const todoStore = new TodoStore();
const { 
    getTodos,
    loadStore
 } = todoStore;

let todos = [];
let todoToggleAll;
let todoListUL;
let todoMainSection;
let todoClearCompleted;
let filtersLI;

const ElementIDs = {
    TODO_LIST: '.todo-list',
    NEW_TODO_INPUT: '#new-todo-input',
    TODO_TOGGLE_ALL: '#toggle-all',
    TODO_MAIN_SECTION: '.main',
    TODO_FILTERS: '.filtro',
    DELETE_COMPLETED: '.clear-completed',
    TODOS_PENDING: '#pending-count'
}  

/**
 * 
 * @param {string} elementIdList Identificador del elemeento HTML
 * @throws {Error} si no se proporciona un elementId
 * @throws {Error} si el elementId no es válido
 * @returns {void} Esta función se encarga de mostrar las tareas (todos) en el elemento especificado por elementId. Requiere un elementId para identificar el elemento HTML donde se van a mostrar las tareas. Si no se proporciona un elementId, lanzará un error indicando que es requerido. Si el elementId no es válido, lanzará un error indicando que no es válido. La función obtiene la lista de tareas (todos) del store utilizando la función getTodos con el filtro actual obtenido por getCurrentFilter, y luego llama a la función renderTodos para renderizar las tareas en el elemento especificado por elementId.
 * @description Esta función se encarga de mostrar las tareas (todos) en el elemento especificado por elementId. Requiere un elementId para identificar el elemento HTML donde se van a mostrar las tareas. Si no se proporciona un elementId, lanzará un error indicando que es requerido. Si el elementId no es válido, lanzará un error indicando que no es válido. La función obtiene la lista de tareas (todos) del store utilizando la función getTodos con el filtro actual obtenido por getCurrentFilter, y luego llama a la función renderTodos para renderizar las tareas en el elemento especificado por elementId.
 * 
 */
const displayTodos = (elementIdList) => {
    if (!elementIdList) {
        throw new Error('elementId es requerido');
    }

    if (Object.values(ElementIDs).includes(elementIdList) === false) {
        throw new Error('elementId no es válido');
    }

    loadStore();   
    todos = getTodos(todoStore.getCurrentFilter);
    renderTodos(elementIdList, todos);
}

/**
 * @description Esta función se encarga de mostrar u ocultar la sección principal de la aplicación (todoMainSection) dependiendo de si hay tareas (todos) en la lista. Si no hay tareas, se oculta la sección principal; de lo contrario, se muestra. La función verifica el número de elementos li dentro del elemento todoListUL para determinar si hay tareas presentes y ajusta el estilo de visualización de todoMainSection en consecuencia.
 * @returns {void} Esta función no devuelve ningún valor, simplemente ajusta la visibilidad de la sección principal de la aplicación según la cantidad de tareas presentes en la lista.
 */
const displayTodoMainSection = () => {
    if (todoListUL.querySelectorAll('li').length === 0) {
        todoMainSection.style.display = 'none';
    } else {
        todoMainSection.style.display = 'block';
    }
}

/**
 * @description Esta función se encarga de mostrar u ocultar el botón para eliminar tareas completadas (todoClearCompleted) dependiendo de si hay tareas marcadas como completadas (done) en la lista de tareas (todos). Si no hay tareas completadas, se oculta el botón; de lo contrario, se muestra. La función verifica la cantidad de tareas que no están marcadas como completadas en comparación con el total de tareas para determinar si hay tareas completadas presentes y ajusta el estilo de visualización de todoClearCompleted en consecuencia.
 * @returns {void} Esta función no devuelve ningún valor, simplemente ajusta la visibilidad del botón para eliminar tareas completadas según la cantidad de tareas completadas presentes en la lista.   
 */
const displayTodoClearCompleted = () => {
    if (todos.filter(todo => !todo.done).length === todos.length) {
        todoClearCompleted.style.display = 'none';
    }
    else {
        todoClearCompleted.style.display = 'block';
    }
}

/**
* @description Esta función se encarga de marcar todas las tareas (todos) como completadas (done) o no completadas, dependiendo del valor del parámetro done. Si done es true, todas las tareas se marcarán como completadas; si done es false, todas las tareas se marcarán como no completadas. La función recorre la lista de tareas (todos) y actualiza el estado de cada tarea según el valor de done, luego guarda el estado actualizado en el almacenamiento local.
* @returns {void} Esta función devuelve la lista de tareas (todos) actualizada después de marcar todas las tareas como completadas o no completadas según el valor del parámetro done.
*/
const chargeTodoslist = () => {;
    // todoStore.setFilter = filter;
    displayTodos(ElementIDs.TODO_LIST);

    if (!todoToggleAll) {
        todoToggleAll = document.querySelector(ElementIDs.TODO_TOGGLE_ALL);
    }

    if (!todoToggleAll) {
        throw new Error('No se encontró el elemento todoToggleAll');
    }

    if (!todoListUL) {
        todoListUL = document.querySelector(ElementIDs.TODO_LIST);
    }

    if (!todoListUL) {
        throw new Error('No se encontró el elemento todoListUL');
    }

    if (!todoMainSection) {
        todoMainSection = document.querySelector(ElementIDs.TODO_MAIN_SECTION);
    }

    if (!todoMainSection) {
        throw new Error('No se encontró el elemento todoMainSection');
    }

    if (!todoClearCompleted) {
        todoClearCompleted = document.querySelector(ElementIDs.DELETE_COMPLETED);
    }

    if (!todoClearCompleted) {
        throw new Error('No se encontró el elemento todoClearCompleted');
    }

    if (!filtersLI) {
        filtersLI = document.querySelectorAll(ElementIDs.TODO_FILTERS);
    }

    if (!filtersLI) {
        throw new Error('No se encontró el elemento filtersLI');
    }

    displayTodoClearCompleted();
    displayTodoMainSection();
    updatePendingCount();
}

export { chargeTodoslist };