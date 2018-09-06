// 数据库
import { Todo, Data } from "./interface";

export default class Store {
  constructor(private name: string) {
    localStorage[name] = localStorage[name] || JSON.stringify({ todos: [] });
  }

  /**
   * 获取所有数据
   * @param callback
   */
  all = (): Data => JSON.parse(localStorage[this.name]);

  /**
   * 增删改查-增/改
   * @param todo Todo
   * @param callback 没有返回值回调
   */
  save(todo: Todo, callback = () => void 0) {
    const data = this.all();
    const todos: Todo[] = data.todos;
    const { id } = todo;

    if (id) {
      for (let i = 0, length = todos.length; i < length; i++) {
        if (todos[i].id === id) {
          for (let k in todo) {
            todos[i][k] = todo[k];
          }
          break;
        }
      }

      localStorage[this.name] = JSON.stringify(data);

      callback();
    } else {
      todo.id = Date.now();
      todos.push(todo);
      localStorage[this.name] = JSON.stringify(data);

      callback();
    }
  }

  /**
   * 增删改查-查
   * @param query 查找条件
   * @param callback 返回符合条件的集合
   */
  find(query, callback: (todos: Todo[]) => void) {
    if (!callback) return;

    const todos: Todo[] = this.all().todos;

    const filter: Todo[] = todos.filter(todo => {
      for (const q in query) {
        if (query[q] !== todo[q]) return false;
      }

      return true;
    });

    callback(filter);
  }

  /**
   * 增删改查-删
   * @param id number
   * @param callback function
   */
  remove(id, callback: () => void) {
    const data = this.all();
    const todos: Todo[] = data.todos;

    todos.forEach((todo, index) => {
      if (todo.id === id) {
        todos.splice(index, 1);
      }
    });

    localStorage[this.name] = JSON.stringify(data);

    callback();
  }
}
