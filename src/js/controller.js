(function(window) {
  "use strict";

  /**
   * Takes a model and view and acts as the cottroller between them
   * @param {object} model the model instance:实例
   * @param {object} view the view instance:实例
   */
  function Controller(model, view) {
    var self = this;
    self.model = model;
    self.view = view;

    self.view.bind("newTodo", function(title) {
      self.addItem(title);
    });

    self.view.bind("itemEdit", function(item) {
      self.editItem(item.id);
    });

    self.view.bind("itemEditDone", function(item) {
      self.editItemSave(item.id, item.title);
    });

    self.view.bind("itemEditCancel", function(item) {
      self.editItemCancel(item.id);
    });

    self.view.bind("itemRemove", function(item) {
      self.removeItem(item.id);
    });

    self.view.bind("itemToggle", function(item) {
      self.toggleComplete(item.id, item.completed);
    });

    self.view.bind("removeCompleted", function() {
      self.removeCompletedItems();
    });

    self.view.bind("toggleAll", function(status) {
      self.toggleAll(status.completed);
    });
  }

  /**
   * Loads and initialises the view
   * 初始化视图(通过url得到默认选中)
   * @param {string} locationHash  ''|'active'|'completed
   */
  Controller.prototype.setView = function(locationHash) {
    var route = locationHash.split("/")[1];
    var page = route || "";
    this._updateFilterState(page);
  };

  /**
   * An event to fire on load .Will get all items and display them in the
   * todo-list
   * 显示所有的项并将显示到列表中(将model中查到的数据传到view中再调用templete来显示页面)
   */
  Controller.prototype.showAll = function() {
    var self = this;
    // console.log(data);
    self.model.read(function(data) {
      self.view.render("showEntries", data);
    });
  };

  /**
   * 显示未完成项目 Render all active tasks
   */
  Controller.prototype.showActive = function() {
    var self = this;
    self.model.read({ completed: false }, function(data) {
      self.view.render("showEntries", data);
    });
  };

  /**
   * 显示已完成项目 Render all completed tasks
   */
  Controller.prototype.showCompleted = function() {
    var self = this;
    self.model.read({ completed: true }, function(data) {
      self.view.render("showEntries", data);
    });
  };

  /**
   * An envet to fire whenever you want to add an item .Simply pass in the event
   * object and it'll handle the DOM insertion and saving of the new item.
   * 添加项
   * @param {string} title
   */
  Controller.prototype.addItem = function(title) {
    var self = this;

    if (title.trim() === "") {
      return;
    }

    self.model.create(title, function() {
      self.view.render("clearNewTodo");
      self._filter(true);
    });
  };

  /**
   * 开启编辑模式：Triggers the item editting mode.
   * @param {number} id
   */
  Controller.prototype.editItem = function(id) {
    var self = this;
    self.model.read(id, function(data) {
      self.view.render("editItem", { id: id, title: data[0].title });
    });
  };

  /**
   * Finishes the item editing mode successfully.
   * 成功完成编辑状态
   * @param {number} id
   * @param {string} title
   */
  Controller.prototype.editItemSave = function(id, title) {
    var self = this;
    title = title.trim();

    if (title.length !== 0) {
      self.model.update(id, { title: title }, function() {
        self.view.render("editItemDone", { id: id, title: title });
      });
    } else {
      self.removeItem(id);
    }
  };

  /**
   * Cancel the item editing mode.
   * 取消编辑模式
   * @param {number} id
   */
  Controller.prototype.editItemCancel = function(id) {
    var self = this;
    self.model.read(id, function(data) {
      self.view.render("editItemDone", { id: id, title: data[0].title });
    });
  };

  /**
   * By giving it an ID it'll find the DOM element matching that ID,
   * remove it from the DOM and also remove it from storage
   * @param {number} id
   */
  Controller.prototype.removeItem = function(id) {
    var self = this;
    self.model.remove(id, function() {
      self.view.render("removeItem", id);
    });

    self._filter();
  };

  /**
   * 删除已完成项：Will remove all completed items from the Dom and storage.
   */
  Controller.prototype.removeCompletedItems = function() {
    var self = this;
    self.model.read({ completed: true }, function(data) {
      data.forEach(function(item) {
        console.log("item :", item);
        self.removeItem(item.id);
      });
    });

    self._filter();
  };

  /**
   * Give it an Id of a mode and a checkbox and it will update the item
   * in storage based on the checkbox's state.
   * 根据id 勾选复选框
   * @param {number} id the ID of the element to complete or uncomplete
   * @param {string} completed
   * @param {boolearn} silent
   */
  Controller.prototype.toggleComplete = function(id, completed, silent) {
    var self = this;
    // console.log("silent :", silent);
    self.model.update(id, { completed: completed }, function() {
      self.view.render("elementComplete", {
        id: id,
        completed: completed
      });
    });

    if (!silent) {
      self._filter();
    }
  };

  /**
   * Will toggle ALL checkboxes' on/off and completeness of models.
   * Just pass in the event object.
   * 控制所有复选框按钮
   * @param {object} completed
   */
  Controller.prototype.toggleAll = function(completed) {
    var self = this;
    self.model.read({ completed: !completed }, function(data) {
      data.forEach(function(item) {
        self.toggleComplete(item.id, completed, true);
      });
    });

    self._filter();
  };

  /**
   * Updates the pieces of the page which change depending on the remaining
   * number of todos.
   * 更新各个类型数据数量根据数量显示/隐藏
   * 选中按钮/footer(main)/清除所有完成按钮
   */
  Controller.prototype._updateCount = function() {
    var self = this;
    self.model.getCount(function(todos) {
      // 描述信息
      self.view.render("updateElementCount", todos.active);

      // 更新清除全部按钮
      self.view.render("clearCompletedButton", {
        completed: todos.completed,
        visible: todos.completed > 0
      });

      // main/footer显示与隐藏
      self.view.render("contentBlockVisibility", { visible: todos.total > 0 });

      // 全选按钮显示与隐藏
      self.view.render("toggleAll", {
        checked: todos.completed === todos.total
      });
    });
  };

  /**
   * TODO 不太明白的函数(开始处理选中类型的文件)
   * 调用updateCount返回不同类型项的数据
   * 显示所有数据到列表中
   * 初始化当前选中按钮的标志
   * @param {*} force
   */
  Controller.prototype._filter = function(force) {
    // 将选中状态第一字母变成大写
    var activeRoute =
      this._activeRoute.charAt(0).toUpperCase() + this._activeRoute.substr(1);

    // Update the elements on the page, which change with each completed todo
    this._updateCount();

    // If the last active route isn't "All", or we're switching routes, we
    // re-create the todo item elements, calling:
    //   this.show[All|Active|Completed]();
    // 重新渲染列表
    if (
      force ||
      this._lastActiveRoute !== "All" ||
      this._lastActiveRoute !== activeRoute
    ) {
      debugger;
      this["show" + activeRoute]();
    }

    this._lastActiveRoute = activeRoute;
  };

  /**
   * 初始化为ALL(设置默认筛选)
   * @param {string} currentPage page
   */
  Controller.prototype._updateFilterState = function(currentPage) {
    // console.log("选中currentPage :", currentPage);
    this._activeRoute = currentPage;

    if (currentPage == "") {
      this._activeRoute = "All";
    }
    this._filter();

    this.view.render("setFilter", currentPage);
  };

  // 抛出到window中
  window.app = window.app || {};
  window.app.Controller = Controller;
})(window);
