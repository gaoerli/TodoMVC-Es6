import { emptyItemQuery } from "./item";
import Store from "./store";
import View from "./store";

export default class Controller {
  constructor(store, view) {
    this.store = store;
    this.view = view;

    // 事件初始化
    /**
     * 新增
     */
    view.bindAddItem(this.addItem.bind(this));

    /**
     * 编辑保存
     */
    view.bindEditItemSave(this.editItemSave.bind(this));

    /**
     * 编辑关闭
     */
    view.bindEditItemCancel(this.editItemCancel.bind(this));

    /**
     * 删除单项
     */
    view.bindRemoveItem(this.removeItem.bind(this));

    /**
     * 选择单项
     */
    view.bindToggleItem((id, completed) => {
      this.toggleCompleted(id, completed);
      this._filter();
    });

    /**
     * 删除完成
     */
    view.bindRemoveCompleted(this.removeCompletedItems.bind(this));

    /**
     * 选中所有
     */
    view.bindToggleAll(this.toggleAll.bind(this));

    this._activeRoute = ""; //路由标志
    this._lastActiveRoute = null;
  }

  /**
   *  Set and render the active route.
   * @param {string} raw ''| '#/' | '#/active' |'#/completed'
   */
  setView(raw) {
    const route = raw.replace(/^#\//, "");
    this._activeRoute = route;
    this._filter();
    this.view.updateFilterButtons(route);
  }

  //TODO 具体方法
  // 增
  addItem(title) {
    this.store.insert({ id: Date.now(), title, completed: false }, () => {
      this.view.clearNewTodo();
      this._filter(title);
    });
  }

  // 改
  editItemSave(id, title) {
    if (title.length) {
      this.store.upadte({ id, title }, () => {
        this.view.editItemDone(id, title); // 开启编辑模式
      });
    } else {
      this.removeItem(id);
    }
  }

  /**
   * 关闭编辑
   * @param {number} id
   */
  editItemCancel(id) {
    this.store.find({ id }, data => {
      const title = data[0].title;
      this.view.editItemDone(id, title);
    });
  }

  /**
   * 删
   * @param {number} id
   */
  removeItem(id) {
    this.store.remove({ id }, () => {
      this._filter();
      this.view.removeItem(id);
    });
  }

  /**
   * Remove all completed items.
   */
  removeCompletedItems() {
    this.store.remove({ completed: true }, this._filter.bind(this));
  }

  /**
   * Update an Item in storage based on the state of completed
   * @param {number} id Id of the target Item
   * @param {boo} completed Desired completed state
   */
  toggleCompleted(id, completed) {
    this.store.upadte({ id, completed }, () => {
      this.view.setItemComplete(id, completed);
    });
  }

  /**
   * Set all items to completed or active
   * @param {boolean} completed Desired completed state
   */
  toggleAll(completed) {
    this.store.find({ completed: !completed }, data => {
      for (let { id } of data) {
        this.toggleCompleted(id, completed);
      }
    });

    this._filter();
  }

  /**
   * 初始化各个按钮的状态(描述，清除按钮，全选按钮，mian显示与隐藏))
   * @param {booleac} force
   */
  _filter(force) {
    const route = this._activeRoute;

    if (
      force ||
      this._lastActiveRoute !== "" ||
      this._lastActiveRoute !== route
    ) {
      /* jscs:disable disallowQuotedKeysInObjects */
      this.store.find(
        {
          "": emptyItemQuery,
          active: { completed: false },
          completed: { completed: true }
        }[route],
        this.view.showItem.bind(this.view)
      );
      /* jscs:enable disallowQuotedKeysInObjects */
    }

    this.store.count((total, active, completed) => {
      this.view.setItemsLeft(active);
      this.view.setClearCompletedButtonVisibility(completed);
      this.view.setCompleteAllCheckbox(completed === total);
      this.view.setMainAndFooterVisibility(total);
    });

    this._lastActiveRoute = route;
  }
}
