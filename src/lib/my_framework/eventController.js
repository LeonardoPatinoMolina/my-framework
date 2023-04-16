import { MyComponent } from "./component.js";

/**
 * @class EventController
 * @classdesc clase encargada de manejar los manejadores de eventos de los eventos de asignaci´no
 * en línea del componente owner
 */
export class EventController{
    /**
   * @typedef {{keyEvent: string, name: string, callback: (e: any)=>void, config: Config}} Handler
   * @typedef {{capture?: boolean, passive?: boolean, once?: boolean}} Config
   */
  /** componente propieatario del presente controlador
   * @type {MyComponent}
   */
  #owner;
  /** Variable auxiliar para evitar sobrecarga de eventos
   * y llevar el conteo de las keys
   * @type {number}
   */
  #counterKeyEvent = 0;

  /**
   * @type {Map<string, AbortController>}
   */
  #abortControllers = new Map();

  /**
   * @type {Map<string, Handler>}
   */
  #eventHandlers = new Map();

  /**
   * @param {MyComponent} owner 
   */
  constructor(owner){
    this.#owner = owner;
  }

  /**
   * Método encargado de reclarar todos los handlers de 
   * los eventos declarados en línea
   * y retornar los atributps de selección
   * @param {string} name 
   * @param {any} callback 
   * @param {Config=} config 
   * @returns {string}
   */
  onEvent(name, callback, config){
    const keyEvent = `${this.#owner.key}-event-${this.#counterKeyEvent}`
    this.#eventHandlers.set(keyEvent,{
      keyEvent, name, callback, config
    });
    this.#counterKeyEvent += 1;
    
    return `data-event="${name}" data-keyevent="${keyEvent}"`
  }//end onEvent

  /**
   * Método encargado de añadirlos handlers a los evensListeners
   * previamente decalrados
   */
  addEvents(){
    this.#eventHandlers.forEach((e)=>{
      const abortC = new AbortController();
      this.#abortControllers.set(e.keyEvent, abortC);
      // console.log(this.key, this.#eventHandlers.length);
      const target = this.#owner.body.querySelector(`[data-keyevent="${e.keyEvent}"]`)
      target.addEventListener(e.name,(evnt)=>{
        e.callback(evnt);
      },{...e.config, signal: abortC.signal});//end addEvnetListener
    })//end foreach
  }//end addEvents

  /**
   * Método encargado de remover los eventsListeners
   *  previamente añadidos
   */
  removeEvents(){
    this.#eventHandlers.forEach((e)=>{
      this.#abortControllers.get(e.keyEvent).abort();
    })//end foreach
    this.#counterKeyEvent = 0;
  }//end removeEvents
}