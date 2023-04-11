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
  /** estructura de datos que almacena las key de los componentes
   * hijos indexados por la key del componente padre
   * @type {Map<string, Set<string>>}
   */
  family = new Map();

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
   * Obtiene un componente almacenado en los nodos del
   * arbol
   * @param {string} key 
   * @returns {Component}
   */
  static getMember(key){
    return new MyDOM().nodes.get(key)
  }

  /** Inicialza una familia en el arbol
   * @param {Component} parent
   */
  static initFamily(parent){
    const family = new MyDOM().family.set(parent.key, new Set());
    return  family.get(parent.key)
  }
  /** Verifica si el compnente con la key pertenece
   * a la familia del comonente padre, es decir si es su hijo
   * @param {Component} parent
   * @param {string} key
   */
  static isInFamily(parent, key){
    let family = MyDOM.getFamily(parent);
    return family.has(key);
  }
  /**
   * Añade un nuevo hijo al atributo family del arbol
   * @param {Component} parent 
   * @param {Component} child 
  */
 static setChild(parent, child){
   let family = MyDOM.getFamily(parent);
   family.add(child.key);
  }
  
  /**
   * Remueve un hijo al atributo family del arbol
   * @param {Component} parent 
   * @param {Component} child 
   */
  static removeChild(parent, child){
    const family = new MyDOM().family.get(parent.key);
    family.delete(child.key);
  }

  /**
   * Obtiene un Set con todos los hijos del actual componente
   * @param {Component} parent 
   */
  static getFamily(parent){
    return new MyDOM().family.get(parent?.key)
  }
  /**
   * @param {Component} parent
   */
  static removeFamily(parent){
    const dom = new MyDOM();
    return dom.family.delete(parent.key);
  }

    /** Añade un nuevo nodo al arbol
   * @param {Component} newMember
   * @returns {boolean} retorna true si se ñadió de forma adecuada
   * y false si no se añadíó correctamente
   */
    static setMember(newMember){
      const dom = new MyDOM();
      if(MyDOM.memberCompare(newMember)) return false;
      dom.nodes.set(newMember.key, newMember)
      return true;
    }

  /**
   * @param {Component} targetMember 
   * @returns {boolean}
   */
  static removeMember(targetMember){
    const dom = new MyDOM();
    if(!dom.nodes.has(targetMember.key)) return false;
    dom.family.delete(targetMember.key);
    return  dom.nodes.delete(targetMember.key);
  }
  /**
   * Verifica si el actual componente existe como 
   * miembro del árbol
   * @param {Component} member 
   */
  static memberCompare(member){
    const dom = new MyDOM();
    return  dom.nodes.has(member.key);
  }
  
   static clearDOM(){
    const dom = new MyDOM();
    dom.nodes.clear();
    dom.family.clear();
  }
}