/** 全局变量 qs,qsa,$on,$parent,$delegate from help.js */
(function(window) {
  "ues strict";
  /**
   * View that abstracts away the browser's DOM completely
   * 抽象浏览器中的DOM视图
   * It has two simple entry points:
   *
   *  -bind(eventName,handler)
   *  -render(command,parameterObject)
   * @param {object} template
   */
  function View(template) {
    this.template = template;

    this.ENTER_KEY = 13;
    this.ESCAPE_KEY = 27;

    this.$todoList = qs(".todo-list"); //项目列表
    this.$todoItemCounter = qs(".todo-count"); //显示项目总数文本
    this.$clearCompleted = qs(".clear-completed"); //清除完成按钮
    this.$main = qs(".main"); //列表盒子
    this.$footer = qs(".footer"); // 脚部信息
    this.$toggleAll = qs(".toggle-all"); //所有项变成完成
    this.$newTodo = qs(".new-todo"); //新增项
  }

  /**
   * 根据id删除项列表中的具体值
   * @param {number} id
   */
  View.prototype._removeItem = function(id) {
    // 先查找出id相应的DOM节点
    var elem = qs('[data-id="' + id + '"]');

    if (elem) {
      this.$todoList.removeChild(elem);
    }
  };

  /**
   * 清除完成项按钮
   * @param {number} completedCount 数量
   * @param {boolearn} visible 可见标志
   */
  View.prototype._clearCompletedButton = function(completedCount, visible) {
    this.$clearCompleted.innerHTML = this.template.clearCompletedButton(
      completedCount
    );
    this.$clearCompleted.style.display = visible ? "block" : "none";
  };

  /**
   * 选按钮添加seleced标志
   * @param {string} currentPage active/completed
   */
  View.prototype._setFilter = function(currentPage) {
    qs(".filters .selected").className = "";
    qs('.filters [href="#/' + currentPage + '"]').className = "selected";
  };

  /**
   * 将完成项添加checked标志
   * @param {number} id 选中id
   * @param {string} completed 是否完成标志
   */
  View.prototype._elementComplete = function(id, completed) {
    var listItem = qs('[data-id="' + id + '"]');

    if (!listItem) {
      return;
    }
    listItem.className = completed ? "completed" : "";

    qs("input", listItem).checked = completed;
  };

  /**
   * 修改项的显示title-ing
   * @param {number} id
   * @param {string} title
   */
  View.prototype._editItem = function(id, title) {
    // 先根据id找到节点
    var listItem = qs('[data-id="' + id + '"]');

    if (!listItem) {
      return;
    }

    // 添加class
    listItem.className = listItem.className + " editing";

    // 新建节点
    var input = document.createElement("input");
    input.className = "edit";

    listItem.appendChild(input);
    input.focus();
    input.value = title;
  };

  /**
   * 修改项的显示title-done
   * @param {*} id  same as above
   * @param {*} title same as above
   */
  View.prototype._editItemDone = function(id, title) {
    var listItem = qs('[data-id="' + id + '"]');

    if (!listItem) {
      return;
    }

    var input = qs("input.edit", listItem);
    listItem.removeChild(input);

    listItem.className = listItem.className.replace("editing", "");

    qsa("label", listItem).forEach(function(label) {
      label.textContent = title;
    });
  };

  /**
   *
   * @param {*} viewCmd  视图
   * @param {*} parameter 参数
   */
  View.prototype.render = function(viewCmd, parameter) {
    var self = this;
    var viewCommands = {
      showEntries: function() {
        self.$todoList.innerHTML = self.template.show(parameter);
      },
      removeItem: function() {
        self._removeItem(parameter);
      },
      updateElementCount: function() {
        self.$todoItemCounter.innerHTML = self.template.itemCounter(parameter);
      },
      clearCompletedButton: function() {
        self._clearCompletedButton(parameter.completed, parameter.visible);
      },
      contentBlockVisibility: function() {
        self.$main.style.display = self.$footer.style.display = parameter.visible
          ? "block"
          : "none";
      },
      toggleAll: function() {
        self.$toggleAll.checked = parameter.checked;
      },
      setFilter: function() {
        self._setFilter(parameter);
      },
      clearNewTodo: function() {
        self.$newTodo.value = "";
      },
      elementComplete: function() {
        self._elementComplete(parameter.id, parameter.completed);
      },
      editItem: function() {
        self._editItem(parameter.id, parameter.title);
      },
      editItemDone: function() {
        self._editItemDone(parameter.id, parameter.title);
      }
    };
    viewCommands[viewCmd]();
  };

  /**
   * 返回项的id
   * @param {object} element
   * @returns id of number
   */
  View.prototype._itemId = function(element) {
    var li = $parent(element, "li");
    // 将节点的id转化为十进制
    return parseInt(li.dataset.id, 10);
  };

  /**
   * 操作项事件
   * @param {*} handler
   */
  View.prototype._bindItemEditDone = function(handler) {
    var self = this;
    $delegate(self.$todoList, "li .edit", "blur", function() {
      if (!this.dataset.iscanceled) {
        handler({
          id: self._itemId(this),
          title: this.value
        });
      }
    });

    $delegate(self.$todoList, "li .edit", "keypress", function(event) {
      if (event.keyCode === self.ENTER_KEY) {
        // Remove the cursor from the input when you hit enter just like if it
        // were a real form 回车键按下，光标立刻
        this.blur();
      }
    });
  };

  View.prototype._bindItemEditCancel = function(handler) {
    var self = this;
    $delegate(self.$todoList, "li .edit", "keyup", function(event) {
      if (event.keyCode == self.ESCAPE_KEY) {
        this.dataset.iscanceled = true;
        this.blur();

        handler({ id: self._itemId(this) });
      }
    });
  };

  /**
   * 事件集合
   * @param {object} event
   * @param {object} handler 操作对象
   */
  View.prototype.bind = function(event, handler) {
    var self = this;
    // console.log(handler);

    if (event === "newTodo") {
      $on(self.$newTodo, "change", function() {
        debugger;
        console.log(self.$newTodo);
        handler(self.$newTodo.value);
      });
    } else if (event === "removeCompleted") {
      $on(self.$clearCompleted, "click", function() {
        handler();
      });
    } else if (event === "toggleAll") {
      $on(self.$toggleAll, "click", function() {
        handler({ completed: this.checked });
      });
    } else if (event === "itemEdit") {
      $delegate(self.$todoList, "li label", "dblclick", function() {
        handler({ id: self._itemId(this) });
      });
    } else if (event === "itemRemove") {
      $delegate(self.$todoList, ".destroy", "click", function() {
        handler({ id: self._itemId(this) });
      });
    } else if (event === "itemToggle") {
      $delegate(self.$todoList, ".toggle", "click", function() {
        handler({ id: self._itemId(this), completed: this.checked });
      });
    } else if (event === "itemEditDone") {
      self._bindItemEditDone(handler);
    } else if (event === "itemEditCancel") {
      self._bindItemEditCancel(handler);
    }
  };

  // 抛出View到window中
  window.app = window.app || {};
  window.app.View = View;
})(window);
