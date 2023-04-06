import { Component } from "./component.js";
import { getRoot } from "./root.js";

export class Router {
  /**
   * @type {Router}
   */
  static instanceRouter;

  currentPath;
  /**
   * @type {{[string]: Component}}
   */
  pages;

  /**
   * @type {Component}
   */
  #notFound;

  /**
   * @param {pages: {[string]: Component}, notFound: Component} args 
   */
  constructor(args){
    if(!!Router.instanceRouter){
      return Router.instanceRouter;
    }
    this.pages = args?.pages;
    this.#notFound = args?.notFound;

    window.addEventListener('popstate',()=>{
      this.#renderRoute();
    });
    window.addEventListener('DOMContentLoaded',()=>{
      this.#renderRoute();
    });
    Router.instanceRouter = this;
  }

  #renderRoute(){
    const path = window.location.pathname;
    /**
     *@type {Component}
     */
    const component = this.pages[path] || this.#notFound; 
    getRoot().innerHTML = '';
    new component().render(getRoot());
    this.currentPath = path;
  }

  go(path){
    window.history.pushState({}, path, window.location.origin + path);
    this.#renderRoute();
  }
}