"use strict"
import { MyRouter } from "./lib/my_framework/router.js";
import { PAGES } from "./pages/routes.js";
import { NotFound } from "./pages/notFound.js";
import { MyDOM } from "./lib/my_framework/myDOM.js";
import { store } from "./context/store.js";

const root = MyDOM.createRoot(document.getElementById("root"));
MyDOM.setGlobalStore(store);

const router = new MyRouter({
  pages: PAGES, 
  notFound: NotFound
});