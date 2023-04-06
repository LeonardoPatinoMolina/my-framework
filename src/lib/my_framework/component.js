"use strict"
import { MyEventMediator } from "../../utilities/emitter.js";
import { string2html } from "../utils.js";
import { LifeComponent } from "./lifeComponent.js";

/**
 * Clase de declaración de componente
 */
export class Component {
  /** flag que determina si el compoente se encuentra
   * o no, previamnte inicializado
   * @type {boolean}
   */
  #initialized = false;

  /**
   * @type {string}
   */
  key;
  /**
   * @type {MyEventMediator}
   */
  emitter;
  /**
   * @type {{[string]: any}}
   */
  props;
  /** Nodo al que corresponde el presente componente
   * @type {HTMLElement}
   */
  body = document.createElement("div");

  /** controlador de ciclo de vida de componente
   * @type {LifeComponent}
   */
  life;
  
  /** Función encargada de ejecutarse al demontar el 
   * componente
   * @type {Array<()=>void>} args
   */
  _disposing = [];
  /** Función encargada de ejecutarse al demontar el 
   * componente
   * @type {Array<()=>void>} args
   */
  _updating = [];

  /**
   * @type {Component[]}
   */
  children = [];

  /**
   * 
   * @param {{key: string, props: {[string]:anu}}} args 
   */
  constructor(args) {
    this.props = args.props;
    this.key = args.key;
    this.emitter = new MyEventMediator();
    this.life = new LifeComponent(this);
    this.#create();
  }
  
  init(){
    throw new Error('Método sin implementar por clase deribada');
  }
  /**
   * Método especializado se jecuta al renderizar el componente
   */
  #didMount(){
    try {
      if(!this.#initialized) {
        this.init();
        this.#initialized = true;
      }
    } catch (error) {}
  };

  /**
   * Método especializado se ejecuta al des-renderizar el componente
  */
 didUnmount(){
    if(this._disposing.length > 0) {
      this._disposing.forEach(d=>d());
      this._disposing = [];
      this._updating = [];
    }
    this.emitter.emit('unmount','');
    this.emitter.offAll();
  }
  /**
   * Método especializado se ejecuta al des-renderizar el componente
  */
 #didUpdate(){
  // console.time();
    if(this._disposing.length > 0) {
      this._disposing.forEach(d=>d());
    }
    if(this._updating.length > 0) {
      this._updating.forEach(d=>d());
    }
    // console.timeEnd()
  }

  /**
   * Encargada de construir el componente generando el 
   * nodo HTML
   * @param {boolean} wait
   */
  #create(wait = false) {
    //convertimos el template a un nodo del DOM
    const componentNode = string2html(this.template());
    this.body = componentNode;
    
    if(!wait)this.#didMount();
    return this;
  };//end method
  
  /**
   * Encargado de generar la plantilla del componente
   * @param {string} template 
   * @returns {string} plantilla de componente
   */
  template(template){
    let templatetext = template.toString();
    return templatetext;
  };//end method

  /**
   * Encargada de retornar una cadena de texto que representa
   * el componente en su estado actual
   * @param {Component} parent
   * @returns {string}
   */
  attach(parent){
    this.parent = parent;
    parent.children.push(this);
    return `<div class="root-component-${this.key}"></div>`;
  }
  
  link(parent){
    try{
      this.parent = parent;
      parent.children.push(this);
      return `<div class="root-component-${this.key}"></div>`;
    }catch(e){}
    finally{
      setTimeout(()=>{
        const r = parent.body.querySelector(`.root-component-${this.key}`);
        this.render(r,false)
      },1)
    }
  }
  _append(){
    
  }
  /**
   * Método encargado de actualizar un componente que lo requiera,
   * es decir, un componente mutable
   * @param {()=>void} callback 
   */
  update(callback = false) {
    //avisamos que el componente ha sido desmontado
    if(callback) callback();
    const previusBody = this.body;
    this.#create(true);
    previusBody.replaceWith(this.body);
    this.#didUpdate();
  }//end method

  /** ENcargada de renderizar el componente en
   * la raiz que se estipule
   * @param {HTMLElement} root
   */
  render(root, principal = true){
    const fragment = new DocumentFragment();
    if(this.children.length > 0){
      this.children.forEach(child=>{
        child.render(this.body.querySelector(`.root-component-${child.key}`), false)
      })
    }
    fragment.appendChild(this.body);
    if(principal){
      root.innerHTML = '';
      root.appendChild(fragment);
    }else{
      root.replaceWith(fragment);
    }
  }//end render
}