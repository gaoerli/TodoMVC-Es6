(function(window) {
  "use strict";

  /**
   * Creates a new Model instance and hooks up the storage
   * 新建一个model并且连接storage(数据库层)
   * @param {object} storage
   */
  function Model(storage) {
    this.storage = storage;
  }

  /**
   * Creates a new todo model
   * 创建一个新的模型
   * @param {string} title
   * @param {function} callback
   */
  Model.prototype.create = function(title, callback) {
    title = title || "";
    callback = callback || function() {};

    var newItem = {
      title: title.trim(),
      completed: false
    };

    this.storage.save(newItem, callback);
  };

  /**
   * Finds and returns a model in storage.If no query is given it'll simply
   * return everything .If you pass in a string or number it'll look that up as
   * the ID of the model to find .Lastly,you can pass it an object to match
   * against.查找或者返回存储中的模型，没有查询返回所有，有string或者数字则返回查找Id
   * 最后可能返回对象
   *
   * @param {string|number|object} query a query to match models against
   * @param {function} callback 查询后的回调
   *
   * @example
   * model.read(1.func); will find the model with an ID of 1
   * model.read('1') same as above
   * 将返回匹配到{foo:'bar',hello:'world'}的所有模型
   * model.read({foo:'bar',hello:'world'})
   */
  Model.prototype.read = function(query, callback) {
    var queryType = typeof query;
    callback = callback || function() {};

    if (queryType === "function") {
      callback = query;
      return this.storage.findAll(callback);
    } else if (queryType === "string" || queryType === "number") {
      query = parseInt(query, 10);
      this.storage.find({ id: query }, callback);
    } else {
      this.storage.find(query, callback);
    }
  };

  /**
   * Updates a model by giving it an ID, data to update,and a callback to fire when
   * the update is complete通过给要更新的数据，模型id以及回调来更新模型
   * @param {number} id the id of the model to update
   * @param {object} data the properties to update and their new value
   * @param {function} callback upadte is complete.
   */
  Model.prototype.update = function(id, data, callback) {
    this.storage.save(data, callback, id);
  };

  /**
   * Removes a model from storage 从存储中删除模型
   * @param {number} id
   * @param {function} callback
   */
  Model.prototype.remove = function(id, callback) {
    this.storage.remove(id, callback);
  };

  /**
   * WARING:will remove All data from storage 从存储中移除所有数据
   * @param {function} callback
   */
  Model.prototype.removeAll = function(callback) {
    this.storage.drop(callback);
  };

  /**
   * Returns a count of all todos 返回所有项的数量
   * active：活跃的未完成
   * completed：已经完成的
   * total：所有的
   * @param {function} callback
   */
  Model.prototype.getCount = function(callback) {
    var todos = {
      active: 0,
      completed: 0,
      total: 0
    };

    this.storage.findAll(function(data) {
      data.forEach(function(todo) {
        if (todo.completed) {
          todos.completed++;
        } else {
          todos.active++;
        }

        todos.total++;
      });
      callback(todos);
    });
  };

  // Export to window 抛出到widow中
  window.app = window.app || {};
  window.app.Model = Model;
})(window);
