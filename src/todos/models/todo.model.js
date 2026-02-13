import { v4 as uuidv4 } from 'uuid';    

class Todo {
    /**
     * 
     * @param {*} description descripcion de la tarea a realizar
     * @throws {Error} si no se proporciona una descripción
     * @description Esta clase representa una tarea (todo) con una descripción, un estado de completado (done), una fecha de creación (createdAt) y un identificador único (id). El constructor requiere una descripción para crear una nueva instancia de Todo. Si no se proporciona una descripción, lanzará un error indicando que es requerida. Al crear una nueva instancia, se asigna un id inicial de 1, el estado de completado se establece en false y la fecha de creación se establece en la fecha actual.
     */ 
    constructor(description) {
        if (!description) {
            throw new Error('description es requerida');
        }

        this.id = uuidv4();
        this.description = description;
        this.done = false;
        this.createdAt = new Date();
    }   
}

export { Todo };