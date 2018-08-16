import Controller from "./controller";
import { $on } from "./helpers";
import Template from "./template";
import Store from "./store";
import View from "./view";

const store = new Store("gaoerlidb-es6");

const templeted = new Template();
const view = new View(templeted);

const controller = new Controller(store, view);

const setView = () => controller.setView(document.location.hash);

$on(window, "load", setView);
$on(window, "hashchange", setView);
