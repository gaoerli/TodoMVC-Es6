import Store from "./store";
import View from "./view";
import Template from "./template";
import Model from "./model";
import Controller from "./controller";

export default class TodoApp {
  private store: Store;
  private model: Model;
  private template: Template;
  private view: View;
  controller: Controller;

  constructor(private name: string) {
    this.store = new Store(this.name);
    this.model = new Model(this.store);
    this.template = new Template();
    this.view = new View(this.template);
    this.controller = new Controller(this.model, this.view);
  }
}
