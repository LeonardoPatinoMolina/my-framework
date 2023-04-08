"use strict"
import { Component } from "./component.js";

export class MyDOM {
  /**
   * @type {MyDOM}
   */
  static MyDOMtInstancia;
  /** miembros del dom
   * @type {Set<string>}
   */
  members = new Set();

  /**
   * @type {Set<Component>}
   */
  nodes = new Set();
  /** raíz del dom
   * @type {HTMLElement | Element}
   */
  root;
/**
 * @param {HTMLElement | Element=} root 
 */
  constructor(root){
    if(!!MyDOM.MyDOMtInstancia){
      return MyDOM.MyDOMtInstancia;
    }
    this.root = root;
    MyDOM.MyDOMtInstancia = this;
  }

  static createRoot(root){
    new MyDOM(root);
    return {
      /**
       * @param {Component} component 
       */
      render: (component)=>{
        component.render(root);
      }
    }
  }//end createRoot

  /**
   * @param {Component} newMember
   * @returns {boolean}
   */
  static setMember(newMember){
    const dom = new MyDOM();
    if(dom.members.has(newMember.key)) return false;
    dom.members.add(newMember.key);
    dom.nodes.add(newMember)
    return true;
  }

  /**
   * @param {Component} targetMember 
   * @returns {boolean}
   */
  static removeMember(targetMember){
    const dom = new MyDOM();
    if(!dom.members.has(targetMember.key)) return false;
    dom.members.delete(targetMember.key);
    dom.nodes.delete(targetMember);
    return true;
  }
  /**
   * 
   * @param {Component} member 
   */
  static memberCompare(member){
    const dom = new MyDOM();
    return dom.nodes.has(member);
  }

  static clearDOM(){
    const dom = new MyDOM();
    dom.members.clear()
    dom.nodes.clear();
  }
}