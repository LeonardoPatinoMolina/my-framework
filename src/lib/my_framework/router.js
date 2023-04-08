"use strict"
import { Component } from "./component.js";
import { MyDOM } from "./myDOM.js";

export class Router {
  /**
   * @type {Router}
   */
  static instanceRouter;

  /**
   * @type {Component}
   */
  currentPage;
  /**
   * @type {Object<string, typeof Component>}
   */
  pages;

  /**
   * @type {typeof Component}
   */
  #notFound;

  /**
   * @param {{pages: Object.<string, typeof Component>, notFound: typeof Component}=} args 
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
     *@type {typeof Component}
     */
    const page = this.pages[path] ?? this.#notFound; 
    
    const dom = new MyDOM();
    MyDOM.clearDOM();

    const newPage = new page();
    newPage.render(dom.root);

    this.currentPage?.clear();
    this.currentPage = newPage;
  }

  /**
   * Método encargado de navegar a otra página
   * @param {string} path 
   * @returns 
   */
  go(path){
    if(!Object.entries(this.pages).flat().includes(path)) return;
    window.history.pushState({}, path, window.location.origin + path);

    this.#renderRoute();
  }
}