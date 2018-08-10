(function(window) {
  "use strict";

  /**
   * 新建一个列表
   * @param {string} name 数据名称
   */
  function Todo(name) {
    this.storage = new app.Store(name);
    this.model = new app.Model(this.storage);
    this.template = new app.Template();
    this.view = new app.View(this.template);
    this.controller = new app.Controller(this.model, this.view);
  }

  var tode = new Todo("gaoel-textdb");

  function setView() {
    return;
    // todo.controller.setView(document.location.hash);
  }

  $on(window, "load", setView);
  $on(window, "hashchange", setView);
})(window);
