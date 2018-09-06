import Store from "./store";
import { Todo, TodosCount } from "./interface";

export default class Model {
  constructor(private store: Store) {}

  create(title: string, callback: () => void) {
    const newTodo: Todo = {
      title,
      completed: false
    };

    this.store.save(newTodo, callback);
  }

  read(query, callback?) {
    const queryType = typeof query;

    switch (queryType) {
      case "function":
        callback = query;
        callback(this.store.all().todos);
        break;

      case "string":
      case "number":
        query = parseInt(query, 10);
        this.store.find({ id: query }, callback);
        break;

      default:
        this.store.find(query, callback);
    }
  }

  upadte(todoToggled: Todo, callback) {
    this.store.save(todoToggled, callback);
  }

  delete(id: number, callback: () => void) {
    this.store.remove(id, callback);
  }

  getCount(callback: (todosCount: TodosCount) => void) {
    const todosCount: TodosCount = {
      active: 0,
      completed: 0,
      total: 0
    };

    this.store.all().todos.forEach(todo => {
      todo.completed ? todosCount.completed++ : todosCount.active++;
      todosCount.total++;
    });

    callback(todosCount);
  }
}
