"use strict"
import { string2html } from "../utils.js";
import { Life } from "./lifeComponent.js";
import { MyDOM } from "./myDOM.js";

/**
 * @class
*/
export class Component {
  /**
   * @typedef {{name: string, callback: (e: any)=>void}} Handler
   * @typedef {{state: {value: string, positionStart: number, positionEnd: number, isFocus: boolean}, callback: (e: any)=>void, targetKey: string}} InputController
   */

  /** flag que determina si el componente se encuentra
   * o no, previamnte inicializado
   * @type {boolean}
   */
  #initialized = false;
  /** flag que determina si el componente se encuentra
   * o no renderizado
   * @type {boolean}
   */
  #rendered = false;

  /** valor único que desitingue al componente dentro del virtual DOM
   * de los demás componentes
   * @type {string}
   */
  #key;
  
  /** Manejador de eventos en línea, son aquellos escucha de eventos que
   * son declarados edirectamente en la plantilla
   * @type {Array<Handler>}
   */
  #eventHandlers = [];
  /** Controladores de inputs, integra una persistencia de 
   * estado y eventos de control de foco son declarados edirectamente en la plantilla
   * @type {Array<InputController>}
   */
  #inputcontrollers = [];

  /** Variable auxiliar para evitar sobrecarga de controladores
   * y llevar el conteo de las keys
   * @type {number}
   */
  #counterKeyController = 1;
  /** espacio de memoria dedicado a almacenar el estado previo del 
   * componente para veirificaciones de reactividad
   * @type {any}
   */
  #previusState;

  /** Propiedades del componente dispuestas a su uso
   * representan los datos del estado del componente al tener
   * la capacidad de persistir
   * @type {any}
   */
  props;
  /** Propiedades globales a las cualesl el componente se
   * encuentra subscrito, en esecnai se trata del estado global
   * de la app
   * @type {any}
   */
  gloProps;

  /** Atributo encargado de subscribir lógica al ciclo de
   * vida del componente
   * @type {Life}
   */
  $;

  /** Nodo HTML al que corresponde el presente componente
   * @type {Element}
   */
  body;

  /** Componentes hijos acoplados al componente
   * actual
   * @type {Map<string, Component>}
   */
  childrenAttached = new Map();

