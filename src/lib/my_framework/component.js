"use strict"
import { string2html } from "../utils.js";
import { LifeComponent } from "./lifeComponent.js";
import { MyDOM } from "./myDOM.js";

/**
 * Clase de declaración de componente
 */
export class Component {
  /** flag que determina si el compoente se encuentra
   * o no, previamnte inicializado
   * @type {boolean}
   */
  #initialized;
  /**
   * @type {string}
   */
  #key;

  /**
   * @type {{[string]:any}}
   */
  #previusState;
  /**
   * @type {{[string]: any}}
   */
  props;
  /** Nodo al que corresponde el presente componente
   * @type {HTMLElement}
   */
  #bodyFragment = new DocumentFragment();
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
  childrenAttached = [];

  /**
   * 
   * @param {{key: string, props?: {[string]:anu}}} args 
   */
  constructor(args) {
    this.key = args.key;
    this.props = args?.props;
    this.#previusState = this.props ? structuredClone(this.props) : undefined;
    this.life = new LifeComponent(this);
    this.init();
    this.#create();
    if(!MyDOM.setMember(this)) {
      return undefined
    };
  }
  //GETTERS------------------
  get key(){
    return this.#key;
  }
  //SETTERS------------------
  /**
   * @param {string} k
   */
  set key(k){
    this.#key = `com-${k}`
  }
  //STATIC METHODS-------------------
  /**
   * 
   * @param {Component} ClassComponent 
   * @param {Component} parent 
   * @param {Array<{[string]: any}>} dataBuilder 
   */
  static attachMany(ClassComponent, parent, dataBuilder){
    let rootsString = '';
    dataBuilder.forEach((args)=>{
      const newComponent = new ClassComponent(args);
      
      if(!parent.childrenAttached.includes(newComponent)){
        parent.childrenAttached.push(newComponent);
      }

      newComponent.parent = parent;
      rootsString += `<div class="root-component-${newComponent.key}"></div>`;
    })
    return rootsString;
  }

  //METHODS------------
  /**
   * Método encardado de ejecutarse al instanciar el componente
   * con la finalidad de inicializar props
   */
  init(){/*método que se espera sea sobre escrito */}
  /**
   * Método encargado de ejecutarse cuando el nodo HTML que 
   * representa al componente se encuentre disponible
   */
  ready(){/*método que se espera sea sobre escrito */}
  /**
   * función encargada de ejecutar lógica previa a la 
   * construcción de la plantilla
   * @param {{[string]: any}} props
   * @returns {string}
   */
  build(props){
    throw new Error('Método sin implementar por clase deribada');
  }
  /**
   * Método especializado se jecuta al renderizar el componente
   */
  #didMount(){
    try {
      if(!this.#initialized) {
        this.ready();
        this.#initialized = true;
      }
    } catch (error) {}
  };

  /**
   * Método especializado se ejecuta al des-renderizar el componente
  */
 #didUnmount(){
    if(!this.#initialized) return;
    if(this._disposing.length > 0) {
      this._disposing.forEach(d=>d());
      this._disposing = [];
      this._updating = [];
    }
  }
  /**
   * Método especializado se ejecuta al des-renderizar el componente
  */
 #didUpdate(){
    this.life.update();
  }

  /**
   * Encargada de construir el componente generando el 
   * nodo HTML
   * @param {boolean} wait
   */
  #create(wait = false) {
    //convertimos el template a un nodo del DOM
    const componentNode = string2html(this.build(this.props));
    this.body = componentNode;
    this.#bodyFragment.appendChild(this.body);
    
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
    const regex = /\b(?:true|false|undefined)\b/gi;
    templatetext = templatetext.replace(regex,'');
    return templatetext;
  };//end method

  /**
   * Encargada de acoplar el componente hijo al padre y retornar una raíz para futuro renderizado
   * @param {Component} parent
   * @returns {string}
   */
  attach(parent){
    if(!parent.childrenAttached.includes(this)){
      parent.childrenAttached.push(this);
    }
    this.parent = parent;
    // parent.emitter.on(`${parent.key}-EVENT`, this);
    return `<div class="root-component-${this.key}"></div>`;
  }//end attach

  /**
   * Método encargado de actualizar un componente que lo requiera,
   * es decir, un componente mutable
   * @param {()=>void} callback 
   */
  update(callback = false) {
    if(callback) callback();

    if(this.props === this.#previusState) return;
    const previusBody = this.body;

    this.#create(true);
    const fr = new DocumentFragment();
    fr.appendChild(this.body);

    this.childrenAttached.forEach(child=>{
      const root = fr.querySelector(`.root-component-${child.key}`);
      child.render(root, false);
    })
    previusBody.replaceWith(fr);
    this.#previusState = this.props ? structuredClone(this.props) : undefined;
    this.#didUpdate();
  }//end method

  /** ENcargada de renderizar el componente en
   * la raiz que se estipule
   * @param {HTMLElement} root
   */
  render(root, principal = true){
    if(!root) {
      /**
       * si la raíz no existe significa que el componente
       * ha sido desrenderizado
       */
      this.parent.removeChild(this)
      this.#didUnmount();
      return;
    };
    const fragment = new DocumentFragment();
    this.childrenAttached.forEach(child=>{
      child.render(this.body.querySelector(`.root-component-${child.key}`), false)
    });
    fragment.appendChild(this.body);
    if(principal){
      root.innerHTML = '';
      root.appendChild(fragment);
    }else{
      root.replaceWith(fragment);
    }
  }//end render

  /**
   * 
   * @param {Component} child 
   */
  removeChild(child){
    this.childrenAttached = this.childrenAttached.filter(c=> c !== child);
  }
}

