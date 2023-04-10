
import { Component } from "../lib/my_framework/component.js";

export class Card extends Component{

  build({name, email, user}){
    return super.template((_)=>`
      <article>
        <h3>nombre: ${name}</h3>
        <p>correo: ${email}</p>
        <p>usuario: ${user}</p>
      </article>
    `)
  }
}