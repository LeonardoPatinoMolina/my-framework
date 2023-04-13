import { Component } from "./component.js";
  /**
   * @typedef {{[x: string]: (data: any, payload: any)=>void}} Reducer
   */


export class MyGlobalStore {
  /**
   * @type {MyGlobalStore}
   */
  static globalStoreInstance;

  /**
   * @type {Map<string, MyShelf>}
   */
  store = new Map();
  /**
   * @type {Map<string, Set<Component>>}
   */
  observers = new Map();

  constructor() {
    if (!!MyGlobalStore.globalStoreInstance) {
      return MyGlobalStore.globalStoreInstance;
    }
    MyGlobalStore.globalStoreInstance = this;
  }
  /**
   * Establece la configuración egenral de la store global
   * @param {{reducers: {[x: string]: MyShelf}}} config
   */
  static configStore(config) {
    return ()=>{
      const gStore = new MyGlobalStore();
      gStore.store = new Map(Object.entries(config.reducers));
    }
  }

  /**
   * Método encargado de configurar el store principal
   * @param {string} reducer 
   */
  static dispatch(reducer) {
    const gStore = new MyGlobalStore()
    const obs = gStore.observers.get(reducer)
    if(obs){
      gStore.observers.get(reducer).forEach(o=>{
        //actualizamos avisando que se trata
        //de unu cambio global
        o.update(()=>{}, true)
      });
    }
  }//end dispatch

  /**
   * Método que subscribe componentes al store global
   * @param {string} shelfName 
   * @param {Component} observer 
   */
  static subscribe(shelfName, observer){
    const gStore = new MyGlobalStore();
    const myStore = gStore.store.get(shelfName);
    if(myStore){
      const obs = gStore.observers.get(shelfName);
      if(obs){
        obs.add(observer);
      }else gStore.observers.set(shelfName, new Set().add(observer))
      // gStore.observers.set(shelfName,  obs.set ;
      observer.globalStore = {[myStore.name]: myStore.data};
      return myStore.data;

    }else throw new Error(`store inexistente: la store identificada con el nombre ${shelfName} no existe`);
  }//end subscribe
}//end calss

class MyShelf {

  /**
   * @type {string}
   */
  #keyStore;

  /**
   * @type {any}
   */
  #data;
  /**
   * @type {{[x: string]: (payload: any)=>void}}
   */
  #reducer;

  /**
   * @param {{name: string, initialData: any, reducer: Reducer}} args
   */
  constructor({ name, initialData, reducer }) {
    this.#keyStore = name;
    this.#data = initialData;

    //generamos todos las funciones disparadoras
    //partiendo de los reducers configurados

     const reducers = Object.entries(reducer).map(([k, v]) => {
      return{
        /**
         * @param {any} payload 
         */
        [k]: (payload) => {
          v(this.#data, payload);
          MyGlobalStore.dispatch(this.#keyStore);
        },
      };
    })//end map
  
    /**
   * @type {{[x: string]: (payload: any)=>void}}
   */
    let newR;
    reducers.forEach((r)=>{
      newR = {...newR, ...r}
    })
    this.#reducer = newR;
  }

  get name(){
    return this.#keyStore;
  }
  get reducers(){
    return this.#reducer;
  }
  get data(){
    return this.#data
  }
}

/**
 * @param {{name: string, initialData: any, reducer: Reducer}} args
 * @returns {MyShelf}
 */
export const createShelf = (args) => {
  return new MyShelf(args);
};