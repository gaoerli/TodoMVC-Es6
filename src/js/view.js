import { ItemList } from "./item";
import { qs, $on, $delegate } from "./helpers";

const _itemId = element =>
  parseInt(
    element.parentNode.dataset.id || element.parentNode.parentNode.dataset.id,
    10
  );

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

/**
 * 视图层的操作
 */
export default class View {
  /**
   * @param {!Template} template A template instance
   */
  constructor(template) {
    this.template = template; //传入html模板
    this.$todoList = qs(".todo-list"); //列表
    this.$todoItemCounter = qs(".todo-count"); //描述
    this.$clearCompleted = qs(".clear-completed"); // 清除按钮
    this.$main = qs(".main");
    this.$footer = qs(".footer");
    this.$toggleAll = qs(".toggle-all"); //全选按钮
    this.$newTodo = qs(".new-todo"); //新增框
    $delegate(this.$todoList, "li lable", "dblclick", ({ target }) => {
      this.editItem(target);
    }); //编辑
  }

  /**
   * Put an item into edit mode.(改)
   * @param {!Element} target Target Item's lable Element
   */
  editItem(target) {
    const listItem = target.parentElement.parentElement;

    listItem.classList.add("editing");

    const input = document.createElement("input");
    input.className = "edit";

    input.value = target.innerText;
    listItem.appendChild(input);
    input.focus();
  }

  /**
   * Prpulate the todo list with a list of items
   * 显示所有的列表项到html中(读)
   * @param {ItemList} items
   */
  showItem(items) {
    this.$todoList.innerHTML = this.template.itemList(items);
  }

  /**
   * Remove an item from the view (删))
   * @param {number} id Item Id of the item to remove
   */
  removeItem(id) {
    const elem = qs(`[data-id="${id}"]`);

    if (elem) {
      this.$todoList.removeChild(elem);
    }
  }

  /**
   *  Set the number in the 'items left ' display
   * (显示底部左侧信息)
   * @param {number} itemsLeft Number of items left(total)
   */
  setItemsLeft(itemsLeft) {
    this.$todoItemCounter.innerHTML = this.template.itemCounter(itemsLeft);
  }

  /**
   * Set the visibility of the 'Clear completed' button.
   * 显示清除按钮
   * @param {number||boolean} visible
   */
  setClearCompletedButtonVisibility(visible) {
    this.$clearCompleted.style.display = !!visible ? "block" : "none";
  }

  /**
   * above of all
   * @param {boolean || number} visible
   */
  setMainAndFooterVisibility(visible) {
    this.$main.style.display = !!visible ? "block" : "none";
    this.$footer.style.display = !!visible ? "block" : "none";
  }

  /**
   * above of all
   * 全选按钮
   * @param {boolean ||number} checked
   */
  setCompleteAllCheckbox(checked) {
    this.$toggleAll.checked = !!checked;
  }

  /**
   * Change the appearance of the filter buttons based on the route.
   * 更新底部选中按钮
   * @param {string} route the current route
   */
  updateFilterButtons(route) {
    qs(".filters .selected").className = "";
    qs(`.filters [href ="#/${route}"]`).className = "selected";
  }

  /**
   * Clear the new todo input
   */
  clearNewTodo() {
    this.$newTodo.value = "";
  }

  /**
   * Render an item as either completed or not
   * 更新单个选中
   * @param {!number} id
   * @param {!booean} completed
   */
  setItemComplete(id, completed) {
    const listItem = qs(`[data-id="${id}"]`);

    if (!listItem) {
      return;
    }

    listItem.className = completed ? "completed" : ""; //列表添加属性

    qs("input", listItem).checked = completed; //input属性
  }

  /**
   * Bring an item out of edit mode.
   * 编辑模式
   * @param {number} id
   * @param {string} title
   */
  editItemDone(id, title) {
    const listItem = qs(`[data-id="${id}"]`);

    const input = qs("input edit", listItem);
    listItem.removeChild(input);

    listItem.classList.remove("editing");

    qs("label", listItem).textContent = title;
  }

  // TODO 事件的开始
  /**
   * 增事件
   * @param {Function} handler Function called on synthetic event.
   */
  bindAddItem(handler) {
    $on(this.$newTodo, "change", ({ target }) => {
      const title = target.value.trim();

      if (title) {
        handler(title);
      }
    });
  }

  /**
   * 删除完成事件
   * @param {Function} handler above of all
   */
  bindRemoveCompleted(handler) {
    $on(this.$clearCompleted, "click", handler);
  }

  /**
   * 全选事件
   * @param {*} handler above of all
   */
  bindToggleAll(handler) {
    $on(this.$toggleAll, "click", ({ target }) => {
      handler(target.checked);
    });
  }

  /**
   * 删除单个事件
   * @param {*} handler above of all
   */
  bindRemoveItem(handler) {
    $delegate(this.$todoList, ".destroy", "click", ({ target }) => {
      handler(_itemId(target));
    });
  }

  /**
   * 选单个事件
   * @param {*} handler above of all
   */
  bindToggleItem(handler) {
    $delegate(this.$todoList, ".toggle", "click", ({ target }) => {
      handler(_itemId(target), target.checked);
    });
  }
  /**
   * 编辑完成事件
   * @param {*} handler above of all
   */
  bindEditItemSave(handler) {
    $delegate(
      this.$todoList,
      "li .edit",
      "blur",
      ({ target }) => {
        if (!target.dataset.iscanceled) {
          handler(_itemId(target), target.value.trim());
        }
      },
      true
    );

    $delegate(this.$todoList, "li .edit", "keypress", (target, keyCode) => {
      console.log("ENTER_KEY :", keyCode);
      if (keyCode === ENTER_KEY) {
        target.blur();
      }
    });
  }

  /**
   * 键盘弹起事件
   * @param {} handler above of all
   */
  bindEditItemCancel(handler) {
    $delegate(this.$todoList, "li .edit", "keyup", () => {
      console.log("ESCAPE_KEY :", keyCode);
      if (keyCode === ESCAPE_KEY) {
        target.dataset.iscanceled = true;
        target.blur();

        handler(_itemId(target));
      }
    });
  }
}
