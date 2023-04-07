// import { Component } from "./component.js";

// /**
//  * Clase encargada de mediar entre distintos eventos 
//  */
// export class MyEventMediator {
//   /**
//    * @type {Array<{eventName: string, component:Component}>}
//    */
//   #observers = [];
//   /**
//    * @type {Array<string>}
//    */
//   #observersKeys = []
  
//   /**
//    * Método encargado de emitir el evento, en este método
//    * podemos propagar un evento dado, enviando datos por una propiedad detail
//    * @param {string}  eventName
//    * @param {any}  detail
//    */
//   emit(eventName, detail) {
//     const observers2Emit = this.#observers.filter(o=> o.eventName === eventName);
//     observers2Emit.forEach(o=>{
//       o.component.notify(detail);
//     })
//   }
  
//   /**
//    * Método que subscribe un observer a un evento personalizado,
//    * @param {string} eventName
//    * @param {Component} component
//    */
//   on(eventName, component) {

//     const newObserver = {eventName,component}
//     if(!this.#observersKeys.includes(component.key)){
//       this.#observers.push(newObserver)
//       this.#observersKeys.push(component.key)
//     }
//   }
//   /**
//    *  método para eliminar un EventListener del evento personalizado
//    * @param {string} eventName
//    * @param {Component} component
//    */
//   off(eventName, component) {
//     const observer = {eventName, component, key: component.key}
//     if(!this.#observers.includes(observer)) throw new Error('el presente observer no existe en el presente mediador');

//     this.#observers = this.#observers.filter((o)=>observer !== o);
//   }
//   /**
//    * método para eliminar todos los eventos de la presente instancia
//    */
//   offAll() {
//     this.#observers = []
//     this.#observersKeys = []
//   }
// }