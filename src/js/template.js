import { ItemList } from "./item";

import { escapeForHTML } from "./helpers";

export default class Template {
  /**
   * 渲染列表模板
   * @param {ItemList} items
   * @returns {!string} Contents for a todo list
   */
  itemList(items) {
    return items.reduce(
      (a, item) =>
        a +
        `
    <li data-id="${item.id}" ${item.completed ? ' class="completed"' : ""}>
      <div class= 'view'>
        <input class = "toggle" type = "checkbox" ${
          item.completed ? "checked" : ""
        }>
        <label>${escapeForHTML(item.title)}</label>
        <button class ="destroy"></button>
      </div>
    </li>`,
      ""
    );
  }

  /**
   * Format the contents of an "items left" indicator
   * 底部描述信息
   * @param {number} activeTodos
   */
  itemCounter(activeTodos) {
    return `${activeTodos} item${activeTodos !== 1 ? "s" : ""} left`;
  }
}