  /**
   * @param {string} key 
   * @param {{props?: {}}=} args 
   */
  constructor(key, args) {
    this.key = key;
    this.props = args?.props;
    this.#previusState = this.props ? structuredClone(this.props) : undefined;
    this.$ = new Life(this);
    this.init();
    this.#create();

    if(!MyDOM.setMember(this)) {
      if(new MyDOM().members.has(this.#key)){
        const comp = new MyDOM().nodes.get(this.#key)
        if(JSON.stringify(comp?.props) === JSON.stringify(args?.props)){
          console.log(`00000, ${comp.key}`);
          comp.#didMount()
            return comp
        }else{
          this.parent = comp.parent;
          comp.parent?.childrenAttached.delete(this.key);
          comp.parent?.childrenAttached.set(this.key, this);
          MyDOM.removeMember(this);
        }
      }
    };
    MyDOM.setMember(this);
    this.#didMount();

  }//end constructor
  //GETTERS------------------
  get key(){
    return this.#key;
  }
  get isInitialized(){
    return this.#initialized;
  }
  get isRendered(){
    return this.#rendered;
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
   * Metodo encargado de realizar un acoplamiento de componentes
   * en lote, esto reduce las manipulaciones de DOM de 1-N a 1
   * por acople
   * @param {function(new:Component, {})} ClassComponent 
   * @param {Component} parent 
   * @param {Array<any>} dataBuilder 
   */
  static attachMany(ClassComponent, parent, dataBuilder){
    let rootsString = '';
    dataBuilder.forEach((args)=>{
      const newComponent = new ClassComponent(args);
      if(!parent.childrenAttached.has(newComponent.key)){
        parent.childrenAttached.set(newComponent.key, newComponent);
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
   * @param {any=} props
   * @param {any=} globalProps
   * @returns {string}
   */
  build(props, globalProps){
    throw new Error('Método sin implementar por clase deribada');
  }//end build

  /**
   * Método especializado se jecuta al renderizar el componente
   */
  async #didMount(){
    try {
      if(!this.#initialized) {
        // console.log(this.key);
        this.ready();
        this.#addEvents();
        this.#addController();
        this.$.initialize();
        this.#initialized = true;
      }
    } catch (error) {
      console.error(error);
    }
  }//end didMount

  /**
   * Método especializado se ejecuta al des-renderizar el componente
  */
  async #didUnmount(){
    if(!this.#initialized) return;
    
    this.$.dispose();
    this.#removeEvents();
    this.#removeController();
    // this.childrenAttached.forEach((c)=>{
    //   c.#didUnmount();
    // });
    // this.removeGrandChild();
  }//end didUnmount

  /**
   * Método especializado se ejecuta al des-renderizar el componente
  */
 #didUpdate(){
  // console.log(this.key);
    this.$.update();
    this.#addEvents();
    this.#addController();
  }//end didUpdate

  /**
   * Encargada de construir el componente generando el 
   * nodo HTML
   * @param {boolean=} wait
   */
  #create(wait = false) {
    //convertimos el template a un nodo del DOM
    const componentNode = string2html(this.build(this.props, this.gloProps));
    // console.log(componentNode);
    this.body = componentNode;
  }//end create

  /** Se eccarga de administrar los selectores necesarios para
   * añadir los escucha de eventos en linea
   * @param {string} name
   * @param {any} callback 
   * @returns {string}
   */
  #onEvent(name, callback){

    const num = this.#eventHandlers.push({
      name, callback
    });
    
    return `data-event="${name}" data-keyevent="${this.key}-event-${num}"`
  }//end onEvent

  /** Se eccarga de administrar los selectores necesarios para
   * añadir los escucha de eventos en linea
   * @param {(e: any)=>void} callback
   * @returns {string}
   */
  #onInputController(callback){
    const keycontroller = `${this.key}-controller-${this.#counterKeyController}`;

    if(!this.isInitialized){
      this.#inputcontrollers.push({
        callback,
        state: {
          value: '', 
          positionStart: 0, 
          positionEnd: 0,
          isFocus: false
        },
        targetKey: keycontroller
      });
    }


    this.#counterKeyController += 1;

    return `data-controller="input" data-keycontroller="${keycontroller}"`
  }//end onInputController

  #addEvents(){
    this.#eventHandlers.forEach((e,indx)=>{
      const target = this.body.querySelector(`[data-keyevent="${this.key}-event-${indx + 1}"]`)

      target.addEventListener(e.name,(evnt)=>{
        e.callback(evnt);
      });
    })//end foreach
  }//end addEvents
  
  #removeEvents(){
    this.#eventHandlers.forEach((e, indx)=>{
      const target = this.body.querySelector(`[data-keyevent="${this.key}-event-${indx + 1}"]`)
      target.removeEventListener(e.name,(evnt)=>{
        e.callback(evnt);
      });
    })
    this.#eventHandlers = [];
  }//end removeEvents

  #addController(){
    this.#inputcontrollers.forEach((controller)=>{
      /**
       * @type {HTMLInputElement}
       */
      const target = this.body.querySelector(`[data-keycontroller="${controller.targetKey}"]`);

      target.selectionStart = controller.state.positionStart;
      target.selectionEnd = controller.state.positionEnd;
      if(controller.state.isFocus) target.focus();
      else target.blur();
      
      target.addEventListener('keyup',(e)=>{
        controller.state = {
          value: target.value,
          positionStart: target.selectionStart,
          positionEnd: target.selectionEnd,
          isFocus: true
        };

        controller.callback(e);
      });// end keyup eventlistener
      
      document.addEventListener('click',(e)=>{
        if(e.target !== target){
          controller.state = {
              value: target.value,
              positionStart: target.selectionStart,
              positionEnd: target.selectionEnd,
              isFocus: false
            };
        }
      });// end blur eventlistener
    })
  }//end addController

  #removeController(){
    this.#inputcontrollers.forEach((c, indx)=>{
      /**
       * @type {HTMLInputElement}
       */
      const target = this.body.querySelector(`[data-keycontroller="${c.targetKey}"]`);

      target.removeEventListener('keyup',(e)=>{
        c.state = {
          value: target.value,
          positionStart: target.selectionStart,
          positionEnd: target.selectionEnd,
          isFocus: target === document.activeElement
        };

        c.callback(e);
      });// end keyup eventlistener
    });
    this.#counterKeyController = 1;
  }//end removeController
  /**
   * Encargado de generar la plantilla del componente
   * @param {(_: {on: (name: string, callback: any)=>string, inputController: (callback: any)=>string})=>string} template 
   * @returns {string} plantilla de componente
   */
  template(template){
    const obj = {
      /**
       * @param {string} name 
       * @param {any} callback 
      */
     on: (name, callback)=>{
       return this.#onEvent(name, callback);
      },
      /**
       * @param {any} callback 
       */
      inputController: (callback)=>{
        return this.#onInputController(callback);
      }
    }

    let templatetext = template(obj);
    const regex = /\b(?:true|false|undefined)\b/gi;
    templatetext = templatetext.replace(regex,'');
    return templatetext;
  }//end template

  /**
   * Encargada de acoplar el componente hijo al padre y retornar una raíz para futuro renderizado
   * @param {Component} parent
   * @returns {string}
   */
  attach(parent){
    if(!parent.childrenAttached.has(this.#key)){
      parent.childrenAttached.set(this.#key,this);
    }
    this.parent = parent;
    return `<div class="root-component-${this.key}"></div>`;
  }//end attach

  /**
   * Método encargado de actualizar un componente que lo requiera,
   * es decir, un componente mutable
   * @param {(()=>void)=} callback 
   * @param {boolean=} isGlobalChange 
  */
 update(callback, isGlobalChange) {
   if(callback) callback();
   
   const compare =JSON.stringify(this.props) === JSON.stringify(this.#previusState);

   if(compare && !isGlobalChange) return;
   this.#didUnmount();
    const previusBody = this.body;
    this.#create(true);
    
    const fr = new DocumentFragment();
    fr.appendChild(this.body);
    // console.log(this.body);

    this.childrenAttached.forEach((child)=>{
      const root = fr.querySelector(`.root-component-${child.key}`)
      child.render(root, false)
    })

    previusBody.replaceWith(fr);

    //establecemos el estado actual como previo en 
    //espera de una proxima comparación
    this.#previusState.local = this.props ? structuredClone(this.props) : undefined;
    this.#didUpdate();
  }//end update

  /** ENcargada de renderizar el componente en
   * la raiz que se estipule
   * @param {HTMLElement | Element} root
   */
  render(root, principal = true){
    if(!root) {
      console.log(this.key);
      /**
       * si la raíz no existe significa que el componente
       * ha sido desrenderizado
       */
      this.parent.childrenAttached.delete(this.key);
      MyDOM.removeMember(this);
      this.#rendered = false;
      return;
    };
    const fragment = new DocumentFragment();
    fragment.appendChild(this.body);

    this.childrenAttached.forEach((child)=>{
      const roott = this.body.querySelector(`.root-component-${child.key}`);
      
      child.render(roott, false)
    });


    if(principal){
      root.innerHTML = '';
      root.appendChild(fragment);
    }else{
      root.replaceWith(fragment);
    }
    this.#rendered = true;
  }//end render

  /**
   * Método que establece que el componente y de sus hijos, se espera que este método
   * sea empleado al momento de cambiar de página en el enrutador.
   */
  async clear(){
    this.#initialized = false;
    this.childrenAttached.forEach(child=>child.clear());
    this.#didUnmount();
  }// end clear
}