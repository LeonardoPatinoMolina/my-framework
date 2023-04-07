
import { Component } from "../lib/my_framework/component.js";

export class Card extends Component{
  constructor(props){
    super(props)
  }
  
  build({name, email, user}){
    return super.template(`
      <article>
        <h3>nombre: ${name}${Math.floor(Math.random() * 100)}</h3>
        <p>correo: ${email}</p>
        <p>usuario: ${user}</p>
      </article>
    `)
  }
}