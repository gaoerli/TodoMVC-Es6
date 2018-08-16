import { Item, ItemList, ItemQuery, ItemUpdate, emptyItemQuery } from "./item";

export default class Store {
  /**
   * 构造函数
   * @param {string} name Database name
   * @param {function()} [callback] Called when the Store is ready
   * Store 完成后的返回函数
   */
  constructor(name, callback) {
    /**
     * @type {Storage}
     */
    const localStorage = window.localStorage;

    /**
     * @type {ItemList} :数组
     */
    let liveTodos;

    /**
     * Read the local ItemList from localStorage.(读)
     */
    this.getLocalStorage = () => {
      return liveTodos || JSON.parse(localStorage.getItem(name) || "[]");
    };

    /**
     * Write the local ItemList to localStorage.(写))))
     * @param {ItemList} todos
     */
    this.setLocalStorage = todos => {
      localStorage.setItem(name, JSON.stringify((liveTodos = todos)));
    };

    if (callback) {
      callback();
    }
  }

  /**
   * Find items with properties matching those on query.
   * 按规则返回数组
   * @param {Object} query
   * @param {function} callback
   */
  find(query, callback) {
    const todos = this.getLocalStorage();
    let k;

    callback(
      todos.filter(todo => {
        for (k in query) {
          if (query[k] !== todo[k]) {
            return false;
          }
        }
        return true;
      })
    );
  }

  /**
   *
   * Update an iten in the Store.(改)
   * @param {ItemUpdate} update Record with an id and a property to updat
   * @param {function} callback
   */
  update(update, callback) {
    const id = update.id;
    const todos = this.getLocalStorage();
    let i = todos.length;
    let k;

    while (i--) {
      if (todos[i].id === id) {
        for (k in update) {
          todos[i][k] = update[k];
        }
        break;
      }
    }

    this.setLocalStorage(todos);

    if (callback) {
      callback();
    }
  }

  /**
   * Insert an item into the Store.(增)
   * @param {Item} item Item to intert
   * @param {function} callback Called when item is inserted
   */
  insert(item, callback) {
    const todos = this.getLocalStorage();
    todos.push(item);
    this.setLocalStorage(todos);

    if (callback) {
      callback();
    }
  }

  /**
   * Remove items form the Stroe based on a query.(删)
   * @param {ItemQuery} query Query matching the items to remove(id:'11222')
   * @param {function} callback Called when records matching query are removed
   * @returns todos
   */
  remove(query, callback) {
    let k;

    const todos = this.getLocalStorage().filter(todo => {
      for (k in query) {
        if (query[k] !== todo[k]) {
          return true;
        }
      }
      return false;
    });

    this.setLocalStorage(todos);

    if (callback) {
      callback(todos);
    }
  }

  /**
   * Count total,active,and completed todos.
   * @param {function} callback (总数,未完成数,已完成数)
   */
  count(callback) {
    this.find(emptyItemQuery, data => {
      const total = data.length;

      let i = total;
      let completed = 0;

      while (i--) {
        completed += data[i].completed; //类型自动转换
      }
      callback(total, total - completed, completed);
    });
  }
}
