import { createRoot } from "./lib/my_framework/root.js";
import { Router } from "./lib/my_framework/router.js";
import { PAGES } from "./pages/routes.js";
import { NotFound } from "./components/notFound.js";

createRoot(document.getElementById("root"));
const router = new Router({
  pages: PAGES, 
  notFound: NotFound
});