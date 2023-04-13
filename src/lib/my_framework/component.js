"use strict"
import { string2html } from "../utils.js";
import { Life } from "./lifeComponent.js";
import { MyDOM } from "./myDOM.js";

/**
 * @class
*/
export class Component {
  /**
   * @typedef {{keyEvent: string, name: string, callback: (e: any)=>void}} Handler
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
   * @type {Map<string, Handler>}
   */
  #eventHandlers = new Map();
  /** Controladores de inputs, integra una persistencia de 
   * estado y eventos de control de foco son declarados edirectamente en la plantilla
   * @type {Map<string, InputController>}
   */
  #inputcontrollers = new Map();

  /** Variable auxiliar para evitar sobrecarga de controladores
   * y llevar el conteo de las keys
   * @type {number}
   */
  #counterKeyController = 0;
  /** Variable auxiliar para evitar sobrecarga de eventos
   * y llevar el conteo de las keys
   * @type {number}
   */
  #counterKeyEvent = 0;
  /** espacio de memoria dedicado a almacenar el estado previo del 
   * componente para veirificaciones de reactividad
   * @type {any}
   */
  #previusState;

  /** Propiedades del componente dispuestas
   * representan los datos que son inyectados desde el constructor
   * @type {any}
   */
  props;
  /** Estado del componente, consiste en una serie
   * de datos con la capacidad de persistir entre re renderizados.
   * @type {any}
   */
  state;
  /** Stores de datos a las cuales se encuentra subscrito el componente,
   * representan el estado global de la app e igualmente 
   * cuentan con la capacidad de persistir entre re renderizados.
   * @type {any}
   */
  #globalStore;

  /**
   * @type {boolean}
   */
  #firstMount = true;

  /** Atributo encargado de subscribir lógica al ciclo de
   * vida del componente
   * @type {Life}
   */
  $;

  /** Nodo HTML al que corresponde el presente componente
   * @type {Element}
   */
  body;
  
  /**
   * @type {Component}
   */
  parent;

  /**
   * @param {string} key 
   * @param {{props?: any}=} args 
   */
  constructor(key, args) {
    this.key = key;
    this.props = args?.props;

    if(MyDOM.memberCompare(this)){
      const comp = MyDOM.getMember(this.key);
      comp.props = args?.props;
      comp.#create();
      comp.#didMount();
      return comp
    }
  
    this.$ = new Life(this);
    this.init();
    MyDOM.initFamily(this);
    MyDOM.setMember(this);
    this.#create();
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
  get globalStore(){
    return this.#globalStore;
  }
  get isFirstMount(){
    return this.#firstMount;
  }

  //SETTERS------------------
  /**
   * @param {string} k
   */
  set key(k){
    this.#key = `com-${k}`
  }
  /**
   * @param {any} shelf
   */
  set globalStore(shelf){
    this.#globalStore = {...this.#globalStore, ...shelf}
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
      if(!MyDOM.getFamily(parent).has( newComponent.key)){
        MyDOM.setChild(parent, newComponent);
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
   * 
  */
  async #didUnmount(){
    if(!this.#initialized) return;
    // this.$.dispose();
    this.#removeEvents();
    this.#removeController();
    this.#rendered = false;
    this.#firstMount = false;

    MyDOM.getFamily(this).forEach(childKey=>{
      const child = MyDOM.getMember(childKey)
      child.#didUnmount();
    })//end foreach
  }//end didUnmount

  /**
   * Método especializado se ejecuta al des-renderizar el componente
  */
 async #didUpdate(){
  if(this.#firstMount) return;
    // this.$.update();
    this.ready();
    this.#addEvents();
    this.#addController();

    MyDOM.getFamily(this).forEach(childKey=>{
      const child = MyDOM.getMember(childKey)
      child.#didUpdate();
    })//end foreach
  }//end didUpdate

  /**
   * Encargada de construir el componente generando el 
   * nodo HTML
   * @param {boolean=} wait
   */
  #create(wait = false) {
    //convertimos el template a un nodo del DOM
    const componentNode = string2html(this.build(this.props));
    this.body = componentNode;
  }//end create

  /** Se eccarga de administrar los selectores necesarios para
   * añadir los escucha de eventos en linea
   * @param {string} name
   * @param {any} callback 
   * @returns {string}
   */
  #onEvent(name, callback){
    const keyEvent = `${this.key}-event-${this.#counterKeyEvent}`
    this.#eventHandlers.set(keyEvent,{
      keyEvent, name, callback
    });
    this.#counterKeyEvent += 1;
    
