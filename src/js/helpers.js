/**
 * 查询选择器
 * @param {string} selector 选择器(p,li,.,#)
 * @param {Element} scope
 */
export function qs(selector, scope) {
  return (scope || document).querySelector(selector);
}

/**
 * 事件监听器
 * @param {Element|window} target :目标元素（必须作用到的）
 * @param {string} type Event name to bind to 事件绑定到
 * @param {Function} callback Event callback
 * @param {boolean} capture Capture the event 事件
 */
export function $on(target, type, callback, capture) {
  target.addEventListener(type, callback, !capture);
}

/**
 *
 * @param {Element} target Element which the event must bubble to 事件冒泡必须作用到的元素
 * @param {string} selector Selector to mathch
 * @param {string} type Event name(click)
 * @param {Function} handler Function called when the event bubbles to frome an element matching selector
 * @param {boolean} capture Capture the event
 */
export function $delegate(target, selector, type, handler, capture) {
  const dispatchEvent = event => {
    const targetElement = event.target;
    const potentialElements = target.querySelectorAll(selector);
    let i = potentialElements.length;

    while (i--) {
      if (potentialElements[i] === targetElement) {
        handler.call(targetElement, event);
        break;
      }
    }
  };

  $on(target, type, dispatchEvent, !!capture);
}

/**
 * Encode less-than and ampersand charachters with entity codes to make user-
 * provided text safe to parse as html
 * 代替特殊字符
 * @param {string} s String to escape
 */
export const escapeForHTML = s =>
  s.replace(/[&<]/g, c => (c === "&" ? "&amp;" : "&lt;"));
