import { Todo } from "./interface";
import { LayOut } from "./constants";

export default class Template {
  //页面模板
  layOut(command, parameter?) {
    return this[command](parameter);
  }

  private [LayOut.SHOWTODE](todos: Todo[]): string {
    return todos.reduce(
      (accumulator, { id, title, completed }: Todo) =>
        accumulator +
        `<li data-id="${id}" ${completed ? `class = "completed"` : ``}>
              <div class="view">
                <input 
                  class="toggle"
                  type="checkbox"
                  autocompleted="off"
                  ${completed ? `checked` : ``}
                >
                <label>${title}</label>
                <button class="destroy"></button>
              </div>
            </li>`,
      ""
    );
  }

  private [LayOut.TODOCOUNTER](active): string {
    const plural = active < 2 ? "" : "s";

    return `
      <strong>${active}</strong> item${plural} left
    `;
  }
}
