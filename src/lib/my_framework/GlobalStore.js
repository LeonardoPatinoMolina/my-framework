import { MyComponent } from "./component.js";
  /**
   * @typedef {{[x: string]: (data: any, payload: any)=>void}} Reducer
   * @typedef {(payload: any)=>void} Action
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
   * @type {Map<string, Set<MyComponent>>}
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
   * Método encargado de despachar los eventos
   * de actualización en base a un reducerPath
   * @param {string} shelfName
   */
  static dispatch(shelfName) {
    const gStore = new MyGlobalStore()
    const obs = gStore.observers.get(shelfName)
    if(obs){
      gStore.observers.get(shelfName).forEach(o=>{
        //forzamos un actualización de los observers
        o.update(()=>{}, true)
      });
    }
  }//end dispatch

  /**
   * Método que subscribe componentes al store global
   * @param {string} shelfName 
   * @param {MyComponent} observer 
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
      if(observer.globalStore){
        observer.globalStore = {
          ...observer.globalStore,
          [myStore.name]: myStore.data
        };
      }else{
        observer.globalStore = {[myStore.name]: myStore.data}
      }
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
   * @type {{[x: string]: Action}}
   */
  #actions;

  /**
   * @param {{name: string, initialData?: any, reducers: Reducer}} args
   */
  constructor({ name, initialData, reducers }) {
    this.#keyStore = name;
    this.#data = initialData;

    //generamos todos las funciones disparadoras
    //partiendo de los reducers configurados

     const actionsArr = Object.entries(reducers).map(([k, v]) => {
      return{
        /** 
         * @type {Action}
         */
        [`${k}Dispatch`]: (payload) => {
          v(this.#data, payload);
          MyGlobalStore.dispatch(this.#keyStore);
        },
      };
    })//end map
  
    //convertimo sel arreglo de objetos en un solo objeto
    this.#actions = actionsArr.reduce((acc, cur) => {
      return { ...acc, ...cur };
    }, {});
  }

  get name(){
    return this.#keyStore;
  }
  get actions(){
    return this.#actions;
  }
  get data(){
    return this.#data
  }
}

/**
 * @param {{name: string, initialData: any, reducers: Reducer}} args
 * @returns {{name: string, shelf: MyShelf, actions: {[x: string]: Action}}}
 */
export const createShelf = (args) => {
  const newShelf = new MyShelf(args)
  return {
    name: newShelf.name,
    shelf: newShelf,
    actions: newShelf.actions
  }
};