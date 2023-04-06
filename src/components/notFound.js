import { Component } from "../lib/my_framework/component.js";

export class NotFound extends Component{
  template(){
    return super.template(`
      <main>
        <h1>404</h1>
        <p>no se pudo encontrar el contenido</p>
      </main>
    `)
  }
}