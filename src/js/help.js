/** global NodeList */
(function(window) {
  "use strict";

  // Get element(s) by CSS selector:通过CSS选择器获取元素
  /**
   * 获取元素
   * @param {*} selector 选择器：p .class #id
   * @param {*} scope 范围
   */
  window.qs = function(selector, scope) {
    return (scope || document).querySelector(selector);
  };
  window.qsa = function(selector, scope) {
    return (scope || document).querySelectorAll(selector);
  };

  // addEventListener wrapper:包装监听器
  /**
   * 监听器
   * @param {*} target 目标
   * @param {*} type 类型
   * @param {*} callback 回调函数
   * @param {*} useCapture 第三个参数
   * $(document).on('.target','click',function(){},useCapture)
   */
  window.$on = function(target, type, callback, useCapture) {
    target.addEventListener(type, callback, !!useCapture);
  };

  // Attach a handler to event for all elements that match the selector,
  // now or in the future, based on a root element 基于根元素，给所有选择器匹配的元素添加程序事件、
  /**
   * 添加事件
   * @param {*} target 目标
   * @param {*} selector 选择器
   * @param {*} type 类型
   * @param {*} handler 操作者
   */
  window.$delegate = function(target, selector, type, handler) {
    function dispatchEvent(event) {
      var targetElement = event.target;
      var potentialElements = window.qsa(selector, target);
      var hasMatch =
        Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;

      if (hasMatch) {
        handler.call(targetElement, event);
      }
    }

    // https://developer.mozilla.org/en-US/docs/Web/Events/blur
    var useCapture = type === "blur" || type === "focus";

    window.$on(target, type, dispatchEvent, useCapture);
  };

  //Find the element's parents with the given tag name:
  // $parent(qs('a'),'div')
  /**
   * 使用标记名查找元素的父元素
   * @param {*} element 本元素
   * @param {*} tagName 标记名
   */
  window.$parent = function(element, tagName) {
    if (!element.parentNode) {
      return;
    }
    if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
      return element, parentNode;
    }
    return window.$parent(element.parentNode, tagName);
  };

  // Allow for looping on nodes by chaining:允许通过链接在节点上循环:
  // qsa('.foo').forEach(function(){})
  NodeList.prototype.forEach = Array.prototype.forEach;
})(window);
