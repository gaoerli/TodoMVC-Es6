import Model from "./model";
import View from "./view";
import { Render } from "./constants";
import { TodosCount, Todo } from "./interface";

export default class Controller {
  private acitveRoute: string;
  private lastAcitveRoute: string;

  constructor(private model: Model, private view: View) {
    this.acitveRoute = "";
    this.lastAcitveRoute = "";

    this.on();
  }

  private setView(locationHash: string) {
    const route = locationHash.split("/")[1];
    const page = route || "";

    this.updateFilterState(page);
  }

  // 设置初始化状态
  private updateFilterState(currentPage) {
    this.acitveRoute = currentPage;
    this.acitveRoute = this.acitveRoute || "All";

    this.filter();
    this.view.render([Render.底部过滤器class配置], currentPage);
  }

  /**
   * 事件集合
   */
  private on() {
    this.view.onLoad(hash => {
      this.setView(hash);
    });

    this.view.onHashChange(hash => {
      this.setView(hash);
    });

    this.view.onAddTodo(title => {
      this.addTodo(title);
    });

    this.view.onRemoveTodo(id => {
      this.removeTodo(id);
    });

    this.view.onToggleTodo(todoToggled => {
      this.toggleTodo(todoToggled);
    });

    this.view.onToggleAllTodo(status => {
      this.toggleAllTodo(status);
    });

    this.view.onEditTodo(id => {
      this.editTodo(id);
    });

    this.view.onEditDone(todo => {
      this.editTodoDone(todo);
    });

    this.view.onEditTodoCancel(id => {
      this.editTodoCancel(id);
    });

    this.view.onRemoveCompleted(() => {
      this.removeCompleted();
    });
  }

  private addTodo(title: string) {
    if (title.trim() === "") return;

    this.model.create(title, () => {
      this.view.render(Render.清理输入框);
      this.filter(true);
    });
  }

  private removeTodo(id: number) {
    this.model.delete(id, () => {
      this.view.render(Render.删除一项, id);
    });
  }

  private toggleTodo(todoToggled: Todo, silent: boolean = false) {
    this.model.upadte(todoToggled, () => {
      // 改变视图层
      this.view.render(Render.切换完成状态, todoToggled);
    });

    !silent && this.filter();
  }

  private toggleAllTodo(completed: boolean) {
    // this.model.upadte({ completed }, completed => {});
    this.model.read({ completed: !completed }, (todos: Todo[]) => {
      todos.forEach(todo => {
        const { id, completed } = todo;

        this.toggleTodo({ id, completed: !completed }, true);
      });
    });
    // 更改底显示
    this.filter();
  }

  private editTodo(id: number) {
    this.model.read(id, (todos: Todo[]) => {
      const { id, title } = todos[0];

      this.view.render(Render.编辑模式, { id, title });
    });
  }

  private editTodoDone(todo: Todo) {
    let { id, title } = todo;
    title = title.trim();

    if (title.length !== 0) {
      this.model.upadte(todo, () => {
        this.view.render(Render.编辑完成, { id, title });
      });
    } else {
      this.removeTodo(id);
    }
  }

  private editTodoCancel(id: number) {
    this.model.read(id, (todos: Todo[]) => {
      const { title } = todos[0];

      this.view.render(Render.编辑完成, { id, title });
    });
  }

  private removeCompleted() {
    this.model.read({ completed: true }, (todos: Todo[]) => {
      todos.forEach(todo => {
        const { id } = todo;

        this.removeTodo(id);
      });
    });

    this.filter();
  }

  // 页面是否刷新/底部显示
  private filter(force = false) {
    const acitveRoute =
      this.acitveRoute.charAt(0).toUpperCase() + this.acitveRoute.substr(1);

    this.updateCount();

    if (
      focus ||
      this.acitveRoute !== "All" ||
      this.lastAcitveRoute !== acitveRoute
    ) {
      this[`show${acitveRoute}`]();
    }

    this.lastAcitveRoute = acitveRoute;
  }

  // 更新底部按钮显示
  private updateCount() {
    this.model.getCount(({ active, completed, total }: TodosCount) => {
      this.view.render(Render.更新底部计数显示, active);
      this.view.render(Render.清除所有完成项按钮可见性, completed > 0);
      this.view.render(Render.全选, completed === total);
      this.view.render(Render.Main可见性, total > 0);
    });
  }

  private showAll() {
    this.model.read(data => {
      this.view.render(Render.渲染列表, data);
    });
  }

  private showActive() {
    this.model.read({ completed: false }, data => {
      this.view.render(Render.渲染列表, data);
    });
  }
  private showCompleted() {
    this.model.read({ completed: true }, data => {
      this.view.render(Render.渲染列表, data);
    });
  }
}
