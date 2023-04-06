
import { Component } from "../../lib/my_framework/component.js";

export class Card extends Component{
  
  template(){
    return super.template(`
      <article>
        <h3>nombre: ${this.props.name}${Math.floor(Math.random() * 100)}</h3>
        <p>correo: ${this.props.email}</p>
        <p>usuario: ${this.props.user}</p>
      </article>
    `)
  }
}