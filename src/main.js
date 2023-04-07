import { Router } from "./lib/my_framework/router.js";
import { PAGES } from "./pages/routes.js";
import { NotFound } from "./components/notFound.js";
import { MyDOM } from "./lib/my_framework/myDOM.js";

MyDOM.createRoot(document.getElementById("root"));

const router = new Router({
  pages: PAGES, 
  notFound: NotFound
});