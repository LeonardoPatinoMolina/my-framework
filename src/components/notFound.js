import { Component } from "../lib/my_framework/component.js";

export class NotFound extends Component{
  
  build(){
    return super.template(`
      <main>
        <h1>404</h1>
        <p>no se pudo encontrar el contenido</p>
      </main>
    `)
  }
}