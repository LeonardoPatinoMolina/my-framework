import { Component } from "./component.js";

/**
 * encargada de establecer la raiz del proyecto
 * @param {HTMLElement} root 
 */
export const createRoot = (root) => {
  new RootS(root);
  return {
    /**
     * @param {Component} component 
     */
    render: (component)=>{
      component.render(root);
    }
  }
}
/**
 * provee la raiz que fue previmente establecida
 * @returns {HTMLElement} 
 */
export const getRoot = () => {
  return new RootS().root;
}


class RootS {
  static rootInstancia;
  root;
  constructor(rootElement){
    if(!!RootS.rootInstancia){
      return RootS.rootInstancia;
    }
    this.root = rootElement;
    RootS.rootInstancia = this;
  }
}