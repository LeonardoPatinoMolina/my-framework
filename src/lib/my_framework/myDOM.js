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
   * @type {Map<string, Component>}
   */
  nodes = new Map();
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
   * 
   * @param {()=>void} store 
   */
  static setGlobalStore(store){
    store();
  }
  /**
   * @param {Component} newMember
   * @returns {boolean}
   */
  static setMember(newMember){
    const dom = new MyDOM();
    if(dom.members.has(newMember.key)) return false;
    dom.members.add(newMember.key);
    dom.nodes.set(newMember.key, newMember)
    return true;
  }

  /**
   * @param {Component} targetMember 
   * @returns {boolean}
   */
  static removeMember(targetMember){
    const dom = new MyDOM();
    if(!dom.members.has(targetMember.key)) return false;
    const res1 = dom.members.delete(targetMember.key);
    const res2 = dom.nodes.delete(targetMember.key);
    return res1 && res2;
  }
  /**
   * 
   * @param {Component} member 
   */
  static memberCompare(member){
    const dom = new MyDOM();
    return dom.nodes.has(member.key);
  }

  /**
  * Encargado de remover de MyDOM que no se encuentren
  * resnderizados, esto con  la finalidad de liberar memoria.
  * @param {Component} target
  */
  static async cleanTree(target){
    console.log(target.isRendered, target.key);
     target.childrenAttached.forEach(c=>MyDOM.cleanTree(c));
     if(target.isRendered) return;
     MyDOM.removeMember(target)
   }//end remove child
  static clearDOM(){
    const dom = new MyDOM();
    dom.members.clear()
    dom.nodes.clear();
  }
}