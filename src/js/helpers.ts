// 辅助类

/**
 * 选择元素
 * @param selector 目的节点
 * @param scope 源
 * @return Element
 */
export const $ = (selector, scope = document) => scope.querySelector(selector);

/**
 * 返回包含固定标签的父/祖先节点
 * @param element 元素
 * @param tagName 标签名称
 */
export const $parent = (element, tagName) => {
  if (!element.parentNode) return;

  if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
    return element.parentNode;
  }

  return $parent(element.parentNode, tagName);
};

/**
 * 事件绑定函数
 * @param element 元素
 * @param event 事件类型
 * @param fn 执行函数
 * @param options 是否捕获/范围缩小标志
 */
export const $on = (
  element,
  event,
  fn,
  options: { target?: string; capture?: boolean } = {}
) => {
  const delegatiorFn = e =>
    e.target.matches(options.target) && fn.call(e.target, e);

  element.addEventListener(
    event,
    options.target ? delegatiorFn : fn,
    options.capture || false
  );
};
