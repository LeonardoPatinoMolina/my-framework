"use strict"
import { Router } from "./lib/my_framework/router.js";
import { PAGES } from "./pages/routes.js";
import { NotFound } from "./components/notFound.js";
import { MyDOM } from "./lib/my_framework/myDOM.js";
import { store } from "./context/store.js";

const root = MyDOM.createRoot(document.getElementById("root"));
MyDOM.setGlobalStore(store);

const router = new Router({
  pages: PAGES, 
  notFound: NotFound
});