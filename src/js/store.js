/** 类似数据库层 */
(function(window) {
  "use stric";
  /**
   * Creates a new client side storage object and will create an empty
   * collection if no collection already exists.创建一个客户端存储对象
   *
   * @param {string} name The name of our DB we want to use(key)
   * @param {function} callback Our fake DB uses callbacks because in
   * real life you probably would be making AJAX calls
   */
  function Store(name, callback) {
    callback = callback || function() {};

    this._dbName = name;

    if (!localStorage.getItem(name)) {
      var todos = []; //value

      localStorage.setItem(name, JSON.stringify(todos)); // 存入对象
    }

    // 返回key=name对应的value值
    callback.call(this, JSON.parse(localStorage.getItem(name)));
  }

  /**
   * Finds items based on query given as a JS object 根据给定的项查找(返回满足条件的新的数组)
   * @param {object} query the query to match against(i.e.{foo:'bar'})
   * @param {function} callback the callback to fire when the query has
   * completed running
   *
   * @example
   * db.find({foo:'bar',hello:'world'},function (data){
   *  data:将返回任何具有foo: bar和hello: world属性的项
   * });
   */
  Store.prototype.find = function(query, callback) {
    if (!callback) {
      return;
    }

    var todos = JSON.parse(localStorage.getItem(this._dbName));

    callback.call(
      this,
      todos.filter(function(todo) {
        for (var q in query) {
          if (query[q] !== todo[q]) {
            return false;
          }
        }
        return true;
      })
    );
  };
  /**
   * 检索客户端所有的数据
   * @param {function} callback 检索数据时候触发的回调函数
   */
  Store.prototype.findAll = function(callback) {
    callback = callback || function() {};
    callback.call(this, JSON.parse(localStorage.getItem(this._dbName)));
  };

  /**
   * Will save the given data to the DB.If no item exists it will create a new
   * item,otherwise it'll simply update an existing item's properties
   * 存在就更新，不存在就添加
   * @param {object} updateData 保存到数据库的数据
   * @param {function} callback 保存后的回调
   * @param {number} id 可选要更新项的id
   */
  Store.prototype.save = function(updateData, callback, id) {
    var todos = JSON.parse(localStorage.getItem(this._dbName));

    callback = callback || function() {};

    if (id) {
      for (var i = 0; i < todos.length; i++) {
        if (todos[i].id == id) {
          for (var key in updateData) {
            todos[i][key] = updateData[key];
          }
          break;
        }
      }

      localStorage.setItem(this._dbName, JSON.stringify(todos));
      callback.call(this, todos);
    } else {
      //Generate an ID
      updateData.id = new Date().getTime();

      todos.push(updateData);
      localStorage.setItem(this._dbName, JSON.stringify(todos));
      callback.call(this, [updateData]);
    }
  };

  /**
   * 根据id删除固定项
   * @param {number} id 想要删除的id
   * @param {function} callback 删除操作后的回调函数
   */
  Store.prototype.remove = function(id, callback) {
    var todos = JSON.parse(localStorage.getItem(this._dbName));
    for (var i = 0; i < todos.length; i++) {
      if (todos[i].id == id) {
        todos.splice(i, 1);
        break;
      }
    }
    localStorage.setItem(this._dbName, JSON.stringify(todos));
    callback.call(this, todos);
  };

  /**
   * 删除客户端所有的存储
   * @param {function} callback 删除所有后的回调函数
   */
  Store.prototype.drop = function(callback) {
    var todos = [];
    localStorage.setItem(this._dbName, JSON.stringify(todos));
    callback.call(this, todos);
  };

  // Export to window 导出到window中
  window.app = window.app || {};
  window.app.Store = Store;
})(window);
