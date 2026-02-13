import { Todo } from '../todos/models/todo.model';
import { TaskState } from '../enums/taskState';

class TodoStore {
    constructor() {
        this.todos = [ new Todo('Piedra del alma'),
        new Todo('Piedra del tiempo'),
        new Todo('Piedra del espacio'),
        new Todo('Piedra de la realidad'),
        new Todo('Piedra del poder')],
        this.filter = TaskState.ALL;
    }   

    /**
     * @description Esta función se encarga de inicializar el estado del store. Actualmente, solo imprime el estado inicial del store en la consola, pero también se puede descomentar la línea loadStore() para cargar el estado desde el localStorage si es necesario. Al llamar a esta función, se mostrará el estado actual del store, incluyendo las tareas (todos) y el filtro establecido.
     */
    initStore = () => {
        this.loadStore();
        console.log('InitStore 🥑: ', { ...this });
    }   

    saveStateToLocalStorage = () => {       
        localStorage.setItem('state', JSON.stringify({
            todos: this.todos,  
            filter: this.filter
        }));
    }

    /**
     * @description Esta función se encarga de cargar el estado del store desde el localStorage. Si hay un estado guardado en el localStorage, se parsea y se asignan los valores de las tareas (todos) y el filtro al estado actual del store. Si no hay un estado guardado, el store mantendrá su estado inicial con las tareas predefinidas y el filtro establecido en TaskState.ALL.
     */
    loadStore = () => {   
        if (localStorage.getItem('state')) {
            const { todos = [], filter = TaskState.ALL } = JSON.parse(localStorage.getItem('state'));
            this.todos = todos;
            this.filter = filter;
        }   
    }

    /**
     * 
     * @param {string} description de la tarea ejemplo: Piedra del alma
     * @throws {Error} si no se proporciona una descripción
     * @description Esta función se encarga de agregar una nueva tarea (todo) a la lista de tareas. Requiere una descripción para crear una nueva instancia de Todo. Si no se proporciona una descripción, lanzará un error indicando que es requerida. Al crear una nueva instancia de Todo, se asigna un id único, el estado de completado se establece en false y la fecha de creación se establece en la fecha actual. Luego, la nueva tarea se agrega a la lista de tareas (todos) del store.
     */
    addTodo = (description) => {
        if (!description) {
            throw new Error('description es requerida');
        }

        this.loadStore();
        const todo = new Todo(description);
        this.todos.push(todo);

        this.saveStateToLocalStorage();
    }
    
    /**
     * 
     * @param {string} id identificador de la tarea
     * @throws {Error} si no se proporciona un id
     * @throws {Error} si no se encuentra una tarea con el id proporcionado
     * @returns {Todo} la tarea modificada con el nuevo estado 
     * @description Esta función se encarga de cambiar el estado de una tarea (todo) en la lista de tareas. Requiere un id para identificar la tarea que se desea modificar. Si no se proporciona un id, lanzará un error indicando que es requerido. La función recorre la lista de tareas (todos) del store y, si encuentra una tarea cuyo id coincide con el id proporcionado, cambia su estado de completado a su valor opuesto (true a false o viceversa). Las demás tareas permanecen sin cambios.
     */
    toggleTodo = (id) => {
        if (!id) {
            throw new Error('id es requerido');
        }

        this.loadStore();
        const todoIndex = this.todos.findIndex(todo => todo.id === id);

        if (todoIndex === -1) {
            throw new Error('Todo no encontrado');
        }

        this.todos[todoIndex].done = !this.todos[todoIndex].done;
        this.saveStateToLocalStorage();

        return this.todos[todoIndex];

        // this.todos = this.todos.map(todo => {
        //     if (todo.id === id) {
        //         return {
        //             ...todo,
        //             done: !todo.done
        //         }
        //     }
        //     return todo;
        // });
    }

    /**
     * 
     * @param {boolean} done estado de completado que se desea establecer para todas las tareas
     * @throws {Error} si no se proporciona un valor para done o si el valor proporcionado no es un booleano
     * @description Esta función se encarga de cambiar el estado de todas las tareas (todos) en la lista de tareas. Requiere un valor booleano para establecer el estado de completado de todas las tareas. Si no se proporciona un valor para done o si el valor proporcionado no es un booleano, lanzará un error indicando que done debe ser un booleano. La función recorre la lista de tareas (todos) del store y establece el estado de completado de cada tarea al valor proporcionado en done.
     * @returns {void} Esta función no devuelve ningún valor, pero modifica el estado de todas las tareas en la lista de tareas del store según el valor proporcionado en done. 
     */
    toggleAllTodo = (done) => {
        if (typeof done !== 'boolean') {
            throw new Error('done debe ser un booleano');
        }

        this.todos = this.todos.map(todo => {
            return {
                ...todo,
                done
            }
        });
        this.saveStateToLocalStorage();
    }

