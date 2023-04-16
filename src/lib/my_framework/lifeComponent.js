import { MyComponent } from "./component.js";

export class Life {

  /**definicion de tipos con fines de organización
   * @typedef {{dispose: (()=>void)|undefined, update: (()=>void)|(()=>DisposeEvent), dependency: Dependecy, oldDependency: string}} EffectT
   * @typedef {()=>void} DisposeEvent
   * @typedef {any[]|undefined} Dependecy
   */

  /** Componente poseedor de la instancia Life
   * al cual se realiza el seguimiento de su 
   * ciclo de vida
   * @type {MyComponent}
   */
  #owner;

  /**
   * @type {boolean}
   */
  #isInitialized = false;
  /**
   *@type {Array<EffectT>}
   */
  #effects = [];

  /**
   * @param {MyComponent} owner
   */
  constructor(owner){
    this.#owner = owner;
  }

  /**
   * @param {()=>(DisposeEvent | void)} callback
   * @param {Array<any>=} dependency
   */
  effect(callback, dependency){
    if(this.#owner.isFirstMount){

      /**
       *@type {EffectT}
      */
      const newValue = {
        update: callback,
        dispose: undefined,
        dependency: dependency ? dependency : undefined,
        oldDependency: dependency ? JSON.stringify(dependency) : '[]'
      }
      const compare = this.#effects.some((eff)=>{
        return JSON.stringify(eff.dependency) === JSON.stringify(dependency)
      });

      if(compare){
        throw new Error(`$.effect redundante: Está utilizando un effect() en el componente ${this.#owner.key} con una configuración de dependencias que ya existe en otra implementación, utilice el effect que ya posee esta implementación en su lugar`)
      };
        this.#effects.push(newValue);
    }//end if


    if(this.#isInitialized) this.#updateEffect(dependency);
    return this;
  }//end $

  /**
   * @param {any} dependency
   */
  #updateEffect(dependency){
    this.#effects.forEach((eff)=>{
      if (!this.#checkChange(eff?.dependency, dependency)) return;
      eff?.dispose();
      eff.update();
      eff.dependency = dependency;
    })//end foreach
  }//end update
  /**
   */
  update(){
    this.#effects.forEach((eff)=>{
      eff.update();
    })//end foreach
  }//end update
  /**
   * encargada de disparar eventos de desmontura
   */
  dispose(){
    this.#effects.forEach(eff=>{
      if(eff?.dispose){
        eff.dispose();
      }
    })
  }//end dispose

  /** Encargada de evaluar si las dependencias del
   * presente evento de actualización han mutado
   * @param {any[]} oldDependency 
   * @param {any[]} dependency 
   * @returns {boolean}
   */
  #checkChange(oldDependency, dependency){
    if (dependency === undefined) return true;
    if (dependency.length === 0) return false;

    return JSON.stringify(dependency) !== JSON.stringify(oldDependency)
  }

  /**
   * Encargado de disparar los eventos de actualización al menos una vez
   */
  initialize(){
    this.#effects.forEach((eff)=>{
      const d = eff.update();
      if(!!d){
        eff.dispose = d;
      }
    })//end foreach
    this.#isInitialized = true;
  }
}//end class