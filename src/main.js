import { createRoot } from "./lib/my_framework/root.js";
import { App } from "./app.js";

const root = createRoot(document.getElementById("root"));

const app = new App();

root.render(app)