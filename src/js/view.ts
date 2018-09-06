import Template from "./template";
import { $, $parent, $on } from "./helpers";
import { Render, LayOut, ENTER_KEY, ESCAPE_KEY } from "./constants";
import { Todo } from "./interface";

export default class View {
  private $new;
  private $list;
  private $counter;
  private $clearCompleted;
  private $main;
  private $footer;
  private $toggle;
  private $toggleAll;

  constructor(private template: Template) {
    this.$new = $(".new-todo");
    this.$list = $(".todo-list");
    this.$counter = $(".todo-count");
    this.$clearCompleted = $(".clear-completed");
    this.$main = $(".main");
    this.$footer = $(".footer");
    this.$toggleAll = $(".toggle-all");
  }

  private getItemId(element) {
    const li = $parent(element, "li");

    return parseInt(li.dataset.id, 10);
  }

  // 页面加载
  onLoad(handle: (hash: string) => void) {
    $on(window, "load", () => {
      handle(document.location.hash);
    });
  }

  // 路由更改
  onHashChange(handle: (hash: string) => void) {
    $on(window, "hashchange", () => {
      handle(document.location.hash);
    });
  }

  // 新增事件
  onAddTodo(handle: (title: string) => void) {
    $on(this.$new, "change", () => {
      handle(this.$new.value);
    });
  }

  //删除一项
  onRemoveTodo(handle: (id: number) => void) {
    $on(
      this.$list,
      "click",
      event => {
        const id = this.getItemId(event.target);
        handle(id);
      },
      { target: ".destroy" }
    );
  }

  // 选中一项
  onToggleTodo(handle: (todo: Todo) => void) {
    $on(
      this.$list,
      "change",
      event => {
        const id = this.getItemId(event.target);
        const completed = event.target.checked;
        handle({ id, completed });
      },
      { target: ".toggle" }
    );
  }

  // 全选
  onToggleAllTodo(handle: (status: boolean) => void) {
    $on(this.$toggleAll, "click", event => {
      handle(event.target.checked);
    });
  }

  // 编辑模式
  onEditTodo(handle: (id: number) => void) {
    $on(
      this.$list,
      "dblclick",
      event => {
        const id = this.getItemId(event.target);
        handle(id);
      },
      { target: "li label" }
    );
  }

  // 编辑完成
  onEditDone(handle: (todo: Todo) => void) {
    $on(
      this.$list,
      "blur",
      event => {
        if (!event.target.dataset.iscanceled) {
          const id = this.getItemId(event.target);
          const title = event.target.value;
          handle({ id, title });
        }
      },
      { target: "li .edit", capture: true }
    );

    $on(
      this.$list,
      "keypress",
      event => {
        event.keyCode === ENTER_KEY && event.target.blur();
      },
      { target: "li .edit" }
    );
  }

  // 放弃编辑
  onEditTodoCancel(handle: (id: number) => void) {
    $on(
      this.$list,
      "keyup",
      event => {
        const id = this.getItemId(event.target);
        // alert("退出编辑状态");
        if (event.keyCode === ESCAPE_KEY) {
          event.target.dataset.iscanceled = true;
          event.target.blur();
          handle(id);
        }
      },
      { target: "li .edit" }
    );
  }

  // 删除所有完成
  onRemoveCompleted(handle: () => void) {
    $on(this.$clearCompleted, "click", () => {
      handle();
    });
  }

  // 渲染页面
  render(command, parameter?) {
    this[command](parameter);
  }

  // 清除输入框
  private [Render.清理输入框]() {
    this.$new.value = "";
  }

  private [Render.Main可见性](visible: boolean) {
    this.$main.hidden = this.$footer.hidden = !visible;
  }

  private [Render.清除所有完成项按钮可见性](visible: boolean) {
    this.$clearCompleted.hidden = !visible;
  }

  private [Render.全选](allChecked: boolean) {
    this.$toggleAll.checked = allChecked;
  }

  private [Render.渲染列表](todos) {
    this.$list.innerHTML = this.template.layOut([LayOut.SHOWTODE], todos);
  }

  private [Render.底部过滤器class配置](currentPage) {
    $(".filters .selected").classList.remove("selected");
    $(`.filters [href="#/${currentPage}"]`).classList.add("selected");
  }

  private [Render.更新底部计数显示](active: number) {
    // const htmls = this.template.layOut(LayOut.TODOCOUNTER, active);
    this.$counter.innerHTML = this.template.layOut(LayOut.TODOCOUNTER, active);
  }

  private [Render.删除一项](id: number) {
    const el = $(`[data-id="${id}"]`);
    // debugger;

    el && this.$list.removeChild(el);
  }

  private [Render.切换完成状态](toggleTodo: Todo) {
    const { id, completed } = toggleTodo;

    const todo = $(`[data-id="${id}"]`);

    if (!todo) return;

    todo.classList.toggle("completed", completed);
    // todo.classList.toggle("completed");

    $("input", todo).checked = completed;
  }

  private [Render.编辑模式]({ id, title }: Todo) {
    const editing = $(`[data-id="${id}"]`);

    editing.classList.add("editing");

    const input = document.createElement("input");
    input.className = "edit";

    editing.appendChild(input);
    input.focus();
    input.value = title;
  }

  private [Render.编辑完成]({ id, title }: Todo) {
    const editing = $(`[data-id="${id}"]`);
    const input = $(".edit", editing);

    editing.removeChild(input);
    editing.classList.remove("editing");

    $("label", editing).textContent = title;
  }
}
