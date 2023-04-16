"use strict"
import { MyComponent } from "./component.js";

export class MyDOM {
  /**
   * @type {MyDOM}
   */
  static MyDOMtInstancia;

  /** estructura de datos que almacena las key de los componentes
   * hijos indexados por la key del componente padre
   * @type {Map<string, Set<string>>}
   */
  family = new Map();

  /**
   * @type {Map<string, MyComponent>}
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
  /**
   * @param {Element} root
   */
  static createRoot(root){
    new MyDOM(root);
    return {
      /**
       * @param {MyComponent} component 
       */
      render: (component)=>{
        component.render(root);
      }
    }
  }//end createRoot

  /**
   * Establece el store global 
   * @param {()=>void} store 
   */
  static setGlobalStore(store){
    store();
  }

  /**
   * Obtiene un componente almacenado en los nodos del
   * arbol
   * @param {string} key 
   * @returns {MyComponent}
   */
  static getMember(key){
    return new MyDOM().nodes.get(key)
  }

  /** Inicialza una familia en el arbol
   * @param {MyComponent} parent
   */
  static initFamily(parent){
    const family = new MyDOM().family.set(parent.key, new Set());
    return  family.get(parent.key)
  }

  /**
   * Añade un nuevo hijo al atributo family del arbol
   * @param {MyComponent} parent 
   * @param {MyComponent} child 
  */
 static setChild(parent, child){
   let family = MyDOM.getFamily(parent);
   family.add(child.key);
  }
  
  /**
   * Remueve un hijo al atributo family del arbol
   * @param {MyComponent} parent 
   * @param {MyComponent} child 
   */
  static removeChild(parent, child){
    const family = new MyDOM().family.get(parent.key);
    if(family){
      family.delete(child.key);
    }
  }

  /**
   * Obtiene un Set con todos los hijos del actual componente
   * @param {MyComponent} parent 
   */
  static getFamily(parent){
    return new MyDOM().family.get(parent.key)
  }

  /**
   * @param {MyComponent} parent
   */
  static removeFamily(parent){
    const dom = new MyDOM();
    return dom.family.delete(parent.key);
  }

    /** Añade un nuevo nodo al arbol
   * @param {MyComponent} newMember
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
   * @param {MyComponent} targetMember 
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
   * @param {MyComponent} member 
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