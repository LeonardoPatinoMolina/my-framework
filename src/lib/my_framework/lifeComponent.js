import { Component } from "./component.js";

export class LifeComponent {
  /**
   * @type {Component}
   */
  #owner;

  // #previusState;

  /**
   * @param {Component} owner 
   * @returns {LifeComponent}
   */
  constructor(owner){
    this.#owner = owner; 
    // this.#previusState = structuredClone(owner.props); 
  }

  /**encargada de ejecutar un callback si ha cambiado el estado del 
   * @param {()=>void} callback 
   */
  $(callback){
    // if(this.#previusState !== this.#owner.props) return;
    // this.#previusState = structuredClone(this.#owner.props);
    this.#owner._updating.push(callback);
    const d = callback();
    if(!!d){
      if(!this.#owner._disposing.includes(d)){
        this.#owner._disposing.push(d);
      }
    }//end if
  }//end $
}//end class

//---------------------------------------------
