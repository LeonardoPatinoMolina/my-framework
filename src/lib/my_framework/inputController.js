import { Component } from "./component.js";

export class InputController {
  /**
   * @typedef {{state: {value: string, positionStart: number, positionEnd: number, isFocus: boolean}, callback: (e: any)=>void, targetKey: string}} Controller
   */

  /** componente propieatario del presente controlador
   * @type {Component}
   */
  #owner;
  
  /**
   * @type {Map<string, AbortController>}
   */
  #abortControllers = new Map();

  /**
   * @type {Map<string, Controller>}
   */
  #inputcontrollers = new Map();
  /** Variable auxiliar para evitar sobrecarga de controladores
   * y llevar el conteo de las keys
   * @type {number}
   */
  #counterKeyController = 0;

  /**
   * @param {Component} owner 
   */
  constructor(owner){
    this.#owner = owner;
  }

  /** Se eccarga de administrar los selectores necesarios para
   * añadir los escucha de eventos en linea
   * @param {(e: any)=>void} callback
   * @returns {string}
   */
  onInputController(callback){
    const keycontroller = `${this.#owner.key}-controller-${this.#counterKeyController}`;

    if(!this.#owner.isInitialized){
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
  addInputController(){
    this.#inputcontrollers.forEach((controller)=>{
      const abortC = new AbortController();
      this.#abortControllers.set(controller.targetKey, abortC);
      /**
       * @type {HTMLInputElement}
       */
      const target = this.#owner.body.querySelector(`[data-keycontroller="${controller.targetKey}"]`);

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
      },{signal: abortC.signal});// end keyup eventlistener

      document.addEventListener('click',(e)=>{
        if(e.target !== target){
          controller.state = {
            value: target.value,
            positionStart: target.selectionStart,
            positionEnd: target.selectionEnd,
            isFocus: false
          };
        }
      },{signal: abortC.signal});// end click eventlistener
    })
  }//end addController

  removeInputController(){
    this.#inputcontrollers.forEach((controller)=>{
      this.#abortControllers.get(controller.targetKey).abort();
    });
    this.#counterKeyController = 0;
  }//end removeController
}