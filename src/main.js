import './style.css'
import { app } from './todos/app.js'
import { TodoStore } from './store/todo.store.js';

const todoStore = new TodoStore();

const { initStore } = todoStore;

initStore();

app('#app'); 