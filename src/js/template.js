/** 节点是真实存在的 */
(function(window) {
  "use strict";
  var htmlEscapes = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };

  /**
   * 特殊字符转换函数
   * @param {char} chr
   */
  var escapeHtmlChar = function(chr) {
    return htmlEscapes[chr];
  };

  var reUnescapedHtml = /[&<>"'`]/g;
  var reHasUnescapedHtml = new RegExp(reUnescapedHtml.source);

  /**
   * 替换文本中的特殊字符
   * @param {string} string
   */
  var escape = function(string) {
    return string && reHasUnescapedHtml.test(string)
      ? string.replace(reUnescapedHtml, escapeHtmlChar)
      : string;
  };

  /**
   *
   * Sets up defaults for all the Template methods such as a default template
   * 给所有模板设置默认值
   * 构造函数
   */
  function Template() {
    this.defaultTemplate =
      '<li data-id ="{{id}}" class = "{{completed}}">' +
      '<div class="view">' +
      '<input class = "toggle" type = "checkbox" {{checked}}' +
      "<label>{{title}}</label>" +
      '<button class="destroy"></button>' +
      "</div>" +
      "</div>";
  }

  /**
   * Creates an <li>Html string and returns it for placement in you app
   * @param {object} data The object containing keys you want to find in the
   *                    template to replace
   *  将模板中的key来通过data数据来替换
   * NOTE:In real life you should be using a templating engine such as Mustache
   * Or handlebars, however,this is a vanilla Js example.现实中一般使用模板
   * @returns {string} HTML String of an <li> element
   */
  Template.prototype.show = function(data) {
    var i, l;
    var view = "";

    for (i = 0, l = data.length; i < l; i++) {
      var template = this.defaultTemplate;
      var completed = "";
      var checked = "";

      if (data[i].completed) {
        completed = "completed";
        checked = "checked";
      }

      template = template.replace("{{id}}", data[i].id);
      template = template.replace("{{title}}", escape(data[i].title));
      template = template.replace("{{completed}}", completed);
      template = template.replace("{{checked}}", checked);

      view = view + template;
    }
    return view;
  };

  /**
   * Display a counter of how many to dos are left to complete
   * 显示所有项目数量
   * @param {number} activeTodos the nubmer of active todos.
   * @returns {string} string containing the cont 文本显示
   */
  Template.prototype.itemCounter = function(activeTodos) {
    var plural = activeTodos === 1 ? "" : "s";

    return "<strong>" + activeTodos + "</strong> item" + plural + " left";
  };

  /**
   * Updates the text within the "Crear completed" button
   * 设置已完成按钮文本
   * @param {number} completedTodos The number of completed todos
   * @returns {string} string containing the count
   */
  Template.prototype.clearCompletedButton = function(completedTodos) {
    if (completedTodos > 0) {
      return "Clear completed";
    } else {
      return "";
    }
  };

  // 抛出到window
  window.app = window.app || {};
  window.app.Template = Template;
})(window);
