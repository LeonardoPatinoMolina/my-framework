import { Component } from "../lib/my_framework/component.js";

export class NotFound extends Component{
  
  build(){
    return super.template(()=>`
      <div>
        <h2>404</h2>
        <p>no se pudo encontrar el contenido</p>
      </div>
    `)
  }
}