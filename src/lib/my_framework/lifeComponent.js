import { Component } from "./component.js";

export class Life {
  /**
   * @type {Array<{dependency: any[], event: ()=>void, dependency: Array<any>, oldDependency: Array<any>}>}
   */
  #updateEvents = [];
  /**
   * @type {Array<Set<()=>void>>}
   */
  #disposeEvents = [];

  /**
   * @type {Component}
   */
  #owner;

  /**
   * @param {Component} owner
   * @returns {LifeComponent}
   */
  constructor(owner){
    this.#owner = owner;
  }

  /**
   * @param {()=>void} callback
   * @param {Array<any> | boolean} dependency
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
   * @param {boolean | undefined} isInitial
   * @returns {boolean}
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

  /**
   * @param {any[]} oldDependency 
   * @param {any[]} dependency 
   * @returns 
   */
  #checkChange(oldDependency, dependency){
    if (oldDependency === undefined) return true;
    if (oldDependency.length === 0) return false;
    const c = dependency.some((d)=>{
      return !oldDependency.includes(d)
    })
    return c;
  }
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