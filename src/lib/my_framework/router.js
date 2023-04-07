import { Component } from "./component.js";
import { MyDOM } from "./myDOM.js";

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
    
    MyDOM.clearDOM();
    const dom = new MyDOM();
    new component().render(dom.root);
    this.currentPath = path;
  }

  go(path){
    if(!Object.entries(this.pages).flat().includes(path)) return;
    window.history.pushState({}, path, window.location.origin + path);

    const page = new this.pages[this.currentPath]()
    page.emitter.emit(`${page.key}-EVENT`);
    this.#renderRoute();
  }
}