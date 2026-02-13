import html from './app.html?raw';
import { TodoStore } from '../store/todo.store';
import { renderTodos, updatePendingCount, chargeTodoslist } from './use-cases';
import { TaskState } from '../enums/taskState';

const todoStore = new TodoStore();

const { 
    deleteTodo, 
    deleteTodoCompleted, 
    addTodo, 
    toggleTodo,
    toggleAllTodo,
    getTodos,
    saveStateToLocalStorage
} = todoStore;

let todos = [];
let todoToggleAll;
let todoListUL;
let todoMainSection;
let todoClearCompleted;
let filtersLI;

/**
 * 
 * @param {string} elementId de la etiqueta donde se va a renderizar la app
 * @throws {Error} si no se proporciona un elementId
 * @description Esta función se encarga de renderizar la aplicación en el elemento especificado por elementId. Si no se proporciona un elementId, lanzará un error indicando que es requerido. La función utiliza una función autoejecutable para crear un nuevo elemento div, asignarle el contenido HTML de la aplicación y luego agregarlo al DOM en el elemento especificado por elementId.
 */

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
 *@description Esta función se encarga de cargar las referencias a los elementos HTML necesarios para la aplicación. Verifica si cada elemento ya ha sido cargado previamente y, si no es así, utiliza document.querySelector para obtener la referencia al elemento correspondiente. Si no se encuentra algún elemento, lanzará un error indicando que no se encontró el elemento específico. Esta función es esencial para asegurar que las referencias a los elementos HTML estén disponibles antes de interactuar con ellos en la aplicación.
 * @returns {void} Esta función no devuelve ningún valor, simplemente carga las referencias a los elementos HTML necesarios para la aplicación y lanza errores si no se encuentran los elementos correspondientes.
 */
const chargePageElements = () => {
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
};

/**
 * 
 * @param {string} elementId Identificador del elemento HTML
 * @throws {Error} si no se proporciona un elementId
 * @throws {Error} si el elementId no es válido
 * @returns {void} Esta función se encarga de mostrar las tareas (todos) en el elemento especificado por elementId. Requiere un elementId para identificar el elemento HTML donde se van a mostrar las tareas. Si no se proporciona un elementId, lanzará un error indicando que es requerido. Si el elementId no es válido, lanzará un error indicando que no es válido. La función obtiene la lista de tareas (todos) del store utilizando la función getTodos con el filtro actual obtenido por getCurrentFilter, y luego llama a la función renderTodos para renderizar las tareas en el elemento especificado por elementId.
 * @description Esta función se encarga de mostrar las tareas (todos) en el elemento especificado por elementId. Requiere un elementId para identificar el elemento HTML donde se van a mostrar las tareas. Si no se proporciona un elementId, lanzará un error indicando que es requerido. Si el elementId no es válido, lanzará un error indicando que no es válido. La función obtiene la lista de tareas (todos) del store utilizando la función getTodos con el filtro actual obtenido por getCurrentFilter, y luego llama a la función renderTodos para renderizar las tareas en el elemento especificado por elementId.
 */
const app = (elementId) => {
    if (!elementId) {
        throw new Error('elementId es requerido');
    }

    if (!document.querySelector(elementId)) {
        throw new Error('elementId no es válido');
    }

    //Cuando la funcion se llama
    (() => {
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector(elementId).append(app);

        chargeTodoslist();
        chargePageElements();  
    })();

    //Referencias a los elementos HTML
    const newTodoInput = document.querySelector(ElementIDs.NEW_TODO_INPUT);
    const deleteCompleted = document.querySelector(ElementIDs.DELETE_COMPLETED);

    //Eventos
    newTodoInput.addEventListener('keyup', (event) => {
        if (event.keyCode === 13) {
            if (event.target.value.trim().length === 0) {
                return;
            }
            
            if (todos.filter(todo => todo.description.trim().toLowerCase() === event.target.value.trim().toLowerCase()).length > 0) {
                return;
            }

            addTodo(newTodoInput.value);
            newTodoInput.value = '';
            chargeTodoslist();
        }
    });

    todoListUL.addEventListener('click', (event) => {
        const element = event.target.closest('[data-id]');
        if (!element) {
            return;
        }
        
        toggleTodo(element.getAttribute('data-id'), todos);
        chargeTodoslist();
    });

    todoToggleAll.addEventListener('click', () => {
        todos = getTodos();
        if (todos.length !== 0) {
            if (todos.filter(todo => !todo.done).length === todos.length) {
                toggleAllTodo(true);
            } else {                
                toggleAllTodo(false);
            }
        }

        chargeTodoslist();
    });

    todoListUL.addEventListener('click', (event) => {
        const element = event.target.closest('[data-id]');
        if (!element) {
            return;
        }

        const isDestroyButton = event.target.classList.contains('destroy');
        if (isDestroyButton) {
            deleteTodo(element.getAttribute('data-id'));
            chargeTodoslist();
        }
    });

    deleteCompleted.addEventListener('click', () => {
        deleteTodoCompleted();
        chargeTodoslist();
    });

    filtersLI.forEach(filter => {
        filter.addEventListener('click', (event) => {
            filtersLI.forEach(f => f.classList.remove('selected'));
            event.target.classList.add('selected');

            switch (event.target.text) {
                case 'Todos':
                    event.target.setAttribute('data-filter', TaskState.ALL);
                    break;
                case 'Pendientes':
                    event.target.setAttribute('data-filter', TaskState.PENDING);
                    break;
                case 'Completados':
                    event.target.setAttribute('data-filter', TaskState.COMPLETED);
                    break;
            }

            todoStore.setFilter = event.target.getAttribute('data-filter')*1;
            chargeTodoslist();  
        });
    });
};

export { app };

