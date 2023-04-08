import { Component } from "./component.js";

export class Life {

  /**definicion de tipos con fines de organización
   * @typedef {()=>void} DisposeEvent
   * @typedef {{event: ()=>(DisposeEvent | void), dependency: Array<any> | undefined, oldDependency: Array<any> | undefined}} UpdateEvent
   */

  /** Eventos encargados de ejecutarse en cada actualización del
   * owner (componente), este posee dependencias que lo reglan 
   * a la hora de dispararse o no
   * @type {Array<UpdateEvent>}
   */
  #updateEvents = [];
  
  /** Eventos encargados de ejecutarse una vez que el
   * renderizado del owner (componente) finalize
   * @type {Array<DisposeEvent>}
   */
  #disposeEvents = [];

  /** Componente poseedor de la instancia Life
   * al cual se realiza el seguimiento de su 
   * ciclo de vida
   * @type {Component}
   */
  #owner;

  /**
   * @param {Component} owner
   */
  constructor(owner){
    this.#owner = owner;
  }

  /**
   * @param {()=>(DisposeEvent | void)} callback
   * @param {Array<any>=} dependency
   */
  effect(callback, dependency){
    const prevValue = [...this.#updateEvents];
    const newValue = {
      event: callback,
      dependency,
      oldDependency: dependency ? [...dependency] : undefined
    }
    const compare = prevValue.some((v)=>{
      return JSON.stringify(v)===JSON.stringify(newValue)
    });
    if(compare){
      throw new Error(`$.effect redundante: Está utilizando un effect() en el componente ${this.#owner.key} con una configuración de dependencias que ya existe en otra implementación, utilice el effect que ya posee esta implementación en su lugar`)
      // return
      };
    
    const f = [...prevValue, newValue];
    this.#updateEvents =  f;
    return this;
  }//end $

  /**
   */
  update(){
    this.#updateEvents.forEach((upE)=>{
      if (this.#checkChange(upE?.dependency, upE?.oldDependency)){
          upE.event();
      }//end if
    })//end foreach
  }//end update
  /**
   * encargada de disparar eventos de desmontura
   */
  dispose(){
    this.#disposeEvents.forEach(ev=>ev())
  }//end dispose

  /** Encargada de evaluar si las dependencias del
   * presente evento de actualización han mutado
   * @param {any[]} oldDependency 
   * @param {any[]} dependency 
   * @returns {boolean}
   */
  #checkChange(oldDependency, dependency){
    if (oldDependency === undefined) return true;
    if (oldDependency.length === 0) return false;
    const c = dependency.some((d)=>{
      return !oldDependency.includes(d)
    })
    return c;
  }

  /**
   * Encargado de disparar los eventos de actualización al menos una vez
   */
  initialize(){
    this.#updateEvents.forEach((upE)=>{
      const d = upE.event();
      if(!!d){
        const compare = this.#disposeEvents.some(f=>{
          return f.toString() === d.toString()
        })
        if(compare) {
          return
        };
        const nAr = [...this.#disposeEvents, d];
        this.#disposeEvents = nAr;
      }
    })//end foreach
  }
}//end class