    return `data-event="${name}" data-keyevent="${keyEvent}"`
  }//end onEvent

  /** Se eccarga de administrar los selectores necesarios para
   * añadir los escucha de eventos en linea
   * @param {(e: any)=>void} callback
   * @returns {string}
   */
  #onInputController(callback){
    const keycontroller = `${this.key}-controller-${this.#counterKeyController}`;

    if(!this.isInitialized){
      this.#inputcontrollers.set(keycontroller, {
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

  /**
   */
  #addEvents(){
    this.#eventHandlers.forEach((e)=>{
      // console.log(this.key, this.#eventHandlers.length);
      const target = this.body.querySelector(`[data-keyevent="${e.keyEvent}"]`)
      target.addEventListener(e.name,(evnt)=>{
        e.callback(evnt);
      });
    })//end foreach
  }//end addEvents

  #removeEvents(){
    this.#eventHandlers.forEach((e)=>{
      const target = this.body.querySelector(`[data-keyevent="${e.keyEvent}"]`)
      target.removeEventListener(e.name,(evnt)=>{
        e.callback(evnt);
      });
    })//end foreach
    this.#counterKeyEvent = 0;
  }//end removeEvents

  /**
  */  
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
    this.#counterKeyController = 0;
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
    if(!MyDOM.getFamily(parent).has( this.key)){
      MyDOM.setChild(parent, this);
    }
    this.parent = parent;
    return `<div class="root-component-${this.key}"></div>`;
  }//end attach

  /**
   * Método encargado de actualizar un componente que lo requiera,
   * es decir, un componente mutable
   * @param {(()=>void)=} callback 
   * @param {boolean=} forceChange
  */
 update(callback, forceChange = false) {
   if(callback) callback();
   
   const compare = JSON.stringify(this.state) === JSON.stringify(this.#previusState);
   
   // solo actualizar el componente si el estado a cambiado
   //o si el cambio es del estado global
   if(compare || forceChange) return;

   this.#didUnmount();
   const previusBody = this.body;
   this.#create(true);
   
    const fr = new DocumentFragment();
    fr.appendChild(this.body);

    MyDOM.getFamily(this).forEach(childKey=>{
      const child = MyDOM.getMember(childKey)
      const root = fr.querySelector(`.root-component-${child.key}`)
      child.render(root, false)
    });

    previusBody.replaceWith(fr);

    //establecemos el estado actual como previo en 
    //espera de una proxima comparación
    this.#previusState = this.state ? structuredClone(this.state) : undefined;
    this.#didUpdate();
  }//end update

  /** Encargada de renderizar el componente en
   * la raiz que se estipule
   * @param {HTMLElement | Element} root
   */
  render(root, principal = true){
    if(!root) {
      /**
       * si la raíz no existe significa que el componente
       * ha sido desrenderizado por ende podemos removerlo del 
       * arbol
       */
      MyDOM.removeFamily(this);
      MyDOM.removeChild(this.parent, this);
      MyDOM.removeMember(this);
      return;
    };
    const fragment = new DocumentFragment();
    fragment.appendChild(this.body);

    MyDOM.getFamily(this).forEach(childKey=>{
      const child = MyDOM.getMember(childKey)
      const roott = this.body.querySelector(`.root-component-${child.key}`);
      child.render(roott, false)
    })


    if(principal){
      root.innerHTML = '';
      root.appendChild(fragment);
    }else{
      root.replaceWith(fragment);
    }
    this.#rendered = true;
  }//end render

  /**
   * Método que establece que el componente debe ser liberado de memoria
   * se espera que este método sea empleado al momento
   * de cambiar de página en el enrutador.
   */
  async clear(){
    this.#initialized = false;
    this.#didUnmount();
    this.$.dispose();
    this.#inputcontrollers = new Map();
    this.#eventHandlers = new Map();
    this.#rendered = false;
    this.#firstMount = true;
  }// end clear
}