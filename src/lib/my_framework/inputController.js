import { MyComponent } from "./component.js";

export class InputController {
  /**
   * @typedef {{state: {value: string, name: string, stateName: string, isFocus: boolean}, targetKey: string, callback?: (value: string)=>string}} Controller
   */

  /** componente propieatario del presente controlador
   * @type {MyComponent}
   */
  #owner;
  
  /** Variable auxiliar para evitar sobrecarga de controladores
   * y llevar el conteo de las keys
   * @type {number}
   */
  #counterKeyController = 0;
  
  /**
   * @type {Map<string, AbortController>}
   */
  #abortControllers = new Map();

  /**
   * @type {Map<string, Controller>}
   */
  #inputcontrollers = new Map();

  /**
   * @param {MyComponent} owner 
   */
  constructor(owner){
    this.#owner = owner;
  }

  /** Se eccarga de administrar los selectores necesarios para
   * añadir los escucha de eventos en linea
   * @param {string} name
   * @param {string} stateName
   * @param {(string)=>string=} callback
   * @returns {string}
   */
  onInputController(name, stateName, callback){
    const keycontroller = `${this.#owner.key}-controller-${this.#counterKeyController}`;

    if(!this.#owner.isInitialized){

      const curValue = this.#owner.state[stateName] ? this.#owner.state[stateName][name] : undefined;

      this.#inputcontrollers.set(keycontroller, {
        callback,
        state: {
          name,
          stateName,
          value: curValue ?? '',
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
      let target;
      target = this.#owner.body.querySelector(`[data-keycontroller="${controller.targetKey}"]`);
      if(target === null && this.#owner.body.getAttribute("data-keycontroller") === controller.targetKey){
        //@ts-ignore
        target = this.#owner.body
      }

      if(controller.state.isFocus) target.focus();
      else target.blur();
      target.value = controller.state.value;
      
      target.addEventListener('keypress',(e)=>{
      //en caso de existir un callback de constrol, lo ejecutamos
        const newValue = controller.callback ? controller.callback(target.value) : undefined;
        const curValue = newValue ?? target.value;

        controller.state = {
          ...controller.state,
          value: curValue,
          isFocus: true
        };
        target.value = curValue;
        this.#owner.state = {
          ...this.#owner.state,
          [controller.state.stateName]:{
            [controller.state.name]: curValue
          }
        };
      },{signal: abortC.signal});// end keyup eventlistener

      target.addEventListener('blur',(e)=>{
        controller.state = {
          ...controller.state,
          value: target.value,
          isFocus: false
        };
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