    /**
     * 
     * @param {string} id identificador de la tarea
     * @throws {Error} si no se proporciona un id
     * @description Esta función se encarga de eliminar una tarea (todo) de la lista de tareas. Requiere un id para identificar la tarea que se desea eliminar. Si no se proporciona un id, lanzará un error indicando que es requerido. La función filtra la lista de tareas (todos) del store, manteniendo solo aquellas tareas cuyo id no coincide con el id proporcionado, lo que resulta en la eliminación de la tarea correspondiente.
     */
    deleteTodo = (id) => {
        if (!id) {
            throw new Error('id es requerido');
        }

        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveStateToLocalStorage();
    }

    /**
     * @description Esta función se encarga de eliminar todas las tareas (todos) que están marcadas como completadas (done) en la lista de tareas del store. No requiere ningún parámetro. La función filtra la lista de tareas (todos) del store, manteniendo solo aquellas tareas cuyo estado de completado (done) es false, lo que resulta en la eliminación de todas las tareas que estaban marcadas como completadas.
     */
    deleteTodoCompleted = () => {
        this.todos = this.todos.filter(todo => !todo.done);
        this.saveStateToLocalStorage();
    }

    /**
     * @param {TaskState} filter filtro de las tareas ejemplo: TaskState.ALL, TaskState.COMPLETED, TaskState.PENDING
     * @throws {Error} si no se proporciona un filtro o si el filtro no es válido
     * @returns {Array} lista de tareas filtrada según el filtro proporcionado ejemplo: si el filtro es TaskState.COMPLETED, se devuelve una lista de tareas que están marcadas como completadas (done). Si el filtro es TaskState.PENDING, se devuelve una lista de tareas que no están marcadas como completadas (done). Si el filtro es TaskState.ALL o cualquier otro valor, se devuelve la lista completa de tareas sin aplicar ningún filtro.
     * @description Esta función se encarga de obtener la lista de tareas (todos) del store según el filtro proporcionado. El filtro puede ser TaskState.ALL, TaskState.COMPLETED o TaskState.PENDING. Si el filtro es TaskState.COMPLETED, se devuelve una lista de tareas que están marcadas como completadas (done). Si el filtro es TaskState.PENDING, se devuelve una lista de tareas que no están marcadas como completadas (done). Si el filtro es TaskState.ALL o cualquier otro valor, se devuelve la lista completa de tareas sin aplicar ningún filtro.
     */
    getTodos = (filter = TaskState.ALL) => {
        this.loadStore();
        if (!filter) {
            throw new Error('filter es requerido');
        }

        if (!Object.values(TaskState).includes(filter)) {
            throw new Error('Filter no válido');
        }

        switch (filter) {
            case TaskState.COMPLETED:
                return this.todos.filter(todo => todo.done);
            case TaskState.PENDING:
                return this.todos.filter(todo => !todo.done);
            case TaskState.ALL:
                return this.todos;
            default:
                throw new Error('Filter no válido');
        }
    }  

    /**
     * 
     * @param {@TaskState} filter filtro de las tareas ejemplo: TaskState.ALL, TaskState.COMPLETED, TaskState.PENDING
     * @throws {Error} si no se proporciona un filtro o si el filtro no es válido
     * @description Esta funcion establece el filtro de las tareas
     */
    set setFilter (filter = TaskState.ALL)  {
        if (!filter) {
            throw new Error('filter es requerido');
        }

        if (!Object.values(TaskState).includes(filter)) {   
            throw new Error('Filter no válido');
        }

        this.filter = filter;
        this.saveStateToLocalStorage();
    }

    /** 
     * @returns {TaskState} filter filtro de las tareas ejemplo: TaskState.ALL, TaskState.COMPLETED, TaskState.PENDING  
     * @description Esta funcion obtiene el filtro actual de las tareas
    */   
     get getCurrentFilter () {
        return this.filter;
    }
}

export { TodoStore };